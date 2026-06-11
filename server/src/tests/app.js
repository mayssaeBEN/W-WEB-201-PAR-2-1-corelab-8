import 'dotenv/config'
import express from 'express'
import authRoutes from '../routes/auth.js'
import coursesRoutes from '../routes/courses.js'
import lessonsRoutes from '../routes/lessons.js'
import quizzesRoutes from '../routes/quizzes.js'
import adminRoutes from '../routes/admin.js'

const app = express()
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/courses', coursesRoutes)
app.use('/api/lessons', lessonsRoutes)
app.use('/api/quizzes', quizzesRoutes)
app.use('/api/admin', adminRoutes)

export default app
