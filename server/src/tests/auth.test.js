import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import app from './app.js'
import { setupDB, teardownDB, clearDB, createTestUser } from './setup.js'

beforeAll(setupDB)
afterAll(teardownDB)
beforeEach(clearDB)

describe('POST /api/auth/login', () => {
  it('retourne un token avec des identifiants valides', async () => {
    await createTestUser('student')
    const res = await request(app).post('/api/auth/login').send({ email: 'student@test.fr', password: 'basket123' })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user.email).toBe('student@test.fr')
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('retourne 401 avec un mauvais mot de passe', async () => {
    await createTestUser('student')
    const res = await request(app).post('/api/auth/login').send({ email: 'student@test.fr', password: 'mauvais' })
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })

  it('retourne 401 avec un email inconnu', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'inconnu@test.fr', password: 'basket123' })
    expect(res.status).toBe(401)
  })

  it('retourne 400 si email invalide', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'pasunemail', password: 'basket123' })
    expect(res.status).toBe(400)
  })

  it('retourne 401 sans token sur route protégée', async () => {
    const res = await request(app).get('/api/courses')
    expect(res.status).toBe(401)
  })
})
