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
    <div className="page-shell">
      <Navbar />

      <main className="container page-container flex-grow-1">

        <NotificationBanner />

        {/* Welcome */}
        <div className="page-header compact-header">
          <h1>Bonjour, {user?.firstName}</h1>
          <p className="text-muted small mb-0">
            {globalPct === 0
              ? 'Prêt à démarrer ton apprentissage basketball ?'
              : globalPct === 100
              ? 'Félicitations, tu as tout complété !'
              : `Continue comme ça ! Tu es à ${globalPct}% de ta progression.`}
          </p>
        </div>

        {/* Stats */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100">
              <div className="stat-value">{courses.length}</div>
              <small className="text-muted">Cours disponibles</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100">
              <div className="stat-value">{completedLessons}</div>
              <small className="text-muted">Leçons complétées</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100">
              <div className="stat-value">{globalPct}%</div>
              <small className="text-muted">Progression globale</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card stat-card h-100">
              <div className="stat-value">{activeCourses.length}</div>
              <small className="text-muted">Cours en cours</small>
            </div>
          </div>
        </div>

        <div className="card panel-card mb-4">
          <h2 className="section-title">Progression générale</h2>
          <ProgressBar value={completedLessons} total={totalLessons} label="Toutes leçons confondues" height={8} />
        </div>

        <div className="row g-4">
          {/* Accès rapide */}
          <div className="col-lg-4">
            <div className="card panel-card h-100">
              <h2 className="section-title">Accès rapide</h2>

              <p className="text-muted small text-uppercase mb-2">Continuer</p>
              {activeCourses.length === 0 ? (
                <p className="text-muted small">Aucun cours en cours. Démarre un cours !</p>
              ) : (
                activeCourses.map(c => (
                  <div
                    key={c._id}
                    className="quick-course"
                    onClick={() => navigate(`/courses/${c._id}`)}
                    role="button"
                  >
                    <div className="flex-grow-1">
                      <div className="small fw-semibold">{c.title}</div>
                      <div className="progress mt-1" style={{ height: 4 }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${Math.round((c.completedLessons / c.totalLessons) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}

              <hr />

              <p className="text-muted small text-uppercase mb-2">Quiz disponibles</p>
              {courses.slice(0, 2).map(c => (
                <button
                  key={c._id}
                  className="btn btn-outline-orange btn-sm w-100 mb-2"
                  onClick={() => navigate(`/courses/${c._id}`)}
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>

          {/* Course list */}
          <div className="col-lg-8">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h2 className="section-title mb-0">Mes cours</h2>
              <button className="btn btn-quiet btn-sm" onClick={() => navigate('/courses')}>
                Voir tous
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status" />
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

      </main>
      <Footer />
    </div>
  )
}
