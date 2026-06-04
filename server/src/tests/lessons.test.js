import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import Progress from '../models/Progress.js'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser, createTestCourse, createTestLesson } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

function tokenFor(user) {
  return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' })
}

describe('POST /api/lessons/:id/complete', () => {
  it('marque la leçon comme complétée', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const lesson = await createTestLesson(course._id)
    const token = tokenFor(student)

    const res = await request(app)
      .post(`/api/lessons/${lesson._id}/complete`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)

    const progress = await Progress.findOne({ userId: student._id, lessonId: lesson._id })
    expect(progress).not.toBeNull()
    expect(progress.type).toBe('lesson')
  })

  it('bloque une leçon avec date future', async () => {
    const student = await createTestUser('student')
    const course = await createTestCourse()
    const future = new Date(Date.now() + 7 * 24 * 3600 * 1000)
    const lesson = await createTestLesson(course._id, future)
    const token = tokenFor(student)

    const res = await request(app)
      .post(`/api/lessons/${lesson._id}/complete`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(403)
  })

  it('retourne 401 sans token', async () => {
    const course = await createTestCourse()
    const lesson = await createTestLesson(course._id)
    const res = await request(app).post(`/api/lessons/${lesson._id}/complete`)
    expect(res.status).toBe(401)
  })
})
