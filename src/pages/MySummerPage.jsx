import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'
import { useKids } from '../context/KidsContext'
import { camps, SUMMER_WEEKS } from '../data/camps'
import { daysUntil, deadlineColor, deadlineLabel } from '../utils/formatRelativeTime'
import KidAvatar from '../components/KidAvatar'

// ── Calendar export helpers ──────────────────────────────────────────────────
const MONTHS = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5, Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 }

function weekToDateRange(week) {
  const [startPart, endPart] = week.split('–')
  const startTokens = startPart.trim().split(' ')
  const startMonth = MONTHS[startTokens[0]]
  const startDay = parseInt(startTokens[1])
  const endTokens = endPart.trim().split(' ')
  const endMonth = endTokens.length === 2 ? MONTHS[endTokens[0]] : startMonth
  const endDay = parseInt(endTokens[endTokens.length - 1])
  return {
    start: new Date(2026, startMonth, startDay),
    end: new Date(2026, endMonth, endDay + 1), // DTEND is exclusive in iCal
  }
}

function toICSDate(date) {
  return `${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`
}

function escapeICS(str) {
  return (str ?? '').replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n')
}

function generateICS(savedEntries, allCamps, customEvents) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CAPP//Summer 2026//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  savedEntries.forEach((entry) => {
    if (!entry.session) return
    const camp = allCamps.find((c) => c.id === entry.id)
    if (!camp) return
    const { start, end } = weekToDateRange(entry.session)
    lines.push(
      'BEGIN:VEVENT',
      `UID:camp-${camp.id}-${entry.session.replace(/\s/g,'')}@capp`,
      `DTSTART;VALUE=DATE:${toICSDate(start)}`,
      `DTEND;VALUE=DATE:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(camp.name)}`,
      `DESCRIPTION:${escapeICS(camp.description ?? '')}\\nLocation: ${escapeICS(camp.location)}\\nPrice: $${camp.price}/wk`,
      `LOCATION:${escapeICS(camp.location + ', North County San Diego')}`,
      'END:VEVENT',
    )
  })

  customEvents.forEach((ev) => {
    const { start, end } = weekToDateRange(ev.week)
    lines.push(
      'BEGIN:VEVENT',
      `UID:event-${ev.id}@capp`,
      `DTSTART;VALUE=DATE:${toICSDate(start)}`,
      `DTEND;VALUE=DATE:${toICSDate(end)}`,
      `SUMMARY:${escapeICS(ev.emoji + ' ' + ev.label)}`,
      'END:VEVENT',
    )
  })

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}

function downloadICS(savedEntries, allCamps, customEvents) {
  const content = generateICS(savedEntries, allCamps, customEvents)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-summer-2026.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const EVENT_TYPES = [
  { type: 'vacation',    label: 'Family Vacation', emoji: '🏖️', color: '#818CF8' },
  { type: 'family',      label: 'Family in Town',  emoji: '🏡', color: '#34D399' },
  { type: 'appointment', label: 'Appointment',     emoji: '📅', color: '#F87171' },
  { type: 'custom',      label: 'Custom',          emoji: '✏️', color: '#A78BFA' },
]

function useCustomEvents() {
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('capp-custom-events') ?? 'null') ?? [] }
    catch { return [] }
  })
  useEffect(() => {
    localStorage.setItem('capp-custom-events', JSON.stringify(events))
  }, [events])
  const addEvent = (event) => setEvents((prev) => [...prev, { ...event, id: `ev-${Date.now()}` }])
  const removeEvent = (id) => setEvents((prev) => prev.filter((e) => e.id !== id))
  return { events, addEvent, removeEvent }
}

