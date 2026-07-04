import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser, createTestCourse, createTestQuiz } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

function tokenFor(user) {
  return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' })
}

describe('POST /api/quizzes/:id/submit', () => {
  it('calcule correctement le score et retourne pass si ≥ seuil', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const quiz = await createTestQuiz(course._id)
    const token = tokenFor(student)

    const answers = {
      [quiz.questions[0]._id.toString()]: '5',
      [quiz.questions[1]._id.toString()]: '10 min',
    }

    const res = await request(app)
      .post(`/api/quizzes/${quiz._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers })

    expect(res.status).toBe(200)
    expect(res.body.score).toBe(100)
    expect(res.body.passed).toBe(true)
    expect(res.body.correct).toBe(2)
    expect(res.body.total).toBe(2)
  })

  it('retourne failed si score < seuil', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const quiz = await createTestQuiz(course._id)
    const token = tokenFor(student)

    const answers = {
      [quiz.questions[0]._id.toString()]: 'mauvaise',
      [quiz.questions[1]._id.toString()]: 'mauvaise',
    }

    const res = await request(app)
      .post(`/api/quizzes/${quiz._id}/submit`)
      .set('Authorization', `Bearer ${token}`)
      .send({ answers })

    expect(res.status).toBe(200)
    expect(res.body.score).toBe(0)
    expect(res.body.passed).toBe(false)
  })

  it('retourne 401 sans token', async () => {
    const course = await createTestCourse()
    const quiz = await createTestQuiz(course._id)
    const res = await request(app).post(`/api/quizzes/${quiz._id}/submit`).send({ answers: {} })
    expect(res.status).toBe(401)
  })
})
