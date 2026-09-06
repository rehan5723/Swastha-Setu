import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Scan,
  Stethoscope,
  Building2,
  History,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react'

const navItems = [
  {
    group: 'Main',
    items: [
      { to: '/dashboard',         icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    group: 'Analysis',
    items: [
      { to: '/medical-reports',   icon: FileText,         label: 'Medical Reports' },
      { to: '/imaging',           icon: Scan,             label: 'X-Ray / MRI' },
      { to: '/dermatology',       icon: Stethoscope,      label: 'Skin Concern' },
      { to: '/government-schemes',icon: Building2,        label: 'Govt Schemes' },
    ],
  },
  {
    group: 'Account',
    items: [
      { to: '/history',           icon: History,          label: 'History' },
      { to: '/profile',           icon: User,             label: 'Profile' },
      { to: '/settings',          icon: Settings,         label: 'Settings' },
    ],
  },
]

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      className="relative flex-shrink-0 flex flex-col bg-white border-r border-surface-200 h-screen overflow-hidden z-20"
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-surface-200 overflow-hidden flex-shrink-0">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
          <Activity size={18} className="text-white" />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <span className="text-[15px] font-extrabold brand-gradient tracking-tight">
                Swasthya Setu
              </span>
              <p className="text-[9px] font-medium text-ink-300 uppercase tracking-widest mt-[-1px]">
                AI Healthcare
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        {navItems.map((group) => (
          <div key={group.group} className="mb-4">
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-4 mb-1 text-[10px] font-bold uppercase tracking-widest text-ink-300"
                >
                  {group.group}
                </motion.p>
              )}
            </AnimatePresence>

            {group.items.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to
              return (
                <NavLink
                  key={to}
                  to={to}
                  title={collapsed ? label : undefined}
                  className={[
                    'flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 overflow-hidden',
                    active
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-ink-500 hover:bg-surface-100 hover:text-ink-900',
                  ].join(' ')}
                >
                  <Icon
                    size={18}
                    className={`flex-shrink-0 ${active ? 'text-brand-500' : ''}`}
                  />
                  <AnimatePresence initial={false}>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active indicator dot */}
                  {active && !collapsed && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-surface-200 text-ink-400 hover:text-ink-700 hover:bg-surface-50 transition-colors focus:outline-none"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed
          ? <ChevronRight size={18} />
          : <ChevronLeft size={18} />
        }
      </button>
    </motion.aside>
  )
}