function AddEventSheet({ onClose, onAdd }) {
  const [selectedType, setSelectedType] = useState(EVENT_TYPES[0])
  const [customLabel, setCustomLabel] = useState('')
  const [selectedWeek, setSelectedWeek] = useState(SUMMER_WEEKS[0])

  const label = selectedType.type === 'custom' ? customLabel.trim() : selectedType.label
  const canAdd = label.length > 0

  function handleAdd() {
    if (!canAdd) return
    onAdd({
      label,
      emoji: selectedType.emoji,
      color: selectedType.color,
      week: selectedWeek,
      type: selectedType.type,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl shadow-2xl px-5 pt-5 pb-8"
        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto mb-5" />

        <h2 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-4">Add to Calendar</h2>

        {/* Event type pills */}
        <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wide mb-2">Event type</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {EVENT_TYPES.map((et) => (
            <button
              key={et.type}
              onClick={() => setSelectedType(et)}
              className="flex items-center gap-2.5 px-3 py-3 rounded-xl border-2 transition-all active:scale-95 text-left"
              style={selectedType.type === et.type
                ? { backgroundColor: `${et.color}18`, borderColor: et.color }
                : { backgroundColor: 'white', borderColor: '#e2e8f0' }}
            >
              <span className="text-xl">{et.emoji}</span>
              <span className="font-[DM_Sans] text-sm font-semibold text-capp-dark">{et.label}</span>
            </button>
          ))}
        </div>

        {/* Custom label input */}
        {selectedType.type === 'custom' && (
          <div className="mb-4">
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wide mb-2">Event name</p>
            <input
              type="text"
              placeholder="e.g. Beach trip, Grandma visiting…"
              value={customLabel}
              onChange={(e) => setCustomLabel(e.target.value)}
              className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-3 focus:outline-none focus:border-capp-coral/40"
              autoFocus
            />
          </div>
        )}

        {/* Week selector */}
        <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wide mb-2">Week</p>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-3 mb-5 focus:outline-none"
        >
          {SUMMER_WEEKS.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className="w-full py-4 rounded-2xl font-[DM_Sans] font-bold text-sm transition-all active:scale-95"
          style={{ backgroundColor: canAdd ? selectedType.color : '#e2e8f0', color: canAdd ? 'white' : '#94a3b8' }}
        >
          Add to My Summer
        </button>
      </div>
    </div>
  )
}

function DeadlineBadge({ regDeadline }) {
  if (!regDeadline) return null
  const days = daysUntil(regDeadline)
  if (days <= 0) return (
    <span className="font-[DM_Sans] text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
      Deadline passed
    </span>
  )
  const color = deadlineColor(days)
  const label = deadlineLabel(days)
  return (
    <span className="font-[DM_Sans] text-xs font-bold text-white px-2.5 py-0.5 rounded-full" style={{ backgroundColor: color }}>
      ⏰ {label} left
    </span>
  )
}

function parseWeekLabel(week) {
  const [monthPart] = week.split('–')
  const parts = monthPart.trim().split(' ')
  return { mon: parts[0], day: parts[1] }
}

