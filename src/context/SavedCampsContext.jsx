import { createContext, useContext, useState, useEffect } from 'react'

const SavedCampsContext = createContext(null)

const SAMPLE_SAVED = [
  { id: 3, session: 'Jun 23–27', kidId: 'sample-olivia', registered: true },
  { id: 6, session: 'Jul 14–18', kidId: 'sample-olivia', registered: false },
  { id: 2, session: 'Jun 16–20', kidId: 'sample-noah',   registered: true },
  { id: 9, session: 'Jul 7–11',  kidId: 'sample-noah',   registered: false },
  { id: 7, session: 'Jun 16–20', kidId: 'sample-lily',   registered: false },
  { id: 4, session: 'Jul 14–18', kidId: 'sample-lily',   registered: false },
]

function migrate(raw) {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((item) =>
      typeof item === 'number'
        ? { id: item, session: null, kidId: null, registered: false }
        : { id: item.id, session: item.session ?? null, kidId: item.kidId ?? null, registered: item.registered ?? false }
    )
  } catch {
    return []
  }
}

export function SavedCampsProvider({ children }) {
  const [savedEntries, setSavedEntries] = useState(() => {
    const raw = localStorage.getItem('capp-saved')
    const migrated = migrate(raw)
    return migrated ?? SAMPLE_SAVED
  })

  useEffect(() => {
    localStorage.setItem('capp-saved', JSON.stringify(savedEntries))
  }, [savedEntries])

  const savedIds = savedEntries.map((e) => e.id)

  const isSaved = (id) => savedIds.includes(id)

  const getSession = (id) => savedEntries.find((e) => e.id === id)?.session ?? null

  // bookedSessions: all non-null session strings currently in My Summer
  const bookedSessions = savedEntries.map((e) => e.session).filter(Boolean)

  // Simple toggle (no session — from heart button on cards)
  const toggle = (id) =>
    setSavedEntries((prev) =>
      prev.some((e) => e.id === id)
        ? prev.filter((e) => e.id !== id)
        : [...prev, { id, session: null }]
    )

  // Save with a specific session and optional kid assignment
  const saveWithSession = (id, session, kidId = null) =>
    setSavedEntries((prev) => {
      const exists = prev.find((e) => e.id === id)
      if (exists) {
        return prev.map((e) =>
          e.id === id ? { ...e, session, kidId: kidId ?? e.kidId } : e
        )
      }
      return [...prev, { id, session, kidId }]
    })

  const unsave = (id) => setSavedEntries((prev) => prev.filter((e) => e.id !== id))

  const assignKid = (id, kidId) =>
    setSavedEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, kidId } : e))
    )

  const markRegistered = (id, value = true) =>
    setSavedEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, registered: value } : e))
    )

  const isRegistered = (id) => savedEntries.find((e) => e.id === id)?.registered ?? false

  return (
    <SavedCampsContext.Provider
      value={{ savedIds, savedEntries, isSaved, getSession, bookedSessions, toggle, saveWithSession, unsave, assignKid, markRegistered, isRegistered }}
    >
      {children}
    </SavedCampsContext.Provider>
  )
}

export const useSaved = () => useContext(SavedCampsContext)
