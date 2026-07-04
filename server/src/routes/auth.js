import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import User from '../models/User.js'
import { validate } from '../middleware/validate.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

const firstLoginSchema = z.object({
  newPassword: z.string().min(8, 'Mot de passe minimum 8 caractères'),
})

function signToken(user) {
  return jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  )
}

// POST /api/auth/login
router.post('/login', validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Email ou mot de passe incorrect' })

    const token = signToken(user)
    res.json({ token, user: user.toSafeObject(), isFirstLogin: user.isFirstLogin })
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// POST /api/auth/first-login  (étudiant choisit son premier mot de passe)
router.post('/first-login', authenticate, validate(firstLoginSchema), async (req, res) => {
  try {
    const rounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10
    const hashed = await bcrypt.hash(req.body.newPassword, rounds)
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { password: hashed, isFirstLogin: false },
      { new: true }
    )
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    const token = signToken(user)
    res.json({ token, user: user.toSafeObject() })
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })
    res.json(user.toSafeObject())
  } catch {
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

export default router
