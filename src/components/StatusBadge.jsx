const STATUS_CONFIG = {
  'popular':     { label: '⭐ Popular',     bg: '#FFF3CC', text: '#b45309', border: '#FFF95260' },
  'almost-full': { label: '⚡ Almost full', bg: '#fee2e2', text: '#dc2626', border: '#fca5a560' },
}

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_CONFIG[status]
  if (!cfg) return null
  return (
    <span
      className={`inline-flex items-center font-[Montserrat] font-semibold rounded-full border ${
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
      <span className="font-[Montserrat] text-xs font-semibold text-red-500">
        Only {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left!
      </span>
    )
  }
  if (status === 'open') {
    return (
      <span className="font-[Montserrat] text-xs text-emerald-600 font-medium">
        {spotsLeft} spots available
      </span>
    )
  }
  return (
    <span className="font-[Montserrat] text-xs text-capp-dark/40">
      {spotsLeft} spots left
    </span>
  )
}
