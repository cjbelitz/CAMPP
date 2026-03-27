import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useKids } from '../context/KidsContext'
import KidAvatar from '../components/KidAvatar'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, updateProfile, signOut } = useAuth()
  const { kids } = useKids()

  const [editingProfile, setEditingProfile] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSuggestionSheet, setShowSuggestionSheet] = useState(false)
  const [suggestionText, setSuggestionText] = useState('')
  const [suggestionSent, setSuggestionSent] = useState(false)

  const appUrl = window.location.origin
  const shareText = `Hey! I've been using CAMPP to plan my kids' summer camps — it's so good for organizing everything. Join me on it! ${appUrl}`

  function handleShareApp() {
    if (navigator.share) {
      navigator.share({
        title: 'CAMPP — Summer, sorted.',
        text: "I've been using CAMPP to find and organize summer camps for my kids. You should check it out!",
        url: appUrl,
      }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(shareText).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  function handleSaveProfile() {
    if (!name.trim()) return
    updateProfile(name, email)
    setEditingProfile(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleSignOut() {
    signOut()
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* Header */}
      <div className="px-4 pt-12 pb-5 flex items-center gap-3 border-b border-capp-dark/5">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          ←
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-capp-coral flex items-center justify-center">
            <span className="font-[League_Spartan] text-capp-dark text-sm font-bold">C</span>
          </div>
          <span className="font-[League_Spartan] font-bold text-capp-dark text-lg">Settings</span>
        </div>
        {saved && (
          <span className="font-[Montserrat] text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
            Saved ✓
          </span>
        )}
      </div>

      <div className="px-4 pt-6 flex flex-col gap-5">

        {/* ── Profile card ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="font-[Montserrat] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">
              My profile
            </p>
          </div>

          {/* Avatar row */}
          <div className="flex items-center gap-4 px-4 pb-4">
            <div className="w-16 h-16 rounded-full bg-capp-coral flex items-center justify-center shadow-md shrink-0">
              <span className="font-[League_Spartan] font-bold text-capp-dark text-xl">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-[League_Spartan] font-bold text-capp-dark text-lg leading-tight truncate">{user?.name}</p>
              <p className="font-[Montserrat] text-sm text-capp-dark/45 truncate">{user?.email}</p>
            </div>
            <button
              onClick={() => { setEditingProfile(true); setName(user?.name ?? ''); setEmail(user?.email ?? '') }}
              className="w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center text-sm shadow-sm active:scale-95 transition-transform shrink-0"
            >
              ✏️
            </button>
          </div>

          {/* Inline edit form */}
          {editingProfile && (
            <div className="border-t border-capp-dark/5 px-4 py-4 flex flex-col gap-3">
              <div>
                <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full font-[Montserrat] text-base bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-2xl px-4 py-3 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  className="w-full font-[Montserrat] text-base bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-2xl px-4 py-3 focus:outline-none transition-colors"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-capp-coral text-capp-dark font-[Montserrat] font-semibold py-3 rounded-2xl active:scale-95 transition-transform"
                >
                  Save changes
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  className="flex-1 bg-capp-dark/5 text-capp-dark/60 font-[Montserrat] font-medium py-3 rounded-2xl active:scale-95 transition-transform"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ── Kids ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="font-[Montserrat] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">
              My kids
            </p>
            <button
              onClick={() => navigate('/add-kid')}
              className="font-[Montserrat] text-xs font-semibold text-capp-coral"
            >
              + Add kid
            </button>
          </div>

          {kids.length === 0 ? (
            <div className="px-4 pb-5 pt-2 text-center">
              <p className="font-[Montserrat] text-sm text-capp-dark/45 mb-3">No kids added yet</p>
              <button
                onClick={() => navigate('/add-kid')}
                className="bg-capp-coral text-capp-dark font-[Montserrat] font-semibold text-sm px-5 py-2.5 rounded-xl active:scale-95 transition-transform"
              >
                Add your first kid
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-capp-dark/5">
              {kids.map((kid) => (
                <div key={kid.id} className="flex items-center gap-3 px-4 py-3.5">
                  <KidAvatar kid={kid} size={44} rounded="full" className="shadow-sm shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-[Montserrat] text-sm font-semibold text-capp-dark">{kid.name}</p>
                      <span className="font-[Montserrat] text-xs text-capp-dark/40">{kid.age}y</span>
                      {kid.isExample && (
                        <span className="font-[Montserrat] text-[10px] text-capp-dark/30 bg-capp-dark/5 px-1.5 py-0.5 rounded-full">
                          example
                        </span>
                      )}
                    </div>
                    {kid.interests?.length > 0 && (
                      <p className="font-[Montserrat] text-xs text-capp-dark/40 truncate mt-0.5">
                        {kid.interests.join(' · ')}
                      </p>
                    )}
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {kid.environment && (
                        <span className="font-[Montserrat] text-[10px] text-capp-dark/40 bg-capp-dark/5 px-1.5 py-0.5 rounded-full capitalize">
                          {kid.environment === 'both' ? 'indoors & outdoors' : kid.environment}
                        </span>
                      )}
                      {kid.stimulation && (
                        <span className="font-[Montserrat] text-[10px] text-capp-dark/40 bg-capp-dark/5 px-1.5 py-0.5 rounded-full capitalize">
                          {kid.stimulation} energy
                        </span>
                      )}
                      {kid.challenge && (
                        <span className="font-[Montserrat] text-[10px] text-capp-dark/40 bg-capp-dark/5 px-1.5 py-0.5 rounded-full capitalize">
                          {kid.challenge === 'easy' ? 'easy & fun' : kid.challenge}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/edit-kid/${kid.id}`)}
                    className="w-9 h-9 rounded-xl bg-capp-warm-bg border border-capp-dark/10 flex items-center justify-center text-sm shadow-sm active:scale-95 transition-transform shrink-0"
                  >
                    ✏️
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── Community ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="font-[Montserrat] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">Community</p>
          </div>
          <div className="flex flex-col divide-y divide-capp-dark/5">

            {/* Share the app */}
            <button
              onClick={handleShareApp}
              className="flex items-center justify-between px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-capp-coral/10 flex items-center justify-center text-lg shrink-0">
                  🔗
                </div>
                <div>
                  <p className="font-[Montserrat] text-sm font-medium text-capp-dark">Share CAMPP</p>
                  <p className="font-[Montserrat] text-xs text-capp-dark/40">
                    {copied ? 'Link copied!' : 'Spread the word with other camp parents'}
                  </p>
                </div>
              </div>
              <span className={`font-[Montserrat] text-xs font-semibold shrink-0 ${copied ? 'text-emerald-500' : 'text-capp-coral'}`}>
                {copied ? 'Copied ✓' : 'Share →'}
              </span>
            </button>

            {/* Submit a camp suggestion */}
            <button
              onClick={() => { setShowSuggestionSheet(true); setSuggestionSent(false); setSuggestionText('') }}
              className="flex items-center justify-between px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-lg shrink-0">
                  🏕️
                </div>
                <div>
                  <p className="font-[Montserrat] text-sm font-medium text-capp-dark">Submit a camp suggestion</p>
                  <p className="font-[Montserrat] text-xs text-capp-dark/40">Know a great camp we should add?</p>
                </div>
              </div>
              <span className="text-capp-dark/25 text-sm shrink-0">→</span>
            </button>

          </div>
        </section>

        {/* ── App ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="font-[Montserrat] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">App</p>
          </div>
          <div className="flex flex-col divide-y divide-capp-dark/5">
            <button
              onClick={() => navigate('/camps')}
              className="flex items-center justify-between px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🏕️</span>
                <span className="font-[Montserrat] text-sm font-medium text-capp-dark">Browse camps</span>
              </div>
              <span className="text-capp-dark/25 text-sm">→</span>
            </button>
            <button
              onClick={() => navigate('/my-summer')}
              className="flex items-center justify-between px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">☀️</span>
                <span className="font-[Montserrat] text-sm font-medium text-capp-dark">My Summer</span>
              </div>
              <span className="text-capp-dark/25 text-sm">→</span>
            </button>
            <button
              onClick={() => navigate('/ai-chat')}
              className="flex items-center justify-between px-4 py-3.5 active:bg-capp-warm-bg transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">✦</span>
                <span className="font-[Montserrat] text-sm font-medium text-capp-dark">CAMPP Assistant</span>
              </div>
              <span className="text-capp-dark/25 text-sm">→</span>
            </button>
          </div>
        </section>

        {/* ── Support ── */}
        <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="font-[Montserrat] text-[11px] font-bold text-capp-dark/35 uppercase tracking-wider">Support</p>
          </div>
          <div className="px-4 pb-4 pt-1">
            <p className="font-[Montserrat] text-sm text-capp-dark/55 leading-relaxed">
              Questions or feedback? Reach us at{' '}
              <a href="mailto:support@campp.app" className="text-capp-coral font-semibold">
                support@campp.app
              </a>
            </p>
          </div>
        </section>

        {/* ── Sign out ── */}
        <button
          onClick={() => setShowSignOutConfirm(true)}
          className="w-full bg-white rounded-2xl shadow-sm py-4 font-[Montserrat] font-semibold text-red-400 active:scale-95 transition-transform"
        >
          Sign out
        </button>

        <p className="font-[Montserrat] text-xs text-capp-dark/25 text-center pb-4">CAMPP · North County San Diego</p>

      </div>

      {/* Camp suggestion sheet */}
      {showSuggestionSheet && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSuggestionSheet(false)} />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-6 pb-10">
            {suggestionSent ? (
              <div className="flex flex-col items-center text-center py-6 gap-3">
                <span className="text-5xl">🙌</span>
                <h3 className="font-[League_Spartan] font-bold text-capp-dark text-xl uppercase">Thanks for the tip!</h3>
                <p className="font-[Montserrat] text-sm text-capp-dark/55 leading-relaxed">
                  We review every suggestion and love hearing about hidden gems in the area.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">
                    🏕️
                  </div>
                  <div>
                    <h3 className="font-[League_Spartan] font-bold text-capp-dark text-lg leading-tight uppercase">
                      Suggest a camp
                    </h3>
                    <p className="font-[Montserrat] text-xs text-capp-dark/45 mt-0.5">
                      Know something we're missing? Tell us!
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                    Camp name, website, or description
                  </label>
                  <textarea
                    value={suggestionText}
                    onChange={(e) => setSuggestionText(e.target.value)}
                    placeholder="e.g. Surf Divas in La Jolla — great for girls 8–14, they have a website at..."
                    rows={4}
                    autoFocus
                    className="w-full font-[Montserrat] text-base bg-capp-warm-bg border-2 border-capp-dark/10 focus:border-capp-coral/50 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => {
                      if (!suggestionText.trim()) return
                      const subject = encodeURIComponent('Camp suggestion from CAMPP user')
                      const body = encodeURIComponent(
                        `Hi CAMPP team,\n\nI'd like to suggest this camp:\n\n${suggestionText.trim()}\n\nFrom: ${user?.name ?? ''} (${user?.email ?? ''})`
                      )
                      window.location.href = `mailto:support@campp.app?subject=${subject}&body=${body}`
                      setSuggestionSent(true)
                      setTimeout(() => setShowSuggestionSheet(false), 2500)
                    }}
                    disabled={!suggestionText.trim()}
                    className="w-full bg-capp-coral text-capp-dark font-[Montserrat] font-semibold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-40"
                  >
                    Send suggestion →
                  </button>
                  <button
                    onClick={() => setShowSuggestionSheet(false)}
                    className="w-full bg-capp-dark/5 text-capp-dark/70 font-[Montserrat] font-medium py-3.5 rounded-2xl active:scale-95 transition-transform"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Sign out confirm sheet */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSignOutConfirm(false)} />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-6 pb-10">
            <h3 className="font-[League_Spartan] font-bold text-capp-dark text-xl mb-2 uppercase">Sign out?</h3>
            <p className="font-[Montserrat] text-sm text-capp-dark/55 leading-relaxed mb-6">
              Your saved camps and kids' profiles are stored on this device and will still be here when you sign back in.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 text-white font-[Montserrat] font-semibold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Yes, sign out
              </button>
              <button
                onClick={() => setShowSignOutConfirm(false)}
                className="w-full bg-capp-dark/5 text-capp-dark font-[Montserrat] font-medium py-3.5 rounded-2xl active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
