import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRoutes from './routes/auth.js'
import coursesRoutes from './routes/courses.js'
import lessonsRoutes from './routes/lessons.js'
import quizzesRoutes from './routes/quizzes.js'
import adminRoutes from './routes/admin.js'
import statsRoutes from './routes/stats.js'
import notificationsRoutes from './routes/notifications.js'
import progressRoutes from './routes/progress.js'
import { startScheduler } from './utils/scheduler.js'

const app = express()
const PORT = process.env.PORT || 4242

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(express.json({ limit: '10mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/quizzes', quizzesRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/stats', statsRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/progress', progressRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

app.use((req, res) => res.status(404).json({ error: `Route introuvable : ${req.method} ${req.path}` }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Erreur interne du serveur' })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connecté :', process.env.MONGO_URI)
    startScheduler(),
    app.listen(PORT, () => console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`))
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB :', err.message)
    process.exit(1)
  })
