import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'

// Context providers
import { AuthProvider }               from './context/AuthContext'
import { ToastProvider }              from './components/common/Toast'

// Public pages
import Landing        from './pages/Landing'
import Login          from './pages/Login'
import Register       from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword  from './pages/ResetPassword'

// App Shell layout
import AppShell from './layouts/AppShell'

// Protected pages
import Dashboard       from './pages/Dashboard'
import MedicalReports  from './pages/MedicalReports'
import Imaging         from './pages/Imaging'
import Dermatology     from './pages/Dermatology'
import GovernmentSchemes from './pages/GovernmentSchemes'
import HistoryPage     from './pages/History'
import AnalysisDetails from './pages/AnalysisDetails'
import Profile         from './pages/Profile'
import Settings        from './pages/Settings'

const router = createBrowserRouter(
  [
    /* ── Landing (public / guest-only) ─────────────── */
    {
      path: '/',
      element: <Landing />,
    },

    /* ── Auth pages (guest-only) ────────────────────── */
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/register',
      element: <Register />,
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
    },
    {
      path: '/reset-password',
      element: <ResetPassword />,
    },

    /* ── App pages ───────────────────────────────────── */
    {
      element: <AppShell />,
      children: [
            { path: '/dashboard', element: <Dashboard /> },

            {
              path: '/medical-reports',
              element: <MedicalReports />,
            },
            {
              path: '/imaging',
              element: <Imaging />,
            },
            {
              path: '/dermatology',
              element: <Dermatology />,
            },
            {
              path: '/government-schemes',
              element: <GovernmentSchemes />,
            },
            {
              path: '/history',
              element: <HistoryPage />,
            },
            {
              path: '/analysis/:id',
              element: <AnalysisDetails />,
            },
            {
              path: '/profile',
              element: <Profile />,
            },
            {
              path: '/settings',
              element: <Settings />,
            },
      ],
    },

    /* ── 404 fallback ───────────────────────────────── */
    { path: '*', element: <Navigate to="/" replace /> },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
)

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </AuthProvider>
  )
}
