import { Router } from 'express'
import { z } from 'zod'
import Quiz from '../models/Quiz.js'
import Progress from '../models/Progress.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

const submitSchema = z.object({
  answers: z.record(z.string(), z.string()),
})

// GET /api/quizzes/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' })
    res.json(quiz)
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/quizzes/:id/submit
router.post('/:id/submit', authenticate, validate(submitSchema), async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
    if (!quiz) return res.status(404).json({ error: 'Quiz introuvable' })

    const { answers } = req.body
    let correct = 0

    const feedback = quiz.questions.map(q => {
      const given = answers[q._id.toString()]
      const givenArr = Array.isArray(given) ? given : given ? [given] : []
      const isCorrect =
        q.correctAnswers.every(a => givenArr.includes(a)) &&
        givenArr.every(a => q.correctAnswers.includes(a))
      if (isCorrect) correct++
      return { questionId: q._id, correct: isCorrect, correctAnswers: q.correctAnswers }
    })

    const score = quiz.questions.length > 0
      ? Math.round((correct / quiz.questions.length) * 100)
      : 0
    const passed = score >= quiz.passingScore

    await Progress.create({
      userId: req.user.userId,
      quizId: quiz._id,
      type: 'quiz',
      score,
      passed,
      completedAt: new Date(),
    })

    res.json({ score, passed, passingScore: quiz.passingScore, correct, total: quiz.questions.length, feedback })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/quizzes/:id/result  (dernier résultat de l'utilisateur)
router.get('/:id/result', authenticate, async (req, res) => {
  try {
    const result = await Progress.findOne(
      { userId: req.user.userId, quizId: req.params.id, type: 'quiz' },
      null,
      { sort: { completedAt: -1 } }
    )
    if (!result) return res.status(404).json({ error: 'Aucun résultat trouvé' })
    res.json({ score: result.score, passed: result.passed, completedAt: result.completedAt })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
