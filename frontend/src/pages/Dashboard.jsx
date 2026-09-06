import React from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Scan, Stethoscope, Building2,
  ArrowRight, Activity, TrendingUp, Shield
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'

const primaryActions = [
  {
    to: '/medical-reports',
    icon: FileText,
    title: 'Medical Report',
    desc: 'Analyze blood tests & lab reports',
    color: 'text-brand-500',
    bg: 'bg-brand-50',
    border: 'border-brand-100',
  },
  {
    to: '/imaging',
    icon: Scan,
    title: 'X-Ray / MRI',
    desc: 'Analyze medical imaging',
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100',
  },
  {
    to: '/dermatology',
    icon: Stethoscope,
    title: 'Skin Concern',
    desc: 'Analyze skin images or describe symptoms',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    to: '/government-schemes',
    icon: Building2,
    title: 'Government Support',
    desc: 'Find potentially relevant healthcare schemes',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
]

const recentActivity = [
  { id: 'rpt_001', label: 'Blood Report Analysis', date: 'Jan 15, 2024', urgency: 'moderate', type: 'Medical Report' },
  { id: 'img_001', label: 'Chest X-Ray Analysis',  date: 'Jan 16, 2024', urgency: 'low',      type: 'Imaging' },
  { id: 'derm_001',label: 'Skin Concern Analysis', date: 'Jan 17, 2024', urgency: 'moderate', type: 'Dermatology' },
]

const journeySteps = [
  { num: '01', label: 'Share',      desc: 'Upload report or describe concern' },
  { num: '02', label: 'Analyze',    desc: 'AI-assisted analysis begins' },
  { num: '03', label: 'Understand', desc: 'Clear, plain-language findings' },
  { num: '04', label: 'Act',        desc: 'Guided next steps' },
  { num: '05', label: 'Get Support',desc: 'Discover healthcare schemes' },
]

export default function Dashboard() {
  return (
    <motion.div
      className="p-6 lg:p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">
          How can we help you today?
        </h1>
        <p className="text-[14px] text-ink-500 mt-1">
          Choose what you'd like to analyse or explore.
        </p>
      </div>

      {/* ── Primary Action Cards ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {primaryActions.map(({ to, icon: Icon, title, desc, color, bg, border }) => (
          <Link key={to} to={to} className="block group focus:outline-none">
            <Card hoverable variant="bordered" className="h-full transition-shadow">
              <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4`}>
                <Icon size={20} className={color} />
              </div>
              <h2 className="text-[15px] font-bold text-ink-900 mb-1">{title}</h2>
              <p className="text-[13px] text-ink-500 leading-snug mb-4">{desc}</p>
              <span className={`inline-flex items-center gap-1 text-[12px] font-semibold ${color}`}>
                Get started <ArrowRight size={12} />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* ── Journey Steps ────────────────────────────── */}
      <Card variant="ghost" className="mb-8 overflow-x-auto">
        <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-4">
          Your Swasthya Setu Journey
        </p>
        <div className="flex items-start gap-0 min-w-[600px]">
          {journeySteps.map((step, i) => (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center text-center flex-1">
                <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white text-[12px] font-bold shadow-brand mb-2">
                  {step.num}
                </div>
                <p className="text-[13px] font-bold text-ink-900">{step.label}</p>
                <p className="text-[11px] text-ink-400 mt-0.5 max-w-[100px] leading-snug">{step.desc}</p>
              </div>
              {i < journeySteps.length - 1 && (
                <div className="flex-shrink-0 mt-4.5 h-px flex-1 max-w-[40px] bg-surface-200 self-start mt-[18px]" />
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* ── Two-column: Recent + Attention ──────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Health Activity */}
        <Card variant="default">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-ink-900">Recent Health Activity</h2>
            <Link to="/history" className="text-[12px] text-brand-500 font-semibold hover:underline">
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentActivity.map((item) => (
              <Link
                key={item.id}
                to={`/analysis/${item.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-50 transition-colors group"
              >
                <div>
                  <p className="text-[13px] font-semibold text-ink-900">{item.label}</p>
                  <p className="text-[11px] text-ink-400 mt-0.5">{item.type} · {item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.urgency} dot size="sm">
                    {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
                  </Badge>
                  <ArrowRight size={14} className="text-ink-300 group-hover:text-brand-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* What Needs Your Attention */}
        <Card variant="default">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-brand-500" />
            <h2 className="text-[15px] font-bold text-ink-900">What Needs Your Attention?</h2>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-danger-50 border border-danger-border">
              <div className="w-2 h-2 rounded-full bg-danger-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-ink-900">Vitamin D — Below Reference Range</p>
                <p className="text-[12px] text-ink-500 mt-0.5">
                  Reported value (14.2 ng/mL) is below the reference range in your Jan 15 blood report.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-warning-50 border border-warning-border">
              <div className="w-2 h-2 rounded-full bg-warning-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-ink-900">WBC Count — Near Upper Boundary</p>
                <p className="text-[12px] text-ink-500 mt-0.5">
                  Reported value (9,800 /μL) is near the upper limit of the provided reference range.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-50 border border-surface-200">
              <div className="w-2 h-2 rounded-full bg-success-500 mt-1.5 flex-shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-ink-900">Chest X-Ray — No High Concern Detected</p>
                <p className="text-[12px] text-ink-500 mt-0.5">
                  AI-assisted preliminary review did not detect high-priority findings.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Recommended Next Step ────────────────────── */}
      <Card variant="default" className="border-l-4 border-brand-500">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center flex-shrink-0 shadow-brand">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1">
              Your Recommended Next Step
            </p>
            <h2 className="text-[15px] font-bold text-ink-900 mb-1">
              Discuss Vitamin D findings with a healthcare professional
            </h2>
            <p className="text-[13px] text-ink-500 leading-relaxed">
              Based on your recent blood report, a value below the provided reference range for Vitamin D may warrant a
              consultation. Consider discussing supplementation or further testing with your doctor.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Link to="/government-schemes" className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-500 hover:underline">
                <Shield size={12} /> Find healthcare support schemes
              </Link>
            </div>
          </div>
        </div>
      </Card>

      {/* ── Disclaimer ───────────────────────────────── */}
      <p className="text-[11px] text-ink-400 mt-8 leading-relaxed text-center">
        AI-assisted information is for informational purposes only and does not constitute a medical diagnosis or medical advice.
        Consult a qualified healthcare professional for medical concerns.
      </p>
    </motion.div>
  )
}
