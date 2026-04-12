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
    <>
      {/* ── Mobile: fixed bottom nav ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-capp-dark/8" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div className="flex justify-around items-center px-2">
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
                <span className={`font-[Montserrat] text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>
                  {tab.label}
                </span>
                {badge > 0 && (
                  <span className="absolute top-1.5 right-[calc(50%-18px)] min-w-[16px] h-4 bg-capp-coral text-capp-dark text-[9px] font-bold font-[Montserrat] rounded-full flex items-center justify-center px-1">
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

      {/* ── Desktop: fixed top nav ── */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-capp-dark/8 px-8 items-center justify-between h-16 shadow-sm">
        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="font-[League_Spartan] font-bold text-xl text-capp-dark uppercase tracking-wide flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-capp-coral flex items-center justify-center text-sm">🏕️</span>
          CAMPP
        </button>

        {/* Nav links */}
        <div className="flex items-center gap-1">
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
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-[Montserrat] text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-capp-coral/15 text-capp-dark'
                    : 'text-capp-dark/50 hover:text-capp-dark hover:bg-capp-dark/5'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                {tab.label}
                {badge > 0 && (
                  <span className="min-w-[18px] h-[18px] bg-capp-coral text-capp-dark text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Right side: Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-xl bg-capp-dark/5 flex items-center justify-center text-capp-dark/50 hover:bg-capp-dark/10 transition-colors"
        >
          ⚙️
        </button>
      </div>
    </>
  )
}
