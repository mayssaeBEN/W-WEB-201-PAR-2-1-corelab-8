import { useEffect, useState } from 'react'
import { getGrades } from '../../services/adminApi'
import Navbar from '../../components/Navbar'

export default function AdminGradesPage() {
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    getGrades().then(data => { setGrades(data || []); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = grades.filter(g => {
    const name = `${g.userId?.firstName} ${g.userId?.lastName} ${g.userId?.email}`.toLowerCase()
    return name.includes(filter.toLowerCase())
  })

  const passed = grades.filter(g => g.passed).length
  const failed = grades.filter(g => !g.passed).length
  const avg = grades.length > 0 ? Math.round(grades.reduce((s, g) => s + g.score, 0) / grades.length) : 0

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1100 }}>
        <h1 className="fw-bold mb-4" style={{ fontSize: '1.6rem' }}>Notes des étudiants</h1>

        <div className="row g-3 mb-4">
          {[
            { label: 'Total résultats', value: grades.length, color: '#1f3a5f' },
            { label: 'Réussis', value: passed, color: '#2f855a' },
            { label: 'Échoués', value: failed, color: '#b6473d' },
            { label: 'Moyenne générale', value: `${avg}%`, color: '#f97316' },
          ].map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="card border-0 shadow-sm rounded-4 p-3 text-center">
                <div className="fw-bold" style={{ fontSize: '1.8rem', color: s.color }}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </div>
            </div>
          ))}
        </div>

        <div className="card border-0 shadow-sm rounded-4 p-4">
          <div className="mb-3">
            <input className="form-control rounded-3" placeholder="Filtrer par étudiant..." value={filter} onChange={e => setFilter(e.target.value)} style={{ maxWidth: 320 }} />
          </div>

          {loading ? (
            <div className="text-center py-4"><div className="spinner-border text-warning" role="status" /></div>
          ) : filtered.length === 0 ? (
            <p className="text-muted">Aucun résultat trouvé.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover small align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Étudiant</th>
                    <th>Quiz</th>
                    <th>Score</th>
                    <th>Résultat</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(g => (
                    <tr key={g._id}>
                      <td>
                        <div className="fw-semibold">{g.userId?.firstName} {g.userId?.lastName}</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{g.userId?.email}</div>
                      </td>
                      <td className="fw-medium">{g.quizId?.title || '-'}</td>
                      <td>
                        <span className="fw-bold" style={{ color: g.passed ? '#16a34a' : '#dc2626' }}>{g.score}%</span>
                        <div className="progress mt-1 rounded-pill" style={{ height: 4, width: 80 }}>
                          <div className={`progress-bar rounded-pill ${g.passed ? 'bg-success' : 'bg-danger'}`} style={{ width: `${g.score}%` }} />
                        </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${g.passed ? 'bg-success' : 'bg-danger'}`}>
                          {g.passed ? 'Réussi' : 'Échoué'}
                        </span>
                      </td>
                      <td className="text-muted">{new Date(g.completedAt).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
