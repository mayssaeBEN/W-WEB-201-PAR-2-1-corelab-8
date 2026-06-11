import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

function tokenFor(user) {
  return jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret', { expiresIn: '1h' })
}

describe('POST /api/admin/users/import', () => {
  it('importe des utilisateurs depuis un CSV valide', async () => {
    const admin = await createTestUser('admin')
    const token = tokenFor(admin)
    const csv = 'email,firstName,lastName\nalice@test.fr,Alice,Dupont\nbob@test.fr,Bob,Martin'
    const res = await request(app).post('/api/admin/users/import').set('Authorization', `Bearer ${token}`).send({ csv })
    expect(res.status).toBe(200)
    expect(res.body.created).toBe(2)
  })

  it('refuse l\'accès à un étudiant (403)', async () => {
    const student = await createTestUser('student')
    const token = tokenFor(student)
    const res = await request(app).post('/api/admin/users/import').set('Authorization', `Bearer ${token}`).send({ csv: 'email,firstName,lastName\nalice@test.fr,Alice,D' })
    expect(res.status).toBe(403)
  })
})

describe('POST /api/admin/courses', () => {
  it('crée un nouveau cours', async () => {
    const admin = await createTestUser('admin')
    const token = tokenFor(admin)
    const res = await request(app).post('/api/admin/courses').set('Authorization', `Bearer ${token}`).send({ title: 'Nouveau cours', description: 'Test', icon: '🏀', color: '#e74c3c' })
    expect(res.status).toBe(201)
    expect(res.body.title).toBe('Nouveau cours')
  })
})

describe('GET /api/admin/grades', () => {
  it('retourne les notes pour un admin', async () => {
    const admin = await createTestUser('admin')
    const token = tokenFor(admin)
    const res = await request(app).get('/api/admin/grades').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
