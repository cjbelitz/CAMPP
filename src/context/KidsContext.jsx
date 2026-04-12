import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useAuth } from './AuthContext'

const KidsContext = createContext(null)

// Map Supabase row → app object
function rowToKid(row) {
  return {
    id:          row.id,
    name:        row.name,
    age:         row.age,
    avatarColor: row.color ?? '#FABE37',
    photo:       row.photo_url ?? `https://api.dicebear.com/8.x/adventurer/svg?seed=${encodeURIComponent(row.name)}${row.age}&backgroundColor=${(row.color ?? '#FABE37').replace('#', '')}&backgroundType=solid`,
    interests:   row.interests ?? [],
    environment: row.environment ?? null,
    stimulation: row.stimulation ?? null,
    challenge:   row.challenge ?? null,
    isExample:   row.is_example ?? false,
    pastCampIds: [],
  }
}

// Map app object → Supabase row
function kidToRow(kid, profileId) {
  return {
    profile_id:  profileId,
    name:        kid.name,
    age:         kid.age ?? null,
    color:       kid.avatarColor ?? '#FABE37',
    photo_url:   kid.photo ?? null,
    interests:   kid.interests ?? [],
    environment: kid.environment ?? null,
    stimulation: kid.stimulation ?? null,
    challenge:   kid.challenge ?? null,
    is_example:  kid.isExample ?? false,
  }
}

export function KidsProvider({ children }) {
  const { user, isLoggedIn } = useAuth()
  const [kids, setKids] = useState([])
  const [loading, setLoading] = useState(true)

  // Load kids from Supabase whenever the logged-in user changes
  useEffect(() => {
    if (!isLoggedIn || !user?.id) {
      setKids([])
      setLoading(false)
      return
    }

    async function fetchKids() {
      setLoading(true)
      const { data, error } = await supabase
        .from('kids')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: true })

      if (!error && data) {
        setKids(data.map(rowToKid))
      }
      setLoading(false)
    }

    fetchKids()
  }, [user?.id, isLoggedIn])

  async function addKid(kid) {
    if (!user?.id) return
    const { data, error } = await supabase
      .from('kids')
      .insert(kidToRow(kid, user.id))
      .select()
      .single()

    if (!error && data) {
      setKids((prev) => [...prev, rowToKid(data)])
    }
  }

  async function updateKid(id, updates) {
    const row = {}
    if (updates.name        !== undefined) row.name        = updates.name
    if (updates.age         !== undefined) row.age         = updates.age
    if (updates.avatarColor !== undefined) row.color       = updates.avatarColor
    if (updates.photo       !== undefined) row.photo_url   = updates.photo
    if (updates.interests   !== undefined) row.interests   = updates.interests
    if (updates.environment !== undefined) row.environment = updates.environment
    if (updates.stimulation !== undefined) row.stimulation = updates.stimulation
    if (updates.challenge   !== undefined) row.challenge   = updates.challenge

    const { data, error } = await supabase
      .from('kids')
      .update(row)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setKids((prev) => prev.map((k) => (k.id === id ? rowToKid(data) : k)))
    }
  }

  async function removeKid(id) {
    await supabase.from('kids').delete().eq('id', id)
    setKids((prev) => prev.filter((k) => k.id !== id))
  }

  const getKid = (id) => kids.find((k) => k.id === id)

  return (
    <KidsContext.Provider value={{ kids, loading, addKid, updateKid, removeKid, getKid }}>
      {children}
    </KidsContext.Provider>
  )
}

export const useKids = () => useContext(KidsContext)
