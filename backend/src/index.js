require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('node:crypto')
const fs = require('node:fs')
const path = require('node:path')
const multer = require('multer')
const { query } = require('./db')
const { user, history, schemes, analyses } = require('./data')
const { analyzeReport, analyzeImaging, analyzeDermatology } = require('./ml/analyzer')
const { sendPasswordResetEmail } = require('./email')

const app = express()
app.use(cors())
app.use(express.json())

const uploadDirectory = path.join(__dirname, '..', 'uploads')
fs.mkdirSync(uploadDirectory, { recursive: true })

const allowedMimeTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
const upload = multer({
  dest: uploadDirectory,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => callback(null, allowedMimeTypes.has(file.mimetype)),
})

function uploadedFileMetadata(file) {
  if (!file) return undefined
  return { originalName: file.originalname, storedName: file.filename, mimeType: file.mimetype, size: file.size }
}

/* ─── In-memory user store (replace with DB in production) ─── */
const users = []
const databaseEnabled = Boolean(process.env.DATABASE_URL)
const jwtSecret = process.env.JWT_SECRET || 'development-only-change-me'

function createToken(userId) {
  return jwt.sign({ sub: String(userId) }, jwtSecret, { expiresIn: '7d' })
}

function requireAuth(req, res, next) {
  if (!databaseEnabled) return next()
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, '')
  if (!token) return res.status(401).json({ message: 'Authentication is required.' })
  try {
    const payload = jwt.verify(token, jwtSecret)
    req.userId = Number(payload.sub)
  } catch {
    return res.status(401).json({ message: 'Your session is invalid or has expired.' })
  }
  next()
}

async function saveAnalysis(result, userId) {
  if (!databaseEnabled || !userId) return
  await query(
    'INSERT INTO analyses (id, user_id, type, file_name, analyzed_at, result) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO UPDATE SET result = EXCLUDED.result',
    [result.id, userId, result.type, result.fileName, result.analyzedAt, result]
  )
}

/* ─── POST /api/auth/register ─── */
app.post('/api/auth/register', async (req, res) => {
  const { name, email, mobile, country, password } = req.body

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({ message: 'All fields are required.' })
  }
  if (databaseEnabled) {
    const existing = await query('SELECT id FROM users WHERE email = $1 OR (mobile = $2 AND country = $3)', [email, mobile, country])
    if (existing.rowCount) return res.status(409).json({ message: 'An account with these details already exists.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const result = await query(
      'INSERT INTO users (name, email, mobile, country, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, mobile, country, created_at',
      [name, email, mobile, country || null, passwordHash]
    )
    const createdUser = result.rows[0]
    return res.status(201).json({ message: 'Account created successfully.', token: createToken(createdUser.id), user: createdUser })
  }

  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'An account with this email already exists.' })
  if (users.find(u => u.mobile === mobile && u.country === country)) return res.status(409).json({ message: 'An account with this mobile number already exists.' })

  const user = { id: users.length + 1, name, email, mobile, country, password, createdAt: new Date() }
  users.push(user)

  res.status(201).json({ message: 'Account created successfully.', token: createToken(user.id), user: { ...user, password: undefined } })
})

/* ─── POST /api/auth/login ─── */
app.post('/api/auth/login', async (req, res) => {
  const { identifier, country, password } = req.body

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Identifier and password are required.' })
  }

  if (databaseEnabled) {
    const result = await query('SELECT id, name, email, mobile, country, password_hash, created_at FROM users WHERE email = $1 OR (mobile = $1 AND country = $2)', [identifier, country])
    const storedUser = result.rows[0]
    if (!storedUser || !(await bcrypt.compare(password, storedUser.password_hash))) return res.status(401).json({ message: 'Invalid credentials. Please check your details and try again.' })
    const { password_hash: ignoredPasswordHash, ...safeUser } = storedUser
    return res.json({ message: 'Login successful.', token: createToken(storedUser.id), user: safeUser })
  }

  const user = users.find(u => (u.email === identifier || (u.mobile === identifier && u.country === country)) && u.password === password)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials. Please check your details and try again.' })
  }

  res.json({ message: 'Login successful.', token: createToken(user.id), user: { ...user, password: undefined } })
})

app.post('/api/auth/forgot-password', async (req, res) => {
  const email = req.body?.email?.trim()
  if (!email) return res.status(400).json({ message: 'Email is required.' })
  if (databaseEnabled) {
    const result = await query('SELECT id, name, email FROM users WHERE email = $1', [email])
    if (result.rowCount) {
      const rawToken = crypto.randomBytes(32).toString('hex')
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
      await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND used_at IS NULL', [result.rows[0].id])
      await query('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'1 hour\')', [result.rows[0].id, tokenHash])
      try {
        await sendPasswordResetEmail({ to: result.rows[0].email, name: result.rows[0].name, token: rawToken })
      } catch (error) {
        await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1', [tokenHash])
        console.error(error.message)
      }
    }
  }
  res.json({ message: 'If an account exists for that email, reset instructions will be sent.' })
})

app.post('/api/auth/reset-password', async (req, res) => {
  const { token, password } = req.body || {}
  if (!token || !password || password.length < 8) return res.status(400).json({ message: 'A valid token and password of at least 8 characters are required.' })
  if (!databaseEnabled) return res.status(503).json({ message: 'Password reset requires PostgreSQL.' })

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
  const tokenResult = await query('SELECT id, user_id FROM password_reset_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > NOW()', [tokenHash])
  if (!tokenResult.rowCount) return res.status(400).json({ message: 'This reset link is invalid or has expired.' })

  const passwordHash = await bcrypt.hash(password, 12)
  await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [passwordHash, tokenResult.rows[0].user_id])
  await query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1', [tokenResult.rows[0].id])
  res.json({ message: 'Password reset successfully. You can now sign in.' })
})

