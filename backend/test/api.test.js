const assert = require('node:assert/strict')
const test = require('node:test')
const app = require('../src/index')

let server
let baseUrl
let authToken

async function request(path, options) {
  const isFormData = options?.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...(options?.headers || {}),
  }
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  })
  const body = await response.json()
  return { status: response.status, body }
}

test.before(async () => {
  server = app.listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  baseUrl = `http://127.0.0.1:${server.address().port}`
})

test.after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()))
})

test('health check reports that the backend is running', async () => {
  const result = await request('/api/hello')
  assert.equal(result.status, 200)
  assert.equal(result.body.message, 'SwasthaSetu backend is running.')
})

test('registration validates required fields and returns a session user', async () => {
  const missing = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email: 'missing@example.com' }),
  })
  assert.equal(missing.status, 400)

  const email = `test-${Date.now()}@example.com`
  const created = await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Test User', email, mobile: '9999999999', password: 'secret' }),
  })
  assert.equal(created.status, 201)
  assert.equal(created.body.token.split('.').length, 3)
  authToken = created.body.token
  assert.equal(created.body.user.email, email)
  assert.equal(Object.hasOwn(created.body.user, 'password'), false)
})

test('login rejects bad credentials and accepts a registered email', async () => {
  const invalid = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: 'unknown@example.com', password: 'wrong' }),
  })
  assert.equal(invalid.status, 401)

  const email = `login-${Date.now()}@example.com`
  await request('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name: 'Login User', email, mobile: '8888888888', password: 'secret' }),
  })
  const loggedIn = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ identifier: email, password: 'secret' }),
  })
  assert.equal(loggedIn.status, 200)
  authToken = loggedIn.body.token
  assert.equal(loggedIn.body.user.email, email)
})

test('forgot-password returns a safe response for valid and invalid requests', async () => {
  const missing = await request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({}),
  })
  assert.equal(missing.status, 400)

  const requested = await request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: 'unknown@example.com' }),
  })
  assert.equal(requested.status, 200)
  assert.match(requested.body.message, /If an account exists/)
})

test('history, analysis details, and schemes return frontend-compatible data', async () => {
  const history = await request('/api/history')
  assert.equal(history.status, 200)
  assert.ok(Array.isArray(history.body))

  const analysis = await request('/api/analysis/rpt_001')
  assert.equal(analysis.status, process.env.DATABASE_URL ? 404 : 200)
  if (!process.env.DATABASE_URL) assert.equal(analysis.body.type, 'medical_report')

  const missingAnalysis = await request('/api/analysis/missing')
  assert.equal(missingAnalysis.status, 404)

  const maharashtraSchemes = await request('/api/schemes?state=Maharashtra')
  assert.equal(maharashtraSchemes.status, 200)
  assert.equal(maharashtraSchemes.body.length, 4)
})

test('analysis submission endpoints preserve the uploaded filename and modality', async () => {
  const report = await request('/api/analysis/report', {
    method: 'POST',
    body: JSON.stringify({ fileName: 'new-report.pdf' }),
  })
  assert.equal(report.status, 201)
  assert.equal(report.body.fileName, 'new-report.pdf')

  const mri = await request('/api/analysis/imaging', {
    method: 'POST',
    body: JSON.stringify({ fileName: 'brain.mri', type: 'mri' }),
  })
  assert.equal(mri.status, 201)
  assert.equal(mri.body.type, 'mri')
  assert.equal(mri.body.region, 'Brain')
})

test('report analysis accepts a multipart file upload', async () => {
  const form = new FormData()
  form.append('file', new Blob(['sample report'], { type: 'application/pdf' }), 'uploaded-report.pdf')

  const response = await request('/api/analysis/report', {
    method: 'POST',
    body: form,
    headers: {},
  })

  assert.equal(response.status, 201)
  assert.equal(response.body.fileName, 'uploaded-report.pdf')
  assert.equal(response.body.uploadedFile.originalName, 'uploaded-report.pdf')
  assert.equal(response.body.uploadedFile.mimeType, 'application/pdf')
})
