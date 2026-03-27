import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationsContext'

export default function NotificationBell() {
  const navigate = useNavigate()
  const { unreadCount } = useNotifications()

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="relative w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
    >
      <span className="text-lg leading-none">🔔</span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-capp-coral text-capp-dark text-[9px] font-bold font-[DM_Sans] rounded-full flex items-center justify-center px-1">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}
