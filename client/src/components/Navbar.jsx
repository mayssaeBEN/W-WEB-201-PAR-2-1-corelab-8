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
    <nav className="navbar navbar-expand-lg navbar-dark bg-navy sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={isAdmin ? '/admin' : '/dashboard'}>
          BasketLearn
          {isAdmin && <span className="badge bg-dark ms-2">ADMIN</span>}
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/admin/users')}`} to="/admin/users">Étudiants</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/admin/courses')}`} to="/admin/courses">Cours</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/admin/grades')}`} to="/admin/grades">Notes</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard">Tableau de bord</Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/courses')}`} to="/courses">Cours</Link>
                </li>
              </>
            )}
          </ul>

          {user && (
            <div className="d-flex align-items-center gap-3">
              <span className="text-white small">{user.firstName} {user.lastName}</span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
