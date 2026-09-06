import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopNav from './TopNav'

/**
 * AppShell — main authenticated layout.
 * Desktop: Sidebar (collapsible) + TopNav + main content area.
 * Mobile: TopNav with hamburger; sidebar overlays from left.
 */
export default function AppShell({ pageTitle }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* ── Desktop sidebar ─────────────────────────── */}
      <div className="hidden lg:flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />
      </div>

      {/* ── Mobile sidebar overlay ───────────────────── */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-ink-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 top-0 h-full z-40 lg:hidden">
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileSidebarOpen(false)}
            />
          </div>
        </>
      )}

      {/* ── Right column: TopNav + page content ─────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav
          pageTitle={pageTitle}
          onMenuToggle={() => setMobileSidebarOpen((v) => !v)}
        />

        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
