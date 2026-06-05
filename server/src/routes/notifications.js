import { Router } from 'express'
import Notification from '../models/Notification.js'
import Lesson from '../models/Lesson.js'
import User from '../models/User.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

// GET /api/notifications  — notifications de l'étudiant connecté
router.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(20)
    res.json(notifications)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/notifications/unread-count
router.get('/unread-count', authenticate, async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.user.userId, read: false })
    res.json({ count })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/notifications/:id/read  — marquer une notification lue
router.post('/:id/read', authenticate, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true, readAt: new Date() }
    )
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/notifications/read-all  — tout marquer comme lu
router.post('/read-all', authenticate, async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user.userId, read: false },
      { read: true, readAt: new Date() }
    )
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// Fonction utilitaire : créer une notification "leçon disponible"
export async function notifyLessonAvailable(lessonId) {
  try {
    const lesson = await Lesson.findById(lessonId)
    if (!lesson) return
    const students = await User.find({ role: 'student', accessibleCourses: lesson.courseId })
    const notifications = students.map(s => ({
      userId: s._id,
      type: 'lesson_available',
      title: 'Nouvelle leçon disponible',
      message: `La leçon "${lesson.title}" est maintenant accessible.`,
      lessonId: lesson._id,
    }))
    if (notifications.length > 0) await Notification.insertMany(notifications)
  } catch (err) {
    console.error('Erreur création notifications :', err.message)
  }
}

export default router
