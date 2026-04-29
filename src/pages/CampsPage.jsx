import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCamps, CATEGORY_STYLE } from '../lib/useCamps'
import { useKids } from '../context/KidsContext'
import CampCard from '../components/CampCard'

const AGE_GROUPS = [
  { label: 'All ages', min: 0,  max: 18 },
  { label: '4–6',      min: 4,  max: 6  },
  { label: '7–9',      min: 7,  max: 9  },
  { label: '10–12',    min: 10, max: 12 },
  { label: '13–18',    min: 13, max: 18 },
]

const CATEGORIES = ['All', ...Object.keys(CATEGORY_STYLE)]

export default function CampsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { camps, loading } = useCamps()
  const { kids } = useKids()

  const kidId = searchParams.get('kid')
  const selectedKid = kidId ? kids.find(k => k.id === kidId) : null

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [activeAge, setActiveAge] = useState(0)

  const filtered = useMemo(() => {
    const ageGroup = selectedKid
      ? { min: selectedKid.age ?? 0, max: selectedKid.age ?? 18 }
      : AGE_GROUPS[activeAge]

    return camps.filter(c => {
      const matchSearch =
        !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase()) ||
        c.organization.toLowerCase().includes(search.toLowerCase())
      const matchCategory = activeCategory === 'All' || c.category === activeCategory
      const matchAge = c.ageMax >= ageGroup.min && c.ageMin <= ageGroup.max
      return matchSearch && matchCategory && matchAge
    })
  }, [camps, search, activeCategory, activeAge, selectedKid])

  return (
    <div className="min-h-screen bg-capp-bg pb-nav">

      {/* Sticky header */}
      <div className="sticky top-0 z-50 bg-capp-bg/97 backdrop-blur-sm border-b border-capp-dark/5">

        {/* Search row */}
        <div className="px-4 pt-4 pb-2.5 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="relative flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search camps…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full font-garet text-sm bg-white border border-capp-dark/10 rounded-xl pl-8 pr-8 py-2.5 shadow-sm placeholder:text-capp-dark/30 focus:outline-none focus:border-capp-blue/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-capp-dark/30 text-sm"
              >
                x
              </button>
            )}
          </div>
        </div>

        {/* Kid filter banner */}
        {selectedKid && (
          <div className="flex items-center justify-between bg-capp-blue/10 border-b border-capp-blue/20 px-4 py-2">
            <p className="font-garet text-xs font-bold text-capp-dark/70">
              Camps for <span className="text-capp-dark">{selectedKid.name}</span> · Age {selectedKid.age}
            </p>
            <button
              onClick={() => navigate('/camps')}
              className="font-garet text-xs font-bold text-capp-blue"
            >
              Show all
            </button>
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 font-garet text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-capp-blue text-white border-capp-blue'
                  : 'bg-white text-capp-dark/60 border-capp-dark/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Age chips — hidden when a kid filter is active */}
        {!selectedKid && (
          <div className="flex gap-1.5 px-4 pb-2.5 overflow-x-auto scrollbar-hide">
            {AGE_GROUPS.map((group, i) => (
              <button
                key={group.label}
                onClick={() => setActiveAge(i)}
                className={`shrink-0 font-garet text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                  activeAge === i
                    ? 'bg-capp-dark text-white border-capp-dark'
                    : 'bg-white text-capp-dark/50 border-capp-dark/10'
                }`}
              >
                {group.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="px-4 pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-capp-blue/10 flex items-center justify-center mb-3 animate-pulse">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#155fcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <p className="font-garet text-sm text-capp-dark/40">Loading camps…</p>
          </div>
        ) : (
          <>
            <p className="font-garet text-xs text-capp-dark/40 mb-4">
              {filtered.length} camp{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' ? ` · ${activeCategory}` : ''}
              {selectedKid ? ` for ${selectedKid.name}` : ''}
            </p>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-3xl bg-capp-dark/5 flex items-center justify-center mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </div>
                <h3 className="font-garet font-black text-capp-dark text-xl mb-2 uppercase">No camps found</h3>
                <p className="font-garet text-sm text-capp-dark/50 mb-5">Try a different search or filter.</p>
                <button
                  onClick={() => { setSearch(''); setActiveCategory('All'); setActiveAge(0) }}
                  className="bg-capp-blue text-white font-garet font-bold text-sm px-5 py-2.5 rounded-xl"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map(camp => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
