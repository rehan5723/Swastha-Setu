import React from 'react'
import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageLoader } from './Loading'

/**
 * ProtectedRoute — layout route that requires authentication.
 * Uses <Outlet /> so React Router nested children render correctly.
 * If not authenticated, redirects to /login and preserves the intended path.
 */
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader text="Checking session…" />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Render the matched child route via Outlet
  return <Outlet />
}

/**
 * GuestRoute — wraps auth pages (login, register, landing).
 * If already authenticated, redirects to /dashboard.
 */
export function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
