import { createContext, useContext, useState, useCallback } from 'react'
import { login as authLogin, logout as authLogout, getCurrentUser, isAuthenticated } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => isAuthenticated() ? getCurrentUser() : null)

  const login = useCallback(async (email, password) => {
    const { user: u, isFirstLogin } = await authLogin(email, password)
    setUser(u)
    return { user: u, isFirstLogin: !!isFirstLogin }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
