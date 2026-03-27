import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useKids } from '../context/KidsContext'
import { categories } from '../data/camps'

const INTEREST_OPTIONS = categories.filter((c) => c !== 'All')
const INTEREST_ICONS = { Arts: '🎨', STEM: '🔬', Sports: '⚽', Surf: '🏄', Music: '🎵', Outdoors: '🏕️' }

const AVATAR_COLORS = [
  '#FABE37', '#F055A5', '#CCD537',
  '#7A88FE', '#FF9B28', '#BFDFF3',
]

const ENVIRONMENT_OPTIONS = [
  { value: 'indoor',  icon: '🏠', label: 'Indoors' },
  { value: 'outdoor', icon: '🌳', label: 'Outdoors' },
  { value: 'both',    icon: '🔄', label: 'Mix of both' },
]

const STIMULATION_OPTIONS = [
  { value: 'low',      icon: '🧘', label: 'Low-key' },
  { value: 'moderate', icon: '⚖️', label: 'Moderate' },
  { value: 'high',     icon: '⚡', label: 'High energy' },
]

const CHALLENGE_OPTIONS = [
  { value: 'easy',        icon: '😌', label: 'Easy & fun' },
  { value: 'moderate',    icon: '🎯', label: 'Balanced' },
  { value: 'challenging', icon: '🏆', label: 'Challenging' },
]

// STEPS: 'welcome' | 'name-age' | 'interests' | 'prefs' | 'more' | 'done'
const STEP_PROGRESS = { 'name-age': 20, interests: 50, prefs: 80 }

function OptionGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
            value === opt.value
              ? 'bg-capp-coral/8 border-capp-coral'
              : 'bg-white border-capp-dark/10'
          }`}
        >
          <span className="text-xl">{opt.icon}</span>
          <span className={`font-[Montserrat] text-xs font-semibold text-center leading-tight ${
            value === opt.value ? 'text-capp-coral' : 'text-capp-dark/55'
          }`}>
            {opt.label}
          </span>
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, completeOnboarding } = useAuth()
  const { kids, addKid, removeKid } = useKids()

  const [step, setStep] = useState('welcome')
  const [addedKids, setAddedKids] = useState([])

  // Current kid being built
  const [kidName, setKidName] = useState('')
  const [age, setAge] = useState(8)
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [interests, setInterests] = useState([])
  const [environment, setEnvironment] = useState('both')
  const [stimulation, setStimulation] = useState('moderate')
  const [challenge, setChallenge] = useState('moderate')
  const [nameError, setNameError] = useState(false)

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  function resetKidForm(index = 0) {
    setKidName('')
    setAge(8)
    setAvatarColor(AVATAR_COLORS[index % AVATAR_COLORS.length])
    setInterests([])
    setEnvironment('both')
    setStimulation('moderate')
    setChallenge('moderate')
    setNameError(false)
  }

  function toggleInterest(cat) {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function handleNext_NameAge() {
    if (!kidName.trim()) { setNameError(true); return }
    setNameError(false)
    setStep('interests')
  }

  function handleNext_Interests() {
    setStep('prefs')
  }

  function handleSaveKid() {
    const kidData = {
      id: crypto.randomUUID?.() ?? `kid-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: kidName.trim(),
      age,
      avatarColor,
      photo: null,
      interests,
      environment,
      stimulation,
      challenge,
      pastCampIds: [],
      isExample: false,
    }
    addKid(kidData)
    setAddedKids((prev) => [...prev, kidData])
    setStep('more')
  }

  function handleAddAnother() {
    resetKidForm(addedKids.length)
    setStep('name-age')
  }

  function finish() {
    // Remove example/sample kids
    kids.filter((k) => k.isExample).forEach((k) => removeKid(k.id))
    completeOnboarding()
    navigate('/dashboard')
  }

  function handleSkip() {
    kids.filter((k) => k.isExample).forEach((k) => removeKid(k.id))
    completeOnboarding()
    navigate('/dashboard')
  }

  const progress = STEP_PROGRESS[step]

  return (
    <div className="min-h-screen bg-capp-warm-bg flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="h-1 bg-capp-dark/8 shrink-0">
          <div
            className="h-1 bg-capp-coral transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Back button row */}
      {(step === 'interests' || step === 'prefs') && (
        <div className="px-5 pt-4 shrink-0">
          <button
            onClick={() => setStep(step === 'interests' ? 'name-age' : 'interests')}
            className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform text-capp-dark/60"
          >
            ←
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">

        {/* ── Welcome ── */}
        {step === 'welcome' && (
          <div className="flex flex-col items-center text-center gap-5 pt-8">
            <div className="w-20 h-20 rounded-3xl bg-capp-coral flex items-center justify-center shadow-lg">
              <span className="font-[League_Spartan] text-capp-dark text-4xl font-bold leading-none">C</span>
            </div>

            <div>
              <h1 className="font-[League_Spartan] font-bold text-capp-dark text-3xl leading-tight mb-3 uppercase">
                Hi {firstName}! ☀️<br />Let's plan your summer.
              </h1>
              <p className="font-[Montserrat] text-base text-capp-dark/55 leading-relaxed max-w-xs mx-auto">
                Tell us about your kids and we'll suggest camps perfectly matched to their age, interests, and personality.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap justify-center">
              {Object.entries(INTEREST_ICONS).map(([label, icon]) => (
                <div key={label} className="w-14 h-14 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center gap-0.5">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-[Montserrat] text-[9px] font-semibold text-capp-dark/40">{label}</span>
                </div>
              ))}
            </div>

            <div className="w-full flex flex-col gap-3 mt-2">
              <button
                onClick={() => setStep('name-age')}
                className="w-full py-4 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
              >
                Tell us about your kids →
              </button>
              <button
                onClick={handleSkip}
                className="font-[Montserrat] text-sm text-capp-dark/40 font-medium py-2"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}

        {/* ── Name + Age ── */}
        {step === 'name-age' && (
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-1">
                {addedKids.length === 0 ? 'Kid 1' : `Kid ${addedKids.length + 1}`}
              </p>
              <h2 className="font-[League_Spartan] font-bold text-capp-dark text-2xl leading-snug uppercase">
                {addedKids.length === 0 ? "Who's your first kid?" : 'Tell us about your next kid'}
              </h2>
            </div>

            {/* Avatar preview */}
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold text-white font-[League_Spartan] shadow-lg"
                style={{ backgroundColor: avatarColor }}
              >
                {kidName.trim() ? kidName.trim()[0].toUpperCase() : '?'}
              </div>
              {/* Color picker */}
              <div className="flex gap-3 flex-wrap justify-center">
                {AVATAR_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className="w-9 h-9 rounded-full active:scale-90 transition-transform shrink-0"
                    style={{
                      backgroundColor: color,
                      boxShadow: avatarColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">
                Name
              </label>
              <input
                type="text"
                value={kidName}
                onChange={(e) => { setKidName(e.target.value); setNameError(false) }}
                placeholder="e.g. Emma"
                autoFocus
                className={`w-full font-[Montserrat] text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                  nameError ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/50'
                }`}
              />
              {nameError && <p className="font-[Montserrat] text-xs text-red-400 mt-1.5">Name is required</p>}
            </div>

            {/* Age */}
            <div>
              <label className="font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-3 block">
                Age
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAge((a) => Math.max(1, a - 1))}
                  className="w-14 h-14 rounded-2xl bg-white border border-capp-dark/10 text-capp-dark text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform shadow-sm"
                >
                  −
                </button>
                <div className="flex-1 text-center">
                  <span className="font-[League_Spartan] font-bold text-capp-dark text-5xl">{age}</span>
                  <span className="font-[Montserrat] text-sm text-capp-dark/40 ml-2">yrs old</span>
                </div>
                <button
                  onClick={() => setAge((a) => Math.min(18, a + 1))}
                  className="w-14 h-14 rounded-2xl bg-white border border-capp-dark/10 text-capp-dark text-2xl font-bold flex items-center justify-center active:scale-95 transition-transform shadow-sm"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleNext_NameAge}
              className="w-full py-4 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Interests ── */}
        {step === 'interests' && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-1">Interests</p>
              <h2 className="font-[League_Spartan] font-bold text-capp-dark text-2xl leading-snug uppercase">
                What does {kidName} love?
              </h2>
              <p className="font-[Montserrat] text-sm text-capp-dark/50 mt-1.5">
                Pick everything that fits — we'll find camps to match.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {INTEREST_OPTIONS.map((cat) => {
                const active = interests.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleInterest(cat)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border-2 font-[Montserrat] text-sm font-semibold transition-all active:scale-95 ${
                      active
                        ? 'bg-capp-coral/10 border-capp-coral text-capp-coral'
                        : 'bg-white border-capp-dark/10 text-capp-dark/65'
                    }`}
                  >
                    <span className="text-lg">{INTEREST_ICONS[cat] ?? '⭐'}</span>
                    {cat}
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleNext_Interests}
              className="w-full py-4 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              {interests.length === 0 ? 'Skip for now →' : 'Next →'}
            </button>
          </div>
        )}

        {/* ── Preferences ── */}
        {step === 'prefs' && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/40 uppercase tracking-wider mb-1">Personality</p>
              <h2 className="font-[League_Spartan] font-bold text-capp-dark text-2xl leading-snug uppercase">
                How does {kidName} like to spend their day?
              </h2>
              <p className="font-[Montserrat] text-sm text-capp-dark/50 mt-1.5">
                This helps us match camps to their energy and learning style.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Camp setting</p>
                <OptionGroup options={ENVIRONMENT_OPTIONS} value={environment} onChange={setEnvironment} />
              </div>
              <div>
                <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Energy level</p>
                <OptionGroup options={STIMULATION_OPTIONS} value={stimulation} onChange={setStimulation} />
              </div>
              <div>
                <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/50 uppercase tracking-wider mb-2">Challenge level</p>
                <OptionGroup options={CHALLENGE_OPTIONS} value={challenge} onChange={setChallenge} />
              </div>
            </div>

            <button
              onClick={handleSaveKid}
              className="w-full py-4 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Add {kidName} →
            </button>
          </div>
        )}

        {/* ── Add another? ── */}
        {step === 'more' && (
          <div className="flex flex-col gap-6 pt-4">
            <div className="flex flex-col items-center text-center gap-2">
              <span className="text-5xl mb-1">🎉</span>
              <h2 className="font-[League_Spartan] font-bold text-capp-dark text-2xl uppercase">
                {addedKids[addedKids.length - 1]?.name} is all set!
              </h2>
              <p className="font-[Montserrat] text-sm text-capp-dark/50">
                Do you have another kid to add?
              </p>
            </div>

            {/* Kids added so far */}
            <div className="flex flex-col gap-2">
              {addedKids.map((kid) => (
                <div key={kid.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white font-[League_Spartan] shrink-0"
                    style={{ backgroundColor: kid.avatarColor }}
                  >
                    {kid.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-[Montserrat] text-sm font-semibold text-capp-dark">{kid.name}</p>
                    <p className="font-[Montserrat] text-xs text-capp-dark/40">
                      {kid.age} yrs · {kid.interests.length > 0 ? kid.interests.join(', ') : 'No interests set'}
                    </p>
                  </div>
                  <span className="text-lg">✓</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddAnother}
                className="w-full py-4 bg-white border-2 border-capp-dark/12 text-capp-dark font-[Montserrat] font-semibold text-base rounded-2xl active:scale-95 transition-transform"
              >
                + Add another kid
              </button>
              <button
                onClick={finish}
                className="w-full py-4 bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-base rounded-2xl shadow-md active:scale-95 transition-transform"
              >
                See my summer →
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
