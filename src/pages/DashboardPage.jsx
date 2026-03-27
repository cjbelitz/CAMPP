import { useNavigate } from 'react-router-dom'
import { useKids } from '../context/KidsContext'
import { useSaved } from '../context/SavedCampsContext'
import { camps } from '../data/camps'
import { getSuggestedCamps } from '../utils/getSuggestedCamps'
import { daysUntil, deadlineColor, deadlineLabel } from '../utils/formatRelativeTime'
import CampCard from '../components/CampCard'
import NotificationBell from '../components/NotificationBell'
import KidAvatar from '../components/KidAvatar'
import { useAuth } from '../context/AuthContext'

function getGreeting(name) {
  const h = new Date().getHours()
  const first = name ? `, ${name.split(' ')[0]}` : ''
  if (h < 12) return `Good morning${first} ☀️`
  if (h < 17) return `Good afternoon${first} 👋`
  return `Good evening${first} 🌙`
}

// ── Shared sub-components ──────────────────────────────────────────────────────

function Card({ children }) {
  return <div className="bg-white rounded-2xl shadow-sm overflow-hidden">{children}</div>
}

function CardHeader({ label, onAction, actionLabel }) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <p className="font-[DM_Sans] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">{label}</p>
      {onAction && (
        <button onClick={onAction} className="font-[DM_Sans] text-xs font-semibold text-capp-coral">
          {actionLabel}
        </button>
      )}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-capp-dark/5 mx-4" />
}

