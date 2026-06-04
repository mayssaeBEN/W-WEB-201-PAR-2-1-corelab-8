import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { getToken } from '../services/auth'

export default function FirstLoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    if (password.length < 8) { setError('Minimum 8 caractères.'); return }
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/first-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ newPassword: password }),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error) }
      navigate('/dashboard')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-9 col-md-6 col-lg-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '3.5rem' }}>🔐</div>
              <h1 className="text-white fw-bold mt-2">Bienvenue !</h1>
              <p className="text-white-50">Bonjour {user?.firstName}, choisis ton mot de passe pour sécuriser ton compte.</p>
            </div>
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <h2 className="fw-bold text-center mb-4" style={{ fontSize: '1.3rem' }}>Choisir mon mot de passe</h2>
              {error && <div className="alert alert-danger rounded-3 py-2 mb-3 small">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted">Nouveau mot de passe</label>
                  <input id="pwd" type="password" className="form-control rounded-3" placeholder="Minimum 8 caractères" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold text-muted">Confirmer le mot de passe</label>
                  <input type="password" className="form-control rounded-3" placeholder="Répéter le mot de passe" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                </div>
                <button type="submit" className="btn w-100 fw-bold rounded-pill py-2 text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none' }} disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</> : '✅ Définir mon mot de passe'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
