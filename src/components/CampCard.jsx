import { useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'
import { MOCK_MOMS, MOCK_CIRCLE_SIGNUPS } from '../data/mockCircle'
import { daysUntil, deadlineColor, deadlineLabel } from '../utils/formatRelativeTime'
import StatusBadge, { SpotsLeft } from './StatusBadge'

export default function CampCard({ camp, forKid, compact = false }) {
  const navigate = useNavigate()
  const { isSaved, toggle, bookedSessions } = useSaved()
  const saved = isSaved(camp.id)

  const openSessions = forKid
    ? camp.sessions.filter((s) => !bookedSessions.includes(s))
    : []
  const hasAvailability = forKid && openSessions.length > 0

  const days = camp.regDeadline ? daysUntil(camp.regDeadline) : null
  const showDeadline = days !== null && days <= 14

  const circleSignups = forKid ? (MOCK_CIRCLE_SIGNUPS[camp.id] ?? []) : []

  // ── Compact card (dashboard horizontal scroll) ───────────────────────────
  if (compact) {
    const badge = showDeadline
      ? { bg: `${deadlineColor(days)}15`, border: `1px solid ${deadlineColor(days)}30`, icon: '⏰', text: `${deadlineLabel(days)} left`, color: deadlineColor(days) }
      : hasAvailability
        ? { bg: '#ecfdf5', border: '1px solid #bbf7d0', icon: '📅', text: `${openSessions.length} week${openSessions.length !== 1 ? 's' : ''} open`, color: '#047857' }
        : null

    const circleShown = circleSignups.slice(0, 2)

    return (
      <div
        onClick={() => navigate(`/camps/${camp.id}`)}
        className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer flex flex-col"
        style={{ width: 220 }}
      >
        {/* Colored top band */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: camp.accent }} />

        <div className="p-3.5 flex flex-col flex-1">
          {/* Icon + name + heart */}
          <div className="flex items-start gap-2.5 mb-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: camp.accentLight }}
            >
              {camp.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-[League_Spartan] font-bold text-capp-dark text-sm leading-tight line-clamp-2 uppercase">
                {camp.name}
              </h3>
              <p className="font-[Montserrat] text-[10px] text-capp-dark/45 mt-0.5 truncate">📍 {camp.location}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); toggle(camp.id) }}
              className="text-lg shrink-0 active:scale-90 transition-transform"
              aria-label={saved ? 'Remove from saved' : 'Save camp'}
            >
              {saved ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Rating + age + price */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1">
              <span className="text-capp-yellow text-xs">★</span>
              <span className="font-[Montserrat] text-xs font-semibold text-capp-dark">{camp.rating}</span>
              <span className="font-[Montserrat] text-[10px] text-capp-dark/35 ml-1">· Ages {camp.ageMin}–{camp.ageMax}</span>
            </div>
            <div className="flex items-center gap-0.5">
              <span className="font-[League_Spartan] font-bold text-capp-dark text-sm">${camp.price}</span>
              <span className="font-[Montserrat] text-[10px] text-capp-dark/40">/{camp.priceType}</span>
            </div>
          </div>

          {/* One key badge */}
          {badge && (
            <div
              className="flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 mb-2"
              style={{ backgroundColor: badge.bg, border: badge.border }}
            >
              <span className="text-xs">{badge.icon}</span>
              <span className="font-[Montserrat] text-xs font-semibold leading-none" style={{ color: badge.color }}>
                {badge.text}
              </span>
            </div>
          )}

          {/* Circle hint */}
          {circleShown.length > 0 && (
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 rounded-xl px-2.5 py-1.5 mb-2">
              <div className="flex -space-x-1 shrink-0">
                {circleShown.map(s => {
                  const mom = MOCK_MOMS.find(m => m.kidName === s.kidName)
                  return (
                    <div
                      key={s.kidName}
                      className="w-4 h-4 rounded-full border border-violet-50 flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: mom?.avatarColor ?? '#A78BFA' }}
                    >
                      {s.kidName[0]}
                    </div>
                  )
                })}
              </div>
              <p className="font-[Montserrat] text-[10px] font-semibold text-violet-700 truncate">
                {circleShown.map(s => s.kidName).join(' & ')} going
              </p>
            </div>
          )}

          <div className="mt-auto pt-2">
            <StatusBadge status={camp.status} size="sm" />
          </div>
        </div>
      </div>
    )
  }

  // ── Full card (camps browse page) ────────────────────────────────────────
  return (
    <div
      onClick={() => navigate(`/camps/${camp.id}`)}
      className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-[0.98] transition-transform cursor-pointer"
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: camp.accent }} />

      <div className="p-4">
        <div className="flex items-start gap-3 mb-2.5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: camp.accentLight, border: `1.5px solid ${camp.accent}30` }}
          >
            {camp.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-[League_Spartan] font-bold text-capp-dark text-[15px] leading-tight uppercase">
              {camp.name}
            </h3>
            <p className="font-[Montserrat] text-xs text-capp-dark/50 mt-0.5">📍 {camp.location}</p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); toggle(camp.id) }}
              className="text-xl active:scale-90 transition-transform"
              aria-label={saved ? 'Remove from saved' : 'Save camp'}
            >
              {saved ? '❤️' : '🤍'}
            </button>
            <div className="flex items-center gap-0.5">
              <span className="text-capp-yellow text-xs">★</span>
              <span className="font-[Montserrat] text-xs font-semibold text-capp-dark">{camp.rating}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2.5">
          <StatusBadge status={camp.status} />
          <SpotsLeft spotsLeft={camp.spotsLeft} status={camp.status} />
        </div>

        {showDeadline && (
          <div
            className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 mb-2.5"
            style={{ backgroundColor: `${deadlineColor(days)}15`, border: `1px solid ${deadlineColor(days)}30` }}
          >
            <span className="text-xs">⏰</span>
            <span className="font-[Montserrat] text-xs font-bold" style={{ color: deadlineColor(days) }}>
              Register in {deadlineLabel(days)} — {days <= 7 ? 'almost gone!' : 'spots filling'}
            </span>
          </div>
        )}

        {hasAvailability && (
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5 mb-2.5">
            <span className="text-xs">📅</span>
            <span className="font-[Montserrat] text-xs font-semibold text-emerald-700">
              {forKid.name} has {openSessions.length} week{openSessions.length !== 1 ? 's' : ''} open
            </span>
          </div>
        )}

        {circleSignups.length > 0 && (() => {
          const shown = circleSignups.slice(0, 2)
          const names = shown.map(s => s.kidName)
          const nameStr = names.length === 1 ? names[0] : `${names[0]} & ${names[1]}`
          const isAre = names.length === 1 ? 'is' : 'are'
          const sessions = [...new Set(shown.map(s => s.session))]
          const sessionStr = sessions.length === 1 ? sessions[0] : 'multiple weeks'
          const extraCount = circleSignups.length - shown.length
          return (
            <div className="flex items-start gap-2 bg-violet-50 border border-violet-200 rounded-xl px-3 py-2 mb-2.5">
              <div className="flex -space-x-1.5 shrink-0 mt-0.5">
                {shown.map(s => {
                  const mom = MOCK_MOMS.find(m => m.momId === s.momId || m.kidName === s.kidName)
                  return (
                    <div
                      key={s.kidName}
                      className="w-5 h-5 rounded-full border-2 border-violet-50 flex items-center justify-center text-[9px] font-bold text-white"
                      style={{ backgroundColor: mom?.avatarColor ?? '#A78BFA' }}
                    >
                      {s.kidName[0]}
                    </div>
                  )
                })}
              </div>
              <p className="font-[Montserrat] text-xs font-semibold text-violet-700 leading-snug">
                {nameStr} {isAre} signed up{extraCount > 0 ? ` +${extraCount} more` : ''} · {sessionStr}
              </p>
            </div>
          )
        })()}

        <p className="font-[Montserrat] text-sm text-capp-dark/65 leading-relaxed mb-3 line-clamp-2">
          {camp.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {camp.tags.map((tag) => (
            <span
              key={tag}
              className="font-[Montserrat] text-xs px-2.5 py-1 rounded-full"
              style={{ backgroundColor: camp.accentLight, color: camp.accent }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-capp-dark/5 pt-3">
          <span className="font-[Montserrat] text-xs text-capp-dark/40">Ages {camp.ageMin}–{camp.ageMax}</span>
          <div className="flex items-center gap-1">
            <span className="font-[League_Spartan] font-bold text-capp-dark text-base">${camp.price}</span>
            <span className="font-[Montserrat] text-xs text-capp-dark/40">/{camp.priceType}</span>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/camps/${camp.id}`) }}
          className="w-full py-3 rounded-xl font-[Montserrat] font-semibold text-sm text-capp-dark bg-capp-coral active:scale-95 transition-transform"
        >
          View Details
        </button>
      </div>
    </div>
  )
}
