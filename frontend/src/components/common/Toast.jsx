import React, { createContext, useContext, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

/* ── Context ─────────────────────────────────────────── */
const ToastContext = createContext(null)

let toastId = 0

const iconMap = {
  success: <CheckCircle2 size={18} />,
  error:   <XCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
}

const styleMap = {
  success: 'bg-white border-l-4 border-success-500 text-ink-900',
  error:   'bg-white border-l-4 border-danger-500 text-ink-900',
  warning: 'bg-white border-l-4 border-warning-500 text-ink-900',
  info:    'bg-white border-l-4 border-brand-500 text-ink-900',
}

const iconColor = {
  success: 'text-success-500',
  error:   'text-danger-500',
  warning: 'text-warning-500',
  info:    'text-brand-500',
}

/* ── Single toast item ───────────────────────────────── */
function ToastItem({ id, type = 'info', title, message, onDismiss }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.96 }}
      transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
      className={[
        'flex items-start gap-3 w-80 max-w-full px-4 py-3.5 rounded-xl shadow-card-hover',
        styleMap[type],
      ].join(' ')}
      role="alert"
    >
      <span className={`mt-0.5 flex-shrink-0 ${iconColor[type]}`}>
        {iconMap[type]}
      </span>
      <div className="flex-1 min-w-0">
        {title && <p className="text-[13px] font-semibold leading-snug">{title}</p>}
        {message && (
          <p className={`text-[12px] text-ink-500 ${title ? 'mt-0.5' : ''}`}>{message}</p>
        )}
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="flex-shrink-0 text-ink-300 hover:text-ink-700 transition-colors focus:outline-none"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

/* ── Provider ────────────────────────────────────────── */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, type, title, message }])
    if (duration > 0) {
      setTimeout(() => dismiss(id), duration)
    }
    return id
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div
          className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2.5 items-end"
          aria-live="polite"
          aria-label="Notifications"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} {...t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

/* ── Hook ────────────────────────────────────────────── */
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}