function SummerCalendar({ savedEntries, allCamps, kids, navigate, assignKid, selectedKidId, onKidSelect, isRegistered, customEvents, onRemoveEvent }) {
  const [assigningId, setAssigningId] = useState(null)

  const kidCampCounts = {}
  savedEntries.forEach((e) => {
    if (e.kidId) kidCampCounts[e.kidId] = (kidCampCounts[e.kidId] ?? 0) + 1
  })

  const timelineEntries = selectedKidId
    ? savedEntries.filter((e) => e.kidId === selectedKidId)
    : savedEntries

  const weekMap = {}
  SUMMER_WEEKS.forEach((w) => { weekMap[w] = [] })
  timelineEntries.forEach((entry) => {
    if (!entry.session || !weekMap[entry.session]) return
    const camp = allCamps.find((c) => c.id === entry.id)
    if (!camp) return
    const kid = entry.kidId ? kids.find((k) => k.id === entry.kidId) : null
    weekMap[entry.session].push({ type: 'camp', camp, kid, entry })
  })

  // Add custom events to weekMap
  customEvents.forEach((ev) => {
    if (weekMap[ev.week]) weekMap[ev.week].push({ type: 'event', event: ev })
  })

  const hasAnyCamps = savedEntries.length > 0

  return (
    <div>
      {/* Kid profile cards */}
      {kids.length > 0 && (
        <div className="flex justify-center gap-5 mb-4 flex-wrap">
          {kids.map((kid) => {
            const count = kidCampCounts[kid.id] ?? 0
            const isSelected = selectedKidId === kid.id
            const isDimmed = selectedKidId && !isSelected
            return (
              <button
                key={kid.id}
                onClick={() => onKidSelect(isSelected ? null : kid.id)}
                className={`flex flex-col items-center gap-2 transition-all active:scale-95 ${isDimmed ? 'opacity-30' : ''}`}
              >
                <div className="relative">
                  <KidAvatar
                    kid={kid}
                    size={72}
                    rounded="full"
                    className="shadow-md"
                    style={{
                      border: isSelected ? `3px solid ${kid.avatarColor}` : '3px solid white',
                      boxShadow: isSelected
                        ? `0 0 0 3px ${kid.avatarColor}55, 0 4px 12px rgba(0,0,0,0.15)`
                        : '0 2px 8px rgba(0,0,0,0.12)',
                    }}
                  />
                  {count > 0 && (
                    <div
                      className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-[DM_Sans] border-2 border-white"
                      style={{ backgroundColor: kid.avatarColor }}
                    >
                      {count}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-[Fraunces] font-bold text-sm leading-tight text-capp-dark">{kid.name}</p>
                  <p className="font-[DM_Sans] text-[10px] text-capp-dark/40">{kid.age}y · {count} camp{count !== 1 ? 's' : ''}</p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedKidId && (() => {
        const kid = kids.find((k) => k.id === selectedKidId)
        return (
          <div className="flex items-center justify-between bg-capp-dark/5 rounded-xl px-3 py-2 mb-3">
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60">Showing {kid?.name}'s camps</p>
            <button onClick={() => onKidSelect(null)} className="font-[DM_Sans] text-xs font-semibold text-capp-coral">Show all →</button>
          </div>
        )
      })()}

      <div className="h-px bg-capp-dark/6 mb-4" />

      <div className="flex flex-col">
        {SUMMER_WEEKS.map((week, idx) => {
          const entries = weekMap[week] || []
          const isEmpty = entries.length === 0
          const { mon, day } = parseWeekLabel(week)
          const isLastWeek = idx === SUMMER_WEEKS.length - 1

          const kidIds = entries.filter((e) => e.type === 'camp').map((e) => e.entry.kidId).filter(Boolean)
          const hasConflict = kidIds.length !== new Set(kidIds).size

          return (
            <div key={week} className="flex gap-0 items-stretch">
              <div className="flex flex-col items-center w-14 shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full mt-3 shrink-0 transition-colors ${isEmpty ? 'bg-capp-dark/12' : 'bg-capp-dark/35'}`} />
                {!isLastWeek && <div className="w-px flex-1 bg-capp-dark/8 my-1" />}
              </div>

              <div className="w-10 shrink-0 pt-1.5 mr-3">
                <p className={`font-[DM_Sans] text-[9px] font-semibold uppercase tracking-wide leading-none ${isEmpty ? 'text-capp-dark/20' : 'text-capp-dark/40'}`}>{mon}</p>
                <p className={`font-[Fraunces] font-bold text-sm leading-tight ${isEmpty ? 'text-capp-dark/18' : 'text-capp-dark'}`}>{day}</p>
              </div>

              <div className="flex-1 flex flex-col gap-1.5 py-1.5 pb-3 min-w-0">
                {isEmpty ? (
                  <div className="h-7 flex items-center">
                    <div className="h-px w-full bg-capp-dark/6" />
                  </div>
                ) : (
                  <>
                    {hasConflict && (
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-2.5 py-1.5 mb-0.5">
                        <span className="text-xs">⚠️</span>
                        <p className="font-[DM_Sans] text-xs font-semibold text-amber-700">Same kid has two camps this week</p>
                      </div>
                    )}
                    {entries.map((item) => {
                      if (item.type === 'event') {
                        const ev = item.event
                        return (
                          <div
                            key={ev.id}
                            className="flex items-center gap-2 rounded-xl px-3 py-2"
                            style={{ backgroundColor: `${ev.color}18`, border: `1.5px solid ${ev.color}45` }}
                          >
                            <span className="text-base shrink-0">{ev.emoji}</span>
                            <p className="font-[DM_Sans] text-xs font-semibold flex-1 min-w-0 truncate" style={{ color: ev.color }}>
                              {ev.label}
                            </p>
                            <button
                              onClick={() => onRemoveEvent(ev.id)}
                              className="text-[10px] text-capp-dark/25 hover:text-capp-dark/50 active:opacity-60 shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        )
                      }
                      const { camp, kid, entry } = item
                      const registered = isRegistered(camp.id)
                      return (
                        <div key={`${camp.id}-${entry.session}`} className="relative">
                          <button
                            onClick={() => navigate(`/camps/${camp.id}`)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-left active:scale-[0.98] transition-transform w-full"
                            style={registered ? {
                              backgroundColor: '#FEFCE8',
                              border: '1.5px solid #EAB30855',
                            } : {
                              backgroundColor: kid ? `${kid.avatarColor}18` : 'rgba(0,0,0,0.04)',
                              border: `1.5px solid ${kid ? `${kid.avatarColor}45` : 'rgba(0,0,0,0.08)'}`,
                            }}
                          >
                            <span className="text-base shrink-0">{camp.icon}</span>
                            <div className="flex-1 min-w-0">
                              <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark leading-tight truncate">
                                {registered && <span className="text-yellow-600 mr-1">✓</span>}{camp.name}
                              </p>
                              <p className="font-[DM_Sans] text-[10px] text-capp-dark/40 mt-0.5">${camp.price}/wk · {camp.location}</p>
                            </div>
                            {kid ? (
                              <KidAvatar kid={kid} size={24} rounded="full" className="shrink-0" />
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); setAssigningId(assigningId === camp.id ? null : camp.id) }}
                                className="text-[10px] font-[DM_Sans] text-capp-coral font-semibold shrink-0 active:opacity-60"
                              >
                                Assign
                              </button>
                            )}
                          </button>

                          {assigningId === camp.id && (
                            <div className="flex items-center gap-3 mt-1.5 pl-1">
                              <span className="font-[DM_Sans] text-[10px] text-capp-dark/40">Who?</span>
                              {kids.map((k) => (
                                <button
                                  key={k.id}
                                  onClick={() => { assignKid(camp.id, k.id); setAssigningId(null) }}
                                  className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
                                >
                                  <KidAvatar kid={k} size={32} rounded="full" />
                                  <span className="font-[DM_Sans] text-[9px] text-capp-dark/60">{k.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {!hasAnyCamps && customEvents.length === 0 && (
        <p className="font-[DM_Sans] text-sm text-capp-dark/35 text-center mt-4">
          Save camps to see them on your timeline
        </p>
      )}

      {selectedKidId && timelineEntries.length === 0 && (
        <p className="font-[DM_Sans] text-sm text-capp-dark/35 text-center mt-4">
          No camps assigned to {kids.find((k) => k.id === selectedKidId)?.name} yet
        </p>
      )}
    </div>
  )
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function MonthGrid({ month, year, name, dayMap, navigate, isRegistered }) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4">
      <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg mb-3">{name} {year}</h3>
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center font-[DM_Sans] text-[10px] font-semibold text-capp-dark/35 uppercase tracking-wide py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />
          const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
          const items = dayMap[key] ?? []
          const today = new Date()
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

          return (
            <div key={day} className={`min-h-[48px] rounded-lg p-0.5 flex flex-col gap-0.5 ${items.length > 0 ? 'bg-capp-warm-bg' : ''}`}>
              <span className={`font-[DM_Sans] text-xs font-semibold self-center w-6 h-6 flex items-center justify-center rounded-full mb-0.5 ${
                isToday ? 'bg-capp-coral text-capp-dark' : items.length > 0 ? 'text-capp-dark' : 'text-capp-dark/25'
              }`}>
                {day}
              </span>
              {items.slice(0, 2).map((item, idx) => {
                if (item.type === 'event') {
                  return (
                    <div key={idx} className="text-[8px] font-[DM_Sans] font-semibold px-1 py-0.5 rounded truncate leading-tight"
                      style={{ backgroundColor: `${item.event.color}25`, color: item.event.color }}>
                      {item.event.emoji} {item.event.label}
                    </div>
                  )
                }
                const reg = isRegistered(item.camp.id)
                return (
                  <button key={idx}
                    onClick={() => navigate(`/camps/${item.camp.id}`)}
                    className="text-[8px] font-[DM_Sans] font-semibold px-1 py-0.5 rounded truncate leading-tight text-left active:opacity-70"
                    style={reg
                      ? { backgroundColor: '#FEF08A', color: '#854d0e' }
                      : { backgroundColor: `${item.camp.accent}25`, color: item.camp.accent }}>
                    {item.camp.icon} {item.camp.name}
                  </button>
                )
              })}
              {items.length > 2 && (
                <div className="text-[8px] font-[DM_Sans] text-capp-dark/35 px-1">+{items.length - 2}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function MonthView({ savedEntries, allCamps, customEvents, navigate, isRegistered }) {
  // Build a day → items map
  const dayMap = {}
  const mark = (date, item) => {
    const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`
    if (!dayMap[key]) dayMap[key] = []
    dayMap[key].push(item)
  }

  savedEntries.forEach((entry) => {
    if (!entry.session) return
    const camp = allCamps.find((c) => c.id === entry.id)
    if (!camp) return
    const { start, end } = weekToDateRange(entry.session)
    const d = new Date(start)
    while (d < end) { mark(new Date(d), { type: 'camp', camp, entry }); d.setDate(d.getDate() + 1) }
  })

  customEvents.forEach((ev) => {
    const { start, end } = weekToDateRange(ev.week)
    const d = new Date(start)
    while (d < end) { mark(new Date(d), { type: 'event', event: ev }); d.setDate(d.getDate() + 1) }
  })

  return (
    <div className="flex flex-col gap-4">
      {[{ month: 5, name: 'June' }, { month: 6, name: 'July' }, { month: 7, name: 'August' }].map(({ month, name }) => (
        <MonthGrid key={month} month={month} year={2026} name={name} dayMap={dayMap} navigate={navigate} isRegistered={isRegistered} />
      ))}
    </div>
  )
}

export default function MySummerPage() {
  const navigate = useNavigate()
  const { savedIds, savedEntries, unsave, assignKid, markRegistered, isRegistered } = useSaved()
  const { kids } = useKids()
  const { events: customEvents, addEvent, removeEvent } = useCustomEvents()
  const savedCamps = camps.filter((c) => savedIds.includes(c.id))
  const getSession = (id) => savedEntries.find((e) => e.id === id)?.session ?? null
  const [view, setView] = useState('calendar')
  const [selectedKidId, setSelectedKidId] = useState(null)
  const [showAddEvent, setShowAddEvent] = useState(false)

  const selectedKid = selectedKidId ? kids.find((k) => k.id === selectedKidId) : null

  const filteredEntries = selectedKidId
    ? savedEntries.filter((e) => e.kidId === selectedKidId)
    : savedEntries
  const filteredTotal = filteredEntries.reduce((sum, e) => {
    const c = camps.find((c) => c.id === e.id)
    return sum + (c?.price ?? 0)
  }, 0)
  const filteredCamps = camps.filter((c) => filteredEntries.some((e) => e.id === c.id))
  const total = savedCamps.reduce((sum, c) => sum + c.price, 0)

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* ── Header ── */}
      <div className="px-4 pt-12 pb-4 border-b border-capp-dark/5 bg-white">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 mb-1 active:opacity-70 transition-opacity">
          <div className="w-7 h-7 rounded-lg bg-capp-coral flex items-center justify-center">
            <span className="font-[Fraunces] text-capp-dark text-sm font-bold leading-none">C</span>
          </div>
          <span className="font-[Fraunces] font-bold text-capp-dark text-lg">CAMPP</span>
        </button>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-[Fraunces] font-bold text-capp-dark text-2xl">My Summer</h1>
            <p className="font-[DM_Sans] text-sm text-capp-dark/50 mt-0.5">
              {savedCamps.length === 0
                ? 'Your saved camps will appear here'
                : selectedKid
                  ? `${selectedKid.name} · ${filteredCamps.length} camp${filteredCamps.length !== 1 ? 's' : ''} · $${filteredTotal.toLocaleString()} est.`
                  : `${savedCamps.length} camp${savedCamps.length !== 1 ? 's' : ''} · $${total.toLocaleString()} est.`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddEvent(true)}
              className="px-3 py-2 rounded-xl bg-capp-dark text-white font-[DM_Sans] text-xs font-semibold active:scale-95 transition-transform"
            >
              + Event
            </button>
            <select
              value={view}
              onChange={(e) => setView(e.target.value)}
              className="font-[DM_Sans] text-xs font-semibold text-capp-dark bg-white border border-capp-dark/10 rounded-xl px-3 py-2 shadow-sm"
            >
              <option value="calendar">Calendar</option>
              <option value="list">List</option>
            </select>
          </div>
        </div>
      </div>

      {savedCamps.length === 0 && customEvents.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-capp-coral/10 flex items-center justify-center text-4xl mb-4">🏕️</div>
          <h2 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-2">Start building your summer</h2>
          <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed mb-6">
            Tap the heart on any camp to save it here. Plan your whole summer before you commit to anything.
          </p>
          <button
            onClick={() => navigate('/camps')}
            className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold px-7 py-3.5 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            Browse Camps
          </button>
        </div>
      ) : view === 'calendar' ? (
        /* ── Monthly calendar view ── */
        <div className="px-4 pt-5 flex flex-col gap-4">
          <MonthView
            savedEntries={savedEntries}
            allCamps={camps}
            customEvents={customEvents}
            navigate={navigate}
            isRegistered={isRegistered}
          />
          <button
            onClick={() => navigate('/camps')}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-capp-dark/15 font-[DM_Sans] font-medium text-sm text-capp-dark/40 active:scale-95 transition-transform"
          >
            + Add more camps
          </button>
        </div>
      ) : (
        /* ── List view ── */
        <div className="px-4 pt-4 flex flex-col gap-3">

          {kids.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              <button
                onClick={() => setSelectedKidId(null)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full font-[DM_Sans] text-xs font-semibold shrink-0 transition-all ${
                  !selectedKidId ? 'bg-capp-dark text-white' : 'bg-white text-capp-dark/50 border border-capp-dark/10'
                }`}
              >
                All kids
              </button>
              {kids.map((kid) => (
                <button
                  key={kid.id}
                  onClick={() => setSelectedKidId(selectedKidId === kid.id ? null : kid.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full font-[DM_Sans] text-xs font-semibold shrink-0 transition-all border-2 text-white"
                  style={{
                    backgroundColor: selectedKidId === kid.id ? kid.avatarColor : `${kid.avatarColor}22`,
                    borderColor: kid.avatarColor,
                    color: selectedKidId === kid.id ? 'white' : kid.avatarColor,
                  }}
                >
                  <KidAvatar kid={kid} size={18} rounded="full" />
                  {kid.name}
                </button>
              ))}
            </div>
          )}

          <div
            className="rounded-2xl px-5 py-4 flex items-center justify-between shadow-md transition-all"
            style={{ backgroundColor: selectedKid ? selectedKid.avatarColor : '#FFD166' }}
          >
            <div>
              <p className="font-[DM_Sans] text-xs text-capp-dark/60 mb-0.5">
                {selectedKid ? `${selectedKid.name}'s summer` : 'Estimated total'}
              </p>
              <p className="font-[Fraunces] font-bold text-capp-dark text-3xl">${filteredTotal.toLocaleString()}</p>
              <p className="font-[DM_Sans] text-xs text-capp-dark/50 mt-0.5">
                {filteredCamps.length} camp{filteredCamps.length !== 1 ? 's' : ''} · {selectedKid ? `${selectedKid.name}'s schedule ✓` : 'Summer sorted ✓'}
              </p>
            </div>
            <div className="flex gap-1.5">
              {filteredCamps.slice(0, 4).map((c) => (
                <span key={c.id} className="w-9 h-9 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  {c.icon}
                </span>
              ))}
            </div>
          </div>

          {/* Custom events in list view */}
          {customEvents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-2 border-b border-capp-dark/5">
                <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/40 uppercase tracking-wide">Family Events</p>
              </div>
              <div className="flex flex-col divide-y divide-capp-dark/5">
                {customEvents.map((ev) => (
                  <div key={ev.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: `${ev.color}18` }}>
                      {ev.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-[DM_Sans] text-sm font-semibold text-capp-dark truncate">{ev.label}</p>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/40">{ev.week}</p>
                    </div>
                    <button
                      onClick={() => removeEvent(ev.id)}
                      className="text-capp-dark/20 text-sm active:opacity-60 shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredCamps.map((camp) => {
            const session = getSession(camp.id)
            const days = camp.regDeadline ? daysUntil(camp.regDeadline) : null
            const isUrgent = days !== null && days <= 7 && !isRegistered(camp.id)
            const entry = savedEntries.find((e) => e.id === camp.id)
            const kid = entry?.kidId ? kids.find((k) => k.id === entry.kidId) : null
            const registered = isRegistered(camp.id)

            return (
              <div key={camp.id} className="rounded-2xl shadow-sm overflow-hidden" style={{ backgroundColor: registered ? '#FEFCE8' : 'white' }}>
                <div className="h-1.5 w-full" style={{ backgroundColor: registered ? '#EAB308' : isUrgent ? '#EF4444' : (kid?.avatarColor ?? camp.accent) }} />
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: camp.accentLight }}>
                      {camp.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-[Fraunces] font-bold text-capp-dark text-base leading-tight">{camp.name}</h3>
                      <p className="font-[DM_Sans] text-xs text-capp-dark/50 mt-0.5">📍 {camp.location} · Ages {camp.ageMin}–{camp.ageMax}</p>
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {registered && (
                          <span className="font-[DM_Sans] text-xs font-bold text-yellow-800 bg-yellow-200 border border-yellow-300 px-2 py-0.5 rounded-full">✓ Registered</span>
                        )}
                        {session ? (
                          <span className="font-[DM_Sans] text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{session}</span>
                        ) : (
                          <span className="font-[DM_Sans] text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">No session yet</span>
                        )}
                        {!registered && <DeadlineBadge regDeadline={camp.regDeadline} />}
                        {kid && (
                          <span className="font-[DM_Sans] text-xs font-semibold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: kid.avatarColor }}>
                            {kid.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button onClick={() => unsave(camp.id)} className="text-xl active:scale-90 transition-transform" aria-label="Remove from saved">❤️</button>
                      <span className="font-[Fraunces] font-bold text-capp-dark text-base">${camp.price}</span>
                    </div>
                  </div>

                  {!registered && days !== null && days <= 7 && (
                    <div className="mt-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                      <span className="text-sm">🚨</span>
                      <p className="font-[DM_Sans] text-xs font-semibold text-red-700">Only {days} day{days !== 1 ? 's' : ''} left to register — don't lose your spot!</p>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button onClick={() => navigate(`/camps/${camp.id}`)} className="flex-1 py-2.5 rounded-xl font-[DM_Sans] font-semibold text-sm text-capp-dark bg-capp-coral active:scale-95 transition-transform">
                      View Details
                    </button>
                    <button
                      onClick={() => markRegistered(camp.id, !registered)}
                      className={`px-3 py-2.5 rounded-xl font-[DM_Sans] text-xs font-bold active:scale-95 transition-transform ${
                        registered ? 'bg-yellow-200 text-yellow-800 border border-yellow-300' : 'bg-capp-dark/5 text-capp-dark/50'
                      }`}
                    >
                      {registered ? '✓ Registered' : 'Mark registered'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredCamps.length === 0 && selectedKid && (
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
              <p className="font-[DM_Sans] text-sm text-capp-dark/45 mb-2">No camps assigned to {selectedKid.name} yet</p>
              <button onClick={() => setSelectedKidId(null)} className="font-[DM_Sans] text-sm font-semibold text-capp-coral">Show all camps →</button>
            </div>
          )}

          <button
            onClick={() => navigate('/camps')}
            className="w-full py-4 rounded-2xl border-2 border-dashed border-capp-dark/15 font-[DM_Sans] font-medium text-sm text-capp-dark/40 active:scale-95 transition-transform"
          >
            + Add more camps
          </button>
        </div>
      )}

      {showAddEvent && (
        <AddEventSheet onClose={() => setShowAddEvent(false)} onAdd={addEvent} />
      )}
    </div>
  )
}
