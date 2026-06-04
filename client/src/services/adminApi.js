import { getToken } from './auth'

async function adminFetch(path, options = {}) {
  const res = await fetch(`/api/admin${path}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`)
  return data
}

export const getUsers = () => adminFetch('/users')
export const importUsers = (csv) => adminFetch('/users/import', { method: 'POST', body: JSON.stringify({ csv }) })
export const assignCourses = (userId, courseIds) => adminFetch(`/users/${userId}/courses`, { method: 'PUT', body: JSON.stringify({ courseIds }) })

export const createCourse = (data) => adminFetch('/courses', { method: 'POST', body: JSON.stringify(data) })
export const updateCourse = (id, data) => adminFetch(`/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) })

export const createLesson = (courseId, data) => adminFetch(`/courses/${courseId}/lessons`, { method: 'POST', body: JSON.stringify(data) })
export const updateLesson = (id, data) => adminFetch(`/lessons/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteLesson = (id) => adminFetch(`/lessons/${id}`, { method: 'DELETE' })

export const createQuiz = (courseId, data) => adminFetch(`/courses/${courseId}/quizzes`, { method: 'POST', body: JSON.stringify(data) })
export const importQuiz = (courseId, data) => adminFetch(`/courses/${courseId}/quizzes/import`, { method: 'POST', body: JSON.stringify(data) })
export const deleteQuiz = (id) => adminFetch(`/quizzes/${id}`, { method: 'DELETE' })

export const getGrades = () => adminFetch('/grades')
export const getStudentGrades = (userId) => adminFetch(`/grades/students/${userId}`)
