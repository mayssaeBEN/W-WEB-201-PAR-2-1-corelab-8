import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser, createTestCourse, createTestLesson } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

function tokenFor(user) {
  return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' })
}

describe('GET /api/courses', () => {
  it('retourne la liste des cours pour un étudiant authentifié', async () => {
    const course = await createTestCourse()
    const student = await createTestUser('student')
    student.accessibleCourses = [course._id]
    await student.save()
    const token = tokenFor(student)
    const res = await request(app).get('/api/courses').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body[0]).toHaveProperty('title')
    expect(res.body[0]).toHaveProperty('completedLessons')
  })

  it('retourne 401 sans token', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.status).toBe(401)
  })
})

describe('GET /api/courses/:id', () => {
  it('retourne le détail d\'un cours avec ses leçons', async () => {
    const course = await createTestCourse()
    const student = await createTestUser('student')
    student.accessibleCourses = [course._id]
    await student.save()
    await createTestLesson(course._id)
    const token = tokenFor(student)
    const res = await request(app).get(`/api/courses/${course._id}`).set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('lessons')
    expect(res.body.lessons.length).toBe(1)
  })

  it('retourne 404 pour un cours inexistant', async () => {
    const student = await createTestUser('student')
    const token = tokenFor(student)
    const res = await request(app).get('/api/courses/000000000000000000000000').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(404)
  })
})
