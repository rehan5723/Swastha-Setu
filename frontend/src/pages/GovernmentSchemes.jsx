import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  FileText,
  Filter,
  IndianRupee,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { useToast } from '../components/common/Toast'
import { getGovernmentSchemes } from '../services/api'

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'hospitalisation', label: 'Hospitalisation' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'financial_aid', label: 'Financial aid' },
  { value: 'state_scheme', label: 'State schemes' },
]

function SchemeCard({ scheme, expanded, onToggle }) {
  return (
    <Card variant="bordered" className={expanded ? 'border-amber-300 shadow-card-hover' : ''}>
      <button type="button" onClick={onToggle} className="w-full text-left focus:outline-none">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"><Building2 size={18} className="text-amber-600" /></div>
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-[15px] font-bold text-ink-900">{scheme.name}</h2><Badge variant={scheme.states === 'All India' ? 'brand' : 'moderate'} size="sm">{scheme.states}</Badge></div><p className="text-[12px] text-ink-500 mt-1">{scheme.department}</p></div>
          <span className="text-[12px] font-semibold text-amber-600 flex-shrink-0">{expanded ? 'Hide' : 'Details'}</span>
        </div>
        <p className="text-[13px] text-ink-600 leading-relaxed mt-4">{scheme.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">{scheme.benefits.slice(0, 3).map((benefit) => <span key={benefit} className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-600 bg-surface-50 border border-surface-200 rounded-full px-2.5 py-1"><CheckCircle2 size={12} className="text-success-500" />{benefit}</span>)}</div>
      </button>
      {expanded && <div className="mt-5 pt-5 border-t border-surface-200 grid grid-cols-1 md:grid-cols-3 gap-5"><div><div className="flex items-center gap-2 mb-2"><Users size={15} className="text-amber-600" /><h3 className="text-[12px] font-bold uppercase tracking-wide text-ink-500">Eligibility</h3></div><ul className="flex flex-col gap-2">{scheme.eligibility.map((item) => <li key={item} className="text-[12px] text-ink-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />{item}</li>)}</ul></div><div><div className="flex items-center gap-2 mb-2"><FileText size={15} className="text-amber-600" /><h3 className="text-[12px] font-bold uppercase tracking-wide text-ink-500">Documents</h3></div><ul className="flex flex-col gap-2">{scheme.documents.map((item) => <li key={item} className="text-[12px] text-ink-600 flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />{item}</li>)}</ul></div><div><div className="flex items-center gap-2 mb-2"><ClipboardList size={15} className="text-amber-600" /><h3 className="text-[12px] font-bold uppercase tracking-wide text-ink-500">How to apply</h3></div><p className="text-[12px] text-ink-600 leading-relaxed">{scheme.applicationInfo}</p><a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-semibold text-brand-500 hover:underline">Visit official website <ArrowUpRight size={13} /></a></div></div>}
    </Card>
  )
}

export default function GovernmentSchemes() {
  const [form, setForm] = useState({ age: '', state: 'Maharashtra', district: '', income: '', condition: '' })
  const [schemes, setSchemes] = useState([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  async function findSchemes(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const results = await getGovernmentSchemes(form)
      setSchemes(results)
      setExpandedId(null)
    } catch {
      toast({ type: 'error', title: 'Could not load schemes', message: 'Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    findSchemes({ preventDefault: () => {} })
  }, [])

  const visibleSchemes = schemes.filter((scheme) => {
    const matchesCategory = category === 'all' || scheme.category === category
    const query = search.trim().toLowerCase()
    const matchesSearch = !query || `${scheme.name} ${scheme.description} ${scheme.department}`.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <motion.div className="p-6 lg:p-8 max-w-6xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex items-start gap-3"><div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center flex-shrink-0"><Building2 size={21} className="text-amber-600" /></div><div><h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Government Healthcare Schemes</h1><p className="text-[14px] text-ink-500 mt-1 max-w-2xl">Explore central and state healthcare support programs using a few details about your situation.</p></div></div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
        <Card variant="ghost" className="lg:sticky lg:top-6"><div className="flex items-center gap-2 mb-5"><Filter size={17} className="text-amber-600" /><h2 className="text-[15px] font-bold text-ink-900">Your details</h2></div><form onSubmit={findSchemes} className="flex flex-col gap-4"><Input id="age" name="age" label="Age" type="number" min="0" max="120" value={form.age} onChange={updateField} placeholder="e.g. 32" /><div className="flex flex-col gap-1.5"><label htmlFor="state" className="text-[13px] font-semibold text-ink-900">State</label><select id="state" name="state" value={form.state} onChange={updateField} className="h-11 px-3 rounded-xl border border-surface-300 bg-white text-[14px] text-ink-900 focus:outline-none focus:border-brand-500"><option value="Maharashtra">Maharashtra</option><option value="Karnataka">Karnataka</option><option value="Delhi">Delhi</option><option value="Tamil Nadu">Tamil Nadu</option><option value="">All India</option></select></div><Input id="district" name="district" label="District" value={form.district} onChange={updateField} placeholder="e.g. Pune" /><Input id="income" name="income" label="Annual household income" value={form.income} onChange={updateField} placeholder="Optional" leftAddon={<IndianRupee size={14} />} /><Input id="condition" name="condition" label="Health need" value={form.condition} onChange={updateField} placeholder="e.g. hospitalisation" /><Button type="submit" fullWidth loading={loading} leftIcon={<Search size={16} />}>Find schemes</Button></form><p className="text-[11px] text-ink-400 mt-5 leading-relaxed">Results are a starting point. Confirm eligibility and current rules with the official scheme authority.</p></Card>

        <div><Card variant="bordered" className="mb-5"><div className="flex flex-col md:flex-row md:items-center gap-3"><div className="relative flex-1"><Search size={16} className="absolute left-3 top-3 text-ink-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search schemes, departments, or benefits" className="w-full h-10 pl-9 pr-3 rounded-xl border border-surface-200 text-[13px] text-ink-900 placeholder:text-ink-300 focus:outline-none focus:border-brand-500" /></div><select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 px-3 rounded-xl border border-surface-200 bg-white text-[13px] text-ink-700 focus:outline-none focus:border-brand-500">{CATEGORIES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div></Card><div className="flex items-center justify-between mb-4"><div><h2 className="text-[16px] font-bold text-ink-900">Potentially relevant schemes</h2><p className="text-[12px] text-ink-500 mt-1">{visibleSchemes.length} of {schemes.length} schemes shown for {form.state || 'all India'}</p></div><Badge variant="moderate" dot>Verify eligibility</Badge></div><div className="flex flex-col gap-4">{visibleSchemes.map((scheme) => <SchemeCard key={scheme.id} scheme={scheme} expanded={expandedId === scheme.id} onToggle={() => setExpandedId((current) => current === scheme.id ? null : scheme.id)} />)}{!visibleSchemes.length && <Card variant="ghost" className="text-center py-12"><Building2 size={28} className="mx-auto text-ink-300" /><h2 className="text-[15px] font-bold text-ink-900 mt-4">No matching schemes</h2><p className="text-[13px] text-ink-500 mt-1">Try another category or clear your search.</p></Card>}</div></div>
      </div>
      <Card variant="ghost" className="mt-6 flex items-start gap-3"><ShieldCheck size={17} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[12px] text-ink-500 leading-relaxed">Scheme information is provided for navigation and awareness. Eligibility, benefits, documents, and application processes can change. Use the official website or a government help desk for confirmation.</p></Card>
    </motion.div>
  )
}