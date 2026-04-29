import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext(null)

// Build a user object directly from the Supabase session — no network call needed.
function userFromSession(session) {
  const u = session.user
  return {
    id:        u.id,
    email:     u.email,
    name:      u.user_metadata?.name ?? u.email.split('@')[0],
    onboarded: u.user_metadata?.onboarded ?? false,
    isAdmin:   false,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Enrich the user object with profile-table data in the background.
  // The UI is already unblocked by the time this runs.
  async function enrichFromProfile(userId) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, email, is_admin')
        .eq('id', userId)
        .single()
      if (profile) {
        setUser(prev => prev ? {
          ...prev,
          email:   profile.email   ?? prev.email,
          name:    profile.name    ?? prev.name,
          isAdmin: profile.is_admin ?? false,
        } : prev)
      }
    } catch {
      // profile unavailable — session data is sufficient
    }
  }

  useEffect(() => {
    let mounted = true

    function handleSession(session) {
      if (!mounted) return
      if (session) {
        const u = userFromSession(session)
        setUser(u)
        setLoading(false)
        enrichFromProfile(u.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    }

    // 1. Try getSession first — it reads from localStorage synchronously
    //    and resolves in the same microtask queue tick.
    supabase.auth.getSession()
      .then(({ data }) => handleSession(data?.session ?? null))
      .catch(() => { if (mounted) setLoading(false) })

    // 2. Subscribe to future auth changes (sign-in, sign-out, token refresh).
    let subscription
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        handleSession(session)
      })
      subscription = data?.subscription
    } catch {
      // listener setup failed — getSession above handles initial state
    }

    // 3. Hard safety net: if nothing has resolved after 5 s, unblock anyway.
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000)

    return () => {
      mounted = false
      clearTimeout(timeout)
      subscription?.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function signUp(name, email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, onboarded: false },
        emailRedirectTo: 'https://campp-app.vercel.app',
      },
    })
    if (error) throw error
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      console.error('[Auth] signIn error:', error.message, error)
      throw error
    }
    if (data?.session) {
      const u = userFromSession(data.session)
      setUser(u)
      setLoading(false)
      enrichFromProfile(u.id)
    } else {
      console.error('[Auth] signIn returned no session:', data)
      throw new Error('Sign-in completed but no session was returned. Please try again.')
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function completeOnboarding() {
    await supabase.auth.updateUser({ data: { onboarded: true } })
    setUser(prev => prev ? { ...prev, onboarded: true } : prev)
  }

  async function updateProfile(name, email, phone, zipCode) {
    const updates = { name, email }
    if (phone   !== undefined) updates.phone    = phone
    if (zipCode !== undefined) updates.zip_code = zipCode
    await supabase.from('profiles').update(updates).eq('id', user.id)
    setUser(prev => prev ? { ...prev, name, email } : prev)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fdedd4' }}>
        <img src="/logo.png" alt="CAMPP" className="w-24 h-24 object-contain animate-pulse" />
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, signUp, signIn, signOut, updateProfile, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
