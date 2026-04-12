import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  // Build our app user object from a Supabase session + profile row
  async function loadUser(session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('name, email, is_admin')
      .eq('id', session.user.id)
      .single()

    setUser({
      id:        session.user.id,
      email:     profile?.email ?? session.user.email,
      name:      profile?.name  ?? session.user.user_metadata?.name ?? session.user.email.split('@')[0],
      onboarded: session.user.user_metadata?.onboarded ?? false,
      isAdmin:   profile?.is_admin ?? false,
    })
    setLoading(false)
  }

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) loadUser(session)
      else setLoading(false)
    })

    // Keep in sync with Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) loadUser(session)
      else { setUser(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(name, email, password) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, onboarded: false } },
    })
    if (error) throw error
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  async function completeOnboarding() {
    await supabase.auth.updateUser({ data: { onboarded: true } })
    setUser((prev) => ({ ...prev, onboarded: true }))
  }

  async function updateProfile(name, email) {
    await supabase.from('profiles').update({ name, email }).eq('id', user.id)
    setUser((prev) => ({ ...prev, name, email }))
  }

  // Show a blank screen while checking session — avoids flash of login page
  if (loading) {
    return (
      <div className="min-h-screen bg-capp-coral flex items-center justify-center">
        <span className="font-[League_Spartan] font-bold text-capp-dark text-3xl tracking-tight">CAMPP</span>
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
