const fs = require('node:fs/promises')

const DEMO_DISCLAIMER = 'This is a development baseline and not a medical diagnosis. Consult a qualified healthcare professional.'

function demoReport(file) {
  return {
    type: 'medical_report',
    urgencyLevel: 'moderate',
    summary: { total: 0, normal: 0, attention: 0, highPriority: 0 },
    parameters: [],
    explanation: { simple: 'No trained report model is configured. The uploaded file was received but not clinically interpreted.' },
    nextStep: 'Configure a validated report-analysis provider and discuss the original report with a healthcare professional.',
    disclaimer: DEMO_DISCLAIMER,
    provider: 'development-baseline',
    sourceFile: file?.originalname,
  }
}

function demoImaging(type, file) {
  return {
    type,
    urgencyLevel: 'unknown',
    region: type === 'mri' ? 'Brain' : 'Chest',
    findings: [],
    summary: 'No validated imaging model is configured. The uploaded image was received but not clinically interpreted.',
    nextStep: 'Have a qualified radiologist or specialist review the original image.',
    disclaimer: DEMO_DISCLAIMER,
    provider: 'development-baseline',
    sourceFile: file?.originalname,
  }
}

function demoDermatology(method, file, symptoms) {
  return {
    type: 'dermatology',
    method,
    urgencyLevel: 'unknown',
    possibleConditions: [],
    generalPrecautions: ['Avoid irritating the affected area', 'Do not use prescription treatment without professional guidance'],
    thingsToAvoid: ['Picking or scratching the area', 'Sharing personal identifying information in images'],
    whenToSeek: 'Seek prompt care for rapid spread, fever, facial swelling, breathing difficulty, or severe pain.',
    nextStep: 'Have a qualified clinician assess the symptoms or image.',
    disclaimer: DEMO_DISCLAIMER,
    provider: 'development-baseline',
    sourceFile: file?.originalname,
    symptoms,
  }
}

async function callProvider(payload) {
  if (!process.env.ML_API_URL) return null
  const headers = { 'Content-Type': 'application/json' }
  if (process.env.ML_API_KEY) headers.Authorization = `Bearer ${process.env.ML_API_KEY}`
  const response = await fetch(process.env.ML_API_URL, { method: 'POST', headers, body: JSON.stringify(payload) })
  const result = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(result.message || `ML provider returned ${response.status}.`)
  return result
}

async function filePayload(file) {
  if (!file) return undefined
  const content = await fs.readFile(file.path)
  return { name: file.originalname, mimeType: file.mimetype, contentBase64: content.toString('base64') }
}

async function analyzeReport(file) {
  const providerResult = await callProvider({ task: 'medical_report', file: await filePayload(file) })
  return providerResult || demoReport(file)
}

async function analyzeImaging(type, file) {
  const providerResult = await callProvider({ task: 'medical_imaging', modality: type, file: await filePayload(file) })
  return providerResult || demoImaging(type, file)
}

async function analyzeDermatology({ method, file, symptoms }) {
  const providerResult = await callProvider({ task: 'dermatology', method, symptoms, file: await filePayload(file) })
  return providerResult || demoDermatology(method, file, symptoms)
}

module.exports = { analyzeReport, analyzeImaging, analyzeDermatology }
