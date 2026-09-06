import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

/**
 * Modal — accessible dialog overlay.
 *
 * Usage:
 *   <Modal open={open} onClose={() => setOpen(false)} title="Title">
 *     content
 *   </Modal>
 *
 * size: 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */

const sizes = {
  sm:   'max-w-sm',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-[92vw] max-h-[92vh]',
}

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlay = true,
  showCloseButton = true,
  className = '',
}) {
  const firstFocusableRef = useRef(null)

  // Trap focus & handle Escape
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement
    firstFocusableRef.current?.focus()
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
      prev?.focus()
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={closeOnOverlay ? onClose : undefined}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className={[
              'relative w-full bg-white rounded-3xl shadow-modal overflow-hidden flex flex-col',
              sizes[size],
              className,
            ].join(' ')}
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-surface-200">
                <div>
                  {title && (
                    <h2
                      id="modal-title"
                      className="text-[18px] font-bold text-ink-900"
                      ref={firstFocusableRef}
                      tabIndex={-1}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-[13px] text-ink-500 mt-0.5">{description}</p>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-4 p-1.5 rounded-lg text-ink-500 hover:bg-surface-100 hover:text-ink-900 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500"
                    aria-label="Close modal"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-thin">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 border-t border-surface-200 bg-surface-50 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}
