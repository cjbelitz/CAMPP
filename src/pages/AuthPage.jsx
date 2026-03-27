import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const CAMP_TILES = [
  { icon: '🎨', bg: '#FFF952', label: 'Arts' },
  { icon: '🔬', bg: '#44DD9E', label: 'STEM' },
  { icon: '⚽', bg: '#FF6B6B', label: 'Sports' },
  { icon: '🏄', bg: '#118AB2', label: 'Surf' },
  { icon: '🎵', bg: '#A78BFA', label: 'Music' },
  { icon: '🏕️', bg: '#34D399', label: 'Outdoors' },
]

export default function AuthPage() {
  const { signUp, signIn } = useAuth()
  const [mode, setMode] = useState('signup') // 'signup' | 'signin'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (mode === 'signup' && !name.trim()) e.name = 'Enter your name'
    if (!email.trim() || !email.includes('@')) e.email = 'Enter a valid email'
    if (!password || password.length < 6) e.password = 'At least 6 characters'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setLoading(true)
    // Simulate a brief network moment
    await new Promise((r) => setTimeout(r, 600))
    if (mode === 'signup') {
      signUp(name, email)
    } else {
      signIn(email)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-capp-coral overflow-hidden">

      {/* ── Hero ── */}
      <div className="flex-1 flex flex-col items-center justify-end px-6 pb-8 pt-16">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-capp-dark/10 flex items-center justify-center shadow-lg">
            <span className="font-[League_Spartan] text-capp-dark text-2xl font-bold leading-none">C</span>
          </div>
          <span className="font-[League_Spartan] font-bold text-capp-dark text-4xl tracking-tight">CAMPP</span>
        </div>

        {/* Tagline */}
        <h1 className="font-[League_Spartan] font-bold text-capp-dark text-3xl text-center leading-tight mb-3 uppercase">
          Summer,<br />sorted. ☀️
        </h1>
        <p className="font-[Montserrat] text-capp-dark/65 text-base text-center leading-relaxed max-w-xs">
          Find, save, and plan your kids' whole summer — all in one place.
        </p>

        {/* Camp type tiles */}
        <div className="flex gap-3 mt-8">
          {CAMP_TILES.map((t) => (
            <div
              key={t.label}
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md"
              style={{ backgroundColor: t.bg }}
            >
              {t.icon}
            </div>
          ))}
        </div>
      </div>

      {/* ── Form card ── */}
      <div className="bg-capp-warm-bg rounded-t-[2.5rem] px-6 pt-7 pb-10" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2.5rem)' }}>

        {/* Mode tabs */}
        <div className="flex bg-white rounded-2xl p-1 mb-7 shadow-sm">
          <button
            onClick={() => { setMode('signup'); setErrors({}) }}
            className={`flex-1 py-2.5 rounded-xl font-[Montserrat] text-sm font-semibold transition-all ${
              mode === 'signup' ? 'bg-capp-coral text-capp-dark shadow-sm' : 'text-capp-dark/40'
            }`}
          >
            Create account
          </button>
          <button
            onClick={() => { setMode('signin'); setErrors({}) }}
            className={`flex-1 py-2.5 rounded-xl font-[Montserrat] text-sm font-semibold transition-all ${
              mode === 'signin' ? 'bg-capp-coral text-capp-dark shadow-sm' : 'text-capp-dark/40'
            }`}
          >
            Sign in
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Name (signup only) */}
          {mode === 'signup' && (
            <div>
              <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah"
                autoComplete="given-name"
                className={`w-full font-[Montserrat] text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                  errors.name ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/60'
                }`}
              />
              {errors.name && <p className="font-[Montserrat] text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
              className={`w-full font-[Montserrat] text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                errors.email ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/60'
              }`}
            />
            {errors.email && <p className="font-[Montserrat] text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                className={`w-full font-[Montserrat] text-base bg-white border-2 rounded-2xl px-4 py-3.5 pr-12 focus:outline-none transition-colors ${
                  errors.password ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/60'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-capp-dark/30 text-sm font-[Montserrat] font-medium active:opacity-60"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="font-[Montserrat] text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-capp-coral text-capp-dark font-[Montserrat] font-semibold text-base py-4 rounded-2xl shadow-md mt-1 active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading
              ? '...'
              : mode === 'signup'
                ? 'Create my account →'
                : 'Sign in →'}
          </button>
        </form>

        {/* Fine print */}
        <p className="font-[Montserrat] text-xs text-capp-dark/30 text-center mt-5 leading-relaxed">
          {mode === 'signup'
            ? 'By creating an account you agree to our Terms of Service and Privacy Policy.'
            : 'Forgot your password? Contact support@capp.app'}
        </p>
      </div>
    </div>
  )
}
