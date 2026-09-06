async function sendPasswordResetEmail({ to, name, token }) {
  if (!process.env.BREVO_API_KEY || !process.env.EMAIL_FROM) {
    throw new Error('Brevo email configuration is incomplete.')
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}`
  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender: { email: process.env.EMAIL_FROM, name: 'Swasthya Setu' },
      to: [{ email: to, name: name || undefined }],
      subject: 'Reset your Swasthya Setu password',
      htmlContent: `<p>Hello${name ? ` ${name}` : ''},</p><p>Use the link below to reset your password. It expires in one hour.</p><p><a href="${resetUrl}">Reset your password</a></p><p>If you did not request this, you can ignore this email.</p>`,
    }),
  })

  if (!response.ok) {
    const details = await response.text()
    throw new Error(`Brevo email request failed: ${response.status} ${details}`)
  }
}

module.exports = { sendPasswordResetEmail }
