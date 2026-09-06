import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, FileText, Info, Scan, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import { PageLoader } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { getAnalysisById } from '../services/api'

const TYPE_CONFIG = {
  medical_report: { icon: FileText, label: 'Medical report', color: 'text-brand-500', background: 'bg-brand-50' },
  xray: { icon: Scan, label: 'X-Ray review', color: 'text-teal-600', background: 'bg-teal-50' },
  mri: { icon: Scan, label: 'MRI review', color: 'text-teal-600', background: 'bg-teal-50' },
  dermatology: { icon: Stethoscope, label: 'Dermatology review', color: 'text-violet-600', background: 'bg-violet-50' },
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value))
}

function ReportDetails({ result }) {
  return <>
    <Card variant="bordered"><div className="flex items-center gap-2 mb-5"><Info size={17} className="text-brand-500" /><h2 className="text-[16px] font-bold text-ink-900">Report summary</h2></div><div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><div className="p-3 rounded-xl bg-surface-50 border border-surface-200"><p className="text-[22px] font-extrabold text-ink-900">{result.summary.total}</p><p className="text-[11px] text-ink-500 mt-1">Parameters found</p></div><div className="p-3 rounded-xl bg-success-50 border border-success-border"><p className="text-[22px] font-extrabold text-success-700">{result.summary.normal}</p><p className="text-[11px] text-success-700 mt-1">Within range</p></div><div className="p-3 rounded-xl bg-warning-50 border border-warning-border"><p className="text-[22px] font-extrabold text-warning-700">{result.summary.attention}</p><p className="text-[11px] text-warning-700 mt-1">To monitor</p></div><div className="p-3 rounded-xl bg-danger-50 border border-danger-border"><p className="text-[22px] font-extrabold text-danger-700">{result.summary.highPriority}</p><p className="text-[11px] text-danger-700 mt-1">Needs attention</p></div></div><p className="text-[13px] text-ink-600 leading-relaxed mt-5">{result.explanation.simple}</p></Card>
    <Card variant="default" padding="none"><div className="p-6 pb-4"><h2 className="text-[16px] font-bold text-ink-900">Parameter results</h2><p className="text-[12px] text-ink-500 mt-1">Reference ranges are taken from the uploaded report.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left"><thead className="bg-surface-50 border-y border-surface-200"><tr className="text-[11px] uppercase tracking-wide text-ink-400"><th className="px-6 py-3">Parameter</th><th className="px-4 py-3">Value</th><th className="px-4 py-3">Reference</th><th className="px-6 py-3">Status</th></tr></thead><tbody className="divide-y divide-surface-100">{result.parameters.map((parameter) => <tr key={parameter.name} className="text-[13px] text-ink-700"><td className="px-6 py-3.5 font-semibold text-ink-900">{parameter.name}</td><td className="px-4 py-3.5">{parameter.value} <span className="text-ink-400">{parameter.unit}</span></td><td className="px-4 py-3.5 text-ink-500">{parameter.refMin} - {parameter.refMax} {parameter.unit}</td><td className="px-6 py-3.5"><Badge variant={parameter.status === 'normal' ? 'success' : parameter.status === 'high' ? 'high' : 'moderate'} dot size="sm">{parameter.status === 'normal' ? 'Within range' : parameter.status === 'high' ? 'Needs attention' : 'Monitor'}</Badge></td></tr>)}</tbody></table></div></Card>
  </>
}

