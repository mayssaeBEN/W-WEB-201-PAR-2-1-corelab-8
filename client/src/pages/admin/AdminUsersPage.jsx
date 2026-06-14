import { useEffect, useState } from 'react'
import { getUsers, importUsers, assignCourses } from '../../services/adminApi'
import { fetchCourses } from '../../services/api'
import Navbar from '../../components/Navbar'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [courses, setCourses] = useState([])
  const [csv, setCsv] = useState('')
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [error, setError] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedCourses, setSelectedCourses] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getUsers(), fetchCourses()]).then(([u, c]) => { setUsers(u); setCourses(c) }).catch(() => {})
  }, [])

  async function handleImport(e) {
    e.preventDefault()
    if (!csv.trim()) return
    setImporting(true); setError(''); setImportResult(null)
    try {
      const result = await importUsers(csv)
      setImportResult(result)
      setCsv('')
      const updated = await getUsers()
      setUsers(updated)
    } catch (err) { setError(err.message) }
    finally { setImporting(false) }
  }

  function openAssign(user) {
    setSelectedUser(user)
    setSelectedCourses(user.accessibleCourses?.map(c => c._id || c) || [])
  }

  async function handleAssign() {
    if (!selectedUser) return
    setSaving(true)
    try {
      await assignCourses(selectedUser._id, selectedCourses)
      const updated = await getUsers()
      setUsers(updated)
      setSelectedUser(null)
    } catch (err) { setError(err.message) }
    finally { setSaving(false) }
  }

  function toggleCourse(id) {
    setSelectedCourses(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Navbar />
      <div className="container-fluid px-4 py-4" style={{ maxWidth: 1100 }}>
        <h1 className="fw-bold mb-4" style={{ fontSize: '1.6rem' }}>Gestion des étudiants</h1>

        <div className="row g-4">
          {/* Import CSV */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Importer des étudiants (CSV)</h2>
              <p className="text-muted small mb-3">Format : <code>email,firstName,lastName</code></p>
              <form onSubmit={handleImport}>
                <textarea
                  className="form-control rounded-3 mb-3 font-monospace"
                  rows={6}
                  placeholder={"email,firstName,lastName\nalice@example.fr,Alice,Dupont\nbob@example.fr,Bob,Martin"}
                  value={csv}
                  onChange={e => setCsv(e.target.value)}
                  style={{ fontSize: '0.8rem' }}
                />
                {error && <div className="alert alert-danger rounded-3 py-2 small mb-3">{error}</div>}
                {importResult && (
                  <div className="alert alert-success rounded-3 py-2 small mb-3">
                    {importResult.created} créé(s), {importResult.skipped} ignoré(s)
                    {importResult.errors?.length > 0 && <div className="mt-1 text-danger">{importResult.errors.join(', ')}</div>}
                  </div>
                )}
                <button type="submit" className="btn w-100 rounded-pill text-white fw-semibold" style={{ background: '#0f3460', border: 'none' }} disabled={importing}>
                  {importing ? <><span className="spinner-border spinner-border-sm me-2" />Import...</> : 'Importer'}
                </button>
              </form>
            </div>
          </div>

          {/* Liste étudiants */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h2 className="fw-bold mb-3" style={{ fontSize: '1.1rem' }}>Liste des étudiants ({users.length})</h2>
              {users.length === 0 ? (
                <p className="text-muted">Aucun étudiant. Importez-en via CSV.</p>
              ) : (
                <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                  <table className="table table-hover small">
                    <thead><tr><th>Nom</th><th>Email</th><th>Cours</th><th></th></tr></thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td className="fw-semibold">{u.firstName} {u.lastName}</td>
                          <td className="text-muted">{u.email}</td>
                          <td><span className="badge bg-light text-secondary">{u.accessibleCourses?.length || 0} cours</span></td>
                          <td>
                            <button className="btn btn-sm rounded-pill" style={{ background: '#f0f9ff', color: '#0f3460', border: '1px solid #bae6fd', fontSize: '0.75rem' }} onClick={() => openAssign(u)}>
                              Assigner
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal assign courses */}
        {selectedUser && (
          <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={e => e.target === e.currentTarget && setSelectedUser(null)}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content rounded-4 border-0 p-4">
                <h5 className="fw-bold mb-1">Assigner des cours</h5>
                <p className="text-muted small mb-3">{selectedUser.firstName} {selectedUser.lastName}</p>
                <div className="d-flex flex-column gap-2 mb-4">
                  {courses.map(c => (
                    <label key={c._id} className="d-flex align-items-center gap-3 p-2 rounded-3" style={{ cursor: 'pointer', background: selectedCourses.includes(c._id) ? '#f0f9ff' : '#f8fafc', border: `1px solid ${selectedCourses.includes(c._id) ? '#93c5fd' : '#e5e7eb'}` }}>
                      <input type="checkbox" className="form-check-input m-0" checked={selectedCourses.includes(c._id)} onChange={() => toggleCourse(c._id)} style={{ accentColor: '#0f3460' }} />
                      <span style={{ fontSize: '1.2rem' }}>{c.icon}</span>
                      <span className="small fw-semibold">{c.title}</span>
                    </label>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn flex-grow-1 rounded-pill text-white fw-semibold" style={{ background: '#0f3460', border: 'none' }} onClick={handleAssign} disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Enregistrer'}
                  </button>
                  <button className="btn btn-outline-secondary rounded-pill" onClick={() => setSelectedUser(null)}>Annuler</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
