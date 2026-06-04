import { Router } from 'express'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Quiz from '../models/Quiz.js'
import Progress from '../models/Progress.js'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/courses
router.get('/', authenticate, async (req, res) => {
  try {
    let courses

    if (req.user.role === 'admin') {
      courses = await Course.find().sort({ createdAt: 1 })
    } else {
      const user = await User.findById(req.user.userId).populate('accessibleCourses')
      courses = user.accessibleCourses.length > 0
        ? user.accessibleCourses
        : await Course.find().sort({ createdAt: 1 })
    }

    const courseIds = courses.map(c => c._id)

    const [lessonCounts, quizCounts, userProgress] = await Promise.all([
      Lesson.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', total: { $sum: 1 } } },
      ]),
      Quiz.aggregate([
        { $match: { courseId: { $in: courseIds } } },
        { $group: { _id: '$courseId', total: { $sum: 1 } } },
      ]),
      Progress.find({ userId: req.user.userId, type: 'lesson' }).populate('lessonId', 'courseId'),
    ])

    const lessonCountMap = Object.fromEntries(lessonCounts.map(l => [l._id.toString(), l.total]))
    const quizCountMap = Object.fromEntries(quizCounts.map(q => [q._id.toString(), q.total]))

    const completedByCoure = {}
    for (const p of userProgress) {
      if (p.lessonId) {
        const cId = p.lessonId.courseId?.toString()
        if (cId) completedByCoure[cId] = (completedByCoure[cId] || 0) + 1
      }
    }

    const result = courses.map(c => {
      const id = c._id.toString()
      const total = lessonCountMap[id] || 0
      return {
        _id: c._id,
        title: c.title,
        description: c.description,
        icon: c.icon,
        color: c.color,
        lessonsCount: total,
        quizzesCount: quizCountMap[id] || 0,
        totalLessons: total,
        completedLessons: completedByCoure[id] || 0,
      }
    })

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/courses/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) return res.status(404).json({ error: 'Cours introuvable' })

    const [lessons, quizzes, completedProgress] = await Promise.all([
      Lesson.find({ courseId: course._id }).sort({ order: 1 }),
      Quiz.find({ courseId: course._id }),
      Progress.find({ userId: req.user.userId, type: 'lesson' }).populate('lessonId', 'courseId'),
    ])

    const completedLessonIds = new Set(
      completedProgress
        .filter(p => p.lessonId?.courseId?.toString() === course._id.toString())
        .map(p => p.lessonId._id.toString())
    )

    const completedLessons = completedLessonIds.size

    res.json({
      _id: course._id,
      title: course.title,
      description: course.description,
      icon: course.icon,
      color: course.color,
      totalLessons: lessons.length,
      completedLessons,
      lessons: lessons.map(l => ({
        _id: l._id,
        courseId: l.courseId,
        title: l.title,
        order: l.order,
        availableAt: l.availableAt,
        completed: completedLessonIds.has(l._id.toString()),
        content: l.content,
      })),
      quizzes: quizzes.map(q => ({
        _id: q._id,
        courseId: q.courseId,
        title: q.title,
        passingScore: q.passingScore,
        questions: q.questions,
      })),
    })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
