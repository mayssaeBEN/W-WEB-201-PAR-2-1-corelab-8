import { Router } from 'express'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Quiz from '../models/Quiz.js'
import Progress from '../models/Progress.js'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

function isAdmin(req) {
  return req.user.role === 'admin'
}

function availableLessonFilter() {
  return {
    availableAt: { $lte: new Date() },
  }
}

// GET /api/courses
router.get('/', authenticate, async (req, res) => {
  try {
    let courses = []

    if (isAdmin(req)) {
      courses = await Course.find().sort({ createdAt: 1 })
    } else {
      const user = await User.findById(req.user.userId).populate('accessibleCourses')

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' })
      }

      // Important :
      // Un étudiant ne voit QUE les cours qui lui sont assignés.
      // Si accessibleCourses est vide, il voit 0 cours.
      courses = user.accessibleCourses
    }

    const courseIds = courses.map(course => course._id)

    const lessonMatch = isAdmin(req)
      ? { courseId: { $in: courseIds } }
      : {
          courseId: { $in: courseIds },
          ...availableLessonFilter(),
        }

    const [lessonCounts, quizCounts, userProgress] = await Promise.all([
      Lesson.aggregate([
        { $match: lessonMatch },
        { $group: { _id: '$courseId', total: { $sum: 1 } } },
      ]),
      Quiz.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', total: { $sum: 1 } } },
      ]),
      Progress.find({
        userId: req.user.userId,
        type: 'lesson',
      }).populate('lessonId', 'courseId availableAt'),
    ])

    const lessonCountMap = Object.fromEntries(
      lessonCounts.map(lesson => [lesson._id.toString(), lesson.total])
    )

    const quizCountMap = Object.fromEntries(
      quizCounts.map(quiz => [quiz._id.toString(), quiz.total])
    )

    const completedByCourse = {}

    for (const progress of userProgress) {
      if (!progress.lessonId) continue

      const courseId = progress.lessonId.courseId?.toString()
      if (!courseId) continue

      // Pour un étudiant, on ne compte pas les leçons futures comme progression visible.
      if (!isAdmin(req) && new Date(progress.lessonId.availableAt) > new Date()) {
        continue
      }

      completedByCourse[courseId] = (completedByCourse[courseId] || 0) + 1
    }

    const result = courses.map(course => {
      const id = course._id.toString()
      const totalLessons = lessonCountMap[id] || 0

      return {
        _id: course._id,
        title: course.title,
        description: course.description,
        icon: course.icon,
        color: course.color,
        lessonsCount: totalLessons,
        quizzesCount: quizCountMap[id] || 0,
        totalLessons,
        completedLessons: completedByCourse[id] || 0,
      }
    })

    res.json(result)
  } catch (err) {
    console.error('GET /api/courses error:', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/courses/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ error: 'Cours introuvable' })
    }

    if (!isAdmin(req)) {
      const user = await User.findById(req.user.userId)

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur introuvable' })
      }

      const canAccessCourse = user.accessibleCourses.some(
        courseId => courseId.toString() === course._id.toString()
      )

      // Important :
      // Si l'étudiant n'a pas ce cours dans accessibleCourses,
      // même s'il connaît l'ID, il ne peut pas y accéder.
      if (!canAccessCourse) {
        return res.status(403).json({ error: 'Accès interdit à ce cours' })
      }
    }

    const lessonFilter = isAdmin(req)
      ? { courseId: course._id }
      : {
          courseId: course._id,
          ...availableLessonFilter(),
        }

    const [lessons, quizzes, completedProgress] = await Promise.all([
      Lesson.find(lessonFilter).sort({ order: 1 }),
      Quiz.find({ courseId: course._id }),
      Progress.find({
        userId: req.user.userId,
        type: 'lesson',
      }).populate('lessonId', 'courseId availableAt'),
    ])

    const visibleLessonIds = new Set(
      lessons.map(lesson => lesson._id.toString())
    )

    const completedLessonIds = new Set(
      completedProgress
        .filter(progress => {
          if (!progress.lessonId) return false

          const sameCourse =
            progress.lessonId.courseId?.toString() === course._id.toString()

          const isVisibleLesson =
            visibleLessonIds.has(progress.lessonId._id.toString())

          return sameCourse && isVisibleLesson
        })
        .map(progress => progress.lessonId._id.toString())
    )

    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      icon: course.icon,
      color: course.color,
      totalLessons: lessons.length,
      completedLessons: completedLessonIds.size,
      lessons: lessons.map(lesson => ({
        _id: lesson._id,
        courseId: lesson.courseId,
        title: lesson.title,
        order: lesson.order,
        availableAt: lesson.availableAt,
        completed: completedLessonIds.has(lesson._id.toString()),
        content: lesson.content,
      })),
      quizzes: quizzes.map(quiz => ({
        _id: quiz._id,
        courseId: quiz.courseId,
        title: quiz.title,
        passingScore: quiz.passingScore,
        questions: quiz.questions,
      })),
    })
  } catch (err) {
    console.error('GET /api/courses/:id error:', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router 