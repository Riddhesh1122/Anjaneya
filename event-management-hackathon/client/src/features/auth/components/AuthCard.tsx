import { Lock, Mail, User as UserIcon, Building } from 'lucide-react'
import { RoleTabs } from './RoleTabs'
import { useAuthForm } from '../../../hooks/useAuthForm'

export function AuthCard() {
  const {
    isSignUp,
    setIsSignUp,
    role,
    setRole,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    college,
    setCollege,
    error,
    loading,
    handleSubmit,
    roleLabel,
  } = useAuthForm()

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-[0_30px_80px_rgba(2,6,23,0.8)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-extrabold text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-sm text-white/70">
            {isSignUp ? 'Sign up to register for events' : 'Sign in to access your tickets'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs text-pink-400 hover:text-pink-300 underline font-medium"
        >
          {isSignUp ? 'Already have an account?' : 'Need an account?'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-xs">
          {error}
        </div>
      )}

      {isSignUp && <RoleTabs role={role} onChange={setRole} />}

      <form onSubmit={handleSubmit} className="space-y-4 mt-3">
        {isSignUp && (
          <div>
            <label className="text-xs text-white/80 mb-1 block">Full Name</label>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <UserIcon className="w-4 h-4 text-white/70" />
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/40"
                placeholder="Alex Morgan"
              />
            </div>
          </div>
        )}

        <div>
          <label className="text-xs text-white/80 mb-1 block">Email</label>
          <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Mail className="w-4 h-4 text-white/70" />
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/40"
              placeholder="you@college.edu"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-white/80 mb-1 block">Password</label>
          <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
            <Lock className="w-4 h-4 text-white/70" />
            <input
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/40"
              placeholder="••••••••"
            />
          </div>
        </div>

        {isSignUp && (
          <div>
            <label className="text-xs text-white/80 mb-1 block">College / Institution</label>
            <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl border border-white/10">
              <Building className="w-4 h-4 text-white/70" />
              <input
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                type="text"
                className="w-full bg-transparent outline-none text-white text-sm placeholder:text-white/40"
                placeholder="e.g. Stanford / PDPU"
              />
            </div>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold shadow-lg hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : isSignUp ? `Register as ${roleLabel}` : 'Sign In'}
          </button>
        </div>
      </form>
    </div>
  )
}
