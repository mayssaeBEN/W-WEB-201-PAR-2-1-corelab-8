import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { isAuth, user } = useAuth()

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f8fafc' }}>
      <div className="text-center px-4">
        <h1 className="fw-bold mb-2 text-navy" style={{ fontSize: '5rem' }}>404</h1>
        <h2 className="fw-semibold mb-3" style={{ color: '#374151' }}>Page introuvable</h2>
        <p className="text-muted mb-4">Cette page n'existe pas ou a été déplacée.</p>
        <button
          className="btn rounded-pill px-4 py-2 fw-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)', border: 'none' }}
          onClick={() => navigate(isAuth ? (user?.role === 'admin' ? '/admin' : '/dashboard') : '/login')}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
