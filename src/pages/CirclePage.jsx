import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useKids } from '../context/KidsContext'
import { useCircle } from '../context/CircleContext'
import { MOCK_MOMS, MOCK_CONVERSATIONS, MOCK_CIRCLES, MOCK_CONTACTS, MOCK_CARPOOL_POSTS } from '../data/mockCircle'
import { camps, SUMMER_WEEKS } from '../data/camps'
import { formatRelativeTime } from '../utils/formatRelativeTime'
import NotificationBell from '../components/NotificationBell'

// ─── CarpoolDetailSheet ──────────────────────────────────────────────────────
function DirectionClaimRow({ label, emoji, dir, isMe, isDriving, onClaim }) {
  if (!dir) return null
  const claimed = dir.claimedBy.includes('me')
  const seatsLeft = isDriving ? dir.seats - dir.claimedBy.length : null
  const full = isDriving && seatsLeft <= 0

  return (
    <div className="flex items-center justify-between py-3 border-b border-capp-dark/5 last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-base">{emoji}</span>
        <div>
          <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{label}</p>
          {isDriving && (
            <p className="font-[DM_Sans] text-xs text-capp-dark/45">
              {full ? 'Full' : `${seatsLeft} seat${seatsLeft !== 1 ? 's' : ''} left`}
            </p>
          )}
        </div>
      </div>
      {!isMe && (
        <button
          onClick={onClaim}
          className={`font-[DM_Sans] text-xs font-bold px-3.5 py-2 rounded-xl active:scale-95 transition-transform ${
            claimed
              ? 'bg-capp-dark/8 text-capp-dark/50'
              : full && isDriving
                ? 'bg-capp-dark/8 text-capp-dark/35'
                : isDriving
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-500 text-white'
          }`}
          disabled={full && isDriving && !claimed}
        >
          {claimed ? '✓ Claimed' : full && isDriving ? 'Full' : isDriving ? 'Claim seat' : 'Offer to drive'}
        </button>
      )}
    </div>
  )
}

function ClaimantRow({ momId, direction, dirLabel, onConfirm }) {
  const claimMom = MOCK_MOMS.find((m) => m.id === momId)
  if (!claimMom) return null
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-capp-dark/5 last:border-0">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
        style={{ backgroundColor: claimMom.avatarColor }}>{claimMom.name[0]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{claimMom.name}</p>
        <p className="font-[DM_Sans] text-xs text-capp-dark/40">{dirLabel}</p>
      </div>
      <button onClick={() => onConfirm(claimMom)}
        className="font-[DM_Sans] text-xs font-bold text-white bg-capp-coral px-3 py-1.5 rounded-xl active:scale-95 transition-transform shrink-0">
        Confirm →
      </button>
    </div>
  )
}

