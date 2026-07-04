import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCourses } from '../../services/api'
import { createCourse } from '../../services/adminApi'
import Navbar from '../../components/Navbar'

const COLORS = ['#f97316', '#1f3a5f', '#2f855a', '#d97706', '#64748b']

export default function AdminCoursesPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', icon: '', color: '#f97316' })
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
      setForm({ title: '', description: '', icon: '', color: '#f97316' })
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="page-shell">
      <Navbar />
      <main className="container page-container flex-grow-1" style={{ maxWidth: 1100 }}>
        <div className="page-header d-flex align-items-center justify-content-between">
          <h1>Gestion des cours</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Annuler' : 'Nouveau cours'}
          </button>
        </div>

        {showForm && (
          <div className="card panel-card mb-4">
            <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Créer un nouveau cours</h2>
            <form onSubmit={handleCreate}>
              <div className="row g-3">
                <div className="col-12 col-md-8">
                  <label className="form-label small fw-semibold text-muted">Titre</label>
                  <input className="form-control rounded-3" placeholder="Ex: Techniques de dribble avancées" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="col-12 col-md-4">
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
              <button type="submit" className="btn btn-primary mt-3 px-4" disabled={saving}>
                {saving ? 'Création...' : 'Créer le cours'}
              </button>
            </form>
          </div>
        )}

        <div className="row g-3">
          {courses.map(c => (
            <div key={c._id} className="col-12 col-md-6 col-lg-4">
              <div className="card course-card overflow-hidden h-100">
                <div style={{ height: 12, background: c.color }} />
                <div className="p-3">
                  <h6 className="fw-bold mb-1">{c.title}</h6>
                  <p className="text-muted small mb-3" style={{ lineHeight: 1.4 }}>{c.description}</p>
                  <div className="d-flex gap-2 mb-2">
                    <span className="badge rounded-pill bg-light text-secondary">{c.lessonsCount} leçons</span>
                    <span className="badge rounded-pill bg-light text-secondary">{c.quizzesCount} quiz</span>
                  </div>
                  <button className="btn btn-quiet btn-sm w-100" onClick={() => navigate(`/admin/courses/${c._id}`)}>
                    Gérer le contenu
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
