import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function ForgotPassword() {
  const { forgotPassword } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [sent, setSent]       = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await forgotPassword({ email: email.trim() })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen font-sans">
      {/* ── Left: Form panel ─────────────────────────────── */}
      <div className="relative w-full md:w-[55%] flex items-center justify-center bg-gradient-to-br from-[#e8f0fe] via-[#f0f7ff] to-[#e3ecff] px-6 py-10 overflow-hidden">
        {/* Blobs */}
        <div
          className="animate-blob absolute -top-24 -left-20 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, #1356d8)', filter: 'blur(70px)' }}
        />
        <div
          className="animate-blob-delayed absolute -bottom-20 -right-16 w-[300px] h-[300px] rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00e2ff, #1356d8)', filter: 'blur(70px)' }}
        />

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-[480px] rounded-3xl px-10 py-10 border border-white/80 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.96)', boxShadow: '0 24px 64px rgba(10,22,40,0.22), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {/* Logo */}
          <div className="flex flex-col gap-0.5 mb-8">
            <span className="text-[24px] font-extrabold tracking-tight brand-gradient">Swasthya Setu</span>
            <span className="text-[11px] font-medium text-ink-400 uppercase tracking-wide">AI-Powered Healthcare</span>
          </div>

          <AnimatePresence mode="wait">
            {/* ── Success state ─────────────────────────── */}
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center text-center py-4"
              >
                <div className="w-16 h-16 rounded-full bg-success-50 border border-success-border flex items-center justify-center mb-5">
                  <CheckCircle2 size={32} className="text-success-500" />
                </div>
                <h1 className="text-[22px] font-extrabold text-ink-900 mb-2">Check your inbox</h1>
                <p className="text-[14px] text-ink-500 leading-relaxed mb-6">
                  If an account exists for{' '}
                  <span className="font-semibold text-ink-900">{email}</span>,
                  a password reset link has been sent. Check your spam folder if you don't see it.
                </p>
                <p className="text-[12px] text-ink-400 mb-6">
                  For this demo, no email is actually sent. You can sign in with any credentials.
                </p>
                <div className="flex flex-col gap-2 w-full">
                  <Link
                    to="/login"
                    className="w-full h-[48px] rounded-xl flex items-center justify-center text-white font-bold text-[14px] shadow-brand hover:brightness-110 transition-all"
                    style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)' }}
                  >
                    Back to Sign In
                  </Link>
                  <button
                    onClick={() => { setSent(false); setEmail('') }}
                    className="text-[13px] text-ink-400 hover:text-ink-700 transition-colors mt-1"
                  >
                    Try a different email
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ── Form state ──────────────────────────── */
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Back link */}
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-[13px] text-ink-500 hover:text-ink-900 transition-colors mb-6 group"
                >
                  <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                  Back to Sign In
                </Link>

                {/* Header */}
                <div className="mb-7">
                  <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Reset your password</h1>
                  <p className="text-[13px] text-ink-500 mt-1.5 leading-relaxed">
                    Enter the email address linked to your account. We'll send a reset link.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="forgot-email" className="text-[13px] font-semibold text-ink-900">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300 pointer-events-none" />
                      <input
                        id="forgot-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[52px] w-full pl-11 pr-4 border border-surface-300 rounded-xl outline-none text-[14px] text-ink-900 bg-white placeholder-ink-300 transition-all focus:border-brand-500 focus:shadow-focus"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="px-4 py-3 rounded-lg text-[13px] font-medium bg-danger-50 text-danger-700 border border-danger-border"
                      role="alert"
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 h-[52px] w-full rounded-xl border-none text-white text-[15px] font-bold tracking-wide cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-[1px] active:translate-y-0"
                    style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)', boxShadow: '0 4px 20px rgba(19,86,216,0.35)' }}
                  >
                    {loading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>

                  {/* Sign in link */}
                  <p className="text-center text-[13px] text-ink-500">
                    Remember your password?{' '}
                    <Link to="/login" className="text-brand-500 font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Right: Visual panel ───────────────────────────── */}
      <div
        className="hidden md:flex w-[45%] items-center justify-center px-10 py-12 relative overflow-hidden grid-bg"
        style={{ background: 'linear-gradient(160deg, #071226 0%, #0d1f45 45%, #071a3e 100%)' }}
      >
        <div className="relative z-10 max-w-[340px] w-full flex flex-col gap-7">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 w-fit px-4 py-1.5 rounded-full text-xs font-semibold text-[#a5c4ff]"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Activity size={12} /> Swasthya Setu — AI Healthcare
          </div>

          <h2 className="text-[32px] font-extrabold leading-tight text-white">
            Secure account
            <br />
            <span className="accent-gradient">recovery</span>
          </h2>

          <p className="text-[14px] text-white/55 leading-relaxed">
            Your health data is end-to-end encrypted. Password resets are handled securely and privately.
          </p>

          {/* Feature cards */}
          {[
            { icon: '🔒', label: 'End-to-end encrypted',   desc: 'Your data is always protected' },
            { icon: '📧', label: 'Secure email link',       desc: 'Link expires after 24 hours' },
            { icon: '🛡️', label: 'Zero-knowledge storage', desc: 'We never store passwords' },
          ].map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-3.5 rounded-xl px-4 py-3.5"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <p className="text-[13px] font-bold text-[#e2eeff]">{f.label}</p>
                <p className="text-[12px] text-white/45 mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
