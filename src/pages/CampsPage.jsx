import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useCamps } from '../lib/useCamps'
import { useKids } from '../context/KidsContext'
import { useSaved } from '../context/SavedCampsContext'

const CATEGORY_PHOTOS = {
  Sports:           'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=400&q=80',
  Art:              'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80',
  STEM:             'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&q=80',
  Outdoors:         'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80',
  Surf:             'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80',
  Music:            'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80',
  Nature:           'https://images.unsplash.com/photo-1534880606858-c3b6b265a36b?w=400&q=80',
  Dance:            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
  Swimming:         'https://images.unsplash.com/photo-1560090995-01632a28895b?w=400&q=80',
  'Multi-activity': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80',
  Academic:         'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
  Leadership:       'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&q=80',
}

const CATEGORY_DISPLAY = { Art: 'Arts' }

const AGE_RANGES = [
  { label: '4–6',   min: 4,  max: 6  },
  { label: '7–9',   min: 7,  max: 9  },
  { label: '10–12', min: 10, max: 12 },
  { label: '13–18', min: 13, max: 18 },
]

const CITIES = [
  'San Marcos', 'Carlsbad', 'Encinitas', 'Oceanside',
  'Escondido', 'La Jolla', 'Solana Beach', 'Del Mar',
  'Vista', 'Rancho Santa Fe',
]

