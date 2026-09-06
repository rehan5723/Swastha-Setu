import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Info,
  ShieldCheck,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { ProcessingSteps } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { analyzeDermatologyImage, analyzeDermatologySymptoms } from '../services/api'

const PROCESSING_STEPS = ['Reviewing your input', 'Identifying visible patterns', 'Comparing possible matches', 'Preparing safe guidance']

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value))
}

export default function Dermatology() {
  const [mode, setMode] = useState('image')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const inputRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return undefined
    }
    const nextUrl = URL.createObjectURL(file)
    setPreviewUrl(nextUrl)
    return () => URL.revokeObjectURL(nextUrl)
  }, [file])

  useEffect(() => {
    if (!processing) return undefined
    const timer = setInterval(() => setCurrentStep((step) => Math.min(step + 1, PROCESSING_STEPS.length - 1)), 700)
    return () => clearInterval(timer)
  }, [processing])

  function selectFile(nextFile) {
    if (!nextFile) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(nextFile.type)) {
      toast({ type: 'error', title: 'Unsupported image', message: 'Please upload a JPG, PNG, or WebP image.' })
      return
    }
    if (nextFile.size > 10 * 1024 * 1024) {
      toast({ type: 'error', title: 'Image is too large', message: 'Please choose an image smaller than 10 MB.' })
      return
    }
    setFile(nextFile)
    setResult(null)
  }

  async function handleAnalyze() {
    if (mode === 'image' && !file) {
      toast({ type: 'warning', title: 'Upload a skin image first', message: 'Choose a clear image of the area you want to review.' })
      return
    }
    if (mode === 'symptoms' && symptoms.trim().length < 12) {
      toast({ type: 'warning', title: 'Add more detail', message: 'Describe the location, appearance, and symptoms in a little more detail.' })
      return
    }

    setProcessing(true)
    setCurrentStep(0)
    setResult(null)
    try {
      const analysis = mode === 'image'
        ? await analyzeDermatologyImage(file)
        : await analyzeDermatologySymptoms(symptoms.trim())
      setResult(analysis)
      setCurrentStep(PROCESSING_STEPS.length - 1)
    } catch {
      toast({ type: 'error', title: 'Analysis failed', message: 'Please try again with a different input.' })
    } finally {
      setProcessing(false)
    }
  }

  function clearInput() {
    setFile(null)
    setSymptoms('')
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <motion.div className="p-6 lg:p-8 max-w-6xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div className="mb-8 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0"><Sparkles size={21} className="text-violet-600" /></div>
        <div><h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Skin Concern Analysis</h1><p className="text-[14px] text-ink-500 mt-1 max-w-2xl">Share a skin image or describe what you are experiencing to receive possible matches and general precautions.</p></div>
      </div>

      {!result && <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
        <Card variant="bordered">
          <div className="flex p-1 rounded-xl bg-surface-100 mb-6">
            {[['image', 'Upload image'], ['symptoms', 'Describe symptoms']].map(([value, label]) => <button key={value} type="button" onClick={() => { setMode(value); setResult(null) }} className={`flex-1 h-10 rounded-lg text-[13px] font-semibold transition-colors ${mode === value ? 'bg-white text-violet-700 shadow-sm' : 'text-ink-500 hover:text-ink-900'}`}>{label}</button>)}
          </div>

          {mode === 'image' ? <>
            <div onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]) }} className="min-h-[270px] flex flex-col items-center justify-center text-center rounded-xl bg-surface-50 border-2 border-dashed border-surface-300 px-6 py-8">
              {previewUrl ? <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-ink-900"><img src={previewUrl} alt="Selected skin image preview" className="w-full h-full object-contain" /><button type="button" onClick={clearInput} className="absolute top-2 right-2 p-1.5 rounded-full bg-ink-900/70 text-white" aria-label="Remove selected image"><X size={15} /></button></div> : <><div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mb-4"><ImagePlus size={24} className="text-violet-600" /></div><h2 className="text-[17px] font-bold text-ink-900">Drop a skin image here</h2><p className="text-[13px] text-ink-500 mt-1">Use good lighting and keep the area in focus</p></>}
              <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectFile(event.target.files[0])} />
              {!previewUrl && <Button type="button" variant="outline" size="sm" className="mt-5" leftIcon={<Upload size={15} />} onClick={() => inputRef.current?.click()}>Choose image</Button>}
              <p className="text-[11px] text-ink-400 mt-4">JPG, PNG, or WebP · Maximum 10 MB</p>
            </div>
            {file && <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100"><FileImage size={18} className="text-violet-600 flex-shrink-0" /><div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-ink-900 truncate">{file.name}</p><p className="text-[11px] text-ink-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB ready to review</p></div><button type="button" onClick={clearInput} className="p-1.5 text-ink-400 hover:text-ink-900" aria-label="Remove selected image"><X size={16} /></button></div>}
          </> : <div><label htmlFor="symptoms" className="text-[13px] font-semibold text-ink-900">What are you noticing?</label><p className="text-[12px] text-ink-500 mt-1">Include where it is, how long it has been present, and any itching, pain, scaling, or spread.</p><textarea id="symptoms" value={symptoms} onChange={(event) => setSymptoms(event.target.value)} rows={9} maxLength={1200} placeholder="Example: I have a red, itchy patch on my forearm that started four days ago..." className="mt-4 w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-[13px] text-ink-900 placeholder:text-ink-300 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent" /><p className="text-right text-[11px] text-ink-400 mt-1">{symptoms.length}/1200</p></div>}
          <Button type="button" fullWidth size="lg" className="mt-5" loading={processing} onClick={handleAnalyze} leftIcon={<Sparkles size={17} />}>Review skin concern</Button>
        </Card>

        <Card variant="ghost" className="h-fit"><div className="flex items-center gap-2 mb-5"><ShieldCheck size={18} className="text-success-500" /><h2 className="text-[15px] font-bold text-ink-900">Helpful context</h2></div><div className="flex flex-col gap-4">{[['Clear images help', 'Use natural light and avoid filters, flash glare, or blurry photos.'], ['Describe changes', 'Mention whether the area is spreading, recurring, or changing in appearance.'], ['Possible matches only', 'The results are not a diagnosis and may miss important context.'], ['Get help for red flags', 'Seek care quickly for breathing trouble, facial swelling, fever, or rapid spread.']].map(([title, description]) => <div key={title} className="flex items-start gap-3"><CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" /><div><p className="text-[13px] font-semibold text-ink-900">{title}</p><p className="text-[12px] text-ink-500 mt-0.5 leading-relaxed">{description}</p></div></div>)}</div><div className="mt-6 p-3 rounded-xl bg-white border border-surface-200 flex items-start gap-2.5"><Info size={15} className="text-violet-600 mt-0.5 flex-shrink-0" /><p className="text-[11px] text-ink-500 leading-relaxed">Avoid sharing identifying details in images or symptom descriptions.</p></div></Card>
      </div>}

      {processing && <Card variant="bordered" className="mt-6 max-w-xl mx-auto"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center"><Sparkles size={18} className="text-violet-600 animate-pulse" /></div><div><h2 className="text-[15px] font-bold text-ink-900">Reviewing your skin concern</h2><p className="text-[12px] text-ink-500 mt-0.5">This is a simulated AI-assisted review.</p></div></div><ProcessingSteps steps={PROCESSING_STEPS} currentStep={currentStep} /></Card>}

      {result && !processing && <div className="flex flex-col gap-6">
        <Card variant="bordered" className="border-l-4 border-l-violet-500"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-widest text-violet-600">Review complete</p><h2 className="text-[18px] font-bold text-ink-900 mt-1">Possible condition matches</h2><p className="text-[12px] text-ink-500 mt-1">{result.method === 'image' ? file?.name || 'Skin image' : 'Symptom description'} · Analyzed {formatDate(result.analyzedAt)}</p></div><Badge variant="info" dot>Informational</Badge></div><p className="text-[13px] text-ink-600 leading-relaxed mt-5">These are possible matches based on the input provided. They are not a diagnosis.</p></Card>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">{result.possibleConditions.map((condition, index) => <Card key={condition.name} variant={index === 0 ? 'elevated' : 'bordered'} className={index === 0 ? 'border-t-4 border-violet-500' : ''}><div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-bold uppercase tracking-widest text-ink-400">Match {index + 1}</p><h2 className="text-[16px] font-bold text-ink-900 mt-1">{condition.name}</h2></div><span className="text-[18px] font-extrabold text-violet-600">{Math.round(condition.confidence * 100)}%</span></div><div className="h-2 rounded-full bg-surface-100 overflow-hidden mt-4"><div className="h-full rounded-full bg-violet-500" style={{ width: `${condition.confidence * 100}%` }} /></div><p className="text-[12px] text-ink-500 leading-relaxed mt-4">{condition.description}</p><div className="flex flex-wrap gap-1.5 mt-4">{condition.matchingSymptoms.map((item) => <Badge key={item} variant="brand" size="sm">{item}</Badge>)}</div></Card>)}</div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><Card variant="default"><div className="flex items-center gap-2 mb-4"><CheckCircle2 size={17} className="text-success-500" /><h2 className="text-[15px] font-bold text-ink-900">General precautions</h2></div><ul className="flex flex-col gap-3">{result.generalPrecautions.map((item) => <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink-600"><CheckCircle2 size={15} className="text-success-500 mt-0.5 flex-shrink-0" />{item}</li>)}</ul></Card><Card variant="default" className="border-l-4 border-warning-500"><div className="flex items-center gap-2 mb-4"><AlertTriangle size={17} className="text-warning-600" /><h2 className="text-[15px] font-bold text-ink-900">Things to avoid</h2></div><ul className="flex flex-col gap-3">{result.thingsToAvoid.map((item) => <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink-600"><AlertTriangle size={15} className="text-warning-600 mt-0.5 flex-shrink-0" />{item}</li>)}</ul></Card></div>
        <Card variant="ghost" className="flex items-start gap-3"><AlertTriangle size={17} className="text-danger-500 mt-0.5 flex-shrink-0" /><div><h2 className="text-[14px] font-bold text-ink-900">When to seek care</h2><p className="text-[12px] text-ink-500 leading-relaxed mt-1">{result.whenToSeek}</p></div></Card>
        <Card variant="ghost" className="flex items-start gap-3"><ShieldCheck size={17} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[12px] text-ink-500 leading-relaxed">{result.disclaimer}</p></Card>
        <div className="flex flex-col sm:flex-row justify-between gap-3"><Button type="button" variant="outline" size="sm" onClick={clearInput} leftIcon={<Upload size={15} />}>Start another review</Button><p className="text-[11px] text-ink-400 self-center">A clinician can interpret these findings with your full history.</p></div>
      </div>}
    </motion.div>
  )
}