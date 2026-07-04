import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import Progress from '../models/Progress.js'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser, createTestCourse, createTestLesson, createTestQuiz } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

function tokenFor(user) {
  return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' })
}

describe('Progression utilisateur', () => {
  it('marquer deux leçons complète crée deux entrées Progress', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const lesson1 = await createTestLesson(course._id)
    const lesson2 = await createTestLesson(course._id)
    const token = tokenFor(student)
    await request(app).post(`/api/lessons/${lesson1._id}/complete`).set('Authorization', `Bearer ${token}`)
    await request(app).post(`/api/lessons/${lesson2._id}/complete`).set('Authorization', `Bearer ${token}`)
    const count = await Progress.countDocuments({ userId: student._id, type: 'lesson' })
    expect(count).toBe(2)
  })

  it('marquer la même leçon deux fois ne crée qu\'une seule entrée (upsert)', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const lesson = await createTestLesson(course._id)
    const token = tokenFor(student)
    await request(app).post(`/api/lessons/${lesson._id}/complete`).set('Authorization', `Bearer ${token}`)
    await request(app).post(`/api/lessons/${lesson._id}/complete`).set('Authorization', `Bearer ${token}`)
    const count = await Progress.countDocuments({ userId: student._id, type: 'lesson' })
    expect(count).toBe(1)
  })

  it('le résultat du quiz est bien sauvegardé en base', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const quiz = await createTestQuiz(course._id)
    const token = tokenFor(student)
    const answers = {
      [quiz.questions[0]._id.toString()]: '5',
      [quiz.questions[1]._id.toString()]: '10 min',
    }
    await request(app).post(`/api/quizzes/${quiz._id}/submit`).set('Authorization', `Bearer ${token}`).send({ answers })
    const result = await Progress.findOne({ userId: student._id, quizId: quiz._id, type: 'quiz' })
    expect(result).not.toBeNull()
    expect(result.score).toBe(100)
    expect(result.passed).toBe(true)
  })
})
