import { useNavigate, useLocation } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'
import { useCircle } from '../context/CircleContext'

const tabs = [
  { label: 'Home',      icon: '🏠', path: '/dashboard' },
  { label: 'Browse',    icon: '🔍', path: '/camps'     },
  { label: 'Circle',    icon: '💬', path: '/circle'    },
  { label: 'My Summer', icon: '❤️', path: '/my-summer' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { savedIds } = useSaved()
  const { totalUnread } = useCircle()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-capp-dark/8 px-1" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="flex justify-center gap-2 max-w-[1280px] mx-auto pl-16">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path ||
            (tab.path !== '/dashboard' && pathname.startsWith(tab.path))
          const badge =
            tab.path === '/my-summer' ? savedIds.length :
            tab.path === '/circle'    ? totalUnread     : 0

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`w-28 flex flex-col items-center gap-0.5 py-2.5 relative active:scale-95 transition-transform ${
                isActive ? 'text-capp-coral' : 'text-capp-dark/35'
              }`}
            >
              <span className="text-lg leading-none">{tab.icon}</span>
              <span className={`font-[DM_Sans] text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {badge > 0 && (
                <span className="absolute top-1.5 right-[calc(50%-18px)] min-w-[16px] h-4 bg-capp-coral text-capp-dark text-[9px] font-bold font-[DM_Sans] rounded-full flex items-center justify-center px-1">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-capp-coral rounded-full" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
