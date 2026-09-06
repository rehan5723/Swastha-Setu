import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loginUser, registerUser, requestPasswordReset } from '../services/api'

/**
 * AuthContext — mock authentication state management.
 *
 * Persists session in localStorage so page refresh doesn't log the user out.
 * Replace the internals with real API calls when the backend is ready.
 */

const AuthContext = createContext(null)

const SESSION_KEY = 'swasthya_setu_session'

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    const session = raw ? JSON.parse(raw) : null
    return session?.user || session
  } catch {
    return null
  }
}

function saveSession(user, token) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ user, token }))
  } catch { /* ignore */ }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch { /* ignore */ }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => loadSession())
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(user)

  const login = useCallback(async ({ identifier, password }) => {
    if (!identifier?.trim() || !password?.trim()) {
      throw new Error('Please enter your mobile number or email and password.')
    }

    setLoading(true)
    try {
      const response = await loginUser({ identifier, password })
      const sessionUser = response.user
      setUser(sessionUser)
      saveSession(sessionUser, response.token)
      return sessionUser
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, mobile, password }) => {
    if (!name?.trim() || !email?.trim() || !mobile?.trim() || !password) {
      throw new Error('All fields are required.')
    }

    setLoading(true)
    try {
      const response = await registerUser({ name: name.trim(), email: email.trim(), mobile, password })
      const sessionUser = response.user
      setUser(sessionUser)
      saveSession(sessionUser, response.token)
      return sessionUser
    } finally {
      setLoading(false)
    }
  }, [])

  const forgotPassword = useCallback(async ({ email }) => {
    if (!email?.trim()) throw new Error('Please enter your email address.')
    return requestPasswordReset(email.trim())
  }, [])

  // ── Logout ──────────────────────────────────────────────
  const logout = useCallback(() => {
    setUser(null)
    clearSession()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
