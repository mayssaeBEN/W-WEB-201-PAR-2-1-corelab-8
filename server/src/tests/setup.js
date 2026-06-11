import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import Course from '../models/Course.js'
import Lesson from '../models/Lesson.js'
import Quiz from '../models/Quiz.js'

let mongod

export async function setupDB() {
  mongod = await MongoMemoryServer.create()
  await mongoose.connect(mongod.getUri())
}

export async function teardownDB() {
  await mongoose.disconnect()
  await mongod.stop()
}

export async function clearDB() {
  const collections = mongoose.connection.collections
  for (const key in collections) await collections[key].deleteMany()
}

export async function createTestUser(role = 'student') {
  const password = await bcrypt.hash('basket123', 10)
  return User.create({
    email: `${role}@test.fr`,
    password,
    firstName: 'Test',
    lastName: role === 'admin' ? 'Admin' : 'Etudiant',
    role,
    isFirstLogin: false,
  })
}

export async function createTestCourse() {
  return Course.create({ title: 'Cours Test', description: 'Description test', icon: '🏀', color: '#e74c3c' })
}

export async function createTestLesson(courseId, availableAt = new Date('2026-01-01')) {
  return Lesson.create({ courseId, title: 'Leçon Test', content: '<p>Contenu</p>', order: 1, availableAt })
}

export async function createTestQuiz(courseId) {
  return Quiz.create({
    courseId,
    title: 'Quiz Test',
    passingScore: 60,
    questions: [
      { text: 'Combien de joueurs ?', options: ['4', '5', '6'], correctAnswers: ['5'] },
      { text: 'Durée d\'un quart-temps ?', options: ['8 min', '10 min', '12 min'], correctAnswers: ['10 min'] },
    ],
  })
}
