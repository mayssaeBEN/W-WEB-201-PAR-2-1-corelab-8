import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Quiz from '../models/Quiz.js'
import Progress from '../models/Progress.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()
router.use(authenticate, authorize('admin'))

// ── Utils ──────────────────────────────────────────────────────────────────────

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) || []
    return Object.fromEntries(
      headers.map((h, i) => [h, (values[i] || '').trim().replace(/^"|"$/g, '')])
    )
  })
}

// ── Users ──────────────────────────────────────────────────────────────────────

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }).select('-password -__v').sort({ lastName: 1 })
    res.json(users)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/admin/users/import  (body: { csv: "email,firstName,lastName\n..." })
router.post('/users/import', async (req, res) => {
  try {
    const { csv } = req.body
    if (!csv) return res.status(400).json({ error: 'Champ csv requis' })

    const rows = parseCSV(csv)
    if (rows.length === 0) return res.status(400).json({ error: 'CSV vide ou mal formaté' })

    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const tempPassword = await bcrypt.hash('ChangeMe123!', rounds)

    const results = { created: 0, skipped: 0, errors: [] }

    for (const row of rows) {
      const { email, firstName, lastName } = row
      if (!email || !firstName || !lastName) {
        results.errors.push(`Ligne ignorée (données manquantes) : ${JSON.stringify(row)}`)
        continue
      }
      try {
        await User.create({ email: email.toLowerCase(), firstName, lastName, password: tempPassword, role: 'student', isFirstLogin: true })
        results.created++
      } catch (e) {
        if (e.code === 11000) results.skipped++
        else results.errors.push(`${email}: ${e.message}`)
      }
    }

    res.json({ message: `Import terminé`, ...results })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/admin/users/:id/courses  (body: { courseIds: [...] })
router.put('/users/:id/courses', async (req, res) => {
  try {
    const { courseIds } = req.body
    if (!Array.isArray(courseIds)) return res.status(400).json({ error: 'courseIds doit être un tableau' })
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { accessibleCourses: courseIds },
      { new: true }
    ).select('-password')
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ── Courses ────────────────────────────────────────────────────────────────────

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional(),
  color: z.string().optional(),
})

// POST /api/admin/courses
router.post('/courses', validate(courseSchema), async (req, res) => {
  try {
    const course = await Course.create(req.body)
    res.status(201).json(course)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/admin/courses/:id
router.put('/courses/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!course) return res.status(404).json({ error: 'Cours introuvable' })
    res.json(course)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ── Lessons ────────────────────────────────────────────────────────────────────

const lessonSchema = z.object({
  title: z.string().min(1),
  content: z.string().default(''),
  order: z.number().int().positive().default(1),
  availableAt: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
})

// POST /api/admin/courses/:courseId/lessons  (contenu HTML dans body.content)
router.post('/courses/:courseId/lessons', validate(lessonSchema), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ error: 'Cours introuvable' })
    const lesson = await Lesson.create({ courseId: course._id, ...req.body })
    res.status(201).json(lesson)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!lesson) return res.status(404).json({ error: 'Leçon introuvable' })
    res.json(lesson)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// DELETE /api/admin/lessons/:id
router.delete('/lessons/:id', async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ── Quizzes ────────────────────────────────────────────────────────────────────

const questionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswers: z.array(z.string()).min(1),
})

const quizSchema = z.object({
  title: z.string().min(1),
  passingScore: z.number().min(0).max(100).default(70),
  questions: z.array(questionSchema).min(1),
})

// POST /api/admin/courses/:courseId/quizzes  (body: quiz JSON)
router.post('/courses/:courseId/quizzes', validate(quizSchema), async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ error: 'Cours introuvable' })
    const quiz = await Quiz.create({ courseId: course._id, ...req.body })
    res.status(201).json(quiz)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/admin/courses/:courseId/quizzes/import  (body: { json: "..." } ou { csv: "..." })
router.post('/courses/:courseId/quizzes/import', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
    if (!course) return res.status(404).json({ error: 'Cours introuvable' })

    let quizData
    if (req.body.json) {
      quizData = typeof req.body.json === 'string' ? JSON.parse(req.body.json) : req.body.json
    } else if (req.body.csv) {
      const rows = parseCSV(req.body.csv)
      const questionsMap = {}
      for (const row of rows) {
        if (!questionsMap[row.question]) {
          questionsMap[row.question] = { text: row.question, options: [], correctAnswers: [] }
        }
        if (row.option) questionsMap[row.question].options.push(row.option)
        if (row.correct === 'true' || row.correct === '1') {
          questionsMap[row.question].correctAnswers.push(row.option)
        }
      }
      quizData = {
        title: req.body.title || 'Quiz importé',
        passingScore: parseInt(req.body.passingScore) || 70,
        questions: Object.values(questionsMap),
      }
    } else {
      return res.status(400).json({ error: 'Fournir json ou csv dans le body' })
    }

    const parsed = quizSchema.safeParse(quizData)
    if (!parsed.success) return res.status(400).json({ error: 'Format invalide', details: parsed.error.errors })

    const quiz = await Quiz.create({ courseId: course._id, ...parsed.data })
    res.status(201).json(quiz)
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur', detail: err.message })
  }
})

// DELETE /api/admin/quizzes/:id
router.delete('/quizzes/:id', async (req, res) => {
  try {
    await Quiz.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// ── Grades ─────────────────────────────────────────────────────────────────────

// GET /api/admin/grades
router.get('/grades', async (req, res) => {
  try {
    const grades = await Progress.find({ type: 'quiz' })
      .populate('userId', 'firstName lastName email')
      .populate('quizId', 'title passingScore courseId')
      .sort({ completedAt: -1 })

    res.json(grades)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/admin/grades/students/:userId
router.get('/grades/students/:userId', async (req, res) => {
  try {
    const grades = await Progress.find({ userId: req.params.userId, type: 'quiz' })
      .populate('quizId', 'title passingScore courseId')
      .sort({ completedAt: -1 })
    res.json(grades)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
