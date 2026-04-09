import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { camps, categories, ageGroups, regions } from '../data/camps'
import CampCard from '../components/CampCard'
import SuggestCampModal from '../components/SuggestCampModal'

export default function CampsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [activeAge, setActiveAge] = useState(0) // index into ageGroups
  const [sortBy, setSortBy] = useState('rating') // 'rating' | 'price-asc' | 'price-desc'
  const [activeRegion, setActiveRegion] = useState(regions[0])
  const [suggestOpen, setSuggestOpen] = useState(false)

  const filtered = useMemo(() => {
    const ageGroup = ageGroups[activeAge]
    return camps
      .filter((c) => {
        const matchSearch =
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase())
        const matchCategory = activeCategory === 'All' || c.category === activeCategory
        const matchAge = c.ageMax >= ageGroup.min && c.ageMin <= ageGroup.max
        const campRegion = c.region ?? regions[0]
        const matchRegion = campRegion === activeRegion
        return matchSearch && matchCategory && matchAge && matchRegion
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price
        if (sortBy === 'price-desc') return b.price - a.price
        return b.rating - a.rating
      })
  }, [search, activeCategory, activeAge, sortBy])

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 bg-capp-warm-bg/95 backdrop-blur-sm border-b border-capp-dark/5">
        {/* Nav + search row */}
        <div className="px-4 pt-4 pb-2.5 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            ←
          </button>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-capp-dark/30 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search camps, locations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full font-[Montserrat] text-sm bg-white border border-capp-dark/10 rounded-xl pl-8 pr-8 py-2.5 shadow-sm placeholder:text-capp-dark/30 focus:outline-none focus:border-capp-coral/40"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-capp-dark/30 text-sm"
              >
                ✕
              </button>
            )}
          </div>
          <select
            value={activeRegion}
            onChange={(e) => setActiveRegion(e.target.value)}
            className="font-[Montserrat] text-xs text-capp-dark bg-white border border-capp-dark/10 rounded-xl px-2 py-2.5 shadow-sm shrink-0"
          >
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="font-[Montserrat] text-xs text-capp-dark bg-white border border-capp-dark/10 rounded-xl px-2 py-2.5 shadow-sm shrink-0"
          >
            <option value="rating">⭐ Top</option>
            <option value="price-asc">$ Low</option>
            <option value="price-desc">$ High</option>
          </select>
        </div>

        {/* Category chips */}
        <div className="flex gap-1.5 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 font-[Montserrat] text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                activeCategory === cat
                  ? 'bg-capp-coral text-capp-dark border-capp-coral'
                  : 'bg-white text-capp-dark/60 border-capp-dark/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Age chips */}
        <div className="flex gap-1.5 px-4 pb-2.5 overflow-x-auto scrollbar-hide">
          {ageGroups.map((group, i) => (
            <button
              key={group.label}
              onClick={() => setActiveAge(i)}
              className={`shrink-0 font-[Montserrat] text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeAge === i
                  ? 'bg-capp-dark text-white border-capp-dark'
                  : 'bg-white text-capp-dark/50 border-capp-dark/10'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className="px-4 pt-4">
        <p className="font-[Montserrat] text-xs text-capp-dark/40 mb-4">
          {filtered.length} camp{filtered.length !== 1 ? 's' : ''} found
          {activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
          {ageGroups[activeAge].label !== 'All ages' ? ` · ${ageGroups[activeAge].label}` : ''}
        </p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🏕️</span>
            <h3 className="font-[League_Spartan] font-bold text-capp-dark text-xl mb-2 uppercase">No camps found</h3>
            <p className="font-[Montserrat] text-sm text-capp-dark/50">Try a different search or filter.</p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('All'); setActiveAge(0) }}
              className="mt-5 bg-capp-coral text-capp-dark font-[Montserrat] font-semibold text-sm px-5 py-2.5 rounded-xl"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((camp) => (
              <CampCard key={camp.id} camp={camp} />
            ))}
          </div>
        )}
      </div>

      {/* ── Floating "Suggest a Camp" button ── */}
      <button
        onClick={() => setSuggestOpen(true)}
        className="fixed bottom-24 right-4 z-50 flex items-center gap-2 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-sm px-4 py-3 rounded-full shadow-lg active:scale-95 transition-transform animate-[page-enter_0.4s_ease-out]"
        style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 5.5rem)' }}
      >
        <span className="text-base leading-none">＋</span>
        Suggest a Camp
      </button>

      <SuggestCampModal isOpen={suggestOpen} onClose={() => setSuggestOpen(false)} />
    </div>
  )
}
