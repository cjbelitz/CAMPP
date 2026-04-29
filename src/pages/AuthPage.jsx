import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'

export default function AuthPage() {
  const { signUp, signIn } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [signUpSent, setSignUpSent] = useState(false)
  const [unconfirmed, setUnconfirmed] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

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
    try {
      if (mode === 'signup') {
        await signUp(name.trim(), email.trim().toLowerCase(), password)
        setSignUpSent(true)
      } else {
        await signIn(email.trim().toLowerCase(), password)
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      console.error('[Auth] handleSubmit error:', err?.message, err)
      const msg = (err?.message ?? '').toLowerCase()
      if (msg.includes('not confirmed') || msg.includes('email not confirmed')) {
        setUnconfirmed(true)
      } else if (msg.includes('invalid') || msg.includes('credentials') || msg.includes('wrong') || msg.includes('password')) {
        setErrors({ password: 'Incorrect email or password. Try again.' })
      } else if (msg.includes('already registered') || msg.includes('already exists')) {
        setMode('signin')
        setErrors({ form: 'You already have an account. Sign in below.' })
      } else if (msg) {
        setErrors({ form: err.message })
      } else {
        setErrors({ form: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    setResendLoading(true)
    await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: 'https://campp-app.vercel.app' },
    })
    setResendLoading(false)
    setResendSent(true)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 py-12"
      style={{ backgroundColor: '#fdedd4', paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 3rem)' }}
    >
      {/* Logo */}
      <img
        src="/logo.png"
        alt="CAMPP"
        className="w-28 h-28 object-contain mb-5"
      />

      {/* Headline */}
      <h1 className="font-garet font-black text-capp-dark text-4xl md:text-5xl text-center leading-tight mb-3 uppercase tracking-tight">
        Summer,<br />sorted.
      </h1>

      {/* Tagline */}
      <p className="font-garet text-capp-dark/60 text-base text-center mb-10">
        Discover. Connect. Sort. All in CAMPP.
      </p>

      {/* Form card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl px-6 pt-6 pb-8">

        {/* Sign-up success state */}
        {signUpSent && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-capp-green/15 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#11a253" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h2 className="font-garet font-black text-capp-dark text-lg uppercase mb-1">Check your email</h2>
              <p className="font-garet text-sm text-capp-dark/55 leading-relaxed">
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
              </p>
              <p className="font-garet text-xs text-capp-dark/35 mt-2">Don't see it? Check your spam folder.</p>
            </div>
            {resendSent ? (
              <p className="font-garet text-sm text-capp-green font-bold">Confirmation email resent!</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-3.5 bg-white border-2 border-capp-blue/30 text-capp-blue font-garet font-bold text-sm rounded-2xl active:scale-95 transition-transform disabled:opacity-60"
              >
                {resendLoading ? '...' : 'Resend confirmation email'}
              </button>
            )}
            <button
              onClick={() => { setSignUpSent(false); setMode('signin'); setPassword(''); setResendSent(false) }}
              className="w-full py-4 bg-capp-blue text-white font-garet font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Go to sign in
            </button>
          </div>
        )}

        {/* Email not confirmed state */}
        {unconfirmed && (
          <div className="flex flex-col items-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-capp-yellow/20 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div>
              <h2 className="font-garet font-black text-capp-dark text-lg uppercase mb-1">Confirm your email</h2>
              <p className="font-garet text-sm text-capp-dark/55 leading-relaxed">
                Please confirm <strong>{email}</strong> before signing in. Check your inbox for the link.
              </p>
            </div>
            {resendSent ? (
              <p className="font-garet text-sm text-capp-green font-bold">Confirmation email resent!</p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full py-3.5 bg-capp-blue text-white font-garet font-bold text-sm rounded-2xl shadow-md active:scale-95 transition-transform disabled:opacity-60"
              >
                {resendLoading ? '...' : 'Resend confirmation email'}
              </button>
            )}
            <button
              onClick={() => { setUnconfirmed(false); setResendSent(false) }}
              className="font-garet text-sm text-capp-dark/40 active:opacity-60"
            >
              Back to sign in
            </button>
          </div>
        )}

        {/* Mode tabs + form */}
        {!signUpSent && !unconfirmed && (
          <div className="flex bg-capp-bg rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setMode('signup'); setErrors({}) }}
              className={`flex-1 py-2.5 rounded-xl font-garet text-sm font-bold transition-all ${
                mode === 'signup' ? 'bg-capp-blue text-white shadow-sm' : 'text-capp-dark/40'
              }`}
            >
              Create account
            </button>
            <button
              onClick={() => { setMode('signin'); setErrors({}) }}
              className={`flex-1 py-2.5 rounded-xl font-garet text-sm font-bold transition-all ${
                mode === 'signin' ? 'bg-capp-blue text-white shadow-sm' : 'text-capp-dark/40'
              }`}
            >
              Sign in
            </button>
          </div>
        )}

        {!signUpSent && !unconfirmed && (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {mode === 'signup' && (
              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  autoComplete="given-name"
                  className={`w-full font-garet text-base bg-capp-bg border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                    errors.name ? 'border-capp-red' : 'border-capp-dark/10 focus:border-capp-blue/60'
                  }`}
                />
                {errors.name && <p className="font-garet text-xs text-capp-red mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
                className={`w-full font-garet text-base bg-capp-bg border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                  errors.email ? 'border-capp-red' : 'border-capp-dark/10 focus:border-capp-blue/60'
                }`}
              />
              {errors.email && <p className="font-garet text-xs text-capp-red mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  className={`w-full font-garet text-base bg-capp-bg border-2 rounded-2xl px-4 py-3.5 pr-12 focus:outline-none transition-colors ${
                    errors.password ? 'border-capp-red' : 'border-capp-dark/10 focus:border-capp-blue/60'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-capp-dark/30 text-sm font-garet font-bold active:opacity-60"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.password && <p className="font-garet text-xs text-capp-red mt-1">{errors.password}</p>}
            </div>

            {errors.form && (
              <p className="font-garet text-xs text-capp-red text-center -mt-1">{errors.form}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-capp-blue text-white font-garet font-bold text-base py-4 rounded-2xl shadow-md mt-1 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {loading ? '...' : mode === 'signup' ? 'Create my account' : 'Sign in'}
            </button>
          </form>
        )}

        {!signUpSent && !unconfirmed && (
          <p className="font-garet text-xs text-capp-dark/30 text-center mt-5 leading-relaxed">
            {mode === 'signup'
              ? 'By creating an account you agree to our Terms of Service and Privacy Policy.'
              : 'Forgot your password? Contact support@usecampp.com'}
          </p>
        )}
      </div>
    </div>
  )
}
