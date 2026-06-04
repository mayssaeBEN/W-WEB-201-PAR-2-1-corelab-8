import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse, getQuizResult } from '../services/api'
import Navbar from '../components/Navbar'
import LessonItem from '../components/LessonItem'
import ProgressBar from '../components/ProgressBar'

export default function CoursePage() {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourse(courseId).then(data => {
      setCourse(data)
      setLoading(false)
    })
  }, [courseId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="d-flex align-items-center justify-content-center" style={{ height: '60vh' }}>
          <div className="text-center">
            <div className="spinner-border text-warning" role="status" />
            <p className="text-muted mt-3">Chargement du cours...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
        <Navbar />
        <div className="container py-5 text-center">
          <h2>Cours introuvable</h2>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/courses')}>
            Retour aux cours
          </button>
        </div>
      </div>
    )
  }

  const { title, description, icon, color, lessons = [], quizzes = [], completedLessons, totalLessons } = course

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 900 }}>

        {/* Back button */}
        <button
          className="btn btn-sm btn-outline-secondary rounded-pill mb-3"
          onClick={() => navigate('/courses')}
        >
          ← Retour aux cours
        </button>

        {/* Course header */}
        <div
          className="rounded-4 p-4 mb-4 text-white"
          style={{ background: `linear-gradient(135deg, ${color}cc, ${color})` }}
        >
          <div className="d-flex align-items-center gap-3 mb-2">
            <span style={{ fontSize: '3rem' }}>{icon}</span>
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: '1.6rem' }}>{title}</h1>
              <p className="mb-0" style={{ opacity: 0.85 }}>{description}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={completedLessons} total={totalLessons} label="Progression du cours" color="light" height={10} showText={true} />
          </div>
        </div>

        <div className="row g-4">

          {/* Lessons */}
          <div className="col-12 col-md-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>📖 Leçons</h2>
              {lessons.length === 0 ? (
                <p className="text-muted">Aucune leçon disponible.</p>
              ) : (
                lessons.map((lesson, i) => (
                  <LessonItem key={lesson._id} lesson={lesson} index={i} />
                ))
              )}
            </div>
          </div>

          {/* Quizzes */}
          <div className="col-12 col-md-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>✅ Quiz</h2>
              {quizzes.length === 0 ? (
                <p className="text-muted">Aucun quiz disponible.</p>
              ) : (
                quizzes.map(quiz => {
                  const result = getQuizResult(quiz._id)
                  return (
                    <div
                      key={quiz._id}
                      className="p-3 rounded-3 mb-2"
                      style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}
                    >
                      <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem' }}>{quiz.title}</div>
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <small className="text-muted">Seuil : {quiz.passingScore}%</small>
                        {result && (
                          <span className={`badge rounded-pill ${result.passed ? 'bg-success' : 'bg-danger'}`}>
                            {result.score}% {result.passed ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn btn-sm mt-2 w-100 rounded-pill fw-semibold"
                        style={{ background: color, color: 'white', border: 'none', fontSize: '0.85rem' }}
                        onClick={() => navigate(`/quiz/${quiz._id}`)}
                      >
                        {result ? 'Refaire le quiz' : 'Démarrer le quiz'}
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
