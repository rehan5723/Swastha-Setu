import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, CalendarDays, CheckCircle2, MapPin, Save, ShieldCheck, User } from 'lucide-react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import { PageLoader } from '../components/common/Loading'
import { useToast } from '../components/common/Toast'
import { getUserProfile, updateUserProfile } from '../services/api'

const initialForm = { name: '', email: '', mobile: '', state: '', district: '', dob: '', gender: '', bloodGroup: '' }

export default function Profile() {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    getUserProfile().then((profile) => setForm({ ...initialForm, ...profile })).catch(() => toast({ type: 'error', title: 'Could not load profile', message: 'Please refresh and try again.' })).finally(() => setLoading(false))
  }, [toast])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)
    try {
      await updateUserProfile(form)
      toast({ type: 'success', title: 'Profile saved', message: 'Your profile details have been updated.' })
    } catch {
      toast({ type: 'error', title: 'Could not save profile', message: 'Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader text="Loading your profile..." />

  return <motion.div className="p-6 lg:p-8 max-w-5xl mx-auto" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}><div className="mb-8 flex items-start gap-3"><div className="w-11 h-11 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center flex-shrink-0"><User size={21} className="text-brand-500" /></div><div><h1 className="text-[26px] font-extrabold text-ink-900 leading-tight">Your Profile</h1><p className="text-[14px] text-ink-500 mt-1">Keep your personal and health details up to date for more relevant guidance.</p></div></div><div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start"><Card variant="ghost" className="text-center"><div className="w-20 h-20 rounded-full bg-brand-gradient flex items-center justify-center mx-auto shadow-brand"><span className="text-2xl font-extrabold text-white">{(form.name || 'User').split(' ').map((word) => word[0]).join('').slice(0, 2).toUpperCase()}</span></div><h2 className="text-[16px] font-bold text-ink-900 mt-4">{form.name || 'Your name'}</h2><p className="text-[12px] text-ink-500 mt-1">{form.email || 'No email added'}</p><div className="mt-6 pt-5 border-t border-surface-200 text-left flex flex-col gap-3"><div className="flex items-center gap-2 text-[12px] text-ink-500"><MapPin size={14} className="text-brand-500" />{form.district || 'District not set'}, {form.state || 'State not set'}</div><div className="flex items-center gap-2 text-[12px] text-ink-500"><Activity size={14} className="text-brand-500" />Blood group: {form.bloodGroup || 'Not set'}</div></div></Card><Card variant="bordered"><form onSubmit={saveProfile} className="flex flex-col gap-6"><div><h2 className="text-[16px] font-bold text-ink-900">Personal information</h2><p className="text-[12px] text-ink-500 mt-1">These details are used only to personalise your experience.</p></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><Input id="name" name="name" label="Full name" value={form.name} onChange={updateField} required /><Input id="email" name="email" label="Email address" type="email" value={form.email} onChange={updateField} required /><Input id="mobile" name="mobile" label="Mobile number" value={form.mobile} onChange={updateField} /><Input id="dob" name="dob" label="Date of birth" type="date" value={form.dob} onChange={updateField} /></div><div className="pt-5 border-t border-surface-200"><h2 className="text-[16px] font-bold text-ink-900">Health details</h2><p className="text-[12px] text-ink-500 mt-1 mb-4">Optional details that can help with scheme discovery and context.</p><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><div className="flex flex-col gap-1.5"><label htmlFor="gender" className="text-[13px] font-semibold text-ink-900">Gender</label><select id="gender" name="gender" value={form.gender} onChange={updateField} className="h-11 px-3 rounded-xl border border-surface-300 bg-white text-[14px] text-ink-900 focus:outline-none focus:border-brand-500"><option value="">Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option></select></div><Input id="bloodGroup" name="bloodGroup" label="Blood group" value={form.bloodGroup} onChange={updateField} placeholder="e.g. O+" /><Input id="state" name="state" label="State" value={form.state} onChange={updateField} /><Input id="district" name="district" label="District" value={form.district} onChange={updateField} /></div></div><div className="flex items-start gap-2 p-3 rounded-xl bg-brand-50 border border-brand-100"><ShieldCheck size={15} className="text-brand-500 mt-0.5 flex-shrink-0" /><p className="text-[11px] text-ink-500 leading-relaxed">Profile information is currently stored through the prototype service. Persistent, encrypted storage will be added with the production backend.</p></div><div className="flex justify-end"><Button type="submit" loading={saving} leftIcon={<Save size={16} />}>Save changes</Button></div></form></Card></div></motion.div>
}