import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { camps, reviews, defaultReviews } from '../data/camps'
import { useSaved } from '../context/SavedCampsContext'
import { useKids } from '../context/KidsContext'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewsContext'
import KidAvatar from '../components/KidAvatar'
import { MOCK_MOMS, MOCK_CIRCLE_SIGNUPS } from '../data/mockCircle'
import { daysUntil, deadlineColor, parseSessionStart } from '../utils/formatRelativeTime'
import StatusBadge, { SpotsLeft } from '../components/StatusBadge'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl leading-none transition-transform active:scale-90"
        >
          <span className={star <= (hover || value) ? 'text-capp-yellow' : 'text-capp-dark/15'}>★</span>
        </button>
      ))}
    </div>
  )
}

const whatToBring = [
  'Sunscreen (reapply-friendly)',
  'Reusable water bottle',
  'Snack for morning break',
  'Comfortable closed-toe shoes',
  'Change of clothes',
]

export default function CampDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const camp = camps.find((c) => c.id === Number(id))
  const { isSaved, getSession, saveWithSession, unsave, savedEntries, markRegistered, isRegistered } = useSaved()
  const { kids } = useKids()
  const saved = camp ? isSaved(camp.id) : false
  const persistedSession = camp ? getSession(camp.id) : null
  const persistedKidId = camp ? (savedEntries.find(e => e.id === camp.id)?.kidId ?? null) : null
  const [selectedSession, setSelectedSession] = useState(persistedSession)
  const [selectedKidId, setSelectedKidId] = useState(persistedKidId)
  const { user } = useAuth()
  const { addReview, getUserReview, getUserReviews } = useReviews()
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewBody, setReviewBody] = useState('')
  const [reviewName, setReviewName] = useState(user?.name ?? '')

  const canReview = camp ? kids.some(k => k.pastCampIds?.includes(camp.id)) : false
  const existingReview = (camp && user) ? getUserReview(camp.id, user.email) : null
  const userReviews = camp ? getUserReviews(camp.id) : []

  function handleSubmitReview() {
    if (!reviewRating || !reviewBody.trim()) return
    addReview(camp.id, {
      userEmail: user.email,
      name: reviewName.trim() || user.name || 'Anonymous',
      location: 'North County SD',
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rating: reviewRating,
      body: reviewBody.trim(),
      isUserReview: true,
    })
    setShowReviewForm(false)
    setReviewBody('')
    setReviewRating(0)
  }

  if (!camp) {
    return (
      <div className="min-h-screen bg-capp-warm-bg flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="text-5xl">🏕️</span>
        <h2 className="font-[Fraunces] font-bold text-capp-dark text-2xl">Camp not found</h2>
        <button
          onClick={() => navigate('/camps')}
          className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold px-6 py-3 rounded-2xl"
        >
          Back to Browse
        </button>
      </div>
    )
  }

  const campReviews = reviews[camp.id] || defaultReviews

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-32">

      {/* ── Hero ── */}
      <div className="relative" style={{ backgroundColor: camp.accent }}>
        {/* Back + share row */}
        <div className="flex items-center justify-between px-4 pt-12 pb-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white active:scale-95 transition-transform"
          >
            ←
          </button>
          <button
            onClick={() => { navigator.share?.({ title: camp.name, url: window.location.href }) }}
            className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white text-sm active:scale-95 transition-transform"
          >
            ↑
          </button>
        </div>

        {/* Camp identity */}
        <div className="px-5 pb-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-5xl mb-4 shadow-lg">
            {camp.icon}
          </div>
          <span className="font-[DM_Sans] text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
            {camp.category}
          </span>
          <h1 className="font-[Fraunces] font-bold text-white text-2xl leading-tight mb-1">
            {camp.name}
          </h1>
          <div className="flex items-center gap-1.5 text-white/80 mb-3">
            <span className="text-xs">📍</span>
            <span className="font-[DM_Sans] text-sm">{camp.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={camp.status} size="lg" />
            <span className="font-[DM_Sans] text-xs font-semibold text-white/80 bg-white/20 px-2.5 py-1 rounded-full">
              {camp.spotsLeft === 1 ? '1 spot left' : `${camp.spotsLeft} spots left`}
            </span>
          </div>
        </div>

        {/* Curved bottom edge */}
        <div className="h-6 bg-capp-warm-bg rounded-t-[2rem]" />
      </div>

      {/* ── Quick stats card ── */}
      <div className="mx-4 -mt-1 bg-white rounded-2xl shadow-sm px-4 py-4 flex justify-around divide-x divide-capp-dark/10">
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <span className="text-xl">👦</span>
          <span className="font-[DM_Sans] text-xs font-semibold text-capp-dark">Ages {camp.ageMin}–{camp.ageMax}</span>
          <span className="font-[DM_Sans] text-xs text-capp-dark/40">Age range</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <span className="text-xl">📅</span>
          <span className="font-[DM_Sans] text-xs font-semibold text-capp-dark text-center leading-tight">{camp.dates}</span>
          <span className="font-[DM_Sans] text-xs text-capp-dark/40">Available</span>
        </div>
        <div className="flex-1 flex flex-col items-center gap-0.5 px-2">
          <span className="text-xl">⭐</span>
          <span className="font-[DM_Sans] text-xs font-semibold text-capp-dark">{camp.rating} / 5</span>
          <span className="font-[DM_Sans] text-xs text-capp-dark/40">{camp.reviews} reviews</span>
        </div>
      </div>

      <div className="px-4 mt-6 flex flex-col gap-6">

        {/* ── About ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg mb-2">About this camp</h2>
          <p className="font-[DM_Sans] text-sm text-capp-dark/70 leading-relaxed mb-3">
            {camp.description}
          </p>
          {camp.registrationUrl && (
            <div className="flex items-center justify-between">
              <a
                href={camp.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-[DM_Sans] text-sm font-semibold text-capp-coral active:opacity-70 transition-opacity"
              >
                🔗 Visit website
                <span className="text-capp-coral/60 text-xs">↗</span>
              </a>
              {saved && (
                <button
                  onClick={() => markRegistered(camp.id, !isRegistered(camp.id))}
                  className={`inline-flex items-center gap-1.5 font-[DM_Sans] text-xs font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-transform ${
                    isRegistered(camp.id)
                      ? 'bg-yellow-200 text-yellow-800 border border-yellow-300'
                      : 'bg-capp-dark/6 text-capp-dark/50'
                  }`}
                >
                  {isRegistered(camp.id) ? '✓ Registered' : 'Mark as registered'}
                </button>
              )}
            </div>
          )}
        </section>

        {/* ── In your circle ── */}
        {(() => {
          const signups = MOCK_CIRCLE_SIGNUPS[camp.id]
          if (!signups?.length) return null
          return (
            <section className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg">In your circle</h2>
                <span className="font-[DM_Sans] text-xs font-bold text-violet-700 bg-violet-100 px-2 py-0.5 rounded-full">
                  {signups.length} kid{signups.length !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex flex-col gap-3">
                {signups.map((signup) => {
                  const mom = MOCK_MOMS.find(m => m.kidName === signup.kidName)
                  return (
                    <div key={`${signup.kidName}-${signup.session}`} className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
                        style={{ backgroundColor: mom?.avatarColor ?? '#A78BFA' }}
                      >
                        {signup.kidName[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark leading-tight">
                          {signup.kidName}
                        </p>
                        <p className="font-[DM_Sans] text-xs text-capp-dark/45 mt-0.5">
                          {signup.momName}'s kid
                        </p>
                      </div>
                      <span className="font-[DM_Sans] text-xs font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-full shrink-0">
                        {signup.session}
                      </span>
                    </div>
                  )
                })}
              </div>
              <p className="font-[DM_Sans] text-xs text-capp-dark/35 mt-4">
                Based on your camp circles — reach out to coordinate!
              </p>
            </section>
          )
        })()}

        {/* ── What's included ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg mb-3">What's included</h2>
          <ul className="flex flex-col gap-2.5">
            {camp.tags.map((tag) => (
              <li key={tag} className="flex items-center gap-3">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                  style={{ backgroundColor: camp.accentLight, color: camp.accent }}
                >
                  ✓
                </span>
                <span className="font-[DM_Sans] text-sm text-capp-dark/80">{tag}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Pick a session ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg">Pick a session</h2>
            <SpotsLeft spotsLeft={camp.spotsLeft} status={camp.status} />
          </div>
          <p className="font-[DM_Sans] text-xs text-capp-dark/40 mb-3">Mon–Fri, 9am–3pm</p>

          {/* Deadline urgency banner */}
          {camp.regDeadline && (() => {
            const days = daysUntil(camp.regDeadline)
            const color = deadlineColor(days)
            if (days > 14) return null
            return (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 mb-4"
                style={{ backgroundColor: `${color}12`, border: `1px solid ${color}30` }}
              >
                <span className="text-base shrink-0">{days <= 7 ? '🚨' : '⏰'}</span>
                <div>
                  <p
                    className="font-[DM_Sans] text-sm font-bold"
                    style={{ color }}
                  >
                    {days <= 0 ? 'Registration deadline passed' : days === 1 ? 'Register today — last day!' : `${days} days left to register`}
                  </p>
                  <p className="font-[DM_Sans] text-xs text-capp-dark/50 mt-0.5">
                    {days <= 7 ? 'Spots are going fast — pick a session below.' : 'Secure your spot before it fills up.'}
                  </p>
                </div>
              </div>
            )
          })()}
          <div className="grid grid-cols-2 gap-2.5">
            {camp.sessions.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSession(s)}
                className={`py-3 px-4 rounded-xl border text-sm font-[DM_Sans] font-medium transition-colors text-left ${
                  selectedSession === s
                    ? 'text-white border-transparent'
                    : 'bg-capp-warm-bg text-capp-dark/70 border-capp-dark/10'
                }`}
                style={selectedSession === s ? { backgroundColor: camp.accent, borderColor: camp.accent } : {}}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* ── What to bring ── */}
        <section className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg mb-3">What to bring</h2>
          <ul className="flex flex-col gap-2.5">
            {whatToBring.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-capp-yellow/30 flex items-center justify-center text-xs shrink-0">
                  🎒
                </span>
                <span className="font-[DM_Sans] text-sm text-capp-dark/70">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Reviews ── */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-lg">Reviews</h2>
            <div className="flex items-center gap-1">
              <span className="text-capp-yellow text-sm">★</span>
              <span className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{camp.rating}</span>
              <span className="font-[DM_Sans] text-xs text-capp-dark/40">({camp.reviews})</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {/* User-submitted reviews first */}
            {userReviews.map((r) => (
              <div key={r.userEmail} className="bg-white rounded-2xl p-4 shadow-sm border-2" style={{ borderColor: `${camp.accent}40` }}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-[DM_Sans]"
                      style={{ backgroundColor: camp.accentLight, color: camp.accent }}
                    >
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark">{r.name}</p>
                        <span className="font-[DM_Sans] text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: camp.accent }}>
                          Your review
                        </span>
                      </div>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/40">{r.location} · {r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => (
                        <span key={i} className="text-capp-yellow text-xs">★</span>
                      ))}
                    </div>
                    <button
                      onClick={() => { setReviewRating(r.rating); setReviewBody(r.body); setReviewName(r.name); setShowReviewForm(true) }}
                      className="font-[DM_Sans] text-xs font-semibold text-capp-coral"
                    >
                      Edit
                    </button>
                  </div>
                </div>
                <p className="font-[DM_Sans] text-sm text-capp-dark/70 leading-relaxed">"{r.body}"</p>
              </div>
            ))}

            {/* Mock / seeded reviews */}
            {campReviews.map((r) => (
              <div key={r.name} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-[DM_Sans]"
                      style={{ backgroundColor: camp.accentLight, color: camp.accent }}
                    >
                      {r.name[0]}
                    </div>
                    <div>
                      <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark">{r.name}</p>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/40">{r.location} · {r.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, i) => (
                      <span key={i} className="text-capp-yellow text-xs">★</span>
                    ))}
                  </div>
                </div>
                <p className="font-[DM_Sans] text-sm text-capp-dark/70 leading-relaxed">"{r.body}"</p>
              </div>
            ))}
          </div>

          {/* Write a review CTA — only if eligible and not yet reviewed */}
          {canReview && !existingReview && !showReviewForm && (
            <button
              onClick={() => { setShowReviewForm(true); setReviewName(user?.name ?? '') }}
              className="mt-3 w-full py-3.5 rounded-2xl border-2 border-dashed font-[DM_Sans] font-semibold text-sm transition-colors active:bg-capp-warm-bg"
              style={{ borderColor: `${camp.accent}50`, color: camp.accent }}
            >
              ✍️ Write a review
            </button>
          )}

          {/* Review form */}
          {showReviewForm && (
            <div className="mt-3 bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-[Fraunces] font-bold text-capp-dark text-base">
                  {existingReview ? 'Edit your review' : 'Write a review'}
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="w-7 h-7 rounded-full bg-capp-dark/5 flex items-center justify-center text-capp-dark/40 text-sm"
                >
                  ✕
                </button>
              </div>

              <div>
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-2">Your rating</p>
                <StarPicker value={reviewRating} onChange={setReviewRating} />
              </div>

              <div>
                <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                  Your name
                </label>
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Display name"
                  className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                  Your experience
                </label>
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="What did your kid love about this camp?"
                  rows={4}
                  className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleSubmitReview}
                disabled={!reviewRating || !reviewBody.trim()}
                className="w-full py-3.5 rounded-2xl font-[DM_Sans] font-semibold text-sm text-white active:scale-95 transition-all disabled:opacity-40"
                style={{ backgroundColor: camp.accent }}
              >
                {existingReview ? 'Update review' : 'Submit review'}
              </button>
            </div>
          )}
        </section>

      </div>

      {/* ── Sticky bottom CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-capp-dark/8 px-4 py-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>
        {/* Who's going? */}
        {kids.length > 0 && (
          <div className="max-w-[430px] mx-auto flex items-center gap-2.5 mb-2.5">
            <span className="font-[DM_Sans] text-xs text-capp-dark/40 shrink-0">Who's going?</span>
            <div className="flex gap-1.5">
              {kids.map((kid) => (
                <button
                  key={kid.id}
                  onClick={() => setSelectedKidId(selectedKidId === kid.id ? null : kid.id)}
                  className="flex flex-col items-center gap-1 transition-all active:scale-95"
                  style={{ opacity: selectedKidId && selectedKidId !== kid.id ? 0.35 : 1 }}
                  aria-label={kid.name}
                >
                  <KidAvatar
                    kid={kid}
                    size={38}
                    rounded="full"
                    className="transition-all"
                    style={selectedKidId === kid.id
                      ? { boxShadow: `0 0 0 2.5px white, 0 0 0 4.5px ${kid.avatarColor}` }
                      : {}}
                  />
                  <span className="font-[DM_Sans] text-[9px] text-capp-dark/50">{kid.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 max-w-[430px] mx-auto mb-2">
          <div>
            <p className="font-[DM_Sans] text-xs text-capp-dark/40">Starting at</p>
            <p className="font-[Fraunces] font-bold text-capp-dark text-xl">
              ${camp.price}<span className="font-[DM_Sans] text-sm font-normal text-capp-dark/40">/{camp.priceType}</span>
            </p>
          </div>
          <div className="flex-1 flex gap-2">
            <button
              onClick={() => {
                if (saved && !selectedSession) {
                  unsave(camp.id)
                } else {
                  saveWithSession(camp.id, selectedSession, selectedKidId)
                }
              }}
              className="flex-1 py-3.5 rounded-2xl font-[DM_Sans] font-semibold text-base transition-all active:scale-95 text-capp-dark bg-capp-coral"
            >
              {saved
                ? `❤️ Saved${persistedSession ? ` — ${persistedSession}` : ''}`
                : selectedSession
                  ? `Save — ${selectedSession}`
                  : 'Save to My Summer'}
            </button>
            {camp.registrationUrl && (
              <a
                href={camp.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-4 py-3.5 rounded-2xl font-[DM_Sans] font-semibold text-sm bg-white border-2 border-capp-coral/30 text-capp-coral whitespace-nowrap active:scale-95 transition-all shrink-0"
              >
                Register →
              </a>
            )}
          </div>
        </div>

        {!camp.registrationUrl && (
          <>
            {saved && selectedSession && selectedSession !== persistedSession && (
              <p className="font-[DM_Sans] text-xs text-capp-dark/40 text-center">
                Tap again to update your session to {selectedSession}
              </p>
            )}
            {!saved && !selectedSession && (
              <p className="font-[DM_Sans] text-xs text-capp-dark/40 text-center">
                Pick a session above to lock in your week
              </p>
            )}
          </>
        )}
      </div>

    </div>
  )
}
