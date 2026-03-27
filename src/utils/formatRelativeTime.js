const MIN  = 60 * 1000
const HOUR = 60 * MIN
const DAY  = 24 * HOUR

export function formatRelativeTime(ts) {
  const diff = Date.now() - ts
  if (diff < 1 * MIN)   return 'just now'
  if (diff < 60 * MIN)  return `${Math.floor(diff / MIN)}m ago`
  if (diff < 24 * HOUR) return `${Math.floor(diff / HOUR)}h ago`
  if (diff < 2 * DAY)   return 'Yesterday'
  if (diff < 7 * DAY) {
    return new Date(ts).toLocaleDateString('en-US', { weekday: 'short' })
  }
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function formatChatTime(ts) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

export function formatDaySeparator(ts) {
  const diff = Date.now() - ts
  if (diff < 24 * HOUR) return 'Today'
  if (diff < 48 * HOUR) return 'Yesterday'
  return new Date(ts).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

// ── Deadline utilities ─────────────────────────────────────────────────────────

export function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0)
  return Math.ceil((d - now) / 86400000)
}

export function deadlineColor(days) {
  if (days <= 7)  return '#EF4444'
  if (days <= 14) return '#F59E0B'
  return '#6B7280'
}

export function deadlineLabel(days) {
  if (days <= 0) return 'Today!'
  if (days === 1) return '1 day'
  return `${days}d`
}

// ── Session date parsing ───────────────────────────────────────────────────────

const MONTHS = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 }

export function parseSessionStart(session) {
  // e.g. "Jun 16–20" → Date(2026, 5, 16)
  const [mon, range] = session.split(' ')
  const day = parseInt(range)
  return new Date(2026, MONTHS[mon] ?? 0, day)
}

export function formatSessionCountdown(session) {
  const d = parseSessionStart(session)
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const days = Math.ceil((d - now) / 86400000)
  if (days < 0)  return 'Completed'
  if (days === 0) return 'Today!'
  if (days === 1) return 'Tomorrow'
  if (days < 7)  return `In ${days} days`
  if (days < 14) return 'Next week'
  const months = Math.round(days / 30.5)
  return months >= 1 ? `In ${months}mo` : `In ${days}d`
}
