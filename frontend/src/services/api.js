/**
 * api.js — Swasthya Setu API service layer.
 *
 * All UI components call these functions, never raw fetch calls.
 * Keeps HTTP details out of page components.
 */

async function request(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  let token
  try {
    const session = JSON.parse(localStorage.getItem('swasthya_setu_session') || 'null')
    token = session?.token
  } catch {
    token = undefined
  }
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}
  const response = await fetch(`/api${path}`, {
    headers: isFormData ? { ...authHeaders, ...(options.headers || {}) } : { 'Content-Type': 'application/json', ...authHeaders, ...(options.headers || {}) },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'The request could not be completed.')
  return payload
}

/* ── Auth ────────────────────────────────────────────── */

export async function loginUser({ identifier, password }) {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) })
}

export async function registerUser({ name, email, mobile, password }) {
  return request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, mobile, password }) })
}

export async function requestPasswordReset(email) {
  return request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function resetPassword({ token, password }) {
  return request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, password }) })
}

export async function logoutUser() {
  return { success: true }
}

/* ── User Profile ────────────────────────────────────── */

export async function getUserProfile() {
  return request('/profile')
}

export async function updateUserProfile(updates) {
  return request('/profile', { method: 'PUT', body: JSON.stringify(updates) })
}

/* ── Medical Report Analysis ────────────────────────── */

/**
 * @param {File} file - The uploaded report file
 * @returns {Promise<object>} Analysis result
 */
export async function analyzeMedicalReport(file) {
  const body = new FormData()
  body.append('file', file)
  return request('/analysis/report', { method: 'POST', body })
}

/* ── Imaging Analysis ────────────────────────────────── */

/**
 * @param {File} file - Uploaded X-ray or MRI image
 * @param {'xray'|'mri'} type - Imaging modality
 */
export async function analyzeXRay(file) {
  const body = new FormData()
  body.append('file', file)
  body.append('type', 'xray')
  return request('/analysis/imaging', { method: 'POST', body })
}

export async function analyzeMRI(file) {
  const body = new FormData()
  body.append('file', file)
  body.append('type', 'mri')
  return request('/analysis/imaging', { method: 'POST', body })
}

/* ── Dermatology Analysis ───────────────────────────── */

/**
 * @param {File} image - Uploaded skin image
 */
export async function analyzeDermatologyImage(image) {
  const body = new FormData()
  body.append('file', image)
  body.append('method', 'image')
  return request('/analysis/dermatology', { method: 'POST', body })
}

/**
 * @param {string} symptoms - Text description of symptoms
 */
export async function analyzeDermatologySymptoms(symptoms) {
  return request('/analysis/dermatology', { method: 'POST', body: JSON.stringify({ symptoms, method: 'symptoms' }) })
}

/* ── Government Schemes ──────────────────────────────── */

/**
 * @param {{ age, state, district, income, condition, other }} eligibilityInfo
 */
export async function getGovernmentSchemes(eligibilityInfo) {
  const state = encodeURIComponent(eligibilityInfo?.state || '')
  return request(`/schemes${state ? `?state=${state}` : ''}`)
}

/* ── Analysis History ────────────────────────────────── */

export async function getAnalysisHistory() {
  return request('/history')
}

export async function getAnalysisById(id) {
  return request(`/analysis/${encodeURIComponent(id)}`)
}
