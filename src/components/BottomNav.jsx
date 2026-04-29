import { useNavigate, useLocation } from 'react-router-dom'
import { useSaved } from '../context/SavedCampsContext'
import { useCircle } from '../context/CircleContext'

function IconHome({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#155fcc' : 'none'} stroke={active ? '#155fcc' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.4}>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

function IconSearch({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#155fcc' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.4}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

function IconCircle({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? '#155fcc' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.4}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

function IconHeart({ active }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? '#155fcc' : 'none'} stroke={active ? '#155fcc' : '#1a1a1a'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.4}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

const tabs = [
  { label: 'Home',      Icon: IconHome,   path: '/dashboard' },
  { label: 'Browse',    Icon: IconSearch, path: '/camps'     },
  { label: 'My Circle', Icon: IconCircle, path: '/circle'    },
  { label: 'My Summer', Icon: IconHeart,  path: '/my-summer' },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { savedIds } = useSaved()
  const { totalUnread } = useCircle()

  return (
    <>
      {/* ── Mobile: fixed bottom nav ── */}
      <div className="mobile-nav-bar fixed bottom-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-sm border-t border-capp-dark/8" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
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
                className={`w-28 flex flex-col items-center gap-0.5 py-2.5 relative active:scale-95 transition-transform`}
              >
                <tab.Icon active={isActive} />
                <span className={`font-garet text-[10px] ${isActive ? 'font-bold text-capp-blue' : 'font-semibold text-capp-dark/35'}`}>
                  {tab.label}
                </span>
                {badge > 0 && (
                  <span className="absolute top-1.5 right-[calc(50%-18px)] min-w-[16px] h-4 bg-capp-red text-white text-[9px] font-bold font-garet rounded-full flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-capp-blue rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Desktop: fixed top nav ── */}
      <div className="desktop-nav-bar hidden fixed top-0 left-0 right-0 z-50 bg-white/97 backdrop-blur-sm border-b border-capp-dark/8 px-8 items-center justify-between h-16 shadow-sm">
        {/* Logo */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 active:opacity-80 transition-opacity"
        >
          <img src="/logo.png" alt="CAMPP" className="w-9 h-9 object-contain" />
          <span className="font-garet font-black text-capp-dark text-xl uppercase tracking-wide">CAMPP</span>
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
                className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-garet text-sm font-bold transition-colors ${
                  isActive
                    ? 'bg-capp-blue/10 text-capp-blue'
                    : 'text-capp-dark/50 hover:text-capp-dark hover:bg-capp-dark/5'
                }`}
              >
                <tab.Icon active={isActive} />
                {tab.label}
                {badge > 0 && (
                  <span className="min-w-[18px] h-[18px] bg-capp-red text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Settings */}
        <button
          onClick={() => navigate('/settings')}
          className="w-9 h-9 rounded-xl bg-capp-dark/5 flex items-center justify-center text-capp-dark/50 hover:bg-capp-dark/10 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>
      </div>
    </>
  )
}
