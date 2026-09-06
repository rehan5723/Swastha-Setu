import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/* ── Spinner ─────────────────────────────────────────── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 16, md: 24, lg: 32, xl: 48 }
  return (
    <Loader2
      size={sizes[size] || sizes.md}
      className={`animate-spin text-brand-500 ${className}`}
    />
  )
}

/* ── PageLoader — full-screen centred spinner ────────── */
export function PageLoader({ text = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <Spinner size="lg" />
      {text && <p className="text-[14px] text-ink-500">{text}</p>}
    </div>
  )
}

/* ── SkeletonBlock — animated shimmer placeholder ────── */
export function SkeletonBlock({ className = '' }) {
  return (
    <div
      className={`bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100 bg-[length:400%_100%] animate-pulse rounded-lg ${className}`}
    />
  )
}

/* ── SkeletonCard — multi-line card skeleton ─────────── */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col gap-3">
      <SkeletonBlock className="h-5 w-1/3" />
      <SkeletonBlock className="h-4 w-full" />
      <SkeletonBlock className="h-4 w-3/4" />
      <SkeletonBlock className="h-4 w-1/2" />
    </div>
  )
}

/* ── ProcessingSteps — animated ML processing indicator */
export function ProcessingSteps({ steps, currentStep }) {
  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => {
        const done    = i < currentStep
        const active  = i === currentStep
        const pending = i > currentStep

        return (
          <motion.div
            key={step}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}
          >
            <span
              className={[
                'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[12px] font-bold',
                done    ? 'bg-success-500 text-white'  : '',
                active  ? 'bg-brand-500 text-white'    : '',
                pending ? 'bg-surface-200 text-ink-300' : '',
              ].join(' ')}
            >
              {done ? '✓' : active ? <Loader2 size={12} className="animate-spin" /> : '○'}
            </span>
            <span
              className={[
                'text-[13px]',
                done    ? 'text-ink-500 line-through' : '',
                active  ? 'text-ink-900 font-semibold' : '',
                pending ? 'text-ink-300' : '',
              ].join(' ')}
            >
              {step}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