function CampRow({ camp }) {
  const navigate = useNavigate()
  const { isSaved, savedEntries, saveWithSession, toggle } = useSaved()
  const { kids } = useKids()
  const [showPicker, setShowPicker] = useState(false)

  const saved = isSaved(camp.id)
  const savedEntry = savedEntries.find(e => e.id === camp.id)
  const savedKid = savedEntry?.kidId ? (kids.find(k => k.id === savedEntry.kidId) ?? null) : null
  const heartColor = savedKid?.avatarColor ?? (saved ? '#155fcc' : '#1a1a1a')

  function handleHeart(e) {
    e.stopPropagation()
    if (saved) { toggle(camp.id); return }
    kids.length > 0 ? setShowPicker(true) : toggle(camp.id)
  }

  const subtitle = [camp.city, `Ages ${camp.ageMin}–${camp.ageMax}`, camp.costDisplay].filter(Boolean).join(' · ')

  return (
    <>
      <div
        onClick={() => navigate(`/camps/${camp.id}`)}
        className="flex items-center gap-3 px-4 py-3.5 cursor-pointer active:bg-capp-dark/5 transition-colors"
      >
        <div className="flex-1 min-w-0">
          {savedKid && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: savedKid.avatarColor }} />
              <span className="font-garet text-[10px] font-semibold" style={{ color: savedKid.avatarColor }}>
                {savedKid.name}
              </span>
            </div>
          )}
          <p className="font-garet font-black text-capp-dark text-sm leading-tight uppercase truncate">{camp.name}</p>
          <p className="font-garet text-xs text-capp-dark/45 mt-0.5 truncate">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={handleHeart}
          className="shrink-0 p-1 active:scale-90 transition-transform"
          aria-label={saved ? 'Unsave' : 'Save camp'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"
            fill={saved ? heartColor : 'none'}
            stroke={heartColor}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            opacity={saved ? 1 : 0.3}>
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowPicker(false)}
        >
          <div
            className="w-full bg-white rounded-t-3xl shadow-2xl px-5 pt-5"
            style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />
            <h2 className="font-garet font-black text-capp-dark text-xl uppercase mb-1">Save for who?</h2>
            <p className="font-garet text-sm text-capp-dark/50 mb-5 truncate">{camp.name}</p>
            <div className="flex flex-col gap-2 mb-3">
              {kids.map(kid => (
                <button key={kid.id} type="button"
                  onClick={() => { saveWithSession(camp.id, null, kid.id); setShowPicker(false) }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-capp-dark/10 active:scale-95 transition-transform text-left">
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: kid.avatarColor }} />
                  <div>
                    <p className="font-garet font-bold text-capp-dark text-sm">{kid.name}</p>
                    {kid.age != null && <p className="font-garet text-xs text-capp-dark/40">Age {kid.age}</p>}
                  </div>
                </button>
              ))}
            </div>
            <button type="button"
              onClick={() => { toggle(camp.id); setShowPicker(false) }}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-capp-dark/15 font-garet text-sm font-bold text-capp-dark/35 active:scale-95 transition-transform">
              Save without assigning
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default function CampsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { camps, loading } = useCamps()
  const { kids } = useKids()

  const kidId = searchParams.get('kid')
  const selectedKid = kidId ? kids.find(k => k.id === kidId) : null
  const initCategory = searchParams.get('category') || null

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [openFilter, setOpenFilter] = useState(initCategory ? 'category' : null)
  const [activeCategory, setActiveCategory] = useState(initCategory)
  const [activeAge, setActiveAge] = useState(null)
  const [activeCity, setActiveCity] = useState(null)

  function toggleSection(key) {
    setOpenFilter(prev => prev === key ? null : key)
  }

  function clearAll() {
    setActiveCategory(null)
    setActiveAge(null)
    setActiveCity(null)
    setSearch('')
    setOpenFilter(null)
  }

  const hasActiveFilter = !!(activeCategory || activeAge || activeCity || search)

  const filtered = useMemo(() => {
    return camps.filter(c => {
      if (selectedKid?.age != null && (c.ageMin > selectedKid.age || c.ageMax < selectedKid.age)) return false
      if (search && ![c.name, c.city, c.category, c.organization].some(s => s?.toLowerCase().includes(search.toLowerCase()))) return false
      if (activeCategory && c.category !== activeCategory) return false
      if (activeAge && (c.ageMax < activeAge.min || c.ageMin > activeAge.max)) return false
      if (activeCity && c.city !== activeCity) return false
      return true
    })
  }, [camps, search, activeCategory, activeAge, activeCity, selectedKid])

  const filterParts = [
    activeCategory ? (CATEGORY_DISPLAY[activeCategory] ?? activeCategory) : null,
    activeAge ? `Ages ${activeAge.label}` : null,
    activeCity ?? null,
    search ? `"${search}"` : null,
  ].filter(Boolean)
  const filterLabel = filterParts.join(' · ')

  const BROWSE_OPTIONS = [
    {
      key: 'category',
      label: 'By Category',
      sub: 'Sports, Arts, STEM…',
      hasActive: !!activeCategory,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1.5"/>
        </svg>
      ),
    },
    {
      key: 'age',
      label: 'By Age',
      sub: 'Find the right fit',
      hasActive: !!activeAge,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      ),
    },
    {
      key: 'city',
      label: 'By City',
      sub: 'Camps near you',
      hasActive: !!activeCity,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-capp-bg pb-nav">

      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-40 bg-capp-bg/97 backdrop-blur-sm">

        {/* Search bar */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div className="relative flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search camps, activities, locations..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full font-garet text-sm bg-white border border-capp-dark/10 rounded-2xl pl-10 pr-10 py-3 shadow-sm placeholder:text-capp-dark/30 focus:outline-none focus:border-capp-blue/40 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-capp-dark/30 active:opacity-60">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Kid filter banner */}
        {selectedKid && (
          <div
            className="flex items-center justify-between px-4 py-2 border-t"
            style={{ backgroundColor: `${selectedKid.avatarColor}15`, borderColor: `${selectedKid.avatarColor}30` }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedKid.avatarColor }} />
              <p className="font-garet text-xs font-bold text-capp-dark/70">
                Camps for <span className="text-capp-dark">{selectedKid.name}</span>
                {selectedKid.age != null ? ` · Age ${selectedKid.age}` : ''}
              </p>
            </div>
            <button onClick={() => navigate('/camps')} className="font-garet text-xs font-bold text-capp-blue">
              Show all
            </button>
          </div>
        )}
      </div>

      <div className="px-4 pt-4">

        {/* ── Browse By cards ── */}
        <div className="grid grid-cols-3 gap-2.5 mb-3">
          {BROWSE_OPTIONS.map(({ key, label, sub, icon, hasActive }) => {
            const isOpen = openFilter === key
            return (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className="flex flex-col items-center text-center p-3 rounded-2xl border-2 active:scale-95 transition-all"
                style={{
                  backgroundColor: isOpen ? '#155fcc' : '#fdedd4',
                  borderColor: '#155fcc',
                }}
              >
                <span className={isOpen ? 'text-white' : 'text-capp-blue'}>{icon}</span>
                <p className={`font-garet font-black text-[11px] uppercase leading-tight mt-2 ${isOpen ? 'text-white' : 'text-capp-dark'}`}>
                  {label}
                </p>
                <p className={`font-garet text-[9px] leading-tight mt-0.5 ${isOpen ? 'text-white/70' : 'text-capp-dark/45'}`}>
                  {sub}
                </p>
                {hasActive && !isOpen && (
                  <div className="w-1.5 h-1.5 rounded-full bg-capp-blue mt-1.5" />
                )}
              </button>
            )
          })}
        </div>

        {/* ── Category photo grid ── */}
        {openFilter === 'category' && (
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            {Object.keys(CATEGORY_PHOTOS).map(cat => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(isActive ? null : cat)}
                  className="relative h-24 rounded-2xl overflow-hidden active:scale-[0.97] transition-transform"
                  style={{
                    outline: isActive ? '3px solid #155fcc' : '3px solid transparent',
                    outlineOffset: '2px',
                  }}
                >
                  <img src={CATEGORY_PHOTOS[cat]} alt={cat} className="w-full h-full object-cover" />
                  <div
                    className="absolute inset-0 flex items-end justify-start pb-2 px-2.5"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 65%)' }}
                  >
                    <span className="font-garet text-xs font-black text-white uppercase tracking-wide">
                      {CATEGORY_DISPLAY[cat] ?? cat}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-capp-blue flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Age range buttons ── */}
        {openFilter === 'age' && (
          <div className="flex gap-2.5 mb-3">
            {AGE_RANGES.map(range => {
              const isActive = activeAge?.label === range.label
              return (
                <button
                  key={range.label}
                  onClick={() => setActiveAge(isActive ? null : range)}
                  className="flex-1 py-4 rounded-2xl font-garet font-black text-lg active:scale-95 transition-all"
                  style={{
                    backgroundColor: isActive ? '#155fcc' : 'white',
                    color: isActive ? 'white' : '#1a1a1a',
                    border: `2px solid ${isActive ? '#155fcc' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  {range.label}
                </button>
              )
            })}
          </div>
        )}

        {/* ── City pills ── */}
        {openFilter === 'city' && (
          <div className="flex flex-wrap gap-2 mb-3">
            {CITIES.map(city => {
              const isActive = activeCity === city
              return (
                <button
                  key={city}
                  onClick={() => setActiveCity(isActive ? null : city)}
                  className="font-garet text-sm font-bold px-4 py-2 rounded-full border-2 active:scale-95 transition-all"
                  style={{
                    backgroundColor: isActive ? '#155fcc' : 'transparent',
                    borderColor: '#155fcc',
                    color: isActive ? 'white' : '#155fcc',
                  }}
                >
                  {city}
                </button>
              )
            })}
          </div>
        )}

        {/* ── Active filter indicator ── */}
        {hasActiveFilter && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5 bg-capp-blue/10 border border-capp-blue/20 rounded-full pl-3 pr-2 py-1.5">
              <span className="font-garet text-xs font-bold text-capp-blue">
                {filterLabel} · {filtered.length} camp{filtered.length !== 1 ? 's' : ''}
              </span>
              <button onClick={clearAll} className="text-capp-blue/60 active:opacity-60 ml-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ── Result count (no filter active) ── */}
        {!hasActiveFilter && !loading && (
          <p className="font-garet text-xs text-capp-dark/40 mb-3">
            {camps.length} camp{camps.length !== 1 ? 's' : ''} · North County SD
          </p>
        )}

        {/* ── Camp list ── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-capp-blue/10 animate-pulse flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#155fcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="font-garet text-sm text-capp-dark/40">Loading camps…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center text-center px-8 gap-3">
              <p className="font-garet font-black text-capp-dark text-lg uppercase">No camps found</p>
              <p className="font-garet text-sm text-capp-dark/50">Try a different filter or search.</p>
              <button
                onClick={clearAll}
                className="bg-capp-blue text-white font-garet font-bold text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((camp, i) => (
              <div key={camp.id}>
                <CampRow camp={camp} />
                {i < filtered.length - 1 && <div className="h-px bg-capp-dark/5 mx-4" />}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  )
}
