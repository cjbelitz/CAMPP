import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationsContext'
import { formatRelativeTime } from '../utils/formatRelativeTime'

const URGENCY_LABEL = {
  high:   { label: 'Needs attention', color: '#EF4444' },
  medium: { label: 'This week',       color: '#F97316' },
  low:    { label: 'Recent',          color: '#6B7280' },
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { notifications, unreadCount, markRead, markAllRead, isRead } = useNotifications()

  const grouped = ['high', 'medium', 'low'].map((urgency) => ({
    urgency,
    items: notifications.filter((n) => n.urgency === urgency),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px)' }}>

      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-capp-dark/5 bg-white">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="font-[Fraunces] font-bold text-capp-dark text-xl leading-tight">Notifications</h1>
          {unreadCount > 0 && (
            <p className="font-[DM_Sans] text-xs text-capp-dark/50">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="font-[DM_Sans] text-xs font-semibold text-capp-coral active:scale-95 transition-transform"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="px-4 pt-4 flex flex-col gap-6">
        {grouped.map(({ urgency, items }) => {
          const meta = URGENCY_LABEL[urgency]
          return (
            <section key={urgency}>
              <p
                className="font-[DM_Sans] text-xs font-semibold uppercase tracking-wider mb-3"
                style={{ color: meta.color }}
              >
                {meta.label}
              </p>
              <div className="flex flex-col gap-2">
                {items.map((notif) => {
                  const read = isRead(notif.id)
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={`w-full flex items-start gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors active:scale-[0.98] ${
                        read ? 'bg-white/60' : 'bg-white shadow-sm'
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{notif.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <p className={`font-[DM_Sans] text-sm leading-snug ${read ? 'font-medium text-capp-dark/50' : 'font-bold text-capp-dark'}`}>
                            {notif.title}
                          </p>
                          <span className="font-[DM_Sans] text-[10px] text-capp-dark/35 shrink-0 mt-0.5">
                            {formatRelativeTime(notif.ts)}
                          </span>
                        </div>
                        <p className={`font-[DM_Sans] text-xs leading-relaxed ${read ? 'text-capp-dark/35' : 'text-capp-dark/55'}`}>
                          {notif.body}
                        </p>
                      </div>
                      {!read && (
                        <div className="w-2 h-2 rounded-full bg-capp-coral shrink-0 mt-2" />
                      )}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}

        {notifications.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <span className="text-5xl mb-4">🔔</span>
            <h2 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-2">All caught up!</h2>
            <p className="font-[DM_Sans] text-sm text-capp-dark/50">
              We'll notify you about camps, reminders, and your circle.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
