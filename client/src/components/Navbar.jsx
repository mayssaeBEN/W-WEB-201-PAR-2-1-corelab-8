import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = user?.role === 'admin'

  function handleLogout() {
    logout()
    navigate('/login')
  }

  function isActive(path) {
    return location.pathname.startsWith(path) ? 'active' : ''
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to={isAdmin ? '/admin' : '/dashboard'}>
          <span style={{ fontSize: '1.5rem' }}>🏀</span>
          <span style={{ letterSpacing: '1px' }}>BasketLearn</span>
          {isAdmin && <span className="badge rounded-pill ms-1" style={{ background: '#f97316', fontSize: '0.65rem' }}>ADMIN</span>}
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-1">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link px-3 rounded ${isActive('/admin/users')}`} to="/admin/users">👥 Étudiants</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 rounded ${isActive('/admin/courses')}`} to="/admin/courses">📚 Cours</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 rounded ${isActive('/admin/grades')}`} to="/admin/grades">📊 Notes</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link px-3 rounded ${isActive('/dashboard')}`} to="/dashboard">🏠 Tableau de bord</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link px-3 rounded ${isActive('/courses')}`} to="/courses">📚 Cours</Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white-50 small">👋 {user.firstName} {user.lastName}</span>
              <button className="btn btn-outline-light btn-sm rounded-pill px-3" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
