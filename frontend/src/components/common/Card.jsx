import React from 'react'
import { motion } from 'framer-motion'

/**
 * Card — surface container.
 *
 * variant: 'default' | 'bordered' | 'elevated' | 'ghost'
 * padding: 'none' | 'sm' | 'md' | 'lg'
 * hoverable: adds hover lift effect
 */

const variants = {
  default:  'bg-white shadow-card',
  bordered: 'bg-white border border-surface-200',
  elevated: 'bg-white shadow-card-hover',
  ghost:    'bg-surface-50 border border-surface-200',
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverable ? { y: -2, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={[
        'rounded-2xl overflow-hidden',
        variants[variant],
        paddings[padding],
        hoverable ? 'cursor-pointer' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-[16px] font-bold text-ink-900 ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-[13px] text-ink-500 mt-0.5 ${className}`}>
      {children}
    </p>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-surface-200 ${className}`}>
      {children}
    </div>
  )
}
