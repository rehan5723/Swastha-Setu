import React from 'react'
import { motion } from 'framer-motion'
import { Construction } from 'lucide-react'

/**
 * Placeholder page — shown for routes that haven't been built yet.
 */
export default function PlaceholderPage({ title, description, icon: Icon = Construction }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5 shadow-sm">
        <Icon size={28} className="text-brand-400" />
      </div>
      <h1 className="text-[22px] font-bold text-ink-900 mb-2">{title}</h1>
      <p className="text-[14px] text-ink-500 max-w-sm leading-relaxed">
        {description || 'This section is being built and will be available in an upcoming phase.'}
      </p>
      <div className="mt-6 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-[12px] font-semibold text-brand-500">
        Coming Soon
      </div>
    </motion.div>
  )
}
