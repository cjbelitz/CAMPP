import { useNavigate } from 'react-router-dom'
import { useKids } from '../context/KidsContext'
import { useSaved } from '../context/SavedCampsContext'
import { useAuth } from '../context/AuthContext'
import { useCamps } from '../lib/useCamps'

function daysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

function suggestCamps(kid, allCamps) {
  if (!allCamps.length) return []
  const age = kid.age
  const eligible = age != null
    ? allCamps.filter(c => c.ageMin <= age && c.ageMax >= age)
    : allCamps
  const pool = eligible.length ? eligible : allCamps

  const interests = kid.interests ?? []
  const scored = pool.map(c => ({ ...c, _score: interests.includes(c.category) ? 2 : 1 }))
  scored.sort((a, b) => b._score - a._score)

  const result = []
  const catCount = {}
  for (const camp of scored) {
    if (result.length >= 8) break
    const n = catCount[camp.category] ?? 0
    if (n < 2) { result.push(camp); catCount[camp.category] = n + 1 }
  }
  if (result.length < 5) {
    for (const camp of scored) {
      if (result.length >= 8) break
      if (!result.some(c => c.id === camp.id)) result.push(camp)
    }
  }
  return result
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { kids } = useKids()
  const { savedEntries, isSaved, toggle } = useSaved()
  const { camps } = useCamps()

  const firstName = user?.name?.split(' ')[0] ?? ''

  const upcomingDeadlines = savedEntries
    .map(entry => camps.find(c => c.id === entry.id))
    .filter(Boolean)
    .filter(c => {
      const days = daysUntil(c.registrationDeadline)
      return days !== null && days >= 0 && days <= 30
    })
    .sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline))

  return (
    <div className="min-h-screen bg-capp-bg pb-nav">

      {/* Header */}
      <div className="px-5 pt-12 pb-5 bg-white border-b border-capp-dark/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CAMPP" className="w-9 h-9 object-contain" />
            <span className="font-garet font-black text-capp-dark text-xl uppercase tracking-wide">CAMPP</span>
          </div>
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 rounded-xl bg-capp-dark/5 flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
        {firstName && (
          <h1 className="font-garet font-black text-capp-dark text-2xl mt-3">
            Hello, {firstName}!
          </h1>
        )}
      </div>

      <div className="pt-6 flex flex-col gap-8 pb-6">

        {kids.length === 0 ? (
          /* ── No kids empty state ── */
          <div className="px-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-14 h-14 rounded-2xl bg-capp-blue/10 flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#155fcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="22" y1="11" x2="16" y2="11"/>
                </svg>
              </div>
              <h2 className="font-garet font-black text-capp-dark text-lg uppercase mb-2">Add your first kid</h2>
              <p className="font-garet text-sm text-capp-dark/55 leading-relaxed mb-5">
                Get personalized camp picks matched to their age and interests.
              </p>
              <button
                onClick={() => navigate('/add-kid')}
                className="bg-capp-blue text-white font-garet font-bold px-8 py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                Add a kid
              </button>
            </div>
          </div>
        ) : (
          /* ── Per-kid swimlanes ── */
          <>
            {kids.map(kid => {
              const suggestions = suggestCamps(kid, camps)
              return (
                <section key={kid.id}>
                  {/* Kid column header */}
                  <div className="px-5 mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: kid.avatarColor }} />
                      <h2
                        className="font-garet font-black text-lg uppercase"
                        style={{ color: kid.avatarColor }}
                      >
                        {kid.name}
                      </h2>
                      {kid.age != null && (
                        <span className="font-garet text-xs text-capp-dark/40 font-normal">· Age {kid.age}</span>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/camps?kid=${kid.id}`)}
                      className="font-garet text-xs font-bold text-capp-blue"
                    >
                      See all
                    </button>
                  </div>

                  {/* Horizontal scroll row */}
                  <div
                    className="flex gap-3 overflow-x-auto pb-2"
                    style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', scrollbarWidth: 'none' }}
                  >
                    {suggestions.map(camp => (
                      <button
                        key={camp.id}
                        onClick={() => navigate(`/camps/${camp.id}`)}
                        className="bg-white rounded-2xl shadow-sm flex-shrink-0 w-44 text-left active:scale-[0.97] transition-transform overflow-hidden"
                        style={{ borderLeft: `4px solid ${kid.avatarColor}` }}
                      >
                        <div className="p-3 flex flex-col h-full">
                          <p className="font-garet font-bold text-capp-dark text-sm leading-tight line-clamp-2 mb-1.5">
                            {camp.name}
                          </p>
                          <p className="font-garet text-xs text-capp-dark/45">{camp.city}</p>
                          <p className="font-garet text-xs text-capp-dark/35 mt-0.5">Ages {camp.ageMin}–{camp.ageMax}</p>
                          <div className="flex items-center justify-between mt-2.5">
                            <span className="font-garet text-xs font-bold text-capp-dark/65 truncate pr-1">
                              {camp.costDisplay}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); toggle(camp.id) }}
                              className="shrink-0 active:scale-95 transition-transform"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill={isSaved(camp.id) ? kid.avatarColor : 'none'}
                                stroke={kid.avatarColor}
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </button>
                    ))}

                    {/* See all card */}
                    <button
                      onClick={() => navigate(`/camps?kid=${kid.id}`)}
                      className="bg-white/60 border-2 border-dashed border-capp-dark/10 rounded-2xl flex-shrink-0 w-28 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-transform"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                      <span className="font-garet text-xs font-bold text-capp-dark/30 text-center leading-tight">
                        See all
                      </span>
                    </button>
                  </div>
                </section>
              )
            })}

            {/* Add another kid */}
            <div className="px-4">
              <button
                onClick={() => navigate('/add-kid')}
                className="w-full py-3.5 rounded-2xl border-2 border-dashed border-capp-dark/15 font-garet text-sm font-bold text-capp-dark/35 active:scale-95 transition-transform"
              >
                + Add another kid
              </button>
            </div>
          </>
        )}

        {/* ── Upcoming Deadlines ── */}
        {upcomingDeadlines.length > 0 && (
          <section className="px-4">
            <h2 className="font-garet font-black text-capp-dark text-xl uppercase mb-3">Upcoming Deadlines</h2>
            <div className="flex flex-col gap-2">
              {upcomingDeadlines.map(camp => {
                const days = daysUntil(camp.registrationDeadline)
                const urgent = days !== null && days <= 7
                return (
                  <button
                    key={camp.id}
                    onClick={() => navigate(`/camps/${camp.id}`)}
                    className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm active:scale-[0.98] transition-transform text-left w-full"
                    style={{ borderLeft: `4px solid ${urgent ? '#f20815' : '#ffd21f'}` }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-garet text-sm font-bold text-capp-dark truncate">{camp.name}</p>
                      <p className="font-garet text-xs mt-0.5" style={{ color: urgent ? '#f20815' : '#b45309' }}>
                        {days === 0 ? 'Deadline today!' : `${days} day${days !== 1 ? 's' : ''} to register`}
                      </p>
                    </div>
                    <span className="text-capp-dark/30 text-sm shrink-0">›</span>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ── Browse all shortcut ── */}
        <div className="px-4">
          <button
            onClick={() => navigate('/camps')}
            className="w-full py-4 rounded-2xl bg-capp-blue text-white font-garet font-bold text-sm active:scale-95 transition-transform shadow-sm"
          >
            Browse All Camps
          </button>
        </div>

      </div>
    </div>
  )
}
