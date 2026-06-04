import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUsers, getGrades } from '../../services/adminApi'
import { fetchCourses } from '../../services/api'
import Navbar from '../../components/Navbar'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ users: 0, courses: 0, grades: 0 })

  useEffect(() => {
    Promise.all([getUsers(), fetchCourses(), getGrades()]).then(([users, courses, grades]) => {
      setStats({ users: users.length, courses: courses.length, grades: grades.length })
    }).catch(() => {})
  }, [])

  const cards = [
    { icon: '👥', label: 'Étudiants', value: stats.users, color: '#3b82f6', path: '/admin/users' },
    { icon: '📚', label: 'Cours', value: stats.courses, color: '#f97316', path: '/admin/courses' },
    { icon: '📊', label: 'Résultats de quiz', value: stats.grades, color: '#16a34a', path: '/admin/grades' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1100 }}>
        <div className="rounded-4 p-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.8rem' }}>Bonjour, {user?.firstName} 👋</h1>
          <p className="text-white-50 mb-0">Tableau de bord administrateur — BasketLearn</p>
        </div>

        <div className="row g-3 mb-4">
          {cards.map(c => (
            <div key={c.label} className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(c.path)}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-3 d-flex align-items-center justify-content-center" style={{ width: 56, height: 56, background: `${c.color}22`, fontSize: '1.8rem' }}>{c.icon}</div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '2rem', color: c.color, lineHeight: 1 }}>{c.value}</div>
                    <div className="text-muted small">{c.label}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          {[
            { title: '➕ Ajouter des étudiants', desc: 'Importer une liste d\'étudiants via CSV', btn: 'Gérer les étudiants', path: '/admin/users' },
            { title: '📖 Gérer les cours', desc: 'Créer des cours, ajouter des leçons HTML et des quiz', btn: 'Gérer les cours', path: '/admin/courses' },
            { title: '📈 Voir les notes', desc: 'Consulter les résultats de quiz de tous les étudiants', btn: 'Voir les notes', path: '/admin/grades' },
          ].map(item => (
            <div key={item.title} className="col-12 col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h6 className="fw-bold mb-2">{item.title}</h6>
                <p className="text-muted small mb-3">{item.desc}</p>
                <button className="btn btn-sm rounded-pill text-white fw-semibold" style={{ background: '#0f3460', border: 'none' }} onClick={() => navigate(item.path)}>
                  {item.btn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
