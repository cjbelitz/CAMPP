const STATUS_CONFIG = {
  'hot':         { label: '🔥 Hot',            bg: '#FF6B6B18', text: '#e03e3e', border: '#FF6B6B40' },
  'popular':     { label: '⭐ Popular',         bg: '#FFF3CC',   text: '#b45309', border: '#FFD16660' },
  'almost-full': { label: '⚡ Almost full',     bg: '#fee2e2',   text: '#dc2626', border: '#fca5a560' },
  'open':        { label: '✅ Plenty of room',  bg: '#d1fae5',   text: '#059669', border: '#6ee7b760' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return null
  return (
    <span
      className={`inline-flex items-center font-[DM_Sans] font-semibold rounded-full border ${
        size === 'lg' ? 'text-sm px-3 py-1' : 'text-xs px-2.5 py-1'
      }`}
      style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
    >
      {cfg.label}
    </span>
  )
}

export function SpotsLeft({ spotsLeft, status }) {
  if (status === 'almost-full') {
    return (
      <span className="font-[DM_Sans] text-xs font-semibold text-red-500">
        Only {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left!
      </span>
    )
  }
  if (status === 'open') {
    return (
      <span className="font-[DM_Sans] text-xs text-emerald-600 font-medium">
        {spotsLeft} spots available
      </span>
    )
  }
  return (
    <span className="font-[DM_Sans] text-xs text-capp-dark/40">
      {spotsLeft} spots left
    </span>
  )
}
