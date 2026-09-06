import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  FileText,
  Info,
  ScanLine,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react'
import Card from '../components/common/Card'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import { ProcessingSteps } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { analyzeMedicalReport } from '../services/api'

const PROCESSING_STEPS = [
  'Reading the uploaded report',
  'Extracting health parameters',
  'Comparing reference ranges',
  'Preparing plain-language findings',
]

const STATUS_LABELS = {
  normal: { label: 'Within range', variant: 'success' },
  attention: { label: 'Monitor', variant: 'moderate' },
  high: { label: 'Needs attention', variant: 'high' },
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

function formatValue(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value)
}

function StatusBadge({ status }) {
  const config = STATUS_LABELS[status] || STATUS_LABELS.normal
  return <Badge variant={config.variant} dot size="sm">{config.label}</Badge>
}

function SummaryMetric({ value, label, tone }) {
  const styles = {
    neutral: 'bg-surface-50 border-surface-200 text-ink-900',
    success: 'bg-success-50 border-success-border text-success-700',
    warning: 'bg-warning-50 border-warning-border text-warning-700',
    danger: 'bg-danger-50 border-danger-border text-danger-700',
  }

  return (
    <div className={`rounded-xl border p-4 ${styles[tone]}`}>
      <p className="text-[24px] font-extrabold leading-none">{value}</p>
      <p className="text-[12px] font-medium mt-2 opacity-80">{label}</p>
    </div>
  )
}

