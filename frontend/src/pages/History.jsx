import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, FileText, Filter, History as HistoryIcon, Scan, Search, Stethoscope } from 'lucide-react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { PageLoader } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { getAnalysisHistory } from '../services/api'

const TYPE_FILTERS = [
  { value: 'all', label: 'All analyses' },
  { value: 'medical_report', label: 'Medical reports' },
  { value: 'imaging', label: 'Imaging' },
  { value: 'dermatology', label: 'Dermatology' },
]

const TYPE_CONFIG = {
  medical_report: { icon: FileText, color: 'text-brand-500', background: 'bg-brand-50', label: 'Medical report' },
  imaging: { icon: Scan, color: 'text-teal-600', background: 'bg-teal-50', label: 'Imaging' },
  dermatology: { icon: Stethoscope, color: 'text-violet-600', background: 'bg-violet-50', label: 'Dermatology' },
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

export default function History() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    getAnalysisHistory()
      .then((history) => { if (active) setItems(history) })
      .catch(() => toast({ type: 'error', title: 'Could not load history', message: 'Please refresh and try again.' }))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [toast])

  const visibleItems = items.filter((item) => {
    const matchesType = filter === 'all' || item.type === filter
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${item.label} ${item.fileName} ${item.summary}`.toLowerCase().includes(query)
    return matchesType && matchesSearch
  })

  if (loading) return <PageLoader text="Loading analysis history..." />

  return (
    <motion.div className="p-6 lg:p-8 max-w-5xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex items-start gap-3"><div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0"><HistoryIcon size={21} className="text-brand-500" /></div><div><h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Analysis History</h1><p className="text-[14px] text-ink-500 mt-1">Review your previous medical reports, imaging reviews, and skin concern analyses.</p></div></div>

      <Card variant="bordered" className="mb-5"><div className="flex flex-col md:flex-row gap-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-ink-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, file, or summary" className="w-full h-10 pl-9 pr-3 rounded-xl border border-surface-200 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-brand-500" /></div><div className="flex items-center gap-2"><Filter size={15} className="text-ink-400" /><select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 px-3 rounded-xl border border-surface-200 bg-white text-[13px] text-ink-700 focus:outline-none focus:border-brand-500">{TYPE_FILTERS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></div></div></Card>

      <div className="flex items-center justify-between mb-4"><div><h2 className="text-[16px] font-bold text-ink-900">Your analyses</h2><p className="text-[12px] text-ink-500 mt-1">Showing {visibleItems.length} of {items.length} records</p></div><Badge variant="brand">Mock history</Badge></div>
      <div className="flex flex-col gap-3">{visibleItems.map((item) => { const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.medical_report; const Icon = config.icon; return <Link key={item.id} to={`/analysis/${item.id}`} className="block group"><Card variant="bordered" hoverable className="transition-shadow"><div className="flex items-center gap-4"><div className={`w-11 h-11 rounded-xl ${config.background} flex items-center justify-center flex-shrink-0`}><Icon size={20} className={config.color} /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="text-[14px] font-bold text-ink-900">{item.label}</h3><Badge variant={item.urgency} dot size="sm">{item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}</Badge></div><p className="text-[12px] text-ink-500 mt-1 truncate">{config.label} · {item.fileName}</p><p className="text-[11px] text-ink-400 mt-1">{formatDate(item.date)} · {item.summary}</p></div><ArrowRight size={18} className="text-ink-300 group-hover:text-brand-500 transition-colors flex-shrink-0" /></div></Card></Link> })}</div>
      {!visibleItems.length && <Card variant="ghost" className="text-center py-12"><HistoryIcon size={28} className="mx-auto text-ink-300" /><h2 className="text-[15px] font-bold text-ink-900 mt-4">No analyses found</h2><p className="text-[13px] text-ink-500 mt-1">Try a different search or analysis type.</p></Card>}
      <p className="text-[11px] text-ink-400 leading-relaxed text-center mt-8">Analysis history is currently populated with demonstration data. Saved results will be connected to your account when persistence is added.</p>
    </motion.div>
  )
}