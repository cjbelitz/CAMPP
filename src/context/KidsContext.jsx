import { createContext, useContext, useState, useEffect } from 'react'

const KidsContext = createContext(null)

const SAMPLE_KIDS = [
  {
    id: 'sample-olivia',
    name: 'Olivia',
    age: 9,
    avatarColor: '#C45F3F',
    photo: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Olivia9&backgroundColor=C45F3F&backgroundType=solid',
    interests: ['Arts', 'Music'],
    environment: 'indoor',
    stimulation: 'moderate',
    challenge: 'moderate',
    pastCampIds: [3, 6],
    isExample: true,
  },
  {
    id: 'sample-noah',
    name: 'Noah',
    age: 12,
    avatarColor: '#80B0E8',
    photo: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Noah12&backgroundColor=118AB2&backgroundType=solid',
    interests: ['STEM', 'Sports'],
    environment: 'both',
    stimulation: 'high',
    challenge: 'challenging',
    pastCampIds: [2, 9],
    isExample: true,
  },
  {
    id: 'sample-lily',
    name: 'Lily',
    age: 7,
    avatarColor: '#9B5DE5',
    photo: 'https://api.dicebear.com/8.x/adventurer/svg?seed=Lily7&backgroundColor=9B5DE5&backgroundType=solid',
    interests: ['Sports', 'Outdoors'],
    environment: 'outdoor',
    stimulation: 'high',
    challenge: 'easy',
    pastCampIds: [7, 4],
    isExample: true,
  },
]

export function KidsProvider({ children }) {
  const [kids, setKids] = useState(() => {
    try {
      const stored = localStorage.getItem('capp-kids')
      return stored ? JSON.parse(stored) : SAMPLE_KIDS
    } catch {
      return SAMPLE_KIDS
    }
  })

  useEffect(() => {
    localStorage.setItem('capp-kids', JSON.stringify(kids))
  }, [kids])

  const addKid = (kid) => setKids((prev) => [...prev, kid])

  const updateKid = (id, updates) =>
    setKids((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...updates, isExample: false } : k))
    )

  const removeKid = (id) =>
    setKids((prev) => prev.filter((k) => k.id !== id))

  const getKid = (id) => kids.find((k) => k.id === id)

  return (
    <KidsContext.Provider value={{ kids, addKid, updateKid, removeKid, getKid }}>
      {children}
    </KidsContext.Provider>
  )
}

export const useKids = () => useContext(KidsContext)
