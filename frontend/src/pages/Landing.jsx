import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import {
  FileText, Stethoscope, Building2,
  ArrowRight, CheckCircle2, Activity,
  Shield, ChevronRight, TrendingUp, Zap
} from 'lucide-react'

/* ─── Reusable fade-in-up wrapper ─────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ─── Data ────────────────────────────────────────────── */
const CAPABILITIES = [
  {
    icon: FileText,
    title: 'Medical Report Analysis',
    subtitle: 'Blood tests · Lab reports · Parameters',
    description:
      'Upload your blood tests or laboratory reports. Get AI-assisted extraction of parameters, reference-range comparisons, and plain-language explanations of what each value means.',
    color: 'from-blue-500 to-brand-600',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
    iconColor: 'text-brand-500',
    features: ['18+ parameter types', 'Reference range comparison', 'Urgency categorisation'],
  },
  {
    icon: Stethoscope,
    title: 'Dermatology Analysis',
    subtitle: 'Skin images · Symptom description',
    description:
      'Upload a photo of a skin concern or describe your symptoms in plain text. Receive AI-assisted possible condition matches, general precautions, and guidance on when to seek care.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    iconColor: 'text-violet-600',
    features: ['Image or text input', 'Possible condition matches', 'Confidence indicators'],
  },
  {
    icon: Building2,
    title: 'Government Healthcare Support',
    subtitle: 'Schemes · Eligibility · Benefits',
    description:
      'Enter basic information about yourself and discover potentially relevant central and state government healthcare schemes — from Ayushman Bharat to state-specific programmes.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconColor: 'text-amber-600',
    features: ['Central + state schemes', 'Eligibility guidance', 'Application information'],
  },
]

const JOURNEY_STEPS = [
  { num: '01', icon: FileText,     label: 'Share',       desc: 'Upload a report, image, or describe your concern' },
  { num: '02', icon: Zap,          label: 'Analyze',     desc: 'AI-assisted analysis in seconds' },
  { num: '03', icon: TrendingUp,   label: 'Understand',  desc: 'Clear explanations in plain language' },
  { num: '04', icon: CheckCircle2, label: 'Act',         desc: 'Guided, safe next-step recommendations' },
  { num: '05', icon: Building2,    label: 'Get Support', desc: 'Discover relevant healthcare schemes' },
]

const STATS = [
  { value: '3',   label: 'AI Modules',         icon: Zap },
  { value: '18+', label: 'Report Parameters',  icon: FileText },
  { value: '28',  label: 'States Supported',   icon: Building2 },
  { value: '100%', label: 'Privacy First',     icon: Shield },
]

const TRUST_PILLS = [
  '✅ ABDM Compliant',
  '🔒 256-bit SSL Encryption',
  '🏛️ MoHFW Aligned',
  '⚕️ AI-Assisted, Not AI-Diagnosed',
]