app.get('/api/profile', requireAuth, async (req, res) => {
  if (!databaseEnabled) return res.json(user)
  const result = await query('SELECT id, name, email, mobile, avatar, state, district, dob, gender, blood_group AS "bloodGroup", created_at AS "joinedAt" FROM users WHERE id = $1', [req.userId])
  if (!result.rowCount) return res.status(404).json({ message: 'User not found.' })
  res.json(result.rows[0])
})

app.put('/api/profile', requireAuth, async (req, res) => {
  if (!databaseEnabled) {
    Object.assign(user, req.body)
    return res.json(user)
  }
  const { name, mobile, avatar, state, district, dob, gender, bloodGroup } = req.body
  const result = await query(
    'UPDATE users SET name = COALESCE($2, name), mobile = COALESCE($3, mobile), avatar = COALESCE($4, avatar), state = COALESCE($5, state), district = COALESCE($6, district), dob = COALESCE($7, dob), gender = COALESCE($8, gender), blood_group = COALESCE($9, blood_group), updated_at = NOW() WHERE id = $1 RETURNING id, name, email, mobile, avatar, state, district, dob, gender, blood_group AS "bloodGroup", created_at AS "joinedAt"',
    [req.userId, name, mobile, avatar, state, district, dob, gender, bloodGroup]
  )
  if (!result.rowCount) return res.status(404).json({ message: 'User not found.' })
  res.json(result.rows[0])
})

app.get('/api/history', requireAuth, async (req, res) => {
  if (!databaseEnabled) return res.json(history)
  const result = await query('SELECT result FROM analyses WHERE user_id = $1 ORDER BY analyzed_at DESC', [req.userId])
  res.json(result.rows.map(({ result: analysis }) => ({
    id: analysis.id,
    type: analysis.type === 'xray' || analysis.type === 'mri' ? 'imaging' : analysis.type,
    label: analysis.type === 'medical_report' ? 'Medical Report Analysis' : analysis.type === 'dermatology' ? 'Skin Concern Analysis' : `${analysis.type.toUpperCase()} Analysis`,
    fileName: analysis.fileName,
    date: analysis.analyzedAt,
    urgency: analysis.urgencyLevel,
    summary: analysis.summary?.simple || analysis.summary || 'Analysis completed',
  })))
})

app.get('/api/analysis/:id', requireAuth, async (req, res) => {
  if (databaseEnabled) {
    const stored = await query('SELECT result FROM analyses WHERE id = $1 AND user_id = $2', [req.params.id, req.userId])
    if (!stored.rowCount) return res.status(404).json({ message: 'Analysis not found.' })
    return res.json(stored.rows[0].result)
  }
  const analysis = analyses[req.params.id]
  if (!analysis) return res.status(404).json({ message: 'Analysis not found.' })
  res.json(analysis)
})

app.post('/api/analysis/report', requireAuth, upload.single('file'), async (req, res) => {
  const fileName = req.file?.originalname || req.body.fileName || analyses.rpt_001.fileName
  const result = { ...await analyzeReport(req.file), id: `rpt_${Date.now()}`, fileName, analyzedAt: new Date().toISOString(), uploadedFile: uploadedFileMetadata(req.file) }
  await saveAnalysis(result, req.userId)
  res.status(201).json(result)
})

app.post('/api/analysis/imaging', requireAuth, upload.single('file'), async (req, res) => {
  const type = req.body.type === 'mri' ? 'mri' : 'xray'
  const fileName = req.file?.originalname || req.body.fileName || analyses.img_001.fileName
  const result = { ...await analyzeImaging(type, req.file), id: `${type}_${Date.now()}`, type, fileName, analyzedAt: new Date().toISOString(), uploadedFile: uploadedFileMetadata(req.file) }
  await saveAnalysis(result, req.userId)
  res.status(201).json(result)
})

app.post('/api/analysis/dermatology', requireAuth, upload.single('file'), async (req, res) => {
  const fileName = req.file?.originalname || req.body.fileName || analyses.derm_001.fileName
  const result = { ...await analyzeDermatology({ method: req.body.method || 'image', file: req.file, symptoms: req.body.symptoms }), id: `derm_${Date.now()}`, fileName, analyzedAt: new Date().toISOString(), uploadedFile: uploadedFileMetadata(req.file) }
  await saveAnalysis(result, req.userId)
  res.status(201).json(result)
})

app.get('/api/schemes', async (req, res) => {
  const state = req.query.state
  if (databaseEnabled) {
    const result = await query(
      `SELECT id, name, department, states, category, details
       FROM schemes
       ${state ? 'WHERE states = $1 OR states = \'All India\'' : ''}
       ORDER BY name`,
      state ? [state] : []
    )
    return res.json(result.rows.map(({ details, ...scheme }) => ({ ...scheme, ...details })))
  }
  res.json(state ? schemes.filter((scheme) => scheme.states === 'All India' || scheme.states === state) : schemes)
})

/* ─── Health check ─── */
app.get('/api/hello', (req, res) => {
  res.json({ message: 'SwasthaSetu backend is running.' })
})

if (require.main === module) {
  const port = process.env.PORT || 4000
  app.listen(port, () => console.log('Backend listening on port ' + port))
}

module.exports = app
