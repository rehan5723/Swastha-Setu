import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  FileImage,
  ImagePlus,
  Info,
  Scan,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { ProcessingSteps } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { analyzeMRI, analyzeXRay } from '../services/api'

const PROCESSING_STEPS = [
  'Reading the uploaded image',
  'Checking image quality and anatomy',
  'Reviewing visible patterns',
  'Preparing preliminary findings',
]

const MODALITIES = [
  { value: 'xray', label: 'X-Ray', hint: 'Chest, bones, and more' },
  { value: 'mri', label: 'MRI', hint: 'Brain and soft tissue' },
]

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export default function Imaging() {
  const [modality, setModality] = useState('xray')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
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
    const timer = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, PROCESSING_STEPS.length - 1))
    }, modality === 'mri' ? 1050 : 850)
    return () => clearInterval(timer)
  }, [processing, modality])

  function selectFile(nextFile) {
    if (!nextFile) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(nextFile.type)) {
      toast({ type: 'error', title: 'Unsupported image', message: 'Please upload a JPG, PNG, or WebP image.' })
      return
    }
    if (nextFile.size > 15 * 1024 * 1024) {
      toast({ type: 'error', title: 'Image is too large', message: 'Please choose an image smaller than 15 MB.' })
      return
    }
    setFile(nextFile)
    setResult(null)
  }

  async function handleAnalyze() {
    if (!file) {
      toast({ type: 'warning', title: 'Upload an image first', message: 'Choose an X-Ray or MRI image to begin.' })
      return
    }

    setProcessing(true)
    setCurrentStep(0)
    setResult(null)
    try {
      const analysis = modality === 'mri' ? await analyzeMRI(file) : await analyzeXRay(file)
      setResult(analysis)
      setCurrentStep(PROCESSING_STEPS.length - 1)
    } catch {
      toast({ type: 'error', title: 'Analysis failed', message: 'Please try uploading the image again.' })
    } finally {
      setProcessing(false)
    }
  }

  function clearFile() {
    setFile(null)
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <motion.div
      className="p-6 lg:p-8 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0">
          <Scan size={21} className="text-teal-600" />
        </div>
        <div>
          <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">X-Ray / MRI Analysis</h1>
          <p className="text-[14px] text-ink-500 mt-1 max-w-2xl">Upload a medical image for a preliminary AI-assisted review. A radiologist or specialist should always make the final assessment.</p>
        </div>
      </div>

      {!result && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <Card variant="bordered">
            <div className="mb-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-3">Choose modality</p>
              <div className="grid grid-cols-2 gap-3">
                {MODALITIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => { setModality(item.value); setResult(null) }}
                    className={`text-left p-3 rounded-xl border transition-colors ${modality === item.value ? 'bg-brand-50 border-brand-300 ring-2 ring-brand-100' : 'bg-white border-surface-200 hover:border-brand-200'}`}
                  >
                    <p className="text-[13px] font-bold text-ink-900">{item.label}</p>
                    <p className="text-[11px] text-ink-500 mt-1">{item.hint}</p>
                  </button>
                ))}
              </div>
            </div>

            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => { event.preventDefault(); selectFile(event.dataTransfer.files[0]) }}
              className="min-h-[250px] flex flex-col items-center justify-center text-center rounded-xl bg-surface-50 border-2 border-dashed border-surface-300 px-6 py-8"
            >
              {previewUrl ? (
                <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden bg-ink-900">
                  <img src={previewUrl} alt="Selected medical scan preview" className="w-full h-full object-contain" />
                  <button type="button" onClick={clearFile} className="absolute top-2 right-2 p-1.5 rounded-full bg-ink-900/70 text-white" aria-label="Remove selected image">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4">
                    <ImagePlus size={24} className="text-teal-600" />
                  </div>
                  <h2 className="text-[17px] font-bold text-ink-900">Drop your image here</h2>
                  <p className="text-[13px] text-ink-500 mt-1">Use a clear, original scan where possible</p>
                </>
              )}
              <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => selectFile(event.target.files[0])} />
              {!previewUrl && <Button type="button" variant="outline" size="sm" className="mt-5" leftIcon={<Upload size={15} />} onClick={() => inputRef.current?.click()}>Choose image</Button>}
              <p className="text-[11px] text-ink-400 mt-4">JPG, PNG, or WebP · Maximum 15 MB</p>
            </div>

            {file && <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-teal-50 border border-teal-100">
              <FileImage size={18} className="text-teal-600 flex-shrink-0" />
              <div className="min-w-0 flex-1"><p className="text-[13px] font-semibold text-ink-900 truncate">{file.name}</p><p className="text-[11px] text-ink-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB ready to analyze</p></div>
              <button type="button" onClick={clearFile} className="p-1.5 text-ink-400 hover:text-ink-900" aria-label="Remove selected image"><X size={16} /></button>
            </div>}
            <Button type="button" fullWidth size="lg" className="mt-5" loading={processing} onClick={handleAnalyze} leftIcon={<Scan size={17} />}>Analyze image</Button>
          </Card>

          <Card variant="ghost" className="h-fit">
            <div className="flex items-center gap-2 mb-5"><ShieldCheck size={18} className="text-success-500" /><h2 className="text-[15px] font-bold text-ink-900">Before you upload</h2></div>
            <div className="flex flex-col gap-4">
              {[
                ['Use the original scan', 'Avoid screenshots or heavily compressed images when possible.'],
                ['Remove personal identifiers', 'Crop names, addresses, and registration numbers if you can.'],
                ['Share symptoms separately', 'Image review does not replace the context of your symptoms.'],
                ['Expect preliminary findings', 'The output is informational and requires professional review.'],
              ].map(([title, description]) => <div key={title} className="flex items-start gap-3"><CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" /><div><p className="text-[13px] font-semibold text-ink-900">{title}</p><p className="text-[12px] text-ink-500 mt-0.5 leading-relaxed">{description}</p></div></div>)}
            </div>
            <div className="mt-6 p-3 rounded-xl bg-white border border-surface-200 flex items-start gap-2.5"><Info size={15} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[11px] text-ink-500 leading-relaxed">Seek urgent care for severe symptoms such as sudden weakness, chest pain, or difficulty breathing.</p></div>
          </Card>
        </div>
      )}

      {processing && <Card variant="bordered" className="mt-6 max-w-xl mx-auto"><div className="flex items-center gap-3 mb-5"><div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center"><Scan size={18} className="text-teal-600 animate-pulse" /></div><div><h2 className="text-[15px] font-bold text-ink-900">Reviewing your {modality === 'mri' ? 'MRI' : 'X-Ray'}</h2><p className="text-[12px] text-ink-500 mt-0.5">This is a simulated preliminary review.</p></div></div><ProcessingSteps steps={PROCESSING_STEPS} currentStep={currentStep} /></Card>}

      {result && !processing && <div className="flex flex-col gap-6">
        <Card variant="bordered" className="border-l-4 border-l-teal-500">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"><div><p className="text-[11px] font-bold uppercase tracking-widest text-teal-600">Preliminary review complete</p><h2 className="text-[18px] font-bold text-ink-900 mt-1">{result.fileName}</h2><p className="text-[12px] text-ink-500 mt-1">{result.region} · Analyzed {formatDate(result.analyzedAt)}</p></div><Badge variant={result.urgencyLevel} dot>{result.urgencyLevel.charAt(0).toUpperCase() + result.urgencyLevel.slice(1)} priority</Badge></div>
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 mt-6"><div className="aspect-video lg:aspect-square rounded-xl overflow-hidden bg-ink-900 flex items-center justify-center">{previewUrl ? <img src={previewUrl} alt="Analyzed medical scan" className="w-full h-full object-contain" /> : <FileImage size={42} className="text-ink-500" />}</div><div><p className="text-[11px] font-bold uppercase tracking-widest text-ink-400 mb-2">Summary</p><p className="text-[14px] text-ink-600 leading-relaxed">{result.summary}</p><div className="mt-5 p-3 rounded-xl bg-teal-50 border border-teal-100 flex items-start gap-2.5"><ShieldCheck size={16} className="text-teal-600 mt-0.5 flex-shrink-0" /><p className="text-[12px] text-teal-800 leading-relaxed">No high-priority finding was detected in this preliminary review. This does not rule out a condition.</p></div></div></div>
        </Card>

        <Card variant="default"><div className="flex items-center gap-2 mb-4"><Scan size={17} className="text-teal-600" /><h2 className="text-[16px] font-bold text-ink-900">Observed areas</h2></div><div className="divide-y divide-surface-100">{result.findings.map((item) => <div key={item.label} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"><p className="text-[13px] font-bold text-ink-900 sm:w-40 flex-shrink-0">{item.label}</p><p className="text-[13px] text-ink-600 flex-1">{item.finding}</p><Badge variant="info" size="sm">{Math.round(item.confidence * 100)}% confidence</Badge></div>)}</div></Card>

        <Card variant="default" className="border-l-4 border-warning-500"><div className="flex items-center gap-2 mb-4"><AlertTriangle size={17} className="text-warning-600" /><h2 className="text-[15px] font-bold text-ink-900">Recommended follow-up</h2></div><p className="text-[13px] text-ink-600 leading-relaxed">{result.nextStep}</p></Card>
        <Card variant="ghost" className="flex items-start gap-3"><ShieldCheck size={17} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[12px] text-ink-500 leading-relaxed">{result.disclaimer}</p></Card>
        <div className="flex flex-col sm:flex-row justify-between gap-3"><Button type="button" variant="outline" size="sm" onClick={clearFile} leftIcon={<Upload size={15} />}>Analyze another image</Button><p className="text-[11px] text-ink-400 self-center">Keep the original scan available for specialist review.</p></div>
      </div>}
    </motion.div>
  )
}