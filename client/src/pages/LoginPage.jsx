import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { login, isAuth, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (isAuth) navigate(user?.role === 'admin' ? '/admin' : '/dashboard', { replace: true })
  }, [isAuth, user, navigate])
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user, isFirstLogin } = await login(email, password)
      if (isFirstLogin) navigate('/first-login')
      else if (user.role === 'admin') navigate('/admin')
      else navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5">
            <div className="text-center mb-4">
              <div style={{ fontSize: '4rem' }}>🏀</div>
              <h1 className="text-white fw-bold mt-2" style={{ letterSpacing: 2 }}>BasketLearn</h1>
              <p className="text-white-50">Plateforme e-learning basketball</p>
            </div>
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <h2 className="fw-bold text-center mb-4" style={{ fontSize: '1.4rem' }}>Connexion</h2>
              {error && <div className="alert alert-danger rounded-3 py-2 px-3 mb-3" role="alert">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold small text-muted" htmlFor="email">Adresse email</label>
                  <input id="email" type="email" className="form-control rounded-3" placeholder="vous@example.fr" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold small text-muted" htmlFor="password">Mot de passe</label>
                  <input id="password" type="password" className="form-control rounded-3" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn w-100 fw-bold rounded-pill py-2 text-white" style={{ background: 'linear-gradient(135deg, #f97316, #ef4444)', border: 'none' }} disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Connexion...</> : 'Se connecter'}
                </button>
              </form>
              <div className="mt-4 p-3 rounded-3 bg-light">
                <p className="small text-muted mb-1 fw-semibold">Comptes de démonstration :</p>
                <p className="small text-muted mb-0">👤 <code>etudiant@basketball.fr</code> / <code>basket123</code></p>
                <p className="small text-muted mb-0">🔧 <code>admin@basketball.fr</code> / <code>admin123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
