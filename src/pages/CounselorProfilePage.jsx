import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const STATUS_CONFIG = {
  pending:   { label: 'Pending Review',  bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200' },
  reviewed:  { label: 'Reviewed',        bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'  },
  contacted: { label: 'Camp Contacted You', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  hired:     { label: '🎉 Hired!',        bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  declined:  { label: 'Not a Fit',        bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200'   },
}

export default function CounselorProfilePage() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [apps, setApps]       = useState([])

  useEffect(() => {
    try {
      const p = localStorage.getItem('capp-counselor-profile')
      if (p) setProfile(JSON.parse(p))
      const a = localStorage.getItem('capp-counselor-apps')
      if (a) setApps(JSON.parse(a))
    } catch {}
  }, [])

  if (!profile) {
    return (
      <div className="min-h-screen bg-capp-warm-bg flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-capp-coral/15 flex items-center justify-center text-4xl mb-4">🏕️</div>
        <h2 className="font-garet font-bold text-capp-dark text-2xl uppercase mb-2">No Profile Yet</h2>
        <p className="font-garet text-sm text-capp-dark/55 mb-6 leading-relaxed">
          Create your counselor profile to start applying to camps.
        </p>
        <button
          onClick={() => navigate('/counselors/apply')}
          className="bg-capp-coral text-capp-dark font-garet font-bold px-6 py-3.5 rounded-2xl active:scale-95 transition-transform"
        >
          Create Profile
        </button>
        <button onClick={() => navigate(-1)} className="mt-4 font-garet text-sm text-capp-dark/40">← Go back</button>
      </div>
    )
  }

  const name = `${profile.firstName} ${profile.lastName}`
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase()

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* ── Header ── */}
      <div className="bg-capp-dark px-4 pt-12 pb-8">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-5 active:scale-95 transition-transform"
        >
          ←
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-capp-coral flex items-center justify-center">
            <span className="font-garet font-bold text-capp-dark text-2xl">{initials}</span>
          </div>
          <div>
            <h1 className="font-garet font-bold text-white text-xl uppercase">{name}</h1>
            <p className="font-garet text-xs text-white/55 mt-0.5">
              {profile.grade ? `${profile.grade} Grade` : ''}{profile.school ? ` · ${profile.school}` : ''}
            </p>
            {profile.city && (
              <p className="font-garet text-xs text-white/40 mt-0.5">📍 {profile.city}</p>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4">

        {/* ── Applications ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-garet font-bold text-capp-dark text-base uppercase">My Applications</h2>
            <button
              onClick={() => navigate('/counselors/apply')}
              className="font-garet text-xs font-bold text-capp-coral"
            >
              ＋ Apply Again
            </button>
          </div>

          {apps.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 text-center shadow-sm">
              <p className="font-garet text-sm text-capp-dark/50 mb-3">No applications yet.</p>
              <button
                onClick={() => navigate('/camps')}
                className="font-garet text-sm font-semibold text-capp-coral"
              >
                Browse camps to apply →
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {apps.map(app => {
                const camp = null
                const cfg  = STATUS_CONFIG[app.status] ?? STATUS_CONFIG.pending
                const date = new Date(app.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

                return (
                  <div key={app.id} className="bg-white rounded-2xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{ backgroundColor: camp ? `${camp.accent}20` : '#FABE3720' }}
                      >
                        {camp?.icon ?? '🏕️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-garet text-sm font-semibold text-capp-dark leading-tight">
                          {app.type === 'general' ? 'General Pool Application' : (camp?.name ?? app.campName ?? 'Specific Camp')}
                        </p>
                        <p className="font-garet text-xs text-capp-dark/40 mt-0.5">Submitted {date}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex font-garet text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* ── Profile Details ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-garet font-bold text-capp-dark text-base uppercase">Profile</h2>
            <button
              onClick={() => navigate('/counselors/apply')}
              className="font-garet text-xs font-bold text-capp-dark/40"
            >
              Edit ✏️
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm divide-y divide-capp-dark/6">
            <Row label="Age" value={profile.age} />
            <Row label="Grade" value={profile.grade} />
            <Row label="School" value={profile.school} />
            <Row label="Location" value={[profile.city, profile.zip].filter(Boolean).join(', ')} />
            <Row label="Phone" value={profile.phone} />
            <Row label="Transport" value={profile.transport ? 'Has own transportation ✓' : 'No transport'} />
            {profile.hours && <Row label="Hours" value={profile.hours} />}
            {profile.interests?.length > 0 && (
              <div className="px-4 py-3">
                <p className="font-garet text-xs text-capp-dark/45 uppercase tracking-wider mb-2">Interests</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.interests.map(i => (
                    <span key={i} className="font-garet text-xs font-semibold bg-capp-coral/15 text-capp-dark px-2.5 py-1 rounded-full">{i}</span>
                  ))}
                </div>
              </div>
            )}
            {profile.months?.length > 0 && (
              <Row label="Available" value={profile.months.join(', ')} />
            )}
          </div>
        </section>

        {/* ── Apply to a camp ── */}
        <button
          onClick={() => navigate('/camps')}
          className="w-full bg-capp-dark rounded-2xl py-4 px-5 flex items-center gap-3 active:scale-[0.98] transition-transform"
        >
          <span className="text-2xl">🏕️</span>
          <div className="flex-1 text-left">
            <p className="font-garet text-sm font-bold text-white">Apply to a specific camp</p>
            <p className="font-garet text-xs text-white/50 mt-0.5">Browse camps and apply directly</p>
          </div>
          <span className="text-white/40 text-sm">→</span>
        </button>

      </div>
    </div>
  )
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div className="px-4 py-3 flex items-start justify-between gap-4">
      <p className="font-garet text-xs text-capp-dark/45 uppercase tracking-wider shrink-0 pt-0.5">{label}</p>
      <p className="font-garet text-sm text-capp-dark text-right">{value}</p>
    </div>
  )
}
