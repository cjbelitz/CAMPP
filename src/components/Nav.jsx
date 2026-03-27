import { useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-50 bg-capp-warm-bg/90 backdrop-blur-sm border-b border-capp-dark/5 px-5 py-4 flex items-center justify-between">
      <button onClick={() => navigate('/')} className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm">
          <span className="font-[Fraunces] text-capp-dark text-base font-bold leading-none">C</span>
        </div>
        <span className="font-[Fraunces] font-bold text-capp-dark text-lg">CAMPP</span>
      </button>
      <button
        onClick={() => navigate('/camps')}
        className="bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform"
      >
        Browse Camps
      </button>
    </nav>
  )
}