export default function MedicalReports() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const inputRef = useRef(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!processing) return undefined

    const timer = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, PROCESSING_STEPS.length - 1))
    }, 850)

    return () => clearInterval(timer)
  }, [processing])

  function selectFile(nextFile) {
    if (!nextFile) return
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
    if (!allowedTypes.includes(nextFile.type)) {
      toast({ type: 'error', title: 'Unsupported file', message: 'Please upload a PDF, JPG, or PNG report.' })
      return
    }
    if (nextFile.size > 10 * 1024 * 1024) {
      toast({ type: 'error', title: 'File is too large', message: 'Please choose a report smaller than 10 MB.' })
      return
    }
    setFile(nextFile)
    setResult(null)
  }

  function handleDrop(event) {
    event.preventDefault()
    selectFile(event.dataTransfer.files[0])
  }

  async function handleAnalyze() {
    if (!file) {
      toast({ type: 'warning', title: 'Upload a report first', message: 'Choose a PDF, JPG, or PNG file to begin.' })
      return
    }

    setProcessing(true)
    setCurrentStep(0)
    setResult(null)
    try {
      const analysis = await analyzeMedicalReport(file)
      setResult(analysis)
      setCurrentStep(PROCESSING_STEPS.length - 1)
    } catch {
      toast({ type: 'error', title: 'Analysis failed', message: 'Please try uploading the report again.' })
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
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0">
            <FileText size={21} className="text-brand-500" />
          </div>
          <div>
            <h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Medical Report Analysis</h1>
            <p className="text-[14px] text-ink-500 mt-1 max-w-2xl">
              Upload a blood test or lab report to see extracted values, reference-range comparisons, and a clear summary.
            </p>
          </div>
        </div>
      </div>

      {!result && (
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6">
          <Card variant="bordered" className="border-dashed border-2">
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={handleDrop}
              className="min-h-[300px] flex flex-col items-center justify-center text-center rounded-xl bg-surface-50/70 px-6 py-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-4">
                <Upload size={24} className="text-brand-500" />
              </div>
              <h2 className="text-[17px] font-bold text-ink-900">Drop your report here</h2>
              <p className="text-[13px] text-ink-500 mt-1">or choose a file from your device</p>
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                className="sr-only"
                onChange={(event) => selectFile(event.target.files[0])}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-5"
                leftIcon={<FileText size={15} />}
                onClick={() => inputRef.current?.click()}
              >
                Choose report
              </Button>
              <p className="text-[11px] text-ink-400 mt-4">PDF, JPG, or PNG · Maximum 10 MB</p>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-brand-50 border border-brand-100">
                <FileText size={18} className="text-brand-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-ink-900 truncate">{file.name}</p>
                  <p className="text-[11px] text-ink-500 mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB ready to analyze</p>
                </div>
                <button type="button" onClick={clearFile} className="p-1.5 text-ink-400 hover:text-ink-900" aria-label="Remove selected report">
                  <X size={16} />
                </button>
              </div>
            )}

            <Button type="button" fullWidth size="lg" className="mt-5" loading={processing} onClick={handleAnalyze} leftIcon={<ScanLine size={17} />}>
              Analyze report
            </Button>
          </Card>

          <Card variant="ghost" className="h-fit">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={18} className="text-success-500" />
              <h2 className="text-[15px] font-bold text-ink-900">What you will receive</h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                ['Extracted parameters', 'Values found in your uploaded report'],
                ['Range comparison', 'A quick view of values inside or outside the provided ranges'],
                ['Plain-language summary', 'A concise explanation without medical jargon'],
                ['Suggested next steps', 'Questions and topics to discuss with a professional'],
              ].map(([title, description]) => (
                <div key={title} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-success-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[13px] font-semibold text-ink-900">{title}</p>
                    <p className="text-[12px] text-ink-500 mt-0.5 leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 rounded-xl bg-white border border-surface-200 flex items-start gap-2.5">
              <Info size={15} className="text-brand-500 mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-ink-500 leading-relaxed">Use the original report and a qualified healthcare professional for decisions about your care.</p>
            </div>
          </Card>
        </div>
      )}

      {processing && (
        <Card variant="bordered" className="mt-6 max-w-xl mx-auto">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <ScanLine size={18} className="text-brand-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-ink-900">Analyzing your report</h2>
              <p className="text-[12px] text-ink-500 mt-0.5">This usually takes a few seconds.</p>
            </div>
          </div>
          <ProcessingSteps steps={PROCESSING_STEPS} currentStep={currentStep} />
        </Card>
      )}

      {result && !processing && (
        <div className="flex flex-col gap-6">
          <Card variant="bordered" className="border-l-4 border-l-brand-500">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-brand-500">Analysis complete</p>
                <h2 className="text-[18px] font-bold text-ink-900 mt-1">{result.fileName}</h2>
                <p className="text-[12px] text-ink-500 mt-1">Analyzed {formatDate(result.analyzedAt)}</p>
              </div>
              <Badge variant={result.urgencyLevel} dot>{result.urgencyLevel.charAt(0).toUpperCase() + result.urgencyLevel.slice(1)} attention</Badge>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <SummaryMetric value={result.summary.total} label="Parameters found" tone="neutral" />
              <SummaryMetric value={result.summary.normal} label="Within range" tone="success" />
              <SummaryMetric value={result.summary.attention} label="To monitor" tone="warning" />
              <SummaryMetric value={result.summary.highPriority} label="Needs attention" tone="danger" />
            </div>
          </Card>

          <Card variant="default" padding="none">
            <div className="p-6 pb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[16px] font-bold text-ink-900">Parameter overview</h2>
                <p className="text-[12px] text-ink-500 mt-1">Compared with the reference ranges provided in your report.</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowDetails((value) => !value)} rightIcon={<ChevronDown size={15} className={showDetails ? 'rotate-180' : ''} />}>
                {showDetails ? 'Hide details' : 'Show details'}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="bg-surface-50 border-y border-surface-200">
                  <tr className="text-[11px] uppercase tracking-wide text-ink-400">
                    <th className="px-6 py-3 font-bold">Parameter</th>
                    <th className="px-4 py-3 font-bold">Reported value</th>
                    <th className="px-4 py-3 font-bold">Reference range</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {result.parameters.map((parameter) => (
                    <tr key={parameter.name} className="text-[13px] text-ink-700">
                      <td className="px-6 py-3.5 font-semibold text-ink-900">{parameter.name}</td>
                      <td className="px-4 py-3.5">{formatValue(parameter.value)} <span className="text-ink-400">{parameter.unit}</span></td>
                      <td className="px-4 py-3.5 text-ink-500">{formatValue(parameter.refMin)} - {formatValue(parameter.refMax)} {parameter.unit}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={parameter.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="default">
              <div className="flex items-center gap-2 mb-4">
                <Info size={17} className="text-brand-500" />
                <h2 className="text-[15px] font-bold text-ink-900">In simple language</h2>
              </div>
              <p className="text-[13px] text-ink-600 leading-relaxed">{result.explanation.simple}</p>
              {showDetails && <p className="text-[13px] text-ink-600 leading-relaxed mt-4 pt-4 border-t border-surface-200">{result.explanation.detailed}</p>}
            </Card>
            <Card variant="default" className="border-l-4 border-warning-500">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={17} className="text-warning-600" />
                <h2 className="text-[15px] font-bold text-ink-900">Suggested next step</h2>
              </div>
              <p className="text-[13px] text-ink-600 leading-relaxed">{result.nextStep}</p>
            </Card>
          </div>

          <Card variant="ghost" className="flex items-start gap-3">
            <ShieldCheck size={17} className="text-brand-500 mt-0.5 flex-shrink-0" />
            <p className="text-[12px] text-ink-500 leading-relaxed">{result.disclaimer}</p>
          </Card>

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <Button type="button" variant="outline" size="sm" onClick={clearFile} leftIcon={<Upload size={15} />}>Analyze another report</Button>
            <p className="text-[11px] text-ink-400 self-center">Keep your original report available for clinical review.</p>
          </div>
        </div>
      )}
    </motion.div>
  )
}