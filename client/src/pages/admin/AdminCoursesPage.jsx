import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCourses } from '../../services/api'
import { createCourse } from '../../services/adminApi'
import Navbar from '../../components/Navbar'

const COLORS = ['#e74c3c', '#e67e22', '#27ae60', '#2980b9', '#8e44ad', '#1abc9c', '#f39c12']
const ICONS = ['🏀', '📋', '🎯', '🛡️', '🧩', '🏃', '💪', '🧠', '📖', '🎓']

export default function AdminCoursesPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', icon: '🏀', color: '#e74c3c' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchCourses().then(setCourses).catch(() => {}) }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await createCourse(form)
      const updated = await fetchCourses()
      setCourses(updated)
      setShowForm(false)
      setForm({ title: '', description: '', icon: '🏀', color: '#e74c3c' })
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1100 }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h1 className="fw-bold mb-0" style={{ fontSize: '1.6rem' }}>📚 Gestion des cours</h1>
          <button className="btn rounded-pill text-white fw-semibold px-4" style={{ background: '#f97316', border: 'none' }} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : '➕ Nouveau cours'}
          </button>
        </div>

        {showForm && (
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Créer un nouveau cours</h2>
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold text-muted">Titre</label>
                  <input className="form-control rounded-3" placeholder="Ex: Techniques de dribble avancées" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small fw-semibold text-muted">Icône</label>
                  <select className="form-select rounded-3" value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="col-6 col-md-2">
                  <label className="form-label small fw-semibold text-muted">Couleur</label>
                  <select className="form-select rounded-3" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))}>
                    {COLORS.map(c => <option key={c} value={c} style={{ background: c, color: 'white' }}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold text-muted">Description</label>
                  <textarea className="form-control rounded-3" rows={2} placeholder="Description du cours..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required />
                </div>
              </div>
              {error && <div className="alert alert-danger rounded-3 py-2 small mt-3">{error}</div>}
              <button type="submit" className="btn rounded-pill text-white fw-semibold mt-3 px-4" style={{ background: '#0f3460', border: 'none' }} disabled={saving}>
                {saving ? 'Création...' : '✅ Créer le cours'}
              </button>
            </form>
          </div>
        )}

        <div className="row g-3">
          {courses.map(c => (
            <div key={c._id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100">
                <div className="d-flex align-items-center justify-content-center" style={{ height: 70, background: `${c.color}22` }}>
                  <span style={{ fontSize: '2.5rem' }}>{c.icon}</span>
                </div>
                <div className="p-3">
                  <h6 className="fw-bold mb-1">{c.title}</h6>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.4 }}>{c.description}</p>
                  <div className="d-flex gap-2 mb-2">
                    <span className="badge rounded-pill bg-light text-secondary">📖 {c.lessonsCount} leçons</span>
                    <span className="badge rounded-pill bg-light text-secondary">✅ {c.quizzesCount} quiz</span>
                  </div>
                  <button className="btn btn-sm w-100 rounded-pill fw-semibold text-white" style={{ background: c.color, border: 'none' }} onClick={() => navigate(`/admin/courses/${c._id}`)}>
                    Gérer le contenu →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
