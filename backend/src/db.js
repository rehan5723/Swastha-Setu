const { Pool } = require('pg')

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false })
  : null

async function query(text, values) {
  if (!pool) throw new Error('DATABASE_URL is not configured.')
  return pool.query(text, values)
}

module.exports = { pool, query }
