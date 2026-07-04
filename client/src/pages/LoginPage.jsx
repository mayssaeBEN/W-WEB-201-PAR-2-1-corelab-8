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
    <main className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4">
            <div className="text-center mb-4">
              <h1 className="fw-bold text-orange">BasketLearn</h1>
              <p className="text-muted">Plateforme e-learning basketball</p>
            </div>
            <div className="card shadow-sm p-4">
              <h2 className="h5 fw-bold text-center mb-4">Connexion</h2>
              {error && <div className="alert alert-danger py-2 mb-3" role="alert">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">Adresse email</label>
                  <input id="email" type="email" className="form-control" placeholder="vous@example.fr" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
                <div className="mb-4">
                  <label className="form-label" htmlFor="password">Mot de passe</label>
                  <input id="password" type="password" className="form-control" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-orange w-100" disabled={loading}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Connexion...</> : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