function ImagingDetails({ result }) {
  return <Card variant="bordered"><div className="flex items-center gap-2 mb-5"><Scan size={17} className="text-teal-600" /><h2 className="text-[16px] font-bold text-ink-900">Observed areas</h2></div><p className="text-[13px] text-ink-600 leading-relaxed mb-5">{result.summary}</p><div className="divide-y divide-surface-100">{result.findings.map((item) => <div key={item.label} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"><p className="text-[13px] font-bold text-ink-900 sm:w-40">{item.label}</p><p className="text-[13px] text-ink-600 flex-1">{item.finding}</p><Badge variant="info" size="sm">{Math.round(item.confidence * 100)}% confidence</Badge></div>)}</div></Card>
}

function DermatologyDetails({ result }) {
  return <><Card variant="bordered"><div className="flex items-center gap-2 mb-5"><Sparkles size={17} className="text-violet-600" /><h2 className="text-[16px] font-bold text-ink-900">Possible condition matches</h2></div><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{result.possibleConditions.map((condition) => <div key={condition.name} className="p-4 rounded-xl bg-surface-50 border border-surface-200"><div className="flex items-start justify-between gap-2"><h3 className="text-[14px] font-bold text-ink-900">{condition.name}</h3><span className="text-[14px] font-extrabold text-violet-600">{Math.round(condition.confidence * 100)}%</span></div><p className="text-[12px] text-ink-500 leading-relaxed mt-3">{condition.description}</p><div className="flex flex-wrap gap-1.5 mt-3">{condition.matchingSymptoms.map((symptom) => <Badge key={symptom} variant="brand" size="sm">{symptom}</Badge>)}</div></div>)}</div></Card><Card variant="ghost"><div className="flex items-center gap-2 mb-3"><CheckCircle2 size={17} className="text-success-500" /><h2 className="text-[15px] font-bold text-ink-900">General precautions</h2></div><ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">{result.generalPrecautions.map((item) => <li key={item} className="flex items-start gap-2 text-[13px] text-ink-600"><CheckCircle2 size={14} className="text-success-500 mt-0.5 flex-shrink-0" />{item}</li>)}</ul></Card></>
}

export default function AnalysisDetails() {
  const { id } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    setLoading(true)
    getAnalysisById(id)
      .then((analysis) => { if (active) setResult(analysis) })
      .catch(() => { if (active) { setError(true); toast({ type: 'error', title: 'Analysis not found', message: 'This analysis could not be loaded.' }) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, toast])

  if (loading) return <PageLoader text="Loading analysis details..." />
  if (error || !result) return <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8"><Info size={30} className="text-ink-300" /><h1 className="text-[20px] font-bold text-ink-900 mt-4">Analysis unavailable</h1><p className="text-[13px] text-ink-500 mt-1">The requested result could not be found.</p><Link to="/history" className="mt-5 text-[13px] font-semibold text-brand-500 hover:underline">Return to history</Link></div>

  const config = TYPE_CONFIG[result.type] || TYPE_CONFIG.medical_report
  const Icon = config.icon
  const detailContent = result.type === 'medical_report' ? <ReportDetails result={result} /> : result.type === 'dermatology' ? <DermatologyDetails result={result} /> : <ImagingDetails result={result} />

  return <motion.div className="p-6 lg:p-8 max-w-6xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}><Link to="/history" className="inline-flex items-center gap-2 text-[13px] font-semibold text-ink-500 hover:text-brand-500 mb-6"><ArrowLeft size={15} />Back to history</Link><Card variant="bordered" className="mb-6"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div className="flex items-start gap-3"><div className={`w-11 h-11 rounded-xl ${config.background} flex items-center justify-center flex-shrink-0`}><Icon size={21} className={config.color} /></div><div><p className={`text-[11px] font-bold uppercase tracking-widest ${config.color}`}>{config.label}</p><h1 className="text-[24px] font-extrabold text-ink-900 mt-1">{result.fileName}</h1><p className="text-[12px] text-ink-500 mt-1">Analyzed {formatDate(result.analyzedAt)}</p></div></div><Badge variant={result.urgencyLevel} dot>{result.urgencyLevel.charAt(0).toUpperCase() + result.urgencyLevel.slice(1)} priority</Badge></div></Card><div className="flex flex-col gap-6">{detailContent}<Card variant="default" className="border-l-4 border-warning-500"><div className="flex items-start gap-3"><Info size={17} className="text-warning-600 mt-0.5 flex-shrink-0" /><div><h2 className="text-[15px] font-bold text-ink-900">Recommended next step</h2><p className="text-[13px] text-ink-600 leading-relaxed mt-2">{result.nextStep}</p></div></div></Card><Card variant="ghost" className="flex items-start gap-3"><ShieldCheck size={17} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[12px] text-ink-500 leading-relaxed">{result.disclaimer}</p></Card></div></motion.div>
}