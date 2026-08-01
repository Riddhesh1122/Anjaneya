import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, Mail, ChevronLeft } from 'lucide-react'

type Role = 'customer' | 'organizer' | 'admin'

export default function AuthPage() {
  const [role, setRole] = useState<Role>('customer')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Submitting for role ${role}: ${email}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.14 }} transition={{ duration: 1.2 }} className="absolute -left-20 -top-24 w-[36rem] h-[28rem] rounded-full bg-gradient-to-r from-neonPurple via-neonPink to-neonBlue blur-3xl" />
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} transition={{ duration: 1.5 }} className="absolute -right-20 -bottom-24 w-[36rem] h-[28rem] rounded-full bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-600 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/4 backdrop-blur-md border border-white/6 rounded-2xl p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Welcome</h3>
              <p className="text-sm text-white/70">Sign in to continue</p>
            </div>

            <div className="flex gap-2 items-center">
              <button className="px-3 py-1 rounded-full bg-white/3 text-white/90">Help</button>
            </div>
          </div>

          <div className="flex gap-2 bg-white/3 p-1 rounded-xl mb-5">
            <RoleTab active={role === 'customer'} onClick={() => setRole('customer')}>Customer</RoleTab>
            <RoleTab active={role === 'organizer'} onClick={() => setRole('organizer')}>Organizer</RoleTab>
            <RoleTab active={role === 'admin'} onClick={() => setRole('admin')}>Admin</RoleTab>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-white/80 mb-1 block">Email</label>
              <div className="flex items-center gap-2 bg-white/3 p-2 rounded-xl border border-white/6">
                <Mail className="w-4 h-4 text-white/70" />
                <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="w-full bg-transparent outline-none text-white placeholder:text-white/60" placeholder="you@college.edu" />
              </div>
            </div>

            <div>
              <label className="text-xs text-white/80 mb-1 block">Password</label>
              <div className="flex items-center gap-2 bg-white/3 p-2 rounded-xl border border-white/6">
                <Lock className="w-4 h-4 text-white/70" />
                <input required value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="w-full bg-transparent outline-none text-white placeholder:text-white/60" placeholder="••••••••" />
              </div>
            </div>

            {role === 'organizer' && (
              <div>
                <label className="text-xs text-white/80 mb-1 block">College / Club</label>
                <input className="w-full bg-white/3 p-2 rounded-xl border border-white/6 text-white placeholder:text-white/60" placeholder="e.g., Coding Club" />
              </div>
            )}

            <div className="pt-4">
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-neonPurple to-neonPink text-white font-semibold shadow-[0_14px_40px_rgba(124,58,237,0.18)] hover:scale-[1.02] transition">Continue as {role === 'customer' ? 'Student' : role === 'organizer' ? 'Organizer' : 'Admin'}</button>
            </div>
          </form>

          <div className="mt-4 text-xs text-white/70">By continuing you agree to our <span className="text-white">Terms</span>.</div>
        </div>

        <div className="mt-4 text-center text-white/60 text-sm">
          <a href="/" className="flex items-center gap-2 mx-auto"><ChevronLeft className="w-4 h-4" />Back to home</a>
        </div>
      </div>
    </div>
  )
}

function RoleTab({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-gradient-to-r from-neonPurple to-neonPink text-white shadow-[0_8px_30px_rgba(139,92,246,0.12)]' : 'text-white/80'}`}>
      {children}
    </button>
  )
}