function DeadlineRow({ camp, session, isLast }) {
  const days = daysUntil(camp.regDeadline)
  const color = deadlineColor(days)
  const label = deadlineLabel(days)
  const hasSession = !!session

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 active:bg-capp-warm-bg transition-colors`}
      onClick={() => {}}
    >
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ backgroundColor: `${camp.accent}18` }}
      >
        {camp.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark leading-tight truncate">{camp.name}</p>
        <p className="font-[DM_Sans] text-xs text-capp-dark/40 mt-0.5">
          {hasSession ? `${session} · ${camp.location}` : `${camp.location}`}
        </p>
      </div>
      {hasSession ? (
        <span className="font-[DM_Sans] text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
          ✓ Saved
        </span>
      ) : (
        <div className="flex flex-col items-end shrink-0">
          <span
            className="font-[DM_Sans] text-xs font-bold text-white px-2.5 py-1 rounded-full"
            style={{ backgroundColor: color }}
          >
            {label}
          </span>
          <span className="font-[DM_Sans] text-[10px] text-capp-dark/30 mt-0.5">to register</span>
        </div>
      )}
      {!isLast && <span />}
    </div>
  )
}

function UpcomingRow({ camp, session, isLast }) {
  const countdown = formatSessionCountdown(session)
  const date = parseSessionStart(session)
  const month = date.toLocaleDateString('en-US', { month: 'short' })
  const day = date.getDate()

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div
        className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0"
        style={{ backgroundColor: `${camp.accent}18` }}
      >
        <span className="font-[DM_Sans] text-[9px] font-bold uppercase" style={{ color: camp.accent }}>{month}</span>
        <span className="font-[Fraunces] font-bold text-capp-dark text-sm leading-none">{day}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark truncate">{camp.name}</p>
        <p className="font-[DM_Sans] text-xs text-capp-dark/40 mt-0.5">{session} · {camp.location}</p>
      </div>
      <span className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 shrink-0">{countdown}</span>
    </div>
  )
}

function PastCampPill({ campId }) {
  const camp = camps.find(c => c.id === campId)
  if (!camp) return null
  return (
    <span
      className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-[DM_Sans] font-semibold border"
      style={{ backgroundColor: `${camp.accent}12`, borderColor: `${camp.accent}30`, color: camp.accent }}
    >
      {camp.icon} {camp.name}
    </span>
  )
}

function KidSection({ kid }) {
  const navigate = useNavigate()
  const { savedIds } = useSaved()
  const suggested = getSuggestedCamps(kid, camps, savedIds)

  return (
    <section id={`kid-${kid.id}`} className="pt-2">
      <div className="flex items-center gap-3 mb-3">
        <KidAvatar kid={kid} size={44} rounded="xl" className="shadow-sm shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-base">{kid.name}</h2>
            <span className="font-[DM_Sans] text-xs text-capp-dark/40">{kid.age}y</span>
            {kid.isExample && (
              <span className="font-[DM_Sans] text-[10px] text-capp-dark/30 bg-capp-dark/5 px-1.5 py-0.5 rounded-full">
                example
              </span>
            )}
          </div>
          {kid.interests.length > 0 && (
            <p className="font-[DM_Sans] text-xs text-capp-dark/45 truncate">{kid.interests.join(' · ')}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/edit-kid/${kid.id}`)}
          className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center text-sm shadow-sm active:scale-95 transition-transform shrink-0"
        >
          ✏️
        </button>
      </div>

      {kid.pastCampIds.length > 0 && (
        <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide pb-1">
          {kid.pastCampIds.map(id => <PastCampPill key={id} campId={id} />)}
        </div>
      )}

      <div className="flex items-center justify-between mb-2.5">
        <p className="font-[Fraunces] font-bold text-capp-dark text-base">For {kid.name}</p>
        <button onClick={() => navigate('/camps')} className="font-[DM_Sans] text-xs font-semibold text-capp-coral">
          See all →
        </button>
      </div>

      {suggested.length === 0 ? (
        <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
          <p className="font-[DM_Sans] text-sm text-capp-dark/50 mb-2">No camps match {kid.name}'s age and interests yet.</p>
          <button onClick={() => navigate('/camps')} className="font-[DM_Sans] text-sm font-semibold text-capp-coral">
            Browse all camps →
          </button>
        </div>
      ) : (
        <div
          className="flex gap-3 -mx-4 px-4 overflow-x-scroll scrollbar-hide pb-3"
          style={{ overscrollBehaviorX: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {suggested.slice(0, 8).map(camp => (
            <div key={camp.id} className="shrink-0">
              <CampCard camp={camp} forKid={kid} compact />
            </div>
          ))}
          {/* End-of-row nudge to browse all */}
          <button
            onClick={() => navigate('/camps')}
            className="shrink-0 w-[120px] rounded-2xl border-2 border-dashed border-capp-dark/15 flex flex-col items-center justify-center gap-2 text-capp-dark/35 active:bg-capp-warm-bg transition-colors"
          >
            <span className="text-2xl">🏕️</span>
            <span className="font-[DM_Sans] text-xs font-semibold">See all →</span>
          </button>
        </div>
      )}
    </section>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { kids } = useKids()
  const { savedEntries, savedIds } = useSaved()
  const hasExamples = kids.some(k => k.isExample)

  const savedCamps = camps.filter(c => savedIds.includes(c.id))

  // Deadline items: saved camps first, fallback to hot/almost-full
  const deadlineItems = savedCamps.length > 0
    ? savedCamps
        .map(c => ({ camp: c, session: savedEntries.find(e => e.id === c.id)?.session ?? null }))
        .sort((a, b) => daysUntil(a.camp.regDeadline) - daysUntil(b.camp.regDeadline))
        .slice(0, 3)
    : camps
        .filter(c => ['hot', 'almost-full'].includes(c.status))
        .sort((a, b) => daysUntil(a.regDeadline) - daysUntil(b.regDeadline))
        .slice(0, 3)
        .map(c => ({ camp: c, session: null }))

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* ── Header ── */}
      <div className="px-4 pt-12 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm">
              <span className="font-[Fraunces] text-capp-dark font-bold leading-none">C</span>
            </div>
            <span className="font-[Fraunces] font-bold text-capp-dark text-xl">CAMPP</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-[DM_Sans] text-xs font-semibold text-capp-coral bg-capp-coral/10 border border-capp-coral/20 rounded-full px-2.5 py-1">
              N. County SD
            </span>
            <button
              onClick={() => navigate('/ai-chat')}
              className="w-9 h-9 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Chat with AI assistant"
            >
              <span className="text-capp-dark text-base leading-none font-bold">✦</span>
            </button>
            <NotificationBell />
            <button
              onClick={() => navigate('/settings')}
              className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              aria-label="Settings"
            >
              <span className="text-base leading-none">⚙️</span>
            </button>
          </div>
        </div>
        <h1 className="font-[Fraunces] font-bold text-capp-dark text-2xl leading-tight">{getGreeting(user?.name)}</h1>
        <p className="font-[DM_Sans] text-sm text-capp-dark/50 mt-0.5">
          {kids.length === 0 ? 'Add your kids to get started' : "Here's your summer at a glance"}
        </p>
      </div>

      <div className="px-4 flex flex-col gap-3">

        {/* ── Example disclaimer ── */}
        {hasExamples && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <span className="text-base mt-0.5 shrink-0">💡</span>
            <div>
              <p className="font-[DM_Sans] text-xs font-semibold text-amber-800">These are sample profiles</p>
              <p className="font-[DM_Sans] text-xs text-amber-700/80 mt-0.5">Tap ✏️ on any kid to fill in your own details.</p>
            </div>
          </div>
        )}

        {/* ── Empty state ── */}
        {kids.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-capp-coral/10 flex items-center justify-center text-3xl mx-auto mb-4">
              👧
            </div>
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-2">Add your first kid</h2>
            <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed mb-5">
              We'll track their schedule, suggest the right camps, and help you plan the whole summer.
            </p>
            <button
              onClick={() => navigate('/add-kid')}
              className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold px-6 py-3 rounded-2xl active:scale-95 transition-transform"
            >
              Add a kid
            </button>
          </div>
        )}

        {/* ── Card 1: Deadlines ── */}
        <Card>
          <CardHeader
            label={savedCamps.length > 0 ? "Register before it's too late" : 'Filling up fast'}
            onAction={savedCamps.length > 0 ? () => navigate('/my-summer') : () => navigate('/camps')}
            actionLabel={savedCamps.length > 0 ? 'My Summer →' : 'Browse →'}
          />
          {deadlineItems.map(({ camp, session }, i) => (
            <div key={camp.id}>
              {i > 0 && <Divider />}
              <DeadlineRow camp={camp} session={session} isLast={i === deadlineItems.length - 1} />
            </div>
          ))}
          {savedCamps.length === 0 && (
            <div className="px-4 pb-4 pt-1">
              <button
                onClick={() => navigate('/camps')}
                className="w-full py-2.5 rounded-xl bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold text-sm active:scale-95 transition-transform"
              >
                Save a camp to track deadlines
              </button>
            </div>
          )}
        </Card>

        {/* ── Kids sections (suggested camps, below fold) ── */}
        {kids.length > 0 && (
          <div className="flex flex-col gap-8 pt-4 pb-2">
            {kids.map(kid => <KidSection key={kid.id} kid={kid} />)}
          </div>
        )}

      </div>
    </div>
  )
}
