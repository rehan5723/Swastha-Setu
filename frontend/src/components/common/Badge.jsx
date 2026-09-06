import React from 'react'

/**
 * Badge — status/label indicator.
 *
 * variant: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'low' | 'moderate' | 'high' | 'critical'
 * size:    'sm' | 'md'
 */

const variants = {
  default:  'bg-surface-100 text-ink-700 border border-surface-200',
  brand:    'bg-brand-50 text-brand-600 border border-brand-100',
  success:  'bg-success-50 text-success-700 border border-success-border',
  warning:  'bg-warning-50 text-warning-700 border border-warning-border',
  danger:   'bg-danger-50 text-danger-700 border border-danger-border',
  info:     'bg-teal-50 text-teal-700 border border-teal-200',
  low:      'bg-emerald-50 text-emerald-700 border border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border border-amber-200',
  high:     'bg-red-50 text-red-700 border border-red-200',
  critical: 'bg-violet-50 text-violet-700 border border-violet-200',
}

const sizes = {
  sm: 'h-5 px-2 text-[11px]',
  md: 'h-6 px-2.5 text-[12px]',
}

const dots = {
  success:  'bg-success-500',
  warning:  'bg-warning-500',
  danger:   'bg-danger-500',
  info:     'bg-teal-500',
  low:      'bg-emerald-500',
  moderate: 'bg-amber-500',
  high:     'bg-red-500',
  critical: 'bg-violet-500',
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
    >
      {dot && dots[variant] && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[variant]}`} />
      )}
      {children}
    </span>
  )
}
