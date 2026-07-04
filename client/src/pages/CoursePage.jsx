import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchCourse, getQuizResult } from '../services/api'
import Navbar from '../components/Navbar'
import LessonItem from '../components/LessonItem'
import Footer from '../components/Footer'
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
      <div className="page-shell">
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
      <div className="page-shell">
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

  const { title, description, color, lessons = [], quizzes = [], completedLessons, totalLessons } = course

  return (
    <div className="page-shell">
      <Navbar />

      <main className="container page-container flex-grow-1" style={{ maxWidth: 900 }}>

        {/* Back button */}
        <button
          className="btn btn-sm btn-outline-secondary rounded-pill mb-3"
          onClick={() => navigate('/courses')}
        >
          Retour aux cours
        </button>

        {/* Course header */}
        <div className="card panel-card mb-4" style={{ borderTop: `3px solid ${color}` }}>
          <div className="mb-2">
            <div>
              <h1 className="fw-bold mb-1" style={{ fontSize: '1.35rem' }}>{title}</h1>
              <p className="text-muted mb-0">{description}</p>
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar value={completedLessons} total={totalLessons} label="Progression du cours" color="light" height={10} showText={true} />
          </div>
        </div>

        <div className="row g-4">

          {/* Lessons */}
          <div className="col-12 col-md-7">
            <div className="card panel-card">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Leçons</h2>
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
            <div className="card panel-card">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Quiz</h2>
              {quizzes.length === 0 ? (
                <p className="text-muted">Aucun quiz disponible.</p>
              ) : (
                quizzes.map(quiz => {
                  const result = getQuizResult(quiz._id)
                  return (
                    <div
                      key={quiz._id}
                      className="quick-course"
                    >
                      <div className="fw-semibold mb-1" style={{ fontSize: '0.95rem' }}>{quiz.title}</div>
                      <div className="d-flex align-items-center justify-content-between gap-2">
                        <small className="text-muted">Seuil : {quiz.passingScore}%</small>
                        {result && (
                          <span className={`badge rounded-pill ${result.passed ? 'bg-success' : 'bg-danger'}`}>
                            {result.score}% · {result.passed ? 'Réussi' : 'Échoué'}
                          </span>
                        )}
                      </div>
                      <button
                        className="btn btn-primary btn-sm mt-2 w-100"
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
      </main>
      <Footer />
    </div>
  )
}
