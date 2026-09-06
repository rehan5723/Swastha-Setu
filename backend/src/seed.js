require('dotenv').config()

const { pool, query } = require('./db')
const { schemes } = require('./data')

async function seedSchemes() {
  if (!pool) throw new Error('DATABASE_URL is not configured.')

  for (const scheme of schemes) {
    const { id, name, department, states, category, ...details } = scheme
    await query(
      `INSERT INTO schemes (id, name, department, states, category, details)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         department = EXCLUDED.department,
         states = EXCLUDED.states,
         category = EXCLUDED.category,
         details = EXCLUDED.details,
         updated_at = NOW()`,
      [id, name, department, states, category, details]
    )
  }

  console.log(`Seeded ${schemes.length} government schemes.`)
}

seedSchemes()
  .catch((error) => {
    console.error(`Scheme seed failed: ${error.message}`)
    process.exitCode = 1
  })
  .finally(async () => {
    await pool?.end()
  })
