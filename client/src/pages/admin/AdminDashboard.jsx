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
    { label: 'Étudiants', value: stats.users, variant: 'primary', path: '/admin/users' },
    { label: 'Cours', value: stats.courses, variant: 'warning', path: '/admin/courses' },
    { label: 'Résultats de quiz', value: stats.grades, variant: 'success', path: '/admin/grades' },
  ]

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="container py-4 flex-grow-1">
        <div className="bg-primary text-white rounded p-4 mb-4">
          <h1 className="h4 fw-bold mb-1">Bonjour, {user?.firstName}</h1>
          <p className="mb-0 opacity-75">Tableau de bord administrateur - BasketLearn</p>
        </div>

        <div className="row g-3 mb-4">
          {cards.map(c => (
            <div key={c.label} className="col-12 col-md-4">
              <div className="card shadow-sm p-4 h-100" style={{ cursor: 'pointer' }} onClick={() => navigate(c.path)}>
                <div className={`fw-bold fs-2 text-${c.variant}`}>{c.value}</div>
                <div className="text-muted">{c.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="row g-3">
          {[
            { title: 'Ajouter des étudiants', desc: "Importer une liste d'étudiants via CSV", btn: 'Gérer les étudiants', path: '/admin/users' },
            { title: 'Gérer les cours', desc: 'Créer des cours, ajouter des leçons HTML et des quiz', btn: 'Gérer les cours', path: '/admin/courses' },
            { title: 'Voir les notes', desc: 'Consulter les résultats de quiz de tous les étudiants', btn: 'Voir les notes', path: '/admin/grades' },
          ].map(item => (
            <div key={item.title} className="col-12 col-md-4">
              <div className="card shadow-sm p-4 h-100">
                <h6 className="fw-bold mb-2">{item.title}</h6>
                <p className="text-muted small mb-3">{item.desc}</p>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(item.path)}>
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
