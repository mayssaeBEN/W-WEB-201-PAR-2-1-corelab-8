const TOKEN_KEY = 'basketball_lms_token'
const USER_KEY = 'basketball_lms_user'

// Utilisateurs mock (fallback si le serveur est hors ligne)
const MOCK_USERS = [
  { _id: 'u1', email: 'etudiant@basketball.fr', password: 'basket123', firstName: 'Jordan', lastName: 'Martin', role: 'student' },
  { _id: 'u2', email: 'admin@basketball.fr', password: 'admin123', firstName: 'Admin', lastName: 'Coach', role: 'admin' },
]

export async function login(email, password) {
  // Essai sur la vraie API
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.ok) {
      const { token, user, isFirstLogin } = await res.json()
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return { token, user, isFirstLogin }
    }
    if (res.status === 401 || res.status === 400) {
      const { error } = await res.json()
      throw new Error(error || 'Email ou mot de passe incorrect')
    }
  } catch (err) {
    // Si ce n'est pas un 401/400 mais une erreur réseau → fallback mock
    if (err.message !== 'Email ou mot de passe incorrect' && !err.message.includes('invalide')) {
      console.warn('API hors ligne — utilisation du mode hors ligne')
    } else {
      throw err
    }
  }

  // Fallback mock (serveur non disponible)
  const user = MOCK_USERS.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Email ou mot de passe incorrect')
  const { password: _, ...safeUser } = user
  const token = btoa(JSON.stringify({ userId: user._id, exp: Date.now() + 86400000 }))
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
  return { token, user: safeUser }
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function isAuthenticated() {
  const token = getToken()
  if (!token) return false
  try {
    // Token JWT réel (3 parties base64)
    if (token.includes('.')) {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp > Date.now() / 1000
    }
    // Token mock (1 partie base64)
    const payload = JSON.parse(atob(token))
    return payload.exp > Date.now()
  } catch {
    return false
  }
}
