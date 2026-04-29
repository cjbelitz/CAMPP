import { useNavigate, useParams } from 'react-router-dom'
import { useCamp } from '../lib/useCamps'
import { useSaved } from '../context/SavedCampsContext'
import { useKids } from '../context/KidsContext'
import KidAvatar from '../components/KidAvatar'

const CATEGORY_PHOTOS = {
  Sports:           'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
  Art:              'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
  STEM:             'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80',
  'Multi-activity': 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80',
  Nature:           'https://images.unsplash.com/photo-1534880606858-c3b6b265a36b?w=800&q=80',
  Music:            'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
  Dance:            'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  Academic:         'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=800&q=80',
  Surf:             'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80',
  Swimming:         'https://images.unsplash.com/photo-1560090995-01632a28895b?w=800&q=80',
}

function fmt(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function CampDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { camp, loading } = useCamp(id)
  const { isSaved, toggle, savedEntries, getStatus, cycleStatus } = useSaved()
  const { kids } = useKids()

  if (loading) {
    return (
      <div className="min-h-screen bg-capp-bg flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-capp-blue/10 animate-pulse" />
      </div>
    )
  }

  if (!camp) {
    return (
      <div className="min-h-screen bg-capp-bg flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-3xl bg-capp-dark/5 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
        <h2 className="font-garet font-black text-capp-dark text-2xl uppercase">Camp not found</h2>
        <button
          onClick={() => navigate('/camps')}
          className="bg-capp-blue text-white font-garet font-bold px-6 py-3 rounded-2xl"
        >
          Back to Browse
        </button>
      </div>
    )
  }

  const saved = isSaved(camp.id)
  const savedEntry = savedEntries.find(e => e.id === camp.id)
  const regDeadlineDays = daysUntil(camp.registrationDeadline)
  const deadlineUrgent = regDeadlineDays !== null && regDeadlineDays >= 0 && regDeadlineDays <= 14
  const photo = CATEGORY_PHOTOS[camp.category]

  return (
    <div className="min-h-screen bg-capp-bg pb-32">

      {/* Hero */}
      <div className="relative" style={{ backgroundColor: camp.accent }}>
        {/* Hero photo */}
        {photo && (
          <div className="absolute inset-0 overflow-hidden">
            <img src={photo} alt={camp.category} className="w-full h-full object-cover opacity-30" />
          </div>
        )}

        <div className="relative flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            onClick={() => navigator.share?.({ title: camp.name, url: window.location.href })}
            className="w-9 h-9 rounded-xl bg-white/25 flex items-center justify-center active:scale-95 transition-transform"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>

        <div className="relative px-5 pb-8 flex flex-col items-center text-center">
          <span className="font-garet text-xs font-bold text-white/80 uppercase tracking-wider mb-2 bg-white/15 px-3 py-1 rounded-full">
            {camp.category}
          </span>
          <h1 className="font-garet font-black text-white text-2xl leading-tight mb-1 uppercase">
            {camp.name}
          </h1>
          {camp.organization && (
            <p className="font-garet text-sm text-white/75 mb-2">{camp.organization}</p>
          )}
          {camp.city && (
            <div className="flex items-center gap-1.5 text-white/80">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span className="font-garet text-sm">{camp.locationName || camp.city}</span>
            </div>
          )}
        </div>
        <div className="h-6 bg-capp-bg rounded-t-[2rem]" />
      </div>

      {/* Quick stats */}
      <div className="mx-4 -mt-1 bg-white rounded-2xl shadow-sm px-4 py-4 flex justify-around divide-x divide-capp-dark/10">
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <div className="w-7 h-7 rounded-full bg-capp-purple/10 flex items-center justify-center mb-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#826dee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <span className="font-garet text-xs font-bold text-capp-dark">Ages {camp.ageMin}–{camp.ageMax}</span>
          <span className="font-garet text-[10px] text-capp-dark/40">Age range</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <div className="w-7 h-7 rounded-full bg-capp-green/10 flex items-center justify-center mb-0.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#11a253" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <span className="font-garet text-xs font-bold text-capp-dark text-center leading-tight">{camp.costDisplay}</span>
          <span className="font-garet text-[10px] text-capp-dark/40">Cost</span>
        </div>
        {(camp.startDate || camp.endDate) && (
          <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
            <div className="w-7 h-7 rounded-full bg-capp-blue/10 flex items-center justify-center mb-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#155fcc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span className="font-garet text-xs font-bold text-capp-dark text-center leading-tight">
              {camp.startDate ? fmt(camp.startDate) : ''}
            </span>
            <span className="font-garet text-[10px] text-capp-dark/40">Starts</span>
          </div>
        )}
      </div>

      <div className="px-4 mt-5 flex flex-col gap-5">

        {/* Registration deadline warning */}
        {deadlineUrgent && (
          <div
            className="flex items-center gap-3 rounded-2xl px-4 py-3.5"
            style={{ backgroundColor: regDeadlineDays <= 7 ? '#fff0f0' : '#fffbeb', borderLeft: `4px solid ${regDeadlineDays <= 7 ? '#f20815' : '#ffd21f'}` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={regDeadlineDays <= 7 ? '#f20815' : '#b45309'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <div>
              <p className="font-garet text-sm font-black" style={{ color: regDeadlineDays <= 7 ? '#f20815' : '#b45309' }}>
                {regDeadlineDays === 0 ? 'Registration deadline today!' : `${regDeadlineDays} day${regDeadlineDays !== 1 ? 's' : ''} left to register`}
              </p>
              <p className="font-garet text-xs text-capp-dark/50">Deadline: {fmt(camp.registrationDeadline)}</p>
            </div>
          </div>
        )}

        {/* About */}
        {camp.description && (
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-garet font-black text-capp-dark text-lg mb-2 uppercase">About this camp</h2>
            <p className="font-garet text-sm text-capp-dark/70 leading-relaxed">{camp.description}</p>
          </section>
        )}

        {/* Dates */}
        {(camp.startDate || camp.endDate) && (
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-garet font-black text-capp-dark text-lg mb-3 uppercase">Dates</h2>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-capp-bg rounded-xl px-4 py-3 text-center">
                <p className="font-garet text-[10px] text-capp-dark/40 uppercase tracking-wide mb-0.5">Starts</p>
                <p className="font-garet text-sm font-bold text-capp-dark">{camp.startDate ? fmt(camp.startDate) : '—'}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              <div className="flex-1 bg-capp-bg rounded-xl px-4 py-3 text-center">
                <p className="font-garet text-[10px] text-capp-dark/40 uppercase tracking-wide mb-0.5">Ends</p>
                <p className="font-garet text-sm font-bold text-capp-dark">{camp.endDate ? fmt(camp.endDate) : '—'}</p>
              </div>
            </div>
          </section>
        )}

        {/* What's included */}
        {camp.tags.length > 0 && (
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-garet font-black text-capp-dark text-lg mb-3 uppercase">What's included</h2>
            <ul className="flex flex-col gap-2.5">
              {camp.tags.map(tag => (
                <li key={tag} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#11a25315' }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#11a253" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span className="font-garet text-sm text-capp-dark/80">{tag}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notes */}
        {camp.notes && (
          <section className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-garet font-black text-capp-dark text-lg mb-2 uppercase">Notes</h2>
            <p className="font-garet text-sm text-capp-dark/65 leading-relaxed">{camp.notes}</p>
          </section>
        )}

        {/* My Circle */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-garet font-black text-capp-dark text-lg mb-2 uppercase">From My Circle</h2>
          <p className="font-garet text-sm text-capp-dark/40">
            No one from your circle has saved this camp yet.
          </p>
        </section>

      </div>

      {/* Sticky bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white/97 backdrop-blur-sm border-t border-capp-dark/8 px-4 py-3"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}
      >
        <div className="max-w-[430px] mx-auto flex flex-col gap-2.5">

          {/* Who's going */}
          {kids.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="font-garet text-xs text-capp-dark/40 shrink-0">Who's going?</span>
              <div className="flex gap-2">
                {kids.map(kid => (
                  <button key={kid.id} className="flex flex-col items-center gap-0.5 active:scale-95 transition-transform">
                    <KidAvatar kid={kid} size={36} rounded="full" />
                    <span className="font-garet text-[9px] text-capp-dark/50">{kid.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => toggle(camp.id)}
              className={`flex-1 py-3.5 rounded-2xl font-garet font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
                saved ? 'bg-capp-dark/8 text-capp-dark' : 'bg-capp-blue text-white'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? '#1a1a1a' : 'white'} stroke={saved ? '#1a1a1a' : 'white'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={saved ? 0.6 : 1}>
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {saved ? 'Saved to My Summer' : 'Save to My Summer'}
            </button>

            {camp.registrationUrl && (
              <a
                href={camp.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-4 py-3.5 rounded-2xl font-garet font-bold text-sm bg-white border-2 border-capp-blue/30 text-capp-blue whitespace-nowrap active:scale-95 transition-all shrink-0"
              >
                Register
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
