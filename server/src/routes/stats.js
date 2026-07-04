import { Router } from 'express'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Quiz from '../models/Quiz.js'
import Progress from '../models/Progress.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()
router.use(authenticate, authorize('admin'))

// GET /api/stats
router.get('/', async (req, res) => {
  try {
    const [users, courses, lessons, quizzes, results] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Lesson.countDocuments(),
      Quiz.countDocuments(),
      Progress.countDocuments({ type: 'quiz' }),
    ])
    const passed = await Progress.countDocuments({ type: 'quiz', passed: true })
    res.json({ users, courses, lessons, quizzes, results, passed, failed: results - passed })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
