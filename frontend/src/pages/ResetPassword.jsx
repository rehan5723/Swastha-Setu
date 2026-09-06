import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Activity, Loader2 } from 'lucide-react'
import { resetPassword } from '../services/api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus(null)
    if (password.length < 8) return setStatus({ type: 'error', message: 'Password must be at least 8 characters.' })
    if (password !== confirm) return setStatus({ type: 'error', message: 'Passwords do not match.' })
    if (!searchParams.get('token')) return setStatus({ type: 'error', message: 'This reset link is missing its token.' })

    setLoading(true)
    try {
      await resetPassword({ token: searchParams.get('token'), password })
      setStatus({ type: 'success', message: 'Password reset successfully. Redirecting to sign in...' })
      setTimeout(() => navigate('/login'), 1200)
    } catch (error) {
      setStatus({ type: 'error', message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f0fe] via-[#f0f7ff] to-[#e3ecff] px-6 py-10">
      <section className="w-full max-w-[460px] rounded-3xl bg-white px-8 py-9 shadow-2xl border border-white">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center shadow-brand"><Activity size={14} className="text-white" /></div>
          <div><span className="text-[18px] font-extrabold brand-gradient block leading-none">Swasthya Setu</span><span className="text-[10px] text-ink-400 uppercase tracking-wide">AI-Powered Healthcare</span></div>
        </div>
        <h1 className="text-[26px] font-extrabold text-ink-900">Choose a new password</h1>
        <p className="text-[13px] text-ink-500 mt-2 mb-7">Use at least 8 characters, then sign in with your new password.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink-900">New password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 px-4 rounded-xl border border-surface-300 outline-none font-normal focus:border-brand-500 focus:shadow-focus" /></label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink-900">Confirm password<input type="password" autoComplete="new-password" value={confirm} onChange={(event) => setConfirm(event.target.value)} className="h-12 px-4 rounded-xl border border-surface-300 outline-none font-normal focus:border-brand-500 focus:shadow-focus" /></label>
          {status && <p role={status.type === 'error' ? 'alert' : 'status'} className={`px-4 py-3 rounded-lg text-[13px] font-medium ${status.type === 'error' ? 'bg-danger-50 text-danger-700 border border-danger-border' : 'bg-success-50 text-success-700 border border-success-border'}`}>{status.message}</p>}
          <button type="submit" disabled={loading} className="h-12 rounded-xl bg-brand-gradient text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70">{loading ? <Loader2 size={18} className="animate-spin" /> : 'Reset password'}</button>
        </form>
        <Link to="/login" className="block text-center mt-5 text-[13px] text-brand-500 font-semibold hover:underline">Back to sign in</Link>
      </section>
    </main>
  )
}
