import { Router } from 'express'
import Lesson from '../models/Lesson.js'
import Progress from '../models/Progress.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

function isLessonAvailable(lesson) {
  return new Date(lesson.availableAt) <= new Date()
}

// GET /api/lessons/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)

    if (!lesson) {
      return res.status(404).json({ error: 'Leçon introuvable' })
    }

    const isAdmin = req.user.role === 'admin'

    if (!isAdmin && !isLessonAvailable(lesson)) {
      return res.status(403).json({
        error: 'Cette leçon n’est pas encore disponible',
        availableAt: lesson.availableAt,
      })
    }

    const completed = await Progress.exists({
      userId: req.user.userId,
      lessonId: lesson._id,
      type: 'lesson',
    })

    res.json({
      ...lesson.toObject(),
      completed: !!completed,
    })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/lessons/:id/complete
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)

    if (!lesson) {
      return res.status(404).json({ error: 'Leçon introuvable' })
    }

    if (!isLessonAvailable(lesson)) {
      return res.status(403).json({
        error: 'Cette leçon n’est pas encore disponible',
        availableAt: lesson.availableAt,
      })
    }

    await Progress.findOneAndUpdate(
      {
        userId: req.user.userId,
        lessonId: lesson._id,
        type: 'lesson',
      },
      {
        userId: req.user.userId,
        lessonId: lesson._id,
        type: 'lesson',
        completedAt: new Date(),
      },
      {
        upsert: true,
        new: true,
      }
    )

    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router 