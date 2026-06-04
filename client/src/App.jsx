import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'

import LoginPage from './pages/LoginPage'
import FirstLoginPage from './pages/FirstLoginPage'

import StudentDashboard from './pages/StudentDashboard'
import CoursesPage from './pages/CoursesPage'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import QuizPage from './pages/QuizPage'
import QuizResultPage from './pages/QuizResultPage'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminCoursesPage from './pages/admin/AdminCoursesPage'
import AdminCourseDetailPage from './pages/admin/AdminCourseDetailPage'
import AdminGradesPage from './pages/admin/AdminGradesPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Routes étudiant */}
          <Route element={<PrivateRoute />}>
            <Route path="/first-login" element={<FirstLoginPage />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:courseId" element={<CoursePage />} />
            <Route path="/lessons/:lessonId" element={<LessonPage />} />
            <Route path="/quiz/:quizId" element={<QuizPage />} />
            <Route path="/quiz/:quizId/results" element={<QuizResultPage />} />
          </Route>

          {/* Routes admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/courses/:courseId" element={<AdminCourseDetailPage />} />
            <Route path="/admin/grades" element={<AdminGradesPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
