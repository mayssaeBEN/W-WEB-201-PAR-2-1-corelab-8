import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { fetchCourses } from '../services/api'
import Navbar from '../components/Navbar'
import ProgressBar from '../components/ProgressBar'
import CourseCard from '../components/CourseCard'
import NotificationBanner from '../components/NotificationBanner'
import Footer from '../components/Footer'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCourses().then(data => {
      setCourses(data || [])
      setLoading(false)
    })
  }, [])

  const totalLessons = courses.reduce((s, c) => s + c.totalLessons, 0)
  const completedLessons = courses.reduce((s, c) => s + c.completedLessons, 0)
  const globalPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const activeCourses = courses.filter(c => c.completedLessons > 0 && c.completedLessons < c.totalLessons)
  const recentCourses = courses.slice(0, 4)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />

      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1200 }}>

        <NotificationBanner />

        {/* Welcome Banner */}
        <div
          className="rounded-4 p-4 mb-4 text-white d-flex align-items-center justify-content-between"
          style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f3460 100%)', minHeight: 140 }}
        >
          <div>
            <h1 className="fw-bold mb-1" style={{ fontSize: '1.8rem' }}>
              Bonjour, {user?.firstName} ! 👋
            </h1>
            <p className="text-white-50 mb-0">
              {globalPct === 0
                ? 'Prêt à démarrer ton apprentissage basketball ?'
                : globalPct === 100
                ? 'Félicitations, tu as tout complété ! 🏆'
                : `Continue comme ça ! Tu es à ${globalPct}% de ta progression.`}
            </p>
          </div>
          <div className="d-none d-md-block text-center">
            <div style={{ fontSize: '5rem', lineHeight: 1 }}>🏀</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-4 text-center p-3">
              <div style={{ fontSize: '2rem' }}>📚</div>
              <div className="fw-bold" style={{ fontSize: '1.8rem', color: '#0f3460' }}>{courses.length}</div>
              <small className="text-muted">Cours disponibles</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-4 text-center p-3">
              <div style={{ fontSize: '2rem' }}>✅</div>
              <div className="fw-bold" style={{ fontSize: '1.8rem', color: '#16a34a' }}>{completedLessons}</div>
              <small className="text-muted">Leçons complétées</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-4 text-center p-3">
              <div style={{ fontSize: '2rem' }}>🎯</div>
              <div className="fw-bold" style={{ fontSize: '1.8rem', color: '#f97316' }}>{globalPct}%</div>
              <small className="text-muted">Progression globale</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100 rounded-4 text-center p-3">
              <div style={{ fontSize: '2rem' }}>🏃</div>
              <div className="fw-bold" style={{ fontSize: '1.8rem', color: '#8b5cf6' }}>{activeCourses.length}</div>
              <small className="text-muted">Cours en cours</small>
            </div>
          </div>
        </div>

        {/* Global progress */}
        <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
          <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>📊 Progression générale</h2>
          <ProgressBar value={completedLessons} total={totalLessons} label="Toutes leçons confondues" color="warning" height={16} />
        </div>

        <div className="row g-4">
          {/* Continue learning */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>⚡ Accès rapide</h2>

              <h6 className="text-muted small fw-semibold text-uppercase mb-2">Continuer</h6>
              {activeCourses.length === 0 ? (
                <p className="text-muted small">Aucun cours en cours. Démarre un cours !</p>
              ) : (
                activeCourses.map(c => (
                  <div
                    key={c._id}
                    className="d-flex align-items-center gap-2 p-2 rounded-3 mb-2"
                    style={{ background: '#f8fafc', cursor: 'pointer', border: '1px solid #e5e7eb' }}
                    onClick={() => navigate(`/courses/${c._id}`)}
                    role="button"
                  >
                    <span style={{ fontSize: '1.5rem' }}>{c.icon}</span>
                    <div className="flex-grow-1">
                      <div className="small fw-semibold" style={{ lineHeight: 1.2 }}>{c.title}</div>
                      <div className="progress mt-1 rounded-pill" style={{ height: 4 }}>
                        <div
                          className="progress-bar bg-warning rounded-pill"
                          style={{ width: `${Math.round((c.completedLessons / c.totalLessons) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}

              <hr className="my-3" />

              <h6 className="text-muted small fw-semibold text-uppercase mb-2">Quiz disponibles</h6>
              {courses.slice(0, 2).map(c => (
                <button
                  key={c._id}
                  className="btn btn-sm w-100 rounded-3 mb-2"
                  style={{ background: '#fff7ed', color: '#f97316', border: '1px solid #fed7aa' }}
                  onClick={() => navigate(`/courses/${c._id}`)}
                >
                  🧠 {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Course list */}
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="fw-bold mb-0" style={{ fontSize: '1.1rem' }}>📚 Tes cours</h2>
              <button
                className="btn btn-sm rounded-pill text-white"
                style={{ background: '#0f3460', border: 'none' }}
                onClick={() => navigate('/courses')}
              >
                Voir tous
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-warning" role="status" />
                <p className="text-muted mt-2">Chargement des cours...</p>
              </div>
            ) : (
              <div className="row g-3">
                {recentCourses.map(course => (
                  <div key={course._id} className="col-12 col-sm-6">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}
