import { Router } from 'express'
import Progress from '../models/Progress.js'
import Lesson from '../models/Lesson.js'
import Course from '../models/Course.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/progress/me  — progression complète de l'étudiant connecté
router.get('/me', authenticate, async (req, res) => {
  try {
    const [lessonsDone, quizResults] = await Promise.all([
      Progress.find({ userId: req.user.userId, type: 'lesson' }).populate('lessonId', 'courseId title'),
      Progress.find({ userId: req.user.userId, type: 'quiz' })
        .populate('quizId', 'title passingScore courseId')
        .sort({ completedAt: -1 }),
    ])

    const courses = await Course.find()
    const totalLessonsCount = await Lesson.countDocuments()

    const globalPct = totalLessonsCount > 0
      ? Math.round((lessonsDone.length / totalLessonsCount) * 100)
      : 0

    const quizStats = {
      total: quizResults.length,
      passed: quizResults.filter(r => r.passed).length,
      avgScore: quizResults.length > 0
        ? Math.round(quizResults.reduce((s, r) => s + r.score, 0) / quizResults.length)
        : 0,
    }

    res.json({
      lessonsCompleted: lessonsDone.length,
      totalLessons: totalLessonsCount,
      globalPercent: globalPct,
      quizStats,
      recentQuizzes: quizResults.slice(0, 5),
    })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
