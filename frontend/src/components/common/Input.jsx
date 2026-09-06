import React, { forwardRef } from 'react'

/**
 * Input — styled text/number/password/email/textarea input.
 *
 * variant: 'default' | 'error' | 'success'
 * size:    'sm' | 'md' | 'lg'
 */

const ringBase =
  'transition-all border rounded-xl outline-none w-full bg-white text-ink-900 placeholder-ink-300 ' +
  'focus:border-brand-500 focus:shadow-focus'

const variants = {
  default: 'border-surface-300',
  error:   'border-danger-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.18)]',
  success: 'border-success-500 focus:shadow-[0_0_0_3px_rgba(34,197,94,0.18)]',
}

const sizes = {
  sm: 'h-9  px-3 text-[13px]',
  md: 'h-11 px-4 text-[14px]',
  lg: 'h-[52px] px-4 text-[14px]',
}

// eslint-disable-next-line react/display-name
const Input = forwardRef(function Input({
  label,
  helperText,
  error,
  variant = 'default',
  size = 'md',
  leftAddon,
  rightAddon,
  className = '',
  id,
  ...props
}, ref) {
  const computedVariant = error ? 'error' : variant

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-[13px] font-semibold text-ink-900"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-stretch">
        {leftAddon && (
          <div className="flex items-center px-3 bg-surface-100 border border-r-0 border-surface-300 rounded-l-xl text-ink-500 text-[14px] flex-shrink-0">
            {leftAddon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          className={[
            ringBase,
            variants[computedVariant],
            sizes[size],
            leftAddon  ? 'rounded-l-none' : '',
            rightAddon ? 'rounded-r-none' : '',
            className,
          ].join(' ')}
          {...props}
        />

        {rightAddon && (
          <div className="flex items-center px-3 bg-surface-100 border border-l-0 border-surface-300 rounded-r-xl text-ink-500 text-[14px] flex-shrink-0">
            {rightAddon}
          </div>
        )}
      </div>

      {(helperText || error) && (
        <p className={`text-[12px] ${error ? 'text-danger-500' : 'text-ink-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})

export default Input

/**
 * Textarea component
 */
export const Textarea = forwardRef(function Textarea({
  label,
  helperText,
  error,
  variant = 'default',
  className = '',
  id,
  rows = 4,
  ...props
}, ref) {
  const computedVariant = error ? 'error' : variant

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-semibold text-ink-900">
          {label}
        </label>
      )}

      <textarea
        ref={ref}
        id={id}
        rows={rows}
        className={[
          ringBase,
          variants[computedVariant],
          'px-4 py-3 text-[14px] resize-none',
          className,
        ].join(' ')}
        {...props}
      />

      {(helperText || error) && (
        <p className={`text-[12px] ${error ? 'text-danger-500' : 'text-ink-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  )
})
