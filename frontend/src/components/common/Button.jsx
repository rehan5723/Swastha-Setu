import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * Button — primary building block.
 *
 * variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 * sizes:    'sm' | 'md' | 'lg'
 */

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ' +
  'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer select-none'

const variants = {
  primary:
    'bg-brand-gradient text-white shadow-brand hover:brightness-110 hover:-translate-y-[1px] active:translate-y-0',
  secondary:
    'bg-surface-100 text-ink-900 border border-surface-200 hover:bg-surface-200 active:bg-surface-300',
  ghost:
    'bg-transparent text-ink-700 hover:bg-surface-100 active:bg-surface-200',
  outline:
    'bg-transparent text-brand-500 border border-brand-500 hover:bg-brand-50 active:bg-brand-100',
  danger:
    'bg-danger-500 text-white hover:bg-red-600 hover:-translate-y-[1px] active:translate-y-0',
}

const sizes = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-5 text-[14px]',
  lg: 'h-[52px] px-7 text-[15px]',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      className={[
        base,
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  )
}
