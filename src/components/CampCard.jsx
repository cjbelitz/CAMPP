import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'
import { useKids } from '../context/KidsContext'

export default function CampCard({ camp }) {
  const navigate = useNavigate()
  const { isSaved, savedEntries, saveWithSession, toggle } = useSaved()
  const { kids } = useKids()
  const [showPicker, setShowPicker] = useState(false)

  const saved = isSaved(camp.id)
  const savedEntry = savedEntries.find(e => e.id === camp.id)
  const savedKid = savedEntry?.kidId ? (kids.find(k => k.id === savedEntry.kidId) ?? null) : null

  function handleHeart(e) {
    e.stopPropagation()
    if (saved) { toggle(camp.id); return }
    if (kids.length > 0) { setShowPicker(true) } else { toggle(camp.id) }
  }

  function handlePickKid(kidId) {
    saveWithSession(camp.id, null, kidId)
    setShowPicker(false)
  }

  const heartColor = savedKid?.avatarColor ?? (saved ? '#155fcc' : '#1a1a1a')

  return (
    <>
      <div
        onClick={() => navigate(`/camps/${camp.id}`)}
        className="bg-white rounded-2xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
      >
        <div className="px-4 py-3.5 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            {savedKid && (
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: savedKid.avatarColor }} />
                <span className="font-garet text-[10px] font-semibold" style={{ color: savedKid.avatarColor }}>
                  {savedKid.name}
                </span>
              </div>
            )}
            <h3 className="font-garet font-black text-capp-dark text-[15px] leading-tight uppercase truncate">
              {camp.name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              {camp.city && (
                <span className="font-garet text-xs text-capp-dark/45">{camp.city}</span>
              )}
              {camp.city && <span className="text-capp-dark/20 text-xs">·</span>}
              <span className="font-garet text-xs text-capp-dark/45">Ages {camp.ageMin}–{camp.ageMax}</span>
              {camp.costDisplay && (
                <>
                  <span className="text-capp-dark/20 text-xs">·</span>
                  <span className="font-garet text-xs text-capp-dark/45">{camp.costDisplay}</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleHeart}
            className="shrink-0 active:scale-90 transition-transform p-1"
            aria-label={saved ? 'Remove from saved' : 'Save camp'}
          >
            <svg
              width="20" height="20" viewBox="0 0 24 24"
              fill={saved ? heartColor : 'none'}
              stroke={heartColor}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              opacity={saved ? 1 : 0.3}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
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
                <button
                  key={kid.id}
                  type="button"
                  onClick={() => handlePickKid(kid.id)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 border-capp-dark/10 active:scale-95 transition-transform text-left"
                >
                  <div className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: kid.avatarColor }} />
                  <div>
                    <p className="font-garet font-bold text-capp-dark text-sm">{kid.name}</p>
                    {kid.age != null && (
                      <p className="font-garet text-xs text-capp-dark/40">Age {kid.age}</p>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => { toggle(camp.id); setShowPicker(false) }}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-capp-dark/15 font-garet text-sm font-bold text-capp-dark/35 active:scale-95 transition-transform"
            >
              Save without assigning
            </button>
          </div>
        </div>
      )}
    </>
  )
}
