import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const COUNTRY_CODES = [
  { code: '+91',  flag: '🇮🇳', name: 'India' },
  { code: '+1',   flag: '🇺🇸', name: 'USA' },
  { code: '+44',  flag: '🇬🇧', name: 'UK' },
  { code: '+61',  flag: '🇦🇺', name: 'Australia' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
]

const FEATURES = [
  { icon: '🫀', label: 'Report Analysis',  desc: 'AI-assisted blood & lab report analysis' },
  { icon: '🔬', label: 'Skin Analysis',    desc: 'Dermatology insights from image or text' },
  { icon: '🧠', label: 'Imaging Review',   desc: 'Preliminary X-ray & MRI findings' },
  { icon: '🏥', label: 'Govt Schemes',     desc: 'Ayushman Bharat, PM-JAY & more' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const location   = useLocation()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword]     = useState('')
  const [country, setCountry]       = useState('+91')
  const [showPass, setShowPass]     = useState(false)
  const [error, setError]           = useState(null)
  const [success, setSuccess]       = useState(null)
  const [loading, setLoading]       = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  // Redirect destination (supports redirect-after-login)
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    const t = setInterval(() => setActiveFeature(i => (i + 1) % FEATURES.length), 2800)
    return () => clearInterval(t)
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!identifier.trim()) { setError('Please enter your mobile number or email.'); return }
    if (!password.trim())   { setError('Please enter your password.'); return }

    setLoading(true)
    try {
      await login({ identifier: identifier.trim(), password })
      setSuccess('Welcome back! Redirecting…')
      setTimeout(() => navigate(from, { replace: true }), 900)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">

      {/* ── LEFT: Form panel ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full md:w-[55%] flex items-center justify-center bg-gradient-to-br from-[#e8f0fe] via-[#f0f7ff] to-[#e3ecff] px-6 py-10 overflow-hidden"
      >
        {/* Blobs */}
        <div className="animate-blob absolute -top-24 -left-20 w-[400px] h-[400px] rounded-full opacity-35 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #3b82f6, #1356d8)', filter: 'blur(70px)' }} />
        <div className="animate-blob-delayed absolute -bottom-20 -right-16 w-[300px] h-[300px] rounded-full opacity-35 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #00e2ff, #1356d8)', filter: 'blur(70px)' }} />

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-[500px] rounded-3xl px-10 py-10 border border-white/80 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.96)', boxShadow: '0 24px 64px rgba(10,22,40,0.22), 0 2px 8px rgba(0,0,0,0.08)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-7">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
              <Activity size={14} className="text-white" />
            </div>
            <div>
              <span className="text-[18px] font-extrabold tracking-tight brand-gradient block leading-none">Swasthya Setu</span>
              <span className="text-[10px] font-medium text-ink-400 uppercase tracking-wide">AI-Powered Healthcare</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-7">
            <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Welcome back</h1>
            <p className="text-[13px] text-ink-500 mt-1.5">Sign in to your Swasthya Setu account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Mobile / email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink-900" htmlFor="login-identifier">
                Mobile number or email
              </label>
              <div className="flex items-stretch h-[52px] border border-surface-300 rounded-xl overflow-hidden bg-white transition-all focus-within:border-brand-500 focus-within:shadow-focus">
                <select
                  id="login-country"
                  className="h-full px-3 bg-surface-50 border-r border-surface-300 outline-none text-[14px] text-ink-900 cursor-pointer"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  aria-label="Country code"
                >
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  id="login-identifier"
                  className="flex-1 h-full px-4 border-none outline-none text-[14px] text-ink-900 bg-transparent placeholder-ink-300"
                  type="text"
                  autoComplete="username"
                  placeholder="9876543210 or you@email.com"
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-semibold text-ink-900" htmlFor="login-password">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[12px] text-brand-500 font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-stretch h-[52px] border border-surface-300 rounded-xl overflow-hidden bg-white transition-all focus-within:border-brand-500 focus-within:shadow-focus">
                <input
                  id="login-password"
                  className="flex-1 h-full px-4 pr-12 border-none outline-none text-[14px] text-ink-900 bg-transparent placeholder-ink-300"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-base opacity-60 hover:opacity-100 transition-opacity"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="px-4 py-3 rounded-lg text-[13px] font-medium bg-danger-50 text-danger-700 border border-danger-border"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 py-3 rounded-lg text-[13px] font-medium bg-success-50 text-success-700 border border-success-border"
                  role="status"
                >
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <motion.button
              id="login-submit"
              type="submit"
              disabled={loading}
              whileHover={{ translateY: loading ? 0 : -1 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="h-[52px] w-full rounded-xl border-none text-white text-[15px] font-bold tracking-wide cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)', boxShadow: '0 4px 20px rgba(19,86,216,0.35)' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In →'}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-ink-300 text-xs">
            <span className="flex-1 h-px bg-surface-200" />
            new to swasthya setu?
            <span className="flex-1 h-px bg-surface-200" />
          </div>

          {/* Footer */}
          <p className="text-center text-[13px] text-ink-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-500 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </motion.div>

      {/* ── RIGHT: Visual panel ──────────────────────────── */}
      <div
        className="hidden md:flex grid-bg relative w-[45%] items-center justify-center px-9 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #071226 0%, #0d1f45 45%, #071a3e 100%)' }}
      >
        <div className="relative z-10 max-w-[360px] w-full flex flex-col gap-6">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 w-fit px-4 py-1.5 rounded-full text-xs font-semibold text-[#a5c4ff]"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <Activity size={12} /> Swasthya Setu — AI Healthcare
          </div>

          {/* Heading */}
          <h2 className="text-[34px] font-extrabold leading-tight text-white">
            Bridging India's<br />
            <span className="accent-gradient">Healthcare Gap</span>
          </h2>

          <p className="text-sm text-white/55 leading-relaxed">
            Understand your health reports, get dermatology insights, and discover government healthcare support — all in one place.
          </p>

          {/* ECG */}
          <div
            className="w-full rounded-[10px] overflow-hidden p-2"
            style={{ background: 'rgba(0,226,255,0.05)', border: '1px solid rgba(0,226,255,0.12)' }}
            aria-hidden="true"
          >
            <svg className="animate-ecg w-full block" viewBox="0 0 320 60" fill="none">
              <polyline
                points="0,30 40,30 55,10 65,50 75,10 90,30 130,30 145,30 160,5 175,55 185,5 200,30 240,30 280,30 320,30"
                stroke="#00E2FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Feature cards */}
          <div className="flex flex-col gap-2.5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                animate={{
                  opacity: i === activeFeature ? 1 : 0.5,
                  scale: i === activeFeature ? 1 : 0.98,
                }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 border"
                style={{
                  background: i === activeFeature ? 'rgba(19,86,216,0.2)' : 'rgba(255,255,255,0.06)',
                  borderColor: i === activeFeature ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.08)',
                  boxShadow: i === activeFeature ? '0 4px 20px rgba(19,86,216,0.2)' : 'none',
                }}
              >
                <span className="text-[24px] flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="text-[13px] font-bold text-[#e2eeff]">{f.label}</div>
                  <div className="text-[11px] text-white/45 mt-0.5">{f.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2">
            {['✅ ABDM Compliant', '🔒 256-bit SSL', '🏛️ MoHFW Aligned'].map(pill => (
              <span
                key={pill}
                className="px-3 py-1 rounded-full text-[11px] font-medium text-white/60"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
