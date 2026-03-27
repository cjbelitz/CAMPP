import { useState } from 'react'
import { SUMMER_WEEKS } from '../data/camps'

export default function CarpoolSheet({ onClose, onSubmit }) {
  const [role, setRole] = useState('driving')
  const [session, setSession] = useState(SUMMER_WEEKS[3]) // Jun 23–27 default
  const [seats, setSeats] = useState(2)
  const [neighborhood, setNeighborhood] = useState('')

  function submit() {
    if (!neighborhood.trim()) return
    onSubmit({ role, session, seats, neighborhood: neighborhood.trim() })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-3xl px-5 pt-5 pb-10 flex flex-col gap-5">
        <div className="w-10 h-1 bg-capp-dark/15 rounded-full mx-auto" />
        <h3 className="font-[Fraunces] font-bold text-capp-dark text-lg">Post a carpool</h3>

        {/* Role toggle */}
        <div>
          <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">I am…</p>
          <div className="flex gap-2">
            {['driving', 'riding'].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-xl font-[DM_Sans] text-sm font-semibold transition-colors ${
                  role === r
                    ? r === 'driving'
                      ? 'bg-orange-500 text-white'
                      : 'bg-blue-500 text-white'
                    : 'bg-capp-warm-bg text-capp-dark/50'
                }`}
              >
                {r === 'driving' ? '🚗 Offering a ride' : '🙋 Need a ride'}
              </button>
            ))}
          </div>
        </div>

        {/* Session picker */}
        <div>
          <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Camp week</p>
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-capp-coral/40"
          >
            {SUMMER_WEEKS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        {/* Seats stepper (only for driving) */}
        {role === 'driving' && (
          <div>
            <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Seats available</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSeats((s) => Math.max(1, s - 1))}
                className="w-10 h-10 rounded-full bg-capp-warm-bg border border-capp-dark/10 font-bold text-capp-dark text-xl flex items-center justify-center active:scale-95"
              >
                −
              </button>
              <span className="font-[Fraunces] font-bold text-capp-dark text-2xl w-8 text-center">{seats}</span>
              <button
                onClick={() => setSeats((s) => Math.min(6, s + 1))}
                className="w-10 h-10 rounded-full bg-capp-warm-bg border border-capp-dark/10 font-bold text-capp-dark text-xl flex items-center justify-center active:scale-95"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Neighborhood input */}
        <div>
          <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Your neighborhood / area</p>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="e.g. Carlsbad, Encinitas, Oceanside…"
            className="w-full font-[DM_Sans] text-sm bg-capp-warm-bg border border-capp-dark/10 rounded-xl px-4 py-2.5 focus:outline-none focus:border-capp-coral/40 placeholder:text-capp-dark/30"
          />
        </div>

        {/* Submit */}
        <button
          onClick={submit}
          disabled={!neighborhood.trim()}
          className="w-full py-3.5 rounded-2xl bg-capp-coral text-capp-dark font-[DM_Sans] font-bold text-sm disabled:opacity-40 active:scale-95 transition-transform"
        >
          Post carpool
        </button>
      </div>
    </div>
  )
}
