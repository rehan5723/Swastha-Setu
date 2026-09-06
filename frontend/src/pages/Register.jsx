import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

/* ── Password strength meter ────────────────────────── */
function PasswordStrength({ password }) {
  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
  if (!password) return null
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map(n => (
          <div
            key={n}
            className="flex-1 h-1 rounded-full transition-colors duration-300"
            style={{ background: n <= score ? colors[score] : 'rgba(0,0,0,0.08)' }}
          />
        ))}
      </div>
      <span className="text-[11px] font-semibold min-w-[40px]" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [mobile, setMobile]     = useState('')
  const [country, setCountry]   = useState('+91')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [agreed, setAgreed]     = useState(false)
  const [error, setError]       = useState(null)
  const [success, setSuccess]   = useState(null)
  const [loading, setLoading]   = useState(false)

  function validate() {
    if (!name.trim())    return 'Full name is required.'
    if (!email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(email)) return 'Enter a valid email address.'
    if (!mobile.trim() || !/^\d{7,15}$/.test(mobile)) return 'Enter a valid mobile number (digits only).'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (password !== confirm) return 'Passwords do not match.'
    if (!agreed) return 'You must accept the Terms & Privacy Policy.'
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    const msg = validate()
    if (msg) { setError(msg); return }

    setLoading(true)
    try {
      await register({ name: name.trim(), email: email.trim(), mobile: mobile.trim(), country, password })
      setSuccess('Account created! Redirecting to dashboard…')
      setTimeout(() => navigate('/dashboard'), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  /* Shared input classes */
  const comboWrap  = 'flex items-stretch h-[52px] border border-surface-300 rounded-xl overflow-hidden bg-white transition-all focus-within:border-brand-500 focus-within:shadow-focus'
  const comboInput = 'flex-1 h-full px-4 border-none outline-none text-[14px] text-ink-900 bg-transparent placeholder-ink-300'
  const soloInput  = 'h-[52px] w-full px-4 border border-surface-300 rounded-xl outline-none text-[14px] text-ink-900 bg-white placeholder-ink-300 transition-all focus:border-brand-500 focus:shadow-focus'

  return (
    <div className="flex min-h-screen overflow-hidden font-sans">

      {/* ── LEFT: Dark visual panel ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:flex grid-bg relative w-[40%] items-center justify-center px-9 py-12 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #071226 0%, #0d1f45 45%, #071a3e 100%)' }}
      >
        <div className="relative z-10 max-w-[320px] w-full flex flex-col gap-6">

          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 w-fit px-4 py-1.5 rounded-full text-xs font-semibold text-[#a5c4ff]"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            🌐 Join Swasthya Setu
          </div>

          <h2 className="text-[30px] font-extrabold leading-tight text-white">
            India's AI-Powered<br />
            <span className="accent-gradient">Health Navigator</span>
          </h2>

          <p className="text-[13px] text-white/55 leading-relaxed">
            Understand medical reports, get dermatology insights, and discover government healthcare support.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { num: '3',   label: 'AI Modules' },
              { num: '28',  label: 'States Covered' },
              { num: '18+', label: 'Report Parameters' },
              { num: '100%', label: 'Privacy First' },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-xl p-3.5 text-center"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="text-[22px] font-extrabold text-white leading-none">{s.num}</div>
                <div className="text-[11px] text-white/45 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-2.5">
            {[
              { icon: '📋', title: 'Medical Report Analysis', sub: 'Blood tests, lab reports & more' },
              { icon: '🏛️', title: 'Govt Healthcare Schemes', sub: 'Ayushman Bharat, PMJAY & state schemes' },
              { icon: '🔒', title: 'Privacy First',           sub: '256-bit SSL · ABDM Compliant' },
            ].map(b => (
              <div
                key={b.title}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-[#d0e4ff]"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <span className="text-xl flex-shrink-0">{b.icon}</span>
                <div>
                  <p className="text-[12px] font-bold">{b.title}</p>
                  <p className="text-[11px] text-white/45 mt-0.5">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT: Form panel ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full md:w-[60%] flex items-center justify-center bg-gradient-to-br from-[#e8f0fe] via-[#f0f7ff] to-[#e3ecff] px-6 py-10 overflow-hidden"
      >
        {/* Blobs */}
        <div className="animate-blob absolute -top-24 -right-20 w-[400px] h-[400px] rounded-full opacity-30 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #3b82f6, #1356d8)', filter: 'blur(70px)' }} />
        <div className="animate-blob-delayed absolute -bottom-20 -left-16 w-[300px] h-[300px] rounded-full opacity-30 pointer-events-none"
             style={{ background: 'radial-gradient(circle, #00e2ff, #1356d8)', filter: 'blur(70px)' }} />

        {/* Card */}
        <div
          className="relative z-10 w-full max-w-[600px] rounded-3xl px-10 py-9 border border-white/80 backdrop-blur-xl"
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
            <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Create your account</h1>
            <p className="text-[13px] text-ink-500 mt-1.5">Join Swasthya Setu for smarter, connected care</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Name + Email row */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-ink-900" htmlFor="reg-name">Full name</label>
                <input id="reg-name" className={soloInput} type="text" autoComplete="name"
                  placeholder="Aarav Sharma" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-ink-900" htmlFor="reg-email">Email address</label>
                <input id="reg-email" className={soloInput} type="email" autoComplete="email"
                  placeholder="aarav@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-ink-900" htmlFor="reg-mobile">Mobile number</label>
              <div className={comboWrap}>
                <select id="reg-country"
                  className="h-full px-3 bg-surface-50 border-r border-surface-300 outline-none text-[14px] text-ink-900 cursor-pointer"
                  value={country} onChange={e => setCountry(e.target.value)} aria-label="Country code">
                  {COUNTRY_CODES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input id="reg-mobile" className={comboInput} type="tel" autoComplete="tel"
                  placeholder="9876543210" value={mobile} onChange={e => setMobile(e.target.value)} />
              </div>
            </div>

            {/* Password + Confirm row */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-ink-900" htmlFor="reg-password">Password</label>
                <div className={`relative ${comboWrap}`}>
                  <input id="reg-password" className={`${comboInput} pr-12`}
                    type={showPass ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-sm opacity-60 hover:opacity-100 transition-opacity"
                    onClick={() => setShowPass(v => !v)} aria-label="Toggle password">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
                <PasswordStrength password={password} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-ink-900" htmlFor="reg-confirm">Confirm password</label>
                <div className={`relative ${comboWrap}`}>
                  <input id="reg-confirm" className={`${comboInput} pr-12`}
                    type={showConf ? 'text' : 'password'} autoComplete="new-password"
                    placeholder="Repeat password" value={confirm} onChange={e => setConfirm(e.target.value)} />
                  <button type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-sm opacity-60 hover:opacity-100 transition-opacity"
                    onClick={() => setShowConf(v => !v)} aria-label="Toggle confirm">
                    {showConf ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 text-[13px] text-ink-500 cursor-pointer leading-snug">
              <input id="reg-terms" type="checkbox" className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer accent-brand-500"
                checked={agreed} onChange={e => setAgreed(e.target.checked)} />
              <span>
                I agree to the{' '}
                <a href="#" className="text-brand-500 font-semibold hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-brand-500 font-semibold hover:underline">Privacy Policy</a>
              </span>
            </label>

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
              id="register-submit"
              type="submit"
              disabled={loading}
              whileHover={{ translateY: loading ? 0 : -1 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="h-[52px] w-full rounded-xl border-none text-white text-[15px] font-bold tracking-wide cursor-pointer flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)', boxShadow: '0 4px 20px rgba(19,86,216,0.35)' }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account →'}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-[13px] text-ink-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