function CarpoolDetailSheet({ post, mom, onMessage, onClaim, onConfirmClaimant, onClose }) {
  const isDriving = post.role === 'driving'
  const isMe = post.momId === 'me'

  const allClaimants = [
    ...(post.tocamp?.claimedBy ?? []).map((id) => ({ id, direction: 'tocamp', label: 'Ride to camp' })),
    ...(post.fromcamp?.claimedBy ?? []).map((id) => ({ id, direction: 'fromcamp', label: 'Ride home' })),
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />

        {/* Role badge */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-[DM_Sans] mb-4 ${isDriving ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
          <span>{isDriving ? '🚗' : '🙋'}</span>
          {isDriving ? 'Offering rides' : 'Looking for rides'}
        </div>

        {/* Poster */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white font-[Fraunces] shrink-0"
            style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
          <div>
            <p className="font-[DM_Sans] font-semibold text-capp-dark text-base">{mom.name}</p>
            <p className="font-[DM_Sans] text-xs text-capp-dark/45">{mom.location} · {mom.kidName}'s mom</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-capp-warm-bg rounded-2xl px-4 py-4 flex flex-col gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-lg w-6 text-center shrink-0">🏕️</span>
            <div>
              <p className="font-[DM_Sans] text-[10px] font-semibold text-capp-dark/40 uppercase tracking-wider">Circle</p>
              <p className="font-[DM_Sans] text-sm font-medium text-capp-dark">{post.circleName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg w-6 text-center shrink-0">📅</span>
            <div>
              <p className="font-[DM_Sans] text-[10px] font-semibold text-capp-dark/40 uppercase tracking-wider">Camp week</p>
              <p className="font-[DM_Sans] text-sm font-medium text-capp-dark">{post.session}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg w-6 text-center shrink-0">📍</span>
            <div>
              <p className="font-[DM_Sans] text-[10px] font-semibold text-capp-dark/40 uppercase tracking-wider">Neighborhood</p>
              <p className="font-[DM_Sans] text-sm font-medium text-capp-dark">{post.neighborhood}</p>
            </div>
          </div>
        </div>

        {/* Direction rows */}
        <div className="bg-capp-warm-bg rounded-2xl px-4 mb-5">
          <DirectionClaimRow
            label="Ride to camp" emoji="🌅" dir={post.tocamp}
            isMe={isMe} isDriving={isDriving}
            onClaim={() => { onClaim(post.id, 'tocamp'); onClose() }}
          />
          <DirectionClaimRow
            label="Ride home" emoji="🌇" dir={post.fromcamp}
            isMe={isMe} isDriving={isDriving}
            onClaim={() => { onClaim(post.id, 'fromcamp'); onClose() }}
          />
        </div>

        {/* Claimants section — visible on my own driving posts */}
        {isMe && isDriving && allClaimants.length > 0 && (
          <div className="bg-capp-warm-bg rounded-2xl px-4 mb-4">
            <p className="font-[DM_Sans] text-[10px] font-semibold text-capp-dark/40 uppercase tracking-wider pt-3 pb-1">
              🎉 {allClaimants.length} seat{allClaimants.length !== 1 ? 's' : ''} claimed — confirm pickup details
            </p>
            {allClaimants.map((c) => (
              <ClaimantRow
                key={`${c.id}-${c.direction}`}
                momId={c.id}
                direction={c.direction}
                dirLabel={c.label}
                onConfirm={(claimMom) => { onConfirmClaimant(claimMom, c.direction); onClose() }}
              />
            ))}
            <div className="pb-1" />
          </div>
        )}

        {!isMe && (
          <button onClick={onMessage}
            className="w-full py-3.5 rounded-2xl bg-capp-dark/5 text-capp-dark font-[DM_Sans] font-semibold text-sm active:scale-95 transition-transform">
            Message {mom.name.split(' ')[0]}
          </button>
        )}
      </div>
    </div>
  )
}

// ─── CarpoolPostCard ──────────────────────────────────────────────────────────
function CarpoolPostCard({ post, onPress }) {
  const mom = MOCK_MOMS.find((m) => m.id === post.momId)
  if (!mom) return null
  const isDriving = post.role === 'driving'
  const isMe = post.momId === 'me'

  const hasClaimed = [post.tocamp, post.fromcamp].some((d) => d?.claimedBy?.includes('me'))
  const totalSeats = isDriving
    ? [post.tocamp, post.fromcamp].filter(Boolean).reduce((s, d) => s + (d.seats - d.claimedBy.length), 0)
    : null

  return (
    <button
      onClick={onPress}
      className="w-full text-left bg-white rounded-2xl px-4 py-3.5 shadow-sm active:scale-[0.98] transition-transform border border-capp-dark/[0.06] flex items-center gap-3"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
        style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-[DM_Sans] text-sm font-semibold text-capp-dark">
            {isMe ? 'You' : mom.name}
          </span>
          <span className={`font-[DM_Sans] text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
            hasClaimed ? 'bg-emerald-50 text-emerald-600' :
            isDriving ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {hasClaimed ? '✓ Claimed' : isDriving ? `🚗 ${totalSeats} seat${totalSeats !== 1 ? 's' : ''} left` : '🙋 Need a ride'}
          </span>
        </div>
        <p className="font-[DM_Sans] text-xs text-capp-dark/45 truncate">
          {post.session} · {post.neighborhood}
        </p>
      </div>

      <span className="font-[DM_Sans] text-[11px] text-capp-dark/30 shrink-0">{formatRelativeTime(post.ts)}</span>
    </button>
  )
}

// ─── CarpoolFlowSheet ────────────────────────────────────────────────────────
function CarpoolFlowSheet({ kids, circles, contacts, onClose, onViewChat, onPost }) {
  const { sendCarpool } = useCircle()
  const [step, setStep] = useState(1)
  const [dest, setDest] = useState(null) // { convId, name, circleData? }
  const [role, setRole] = useState('driving')
  const [session, setSession] = useState(SUMMER_WEEKS[3])
  // Driving: separate seat counts per direction
  const [offerTo, setOfferTo] = useState(true)
  const [offerFrom, setOfferFrom] = useState(true)
  const [seatsTo, setSeatsTo] = useState(2)
  const [seatsFrom, setSeatsFrom] = useState(2)
  // Riding: which directions are needed
  const [needTo, setNeedTo] = useState(true)
  const [needFrom, setNeedFrom] = useState(true)
  const [neighborhood, setNeighborhood] = useState('')
  const [posted, setPosted] = useState(false)

  function pickDest(d) { setDest(d); setStep(2) }

  const canPost = neighborhood.trim() && (
    role === 'driving' ? (offerTo || offerFrom) : (needTo || needFrom)
  )

  function post() {
    if (!canPost) return
    const tocamp = role === 'driving'
      ? (offerTo  ? { seats: seatsTo,   claimedBy: [] } : null)
      : (needTo   ? { seats: 0,          claimedBy: [] } : null)
    const fromcamp = role === 'driving'
      ? (offerFrom ? { seats: seatsFrom, claimedBy: [] } : null)
      : (needFrom  ? { seats: 0,          claimedBy: [] } : null)
    sendCarpool(dest.convId, { role, session, tocamp, fromcamp, neighborhood: neighborhood.trim() })
    onPost({ dest, role, session, tocamp, fromcamp, neighborhood: neighborhood.trim() })
    setPosted(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10 max-h-[92vh] flex flex-col">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-4" />

        {/* ── Success ── */}
        {posted && (
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <span className="text-5xl">🚗</span>
            <h3 className="font-[Fraunces] font-bold text-capp-dark text-xl">Carpool posted!</h3>
            <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed">
              Your post was sent to <span className="font-semibold text-capp-dark">{dest.name}</span>.
            </p>
            <div className="flex flex-col gap-2.5 w-full mt-2">
              <button onClick={() => { onClose(); onViewChat(dest) }}
                className="w-full py-3.5 rounded-2xl bg-capp-coral text-capp-dark font-[DM_Sans] font-bold text-sm active:scale-95 transition-transform">
                View in {dest.name} →
              </button>
              <button onClick={onClose}
                className="w-full py-3 rounded-2xl bg-capp-dark/5 text-capp-dark/60 font-[DM_Sans] font-medium text-sm active:scale-95 transition-transform">
                Done
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Pick destination ── */}
        {!posted && step === 1 && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl shrink-0">🚗</div>
              <div>
                <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg leading-tight">Post a carpool</h3>
                <p className="font-[DM_Sans] text-xs text-capp-dark/45 mt-0.5">Which circle or conversation?</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4">
              {/* Circles per kid */}
              {kids.map((kid) => {
                const kidCircles = circles.filter((c) => c.kidId === kid.id)
                if (!kidCircles.length) return null
                return (
                  <div key={kid.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-[Fraunces] shrink-0"
                        style={{ backgroundColor: kid.avatarColor }}>{kid.name[0]}</div>
                      <p className="font-[DM_Sans] text-[11px] font-semibold text-capp-dark/40 uppercase tracking-wider">{kid.name}'s circles</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {kidCircles.map((circle) => {
                        const camp = circle.campId ? camps.find((c) => c.id === circle.campId) : null
                        const convId = `group-${circle.campId ?? circle.id}`
                        return (
                          <button key={circle.id}
                            onClick={() => pickDest({ convId, name: circle.name, circleData: { camp, circle } })}
                            className="flex items-center gap-3 bg-capp-warm-bg rounded-2xl px-4 py-3 active:scale-[0.98] transition-transform text-left">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                              style={{ backgroundColor: camp ? `${camp.accent}25` : '#f3f4f6' }}>
                              {camp?.icon ?? '💬'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark truncate">{circle.name}</p>
                              <p className="font-[DM_Sans] text-xs text-capp-dark/40">
                                {circle.memberIds.length} member{circle.memberIds.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <span className="text-capp-dark/20 text-sm">›</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Direct messages */}
              {contacts.length > 0 && (
                <div>
                  <p className="font-[DM_Sans] text-[11px] font-semibold text-capp-dark/40 uppercase tracking-wider mb-2">Send directly</p>
                  <div className="flex flex-col gap-2">
                    {contacts.map((mom) => (
                      <button key={mom.id}
                        onClick={() => pickDest({ convId: `dm-${mom.id}`, name: mom.name })}
                        className="flex items-center gap-3 bg-capp-warm-bg rounded-2xl px-4 py-3 active:scale-[0.98] transition-transform text-left">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
                          style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{mom.name}</p>
                          <p className="font-[DM_Sans] text-xs text-capp-dark/40">{mom.location} · {mom.kidName}'s mom</p>
                        </div>
                        <span className="text-capp-dark/20 text-sm">›</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {kids.every((k) => !circles.some((c) => c.kidId === k.id)) && contacts.length === 0 && (
                <p className="font-[DM_Sans] text-sm text-capp-dark/40 text-center py-8">
                  Add people to your community first to start a carpool.
                </p>
              )}
            </div>
          </>
        )}

        {/* ── Step 2: Carpool details ── */}
        {!posted && step === 2 && (
          <>
            <div className="flex items-center gap-3 mb-1">
              <button onClick={() => setStep(1)}
                className="w-8 h-8 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center text-sm shrink-0 active:scale-95 transition-transform">
                ←
              </button>
              <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg">Post a carpool</h3>
            </div>

            {/* Destination pill */}
            <div className="flex items-center gap-2 mb-5 mt-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
              <span className="text-base">🚗</span>
              <p className="font-[DM_Sans] text-xs text-capp-dark/60">
                Sending to <span className="font-semibold text-capp-dark">{dest.name}</span>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-5">
              {/* Role toggle */}
              <div>
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">I am…</p>
                <div className="flex gap-2">
                  {['driving', 'riding'].map((r) => (
                    <button key={r} onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl font-[DM_Sans] text-sm font-semibold transition-colors ${
                        role === r
                          ? r === 'driving' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                          : 'bg-capp-warm-bg text-capp-dark/50'
                      }`}>
                      {r === 'driving' ? '🚗 Offering a ride' : '🙋 Need a ride'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Camp week */}
              <div>
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Camp week</p>
                <select value={session} onChange={(e) => setSession(e.target.value)}
                  className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-capp-coral/40">
                  {SUMMER_WEEKS.map((w) => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              {/* Directions */}
              <div>
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">
                  {role === 'driving' ? 'Which way are you offering?' : 'Which direction do you need?'}
                </p>
                <div className="flex flex-col gap-2">
                  {/* To camp */}
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                    (role === 'driving' ? offerTo : needTo) ? 'bg-orange-50 border-orange-200' : 'bg-capp-warm-bg border-capp-dark/10'
                  }`}>
                    <button
                      onClick={() => role === 'driving' ? setOfferTo((v) => !v) : setNeedTo((v) => !v)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        (role === 'driving' ? offerTo : needTo) ? 'bg-orange-500 border-orange-500' : 'border-capp-dark/20'
                      }`}
                    >
                      {(role === 'driving' ? offerTo : needTo) && <span className="text-white text-[10px] font-bold">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">🌅 Ride to camp</p>
                    </div>
                    {role === 'driving' && offerTo && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSeatsTo((s) => Math.max(1, s - 1))}
                          className="w-7 h-7 rounded-full bg-white border border-capp-dark/10 font-bold text-capp-dark flex items-center justify-center text-sm active:scale-95">−</button>
                        <span className="font-[Fraunces] font-bold text-capp-dark text-lg w-5 text-center">{seatsTo}</span>
                        <button onClick={() => setSeatsTo((s) => Math.min(6, s + 1))}
                          className="w-7 h-7 rounded-full bg-white border border-capp-dark/10 font-bold text-capp-dark flex items-center justify-center text-sm active:scale-95">+</button>
                      </div>
                    )}
                  </div>
                  {/* From camp */}
                  <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-colors ${
                    (role === 'driving' ? offerFrom : needFrom) ? 'bg-orange-50 border-orange-200' : 'bg-capp-warm-bg border-capp-dark/10'
                  }`}>
                    <button
                      onClick={() => role === 'driving' ? setOfferFrom((v) => !v) : setNeedFrom((v) => !v)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                        (role === 'driving' ? offerFrom : needFrom) ? 'bg-orange-500 border-orange-500' : 'border-capp-dark/20'
                      }`}
                    >
                      {(role === 'driving' ? offerFrom : needFrom) && <span className="text-white text-[10px] font-bold">✓</span>}
                    </button>
                    <div className="flex-1">
                      <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">🌇 Ride home</p>
                    </div>
                    {role === 'driving' && offerFrom && (
                      <div className="flex items-center gap-2">
                        <button onClick={() => setSeatsFrom((s) => Math.max(1, s - 1))}
                          className="w-7 h-7 rounded-full bg-white border border-capp-dark/10 font-bold text-capp-dark flex items-center justify-center text-sm active:scale-95">−</button>
                        <span className="font-[Fraunces] font-bold text-capp-dark text-lg w-5 text-center">{seatsFrom}</span>
                        <button onClick={() => setSeatsFrom((s) => Math.min(6, s + 1))}
                          className="w-7 h-7 rounded-full bg-white border border-capp-dark/10 font-bold text-capp-dark flex items-center justify-center text-sm active:scale-95">+</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Neighborhood */}
              <div>
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Your neighborhood / area</p>
                <input type="text" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="e.g. Carlsbad, Encinitas, Oceanside…"
                  className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-capp-coral/40 placeholder:text-capp-dark/30"
                />
              </div>
            </div>

            <div className="pt-4">
              <button onClick={post} disabled={!canPost}
                className="w-full py-3.5 rounded-2xl bg-capp-coral text-capp-dark font-[DM_Sans] font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform">
                Post carpool →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── InviteSheet ─────────────────────────────────────────────────────────────
function InviteSheet({ onClose }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const appUrl = window.location.origin

  function sendInvite() {
    if (!email.trim()) return
    const subject = encodeURIComponent('Join my Circle on CAMPP')
    const body = encodeURIComponent(
      `Hey!\n\nI'd love for you to join my Circle on CAMPP — an app for finding and organizing summer camps in North County San Diego.\n\nJoin here: ${appUrl}\n\nSee you there! 🏕️`
    )
    window.location.href = `mailto:${email.trim()}?subject=${subject}&body=${body}`
    setSent(true)
    setTimeout(onClose, 2500)
  }

  function shareLink() {
    const shareText = `Hey! I've been using CAMPP to plan my kids' summer camps. Join me on it! ${appUrl}`
    if (navigator.share) {
      navigator.share({ title: 'CAMPP — Summer, sorted.', text: shareText, url: appUrl }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(shareText).catch(() => {})
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />
        {sent ? (
          <div className="flex flex-col items-center text-center py-6 gap-3">
            <span className="text-5xl">🎉</span>
            <h3 className="font-[Fraunces] font-bold text-capp-dark text-xl">Invite sent!</h3>
            <p className="font-[DM_Sans] text-sm text-capp-dark/55">Your friend will get an email with a link to join CAMPP and connect with you.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-2xl shrink-0">👯</div>
              <div>
                <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg leading-tight">Add a friend to your Circle</h3>
                <p className="font-[DM_Sans] text-xs text-capp-dark/45 mt-0.5">They'll get an invite to join CAMPP and connect</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Friend's email</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. jessica@email.com" inputMode="email" autoFocus
                className="w-full font-[DM_Sans] text-base bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2.5">
              <button onClick={sendInvite} disabled={!email.trim()}
                className="w-full bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-40">
                Send invite →
              </button>
              <button onClick={shareLink}
                className="w-full bg-capp-dark/5 text-capp-dark/70 font-[DM_Sans] font-medium py-3.5 rounded-2xl active:scale-95 transition-transform">
                Or share a link instead
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── NewCircleSheet ───────────────────────────────────────────────────────────
function NewCircleSheet({ kid, contacts, onCreate, onClose }) {
  const [name, setName] = useState('')
  const [selectedIds, setSelectedIds] = useState([])

  function toggle(id) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  function create() {
    if (!name.trim()) return
    onCreate({ name: name.trim(), memberIds: selectedIds })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10 max-h-[88vh] flex flex-col">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white font-[Fraunces] shrink-0"
            style={{ backgroundColor: kid.avatarColor }}>
            {kid.name[0]}
          </div>
          <div>
            <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg leading-tight">New circle</h3>
            <p className="font-[DM_Sans] text-xs text-capp-dark/45">For {kid.name}</p>
          </div>
        </div>

        <div className="mb-4">
          <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
            Circle name
          </label>
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)} autoFocus
            placeholder="e.g. La Costa Oaks, Mrs. Park's Class…"
            className="w-full font-[DM_Sans] text-base bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors"
          />
        </div>

        {contacts.length > 0 && (
          <div className="flex-1 overflow-y-auto min-h-0">
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/45 uppercase tracking-wider mb-2">Add people from your community</p>
            <div className="flex flex-col gap-1">
              {contacts.map((mom) => {
                const selected = selectedIds.includes(mom.id)
                return (
                  <button key={mom.id} onClick={() => toggle(mom.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-colors text-left ${selected ? 'bg-capp-coral/8 border border-capp-coral/30' : 'bg-capp-warm-bg border border-transparent'}`}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
                      style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{mom.name}</p>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/40">{mom.location} · {mom.kidName}'s mom</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'bg-capp-coral border-capp-coral' : 'border-capp-dark/20'}`}>
                      {selected && <span className="text-capp-dark text-[10px] font-bold">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-2.5">
          <button onClick={create} disabled={!name.trim()}
            className="w-full bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-40">
            Create circle
          </button>
          <button onClick={onClose}
            className="w-full bg-capp-dark/5 text-capp-dark/60 font-[DM_Sans] font-medium py-3 rounded-2xl active:scale-95 transition-transform">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ContactSheet ─────────────────────────────────────────────────────────────
function ContactSheet({ mom, circles, onMessage, onAddToCircle, onRemove, onClose }) {
  const [addMode, setAddMode] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white font-[Fraunces] shrink-0"
            style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
          <div>
            <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg">{mom.name}</h3>
            <p className="font-[DM_Sans] text-sm text-capp-dark/50">{mom.location} · {mom.kidName}'s mom (age {mom.kidAge})</p>
          </div>
        </div>

        {addMode ? (
          <>
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/45 uppercase tracking-wider mb-3">Add to a circle</p>
            {circles.length === 0 ? (
              <p className="font-[DM_Sans] text-sm text-capp-dark/40 text-center py-3">No circles yet — create one first.</p>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {circles.map((circle) => {
                  const alreadyIn = circle.memberIds.includes(mom.id)
                  return (
                    <button key={circle.id} onClick={() => { if (!alreadyIn) { onAddToCircle(circle.id, mom.id); onClose() } }}
                      disabled={alreadyIn}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-colors ${alreadyIn ? 'bg-capp-dark/3 border-capp-dark/5' : 'bg-capp-warm-bg border-capp-dark/10 active:bg-capp-coral/8'}`}>
                      <span className="font-[DM_Sans] text-sm font-medium text-capp-dark">{circle.name}</span>
                      {alreadyIn
                        ? <span className="font-[DM_Sans] text-xs text-capp-dark/35">Already in</span>
                        : <span className="font-[DM_Sans] text-xs font-semibold text-capp-coral">Add →</span>}
                    </button>
                  )
                })}
              </div>
            )}
            <button onClick={() => setAddMode(false)}
              className="w-full bg-capp-dark/5 text-capp-dark/60 font-[DM_Sans] font-medium py-3 rounded-2xl active:scale-95 transition-transform">
              Back
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2.5">
            <button onClick={onMessage}
              className="w-full py-3.5 rounded-2xl bg-capp-coral text-capp-dark font-[DM_Sans] font-bold text-sm active:scale-95 transition-transform">
              Send a message
            </button>
            <button onClick={() => setAddMode(true)}
              className="w-full py-3.5 rounded-2xl bg-capp-dark/5 text-capp-dark font-[DM_Sans] font-semibold text-sm active:scale-95 transition-transform">
              Add to a circle
            </button>
            <button onClick={() => { onRemove(mom.id); onClose() }}
              className="w-full py-3 rounded-2xl text-red-400 font-[DM_Sans] font-medium text-sm active:scale-95 transition-transform">
              Remove from community
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── AddPeopleSheet ───────────────────────────────────────────────────────────
function AddPeopleSheet({ available, onAdd, onClose }) {
  const [added, setAdded] = useState(new Set())

  function addPerson(id) {
    onAdd(id)
    setAdded((prev) => new Set([...prev, id]))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10 max-h-[80vh] flex flex-col">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-4" />
        <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg mb-1">Add people</h3>
        <p className="font-[DM_Sans] text-sm text-capp-dark/50 mb-4">Parents from your kids' camps</p>

        {available.length === 0 ? (
          <p className="font-[DM_Sans] text-sm text-capp-dark/40 text-center py-8">Everyone's already in your community!</p>
        ) : (
          <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-2">
            {available.map((mom) => {
              const isAdded = added.has(mom.id)
              return (
                <div key={mom.id} className="flex items-center gap-3 px-1 py-1">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white font-[Fraunces] shrink-0"
                    style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{mom.name}</p>
                    <p className="font-[DM_Sans] text-xs text-capp-dark/40">{mom.location} · {mom.kidName}'s mom</p>
                  </div>
                  <button onClick={() => addPerson(mom.id)} disabled={isAdded}
                    className={`font-[DM_Sans] text-xs font-semibold px-3.5 py-1.5 rounded-xl shrink-0 transition-colors ${isAdded ? 'bg-emerald-50 text-emerald-600' : 'bg-capp-coral/10 text-capp-coral active:scale-95'}`}>
                    {isAdded ? 'Added ✓' : '+ Add'}
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <button onClick={onClose} className="mt-4 w-full bg-capp-dark/5 text-capp-dark/60 font-[DM_Sans] font-medium py-3.5 rounded-2xl active:scale-95 transition-transform">
          Done
        </button>
      </div>
    </div>
  )
}

// ─── CircleRow ────────────────────────────────────────────────────────────────
function CircleRow({ circle, members, onPress }) {
  const { getLastMessage, getUnreadCount } = useCircle()
  const convId = `group-${circle.campId ?? circle.id}`
  const last = getLastMessage(convId)
  const unread = getUnreadCount(convId)
  const senderMom = last ? MOCK_MOMS.find((m) => m.id === last.senderId) : null
  const senderLabel = last?.senderId === 'me' ? 'You' : senderMom?.name?.split(' ')[0]

  return (
    <button onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3 active:bg-capp-dark/[0.03] transition-colors text-left">
      {/* Member stack */}
      <div className="relative w-11 h-11 shrink-0">
        {members.slice(0, 2).map((m, i) => (
          <div key={m.id}
            className="absolute w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white font-[Fraunces]"
            style={{ backgroundColor: m.avatarColor, left: i * 12, top: i * 8, zIndex: 2 - i }}>
            {m.name[0]}
          </div>
        ))}
        {members.length === 0 && (
          <div className="w-10 h-10 rounded-full bg-capp-dark/8 flex items-center justify-center text-lg">💬</div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-[DM_Sans] font-semibold text-capp-dark text-sm truncate max-w-[180px]">{circle.name}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {last && <span className="font-[DM_Sans] text-[11px] text-capp-dark/35">{formatRelativeTime(last.ts)}</span>}
            {unread > 0 && (
              <span className="min-w-[18px] h-[18px] bg-capp-coral text-capp-dark text-[10px] font-bold font-[DM_Sans] rounded-full flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </div>
        </div>
        <p className="font-[DM_Sans] text-xs text-capp-dark/40 truncate">
          {last ? `${senderLabel}: ${last.body}` : `${members.length} member${members.length !== 1 ? 's' : ''}`}
        </p>
      </div>
      <span className="text-capp-dark/20 text-sm shrink-0">›</span>
    </button>
  )
}

// ─── DMRow ────────────────────────────────────────────────────────────────────
function DMRow({ mom, onPress }) {
  const { getLastMessage, getUnreadCount } = useCircle()
  const convId = `dm-${mom.id}`
  const last = getLastMessage(convId)
  const unread = getUnreadCount(convId)
  const senderLabel = last?.senderId === 'me' ? 'You' : mom.name.split(' ')[0]

  return (
    <button onClick={onPress}
      className="w-full flex items-center gap-3 bg-white rounded-2xl px-4 py-3.5 shadow-sm active:scale-[0.98] transition-transform text-left">
      <div className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white font-[Fraunces] shrink-0"
        style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-[DM_Sans] font-semibold text-capp-dark text-sm">{mom.name}</span>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            {last && <span className="font-[DM_Sans] text-[11px] text-capp-dark/35">{formatRelativeTime(last.ts)}</span>}
            {unread > 0 && (
              <span className="min-w-[18px] h-[18px] bg-capp-coral text-capp-dark text-[10px] font-bold font-[DM_Sans] rounded-full flex items-center justify-center px-1">
                {unread}
              </span>
            )}
          </div>
        </div>
        <p className="font-[DM_Sans] text-xs text-capp-dark/40 truncate">
          {last ? `${senderLabel}: ${last.body}` : `${mom.location} · ${mom.kidName}'s mom`}
        </p>
      </div>
    </button>
  )
}

// ─── KidSection ───────────────────────────────────────────────────────────────
function KidSection({ kid, kidCircles, allContacts, onNewCircle, onCirclePress, onRenameCircle }) {
  const [expanded, setExpanded] = useState(true)
  const [renamingId, setRenamingId] = useState(null)
  const [renameVal, setRenameVal] = useState('')

  function startRename(circle) {
    setRenamingId(circle.id)
    setRenameVal(circle.name)
  }

  function commitRename(id) {
    if (renameVal.trim()) onRenameCircle(id, renameVal.trim())
    setRenamingId(null)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Kid header */}
      <button onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-4 active:bg-capp-dark/[0.03] transition-colors">
        {kid.photo ? (
          <img src={kid.photo} alt={kid.name} className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-white shadow-sm" />
        ) : (
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold text-white font-[Fraunces] shrink-0"
            style={{ backgroundColor: kid.avatarColor }}>{kid.name[0]}</div>
        )}
        <div className="flex-1 text-left min-w-0">
          <p className="font-[Fraunces] font-bold text-capp-dark">{kid.name}</p>
          <p className="font-[DM_Sans] text-xs text-capp-dark/40">
            {kidCircles.length > 0 ? `${kidCircles.length} circle${kidCircles.length !== 1 ? 's' : ''}` : 'No circles yet'}
          </p>
        </div>
        <span className="text-capp-dark/25 text-lg leading-none">{expanded ? '⌃' : '⌄'}</span>
      </button>

      {expanded && (
        <div className="border-t border-capp-dark/5">
          {kidCircles.length > 0 && (
            <div className="divide-y divide-capp-dark/[0.04]">
              {kidCircles.map((circle) => {
                const members = circle.memberIds.map((id) => MOCK_MOMS.find((m) => m.id === id)).filter(Boolean)
                return (
                  <div key={circle.id} className="relative">
                    {renamingId === circle.id ? (
                      <div className="flex items-center gap-2 px-4 py-2.5">
                        <input
                          value={renameVal} onChange={(e) => setRenameVal(e.target.value)}
                          autoFocus onBlur={() => commitRename(circle.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter') commitRename(circle.id); if (e.key === 'Escape') setRenamingId(null) }}
                          className="flex-1 font-[DM_Sans] text-sm bg-capp-warm-bg border-2 border-capp-coral/40 rounded-xl px-3 py-2 focus:outline-none"
                        />
                        <button onClick={() => commitRename(circle.id)}
                          className="font-[DM_Sans] text-xs font-semibold text-capp-coral px-3 py-2 rounded-xl bg-capp-coral/10">
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="group">
                        <CircleRow circle={circle} members={members} onPress={onCirclePress(circle, members)} />
                        <button onClick={() => startRename(circle)}
                          className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity font-[DM_Sans] text-[10px] text-capp-dark/35 px-2 py-1 rounded-lg bg-capp-dark/5">
                          rename
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* New circle button */}
          <button onClick={() => onNewCircle(kid)}
            className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-capp-dark/[0.03] transition-colors border-t border-capp-dark/[0.04]">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-capp-dark/20 flex items-center justify-center shrink-0">
              <span className="text-capp-dark/35 text-sm font-bold">+</span>
            </div>
            <span className="font-[DM_Sans] text-sm font-medium text-capp-dark/45">New circle</span>
          </button>
        </div>
      )}
    </div>
  )
}

// ─── CirclePage ───────────────────────────────────────────────────────────────
export default function CirclePage() {
  const navigate = useNavigate()
  const { kids } = useKids()
  const { sendMessage, activeDmMomIds } = useCircle()

  // Circles, contacts & carpool posts in local state
  const [circles, setCircles] = useState(MOCK_CIRCLES)
  const [contactIds, setContactIds] = useState(MOCK_CONTACTS)
  const [carpoolPosts, setCarpoolPosts] = useState(MOCK_CARPOOL_POSTS)

  // Sheet state
  const [newCircleKid, setNewCircleKid] = useState(null)
  const [contactSheet, setContactSheet] = useState(null)
  const [showAddPeople, setShowAddPeople] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [showCarpool, setShowCarpool] = useState(false)
  const [carpoolDetail, setCarpoolDetail] = useState(null) // post object

  // Derived
  const contactMoms = contactIds.map((id) => MOCK_MOMS.find((m) => m.id === id)).filter(Boolean)
  const availableMoms = MOCK_MOMS.filter((m) => !contactIds.includes(m.id))

  function handleCreateCircle(kid, { name, memberIds }) {
    const id = `circle-custom-${Date.now()}`
    setCircles((prev) => [...prev, { id, kidId: kid.id, name, campId: null, memberIds }])
  }

  function handleRenameCircle(id, name) {
    setCircles((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)))
  }

  function handleAddToCircle(circleId, momId) {
    setCircles((prev) => prev.map((c) => c.id === circleId ? { ...c, memberIds: [...c.memberIds, momId] } : c))
  }

  function handleAddContact(id) {
    setContactIds((prev) => prev.includes(id) ? prev : [...prev, id])
  }

  function handleRemoveContact(id) {
    setContactIds((prev) => prev.filter((x) => x !== id))
  }

  function handleCarpoolPost({ dest, role, session, tocamp, fromcamp, neighborhood }) {
    const newPost = {
      id: `carpool-${Date.now()}`,
      momId: 'me',
      circleId: dest.circleData?.circle?.id ?? null,
      circleName: dest.name,
      convId: dest.convId,
      role,
      session,
      neighborhood,
      tocamp,
      fromcamp,
      ts: Date.now(),
    }
    setCarpoolPosts((prev) => [newPost, ...prev])
  }

  function handleClaimCarpool(postId, direction) {
    const post = carpoolPosts.find((p) => p.id === postId)
    if (!post) return
    const dir = post[direction]
    if (!dir) return
    const already = dir.claimedBy.includes('me')

    setCarpoolPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p
      const d = p[direction]
      if (!d) return p
      return {
        ...p,
        [direction]: {
          ...d,
          claimedBy: already ? d.claimedBy.filter((x) => x !== 'me') : [...d.claimedBy, 'me'],
        },
      }
    }))

    // On a new claim (not unclaim), auto-DM the driver with a pickup confirmation request
    if (!already && post.momId !== 'me') {
      const dirLabel = direction === 'tocamp' ? 'ride to camp' : 'ride home'
      const mom = MOCK_MOMS.find((m) => m.id === post.momId)
      const firstName = mom?.name?.split(' ')[0] ?? 'there'
      const msg = `Hi ${firstName}! I just claimed a spot for the ${dirLabel} carpool — ${post.session} week, ${post.neighborhood} area. Can you share the pickup address and what time to be ready? 🚗`
      sendMessage(`dm-${post.momId}`, msg)
      navigate(`/circle/dm/${post.momId}`)
    }
  }

  // Auto-DM a claimant on my own post to confirm pickup details
  function handleConfirmClaimant(claimMom, direction) {
    const dirLabel = direction === 'tocamp' ? 'ride to camp' : 'ride home'
    const firstName = claimMom.name.split(' ')[0]
    const post = carpoolPosts.find((p) => p.momId === 'me') // active "my" post
    const session = post?.session ?? ''
    const neighborhood = post?.neighborhood ?? ''
    const msg = `Hi ${firstName}! 🚗 You claimed a spot for the ${dirLabel} carpool — ${session} week, ${neighborhood} area. Can you send me your pickup address and what time your kid needs to be there? I'll confirm the full schedule!`
    sendMessage(`dm-${claimMom.id}`, msg)
    navigate(`/circle/dm/${claimMom.id}`)
  }

  // Navigate to chat from carpool success
  function handleViewCarpoolChat(dest) {
    if (dest.circleData) {
      const { camp, circle } = dest.circleData
      navigate(`/circle/group/${circle.campId ?? circle.id}`, {
        state: {
          circleName: circle.name,
          circleIcon: camp?.icon ?? '💬',
          circleAccent: camp?.accent ?? '#FFD166',
          circleMemberIds: circle.memberIds,
        },
      })
    } else {
      const momId = dest.convId.replace('dm-', '')
      navigate(`/circle/dm/${momId}`)
    }
  }

  // Navigate to group chat, passing circle info as state fallback
  function circlePressFn(circle, members) {
    return () => {
      const camp = circle.campId ? camps.find((c) => c.id === circle.campId) : null
      navigate(`/circle/group/${circle.campId ?? circle.id}`, {
        state: {
          circleName: circle.name,
          circleIcon: camp?.icon ?? '💬',
          circleAccent: camp?.accent ?? '#FFD166',
          circleMemberIds: circle.memberIds,
        },
      })
    }
  }

  // Active DM conversations (mock + user-created)
  const dmMoms = activeDmMomIds.map((id) => MOCK_MOMS.find((m) => m.id === id)).filter(Boolean)

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-capp-dark/5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 active:opacity-70 transition-opacity">
            <div className="w-8 h-8 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm">
              <span className="font-[Fraunces] text-capp-dark font-bold leading-none">C</span>
            </div>
            <span className="font-[Fraunces] font-bold text-capp-dark text-xl">CAPP</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowInvite(true)}
              className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Invite a friend">
              <span className="text-base leading-none">👯</span>
            </button>
            <button onClick={() => navigate('/ai-chat')}
              className="w-9 h-9 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Chat with AI assistant">
              <span className="text-capp-dark text-base leading-none font-bold">✦</span>
            </button>
            <NotificationBell />
          </div>
        </div>
        <h1 className="font-[Fraunces] font-bold text-capp-dark text-2xl">My Circle</h1>
        <p className="font-[DM_Sans] text-sm text-capp-dark/50">Your camp community</p>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-6">

        {/* ── No kids ── */}
        {kids.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-4">💬</span>
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-2">Your circle starts here</h2>
            <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed mb-6">
              Add your kids to start building your circle community.
            </p>
            <button onClick={() => navigate('/add-kid')}
              className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold px-6 py-3.5 rounded-2xl shadow-md active:scale-95 transition-transform">
              Add a kid
            </button>
          </div>
        )}

        {/* ── Messages ── */}
        {dmMoms.length > 0 && (
          <section>
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-3">Messages</p>
            <div className="flex flex-col gap-2">
              {dmMoms.map((mom) => (
                <DMRow key={mom.id} mom={mom} onPress={() => navigate(`/circle/dm/${mom.id}`)} />
              ))}
            </div>
          </section>
        )}

        {/* ── Kid sections ── */}
        {kids.length > 0 && (
          <section>
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-3">Circles</p>
            <div className="flex flex-col gap-3">
              {kids.map((kid) => (
                <KidSection
                  key={kid.id}
                  kid={kid}
                  kidCircles={circles.filter((c) => c.kidId === kid.id)}
                  allContacts={contactMoms}
                  onNewCircle={setNewCircleKid}
                  onCirclePress={circlePressFn}
                  onRenameCircle={handleRenameCircle}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── Community / Contacts ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider">Community</p>
            <button onClick={() => setShowAddPeople(true)}
              className="font-[DM_Sans] text-xs font-semibold text-capp-coral">
              + Add people
            </button>
          </div>

          {contactMoms.length === 0 ? (
            <div className="bg-white rounded-2xl px-5 py-6 text-center shadow-sm">
              <p className="font-[DM_Sans] text-sm text-capp-dark/50 leading-relaxed mb-4">
                Add parents from your kids' camps to message them or add them to circles.
              </p>
              <button onClick={() => setShowAddPeople(true)}
                className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform">
                Add people
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="divide-y divide-capp-dark/[0.04]">
                {contactMoms.map((mom) => (
                  <button key={mom.id} onClick={() => setContactSheet(mom)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-capp-dark/[0.03] transition-colors text-left">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white font-[Fraunces] shrink-0"
                      style={{ backgroundColor: mom.avatarColor }}>{mom.name[0]}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{mom.name}</p>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/40 truncate">{mom.kidName}'s mom · {mom.location}</p>
                    </div>
                    <span className="text-capp-dark/20 text-sm shrink-0">›</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── Carpool ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider">Carpool</p>
            <button onClick={() => setShowCarpool(true)}
              className="font-[DM_Sans] text-xs font-semibold text-capp-coral">
              + Post
            </button>
          </div>
          {carpoolPosts.length === 0 ? (
            <button onClick={() => setShowCarpool(true)}
              className="w-full bg-white rounded-2xl px-4 py-4 shadow-sm border border-capp-dark/[0.06] text-left active:scale-[0.98] transition-transform flex items-center gap-3">
              <span className="text-2xl">🚗</span>
              <div>
                <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark">Carpool with your circle</p>
                <p className="font-[DM_Sans] text-xs text-capp-dark/45 mt-0.5">Find or offer rides to camp</p>
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              {carpoolPosts.map((post) => (
                <CarpoolPostCard key={post.id} post={post} onPress={() => setCarpoolDetail(post)} />
              ))}
            </div>
          )}
        </section>

      </div>

      {/* ── Sheets ── */}
      {showCarpool && (
        <CarpoolFlowSheet
          kids={kids}
          circles={circles}
          contacts={contactMoms}
          onClose={() => setShowCarpool(false)}
          onViewChat={handleViewCarpoolChat}
          onPost={handleCarpoolPost}
        />
      )}

      {carpoolDetail && (() => {
        const livePost = carpoolPosts.find((p) => p.id === carpoolDetail.id) ?? carpoolDetail
        const mom = MOCK_MOMS.find((m) => m.id === livePost.momId) ?? { name: 'You', avatarColor: '#FFD166', location: '', kidName: '', kidAge: '' }
        return (
          <CarpoolDetailSheet
            post={livePost}
            mom={mom}
            onMessage={() => {
              setCarpoolDetail(null)
              if (livePost.momId !== 'me') navigate(`/circle/dm/${livePost.momId}`)
            }}
            onClaim={handleClaimCarpool}
            onConfirmClaimant={handleConfirmClaimant}
            onClose={() => setCarpoolDetail(null)}
          />
        )
      })()}

      {showInvite && <InviteSheet onClose={() => setShowInvite(false)} />}

      {newCircleKid && (
        <NewCircleSheet
          kid={newCircleKid}
          contacts={contactMoms}
          onCreate={(data) => handleCreateCircle(newCircleKid, data)}
          onClose={() => setNewCircleKid(null)}
        />
      )}

      {contactSheet && (
        <ContactSheet
          mom={contactSheet}
          circles={circles}
          onMessage={() => { setContactSheet(null); navigate(`/circle/dm/${contactSheet.id}`) }}
          onAddToCircle={handleAddToCircle}
          onRemove={handleRemoveContact}
          onClose={() => setContactSheet(null)}
        />
      )}

      {showAddPeople && (
        <AddPeopleSheet
          available={availableMoms}
          onAdd={handleAddContact}
          onClose={() => setShowAddPeople(false)}
        />
      )}
    </div>
  )
}
