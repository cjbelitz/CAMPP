import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'capp-auth'

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadUser())

  const isLoggedIn = !!user

  function signUp(name, email) {
    const newUser = { name: name.trim(), email: email.trim().toLowerCase(), onboarded: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    setUser(newUser)
  }

  function signIn(email) {
    // Demo mode — accept any credentials, restore or create a user record
    const existing = loadUser()
    const u = existing
      ? { ...existing, onboarded: true }
      : { name: email.split('@')[0], email: email.trim().toLowerCase(), onboarded: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
    setUser(u)
  }

  function completeOnboarding() {
    const updated = { ...loadUser(), onboarded: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  function updateProfile(name, email) {
    const updated = { ...loadUser(), name: name.trim(), email: email.trim().toLowerCase() }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  function signOut() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, signUp, signIn, signOut, updateProfile, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