/* ─── Floating card decoration ───────────────────────── */
function FloatingCard({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={`absolute bg-white rounded-2xl shadow-card-hover border border-surface-200 p-3 ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function Landing() {
  const [activeStep, setActiveStep] = useState(0)

  // Auto-cycle journey steps
  useEffect(() => {
    const t = setInterval(() => setActiveStep(i => (i + 1) % JOURNEY_STEPS.length), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ══════════════════════════════════════════════════
          NAVBAR
      ══════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
              <Activity size={15} className="text-white" />
            </div>
            <span className="text-[16px] font-extrabold brand-gradient tracking-tight">
              Swasthya Setu
            </span>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-ink-500">
            <a href="#capabilities" className="hover:text-ink-900 transition-colors">Features</a>
            <a href="#journey"      className="hover:text-ink-900 transition-colors">How it works</a>
            <a href="#about"        className="hover:text-ink-900 transition-colors">About</a>
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="hidden sm:inline-flex px-4 h-9 items-center text-[13px] font-semibold text-ink-700 rounded-xl hover:bg-surface-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="inline-flex px-4 h-9 items-center text-[13px] font-bold text-white rounded-xl shadow-brand transition-all hover:brightness-110 hover:-translate-y-px"
              style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)' }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-violet-50 pointer-events-none" />
        <div
          className="animate-blob absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, #1356d8)', filter: 'blur(80px)' }}
        />
        <div
          className="animate-blob-delayed absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #7c3aed, #1356d8)', filter: 'blur(80px)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: text */}
            <div>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-brand-600 bg-brand-50 border border-brand-100 mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                AI-Powered Healthcare Navigation
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-[44px] sm:text-[52px] font-extrabold text-ink-900 leading-[1.12] tracking-tight mb-5"
              >
                Understand Your{' '}
                <span className="brand-gradient">Health.</span>
                <br />
                Find Your{' '}
                <span className="brand-gradient">Next Step.</span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-[17px] text-ink-500 leading-relaxed mb-8 max-w-[480px]"
              >
                Swasthya Setu is an AI-assisted healthcare navigation platform — analyse medical reports, 
                understand skin concerns, and discover relevant government healthcare support. All in one place.
              </motion.p>

              {/* CTA row */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-10"
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-xl text-[15px] font-bold text-white shadow-brand transition-all hover:brightness-110 hover:-translate-y-[2px] active:translate-y-0"
                  style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)' }}
                >
                  Get Started Free <ArrowRight size={16} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 h-[52px] px-7 rounded-xl text-[15px] font-semibold text-ink-700 bg-white border border-surface-200 hover:bg-surface-50 hover:border-surface-300 transition-all shadow-card"
                >
                  Sign In
                </Link>
              </motion.div>

              {/* Trust row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-2"
              >
                {TRUST_PILLS.map((pill) => (
                  <span key={pill} className="text-[11px] text-ink-500 font-medium">
                    {pill}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* Right: visual card cluster */}
            <div className="relative hidden lg:flex items-center justify-center h-[480px]">
              {/* Main card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="relative w-80 bg-white rounded-3xl shadow-modal border border-surface-200 p-6 z-10"
              >
                {/* Card header */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand">
                    <FileText size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-ink-900">Blood Report Analysis</p>
                    <p className="text-[11px] text-ink-400">AI-assisted · Jan 15, 2024</p>
                  </div>
                </div>

                {/* Mini parameter bars */}
                {[
                  { label: 'Hemoglobin',   pct: 78, status: 'normal' },
                  { label: 'Vitamin D',    pct: 28, status: 'low' },
                  { label: 'WBC Count',    pct: 89, status: 'attention' },
                  { label: 'Platelets',    pct: 62, status: 'normal' },
                ].map((p, i) => (
                  <div key={p.label} className="mb-3 last:mb-0">
                    <div className="flex justify-between mb-1">
                      <span className="text-[11px] font-medium text-ink-700">{p.label}</span>
                      <span className={`text-[10px] font-semibold ${
                        p.status === 'normal'    ? 'text-success-500' :
                        p.status === 'low'       ? 'text-danger-500' : 'text-warning-500'
                      }`}>
                        {p.status === 'normal' ? '✓ Normal' : p.status === 'low' ? '↓ Below range' : '↑ Near limit'}
                      </span>
                    </div>
                    <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          p.status === 'normal'    ? 'bg-success-500' :
                          p.status === 'low'       ? 'bg-danger-500' : 'bg-warning-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${p.pct}%` }}
                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                ))}

                {/* Summary pill */}
                <div className="mt-5 pt-4 border-t border-surface-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning-500" />
                  <span className="text-[11px] font-semibold text-ink-700">1 value needs attention</span>
                </div>
              </motion.div>

              {/* Floating decoration cards */}
              <FloatingCard className="top-8 -left-12 flex items-center gap-2.5 pr-4" delay={0.6}>
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <Stethoscope size={14} className="text-violet-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-ink-900">Skin Analysis</p>
                  <p className="text-[10px] text-ink-400">3 possible matches</p>
                </div>
              </FloatingCard>

              <FloatingCard className="bottom-16 -right-10 flex items-center gap-2.5 pr-4" delay={0.8}>
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                  <Building2 size={14} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-ink-900">PM-JAY Scheme</p>
                  <p className="text-[10px] text-success-500">Potentially relevant</p>
                </div>
              </FloatingCard>

              <FloatingCard className="top-28 -right-14" delay={1.0}>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-success-500" />
                  <span className="text-[11px] font-semibold text-ink-900">X-Ray: No concern</span>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          STATS BAND
      ══════════════════════════════════════════════════ */}
      <section className="py-10 px-6 border-y border-surface-100 bg-surface-50">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <FadeUp key={label} delay={i * 0.07}>
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-9 h-9 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-1">
                  <Icon size={16} className="text-brand-500" />
                </div>
                <span className="text-[28px] font-extrabold text-ink-900 leading-none">{value}</span>
                <span className="text-[12px] text-ink-500 font-medium">{label}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CAPABILITIES
      ══════════════════════════════════════════════════ */}
      <section id="capabilities" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-brand-500 mb-3">
                What Swasthya Setu Can Do
              </span>
              <h2 className="text-[36px] font-extrabold text-ink-900 leading-tight mb-3">
                Three capabilities. One platform.
              </h2>
              <p className="text-[16px] text-ink-500 max-w-xl mx-auto">
                Each module is designed around a clear, actionable journey — from sharing your health data to understanding what to do next.
              </p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CAPABILITIES.map(({ icon: Icon, title, subtitle, description, bg, border, iconColor, features }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div className={`h-full rounded-3xl border ${border} ${bg} p-7 flex flex-col`}>
                  <div className={`w-12 h-12 rounded-2xl bg-white border ${border} flex items-center justify-center shadow-sm mb-5`}>
                    <Icon size={22} className={iconColor} />
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-1.5">{subtitle}</p>
                  <h3 className="text-[18px] font-extrabold text-ink-900 mb-3 leading-snug">{title}</h3>
                  <p className="text-[13px] text-ink-500 leading-relaxed mb-5 flex-1">{description}</p>
                  <ul className="flex flex-col gap-1.5">
                    {features.map(feat => (
                      <li key={feat} className="flex items-center gap-2 text-[12px] font-medium text-ink-700">
                        <CheckCircle2 size={13} className={iconColor} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          JOURNEY
      ══════════════════════════════════════════════════ */}
      <section id="journey" className="py-24 px-6 bg-gradient-to-br from-ink-900 via-[#0d1f45] to-ink-900 relative overflow-hidden">
        {/* Grid decoration */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px'
        }} />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, #1356d8, transparent 70%)' }} />

        <div className="relative max-w-5xl mx-auto">
          <FadeUp>
            <div className="text-center mb-14">
              <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-teal-400 mb-3">
                The Swasthya Setu Journey
              </span>
              <h2 className="text-[36px] font-extrabold text-white leading-tight">
                From concern to clarity — in five steps.
              </h2>
            </div>
          </FadeUp>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-12">
            {JOURNEY_STEPS.map(({ num, icon: Icon, label, desc }, i) => {
              const isActive = i === activeStep
              return (
                <motion.div
                  key={num}
                  animate={{
                    scale: isActive ? 1.04 : 1,
                    opacity: isActive ? 1 : 0.65,
                  }}
                  transition={{ duration: 0.35 }}
                  className={`flex flex-col items-center text-center p-4 rounded-2xl border cursor-default transition-colors ${
                    isActive
                      ? 'border-brand-400 bg-brand-500/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                  onClick={() => setActiveStep(i)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${
                    isActive ? 'bg-brand-gradient shadow-brand' : 'bg-white/10'
                  }`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white/40 mb-0.5">{num}</span>
                  <p className="text-[13px] font-bold text-white mb-1">{label}</p>
                  <p className="text-[11px] text-white/50 leading-snug">{desc}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Connector line (desktop) */}
          <div className="hidden sm:flex items-center justify-between px-8 -mt-16 mb-8 pointer-events-none">
            {JOURNEY_STEPS.slice(0, -1).map((_, i) => (
              <div key={i} className="flex-1 h-px bg-white/10 mx-2" />
            ))}
          </div>

          {/* CTA */}
          <FadeUp delay={0.2}>
            <div className="text-center">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 h-[52px] px-8 rounded-xl text-[15px] font-bold text-white shadow-brand transition-all hover:brightness-110 hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)' }}
              >
                Start your journey <ArrowRight size={16} />
              </Link>
              <p className="text-[12px] text-white/35 mt-3">No account required to explore.</p>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MEDICAL DISCLAIMER BAND
      ══════════════════════════════════════════════════ */}
      <section id="about" className="py-14 px-6 bg-surface-50 border-y border-surface-200">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-brand-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-ink-900 mb-1">Important Notice</p>
                <p className="text-[13px] text-ink-500 leading-relaxed">
                  Swasthya Setu is an AI-assisted healthcare navigation platform. All outputs are{' '}
                  <strong>informational only</strong> and do not constitute a medical diagnosis or medical advice.
                  Always consult a qualified healthcare professional for medical concerns.
                  Language such as "possible match", "potentially relevant", and "preliminary finding" is used
                  intentionally throughout the platform.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA
      ══════════════════════════════════════════════════ */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-50 to-white pointer-events-none" />
        <div className="relative max-w-2xl mx-auto">
          <FadeUp>
            <span className="inline-block text-[12px] font-bold uppercase tracking-widest text-brand-500 mb-4">
              Ready to start?
            </span>
            <h2 className="text-[40px] font-extrabold text-ink-900 leading-tight mb-4">
              Your health story,{' '}
              <span className="brand-gradient">finally clear.</span>
            </h2>
            <p className="text-[16px] text-ink-500 leading-relaxed mb-8">
              Join Swasthya Setu and take the first step towards understanding your health reports,
              skin concerns, and discovering the support available to you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-xl text-[15px] font-bold text-white shadow-brand transition-all hover:brightness-110 hover:-translate-y-px"
                style={{ background: 'linear-gradient(135deg, #1356d8 0%, #0a40b0 100%)' }}
              >
                Create Free Account <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-xl text-[15px] font-semibold text-ink-700 bg-white border border-surface-200 hover:bg-surface-50 transition-all shadow-card"
              >
                Sign In <ChevronRight size={16} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer className="py-8 px-6 border-t border-surface-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-brand-gradient flex items-center justify-center">
              <Activity size={11} className="text-white" />
            </div>
            <span className="text-[13px] font-bold text-ink-700">Swasthya Setu</span>
          </div>
          <p className="text-[12px] text-ink-400 text-center">
            AI-assisted healthcare navigation · For informational purposes only · Not a substitute for medical advice
          </p>
          <div className="flex gap-4 text-[12px] text-ink-400">
            <Link to="/login"    className="hover:text-ink-700 transition-colors">Login</Link>
            <Link to="/register" className="hover:text-ink-700 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
