import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search, LogOut, User, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function TopNav({ onMenuToggle, pageTitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const displayName = user?.name || 'User'
  const initials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white border-b border-surface-200 z-10">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-ink-500 hover:bg-surface-100 transition-colors focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        {pageTitle && (
          <span className="text-[15px] font-semibold text-ink-900 hidden sm:block">
            {pageTitle}
          </span>
        )}
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          className="p-2 rounded-lg text-ink-400 hover:bg-surface-100 hover:text-ink-700 transition-colors focus:outline-none"
          aria-label="Search"
          title="Search"
        >
          <Search size={18} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg text-ink-400 hover:bg-surface-100 hover:text-ink-700 transition-colors focus:outline-none"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger-500 ring-2 ring-white" />
        </button>

        <span className="w-px h-6 bg-surface-200 mx-1" />

        {/* User avatar */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-surface-100 transition-colors group focus:outline-none"
          aria-label="Go to profile"
        >
          {/* Avatar initials */}
          <div className="w-8 h-8 rounded-full bg-brand-gradient flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-[11px] font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-semibold text-ink-900 leading-none">{displayName}</p>
            <p className="text-[11px] text-ink-400 mt-0.5">Patient</p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-ink-400 hover:bg-danger-50 hover:text-danger-500 transition-colors focus:outline-none"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
