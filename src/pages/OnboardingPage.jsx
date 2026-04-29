import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useKids } from '../context/KidsContext'

const INTEREST_OPTIONS = ['STEM', 'Academic', 'Sports', 'Art', 'Dance', 'Music', 'Nature', 'Multi-activity']

const AVATAR_COLORS = ['#155fcc', '#11a253', '#826dee', '#ffd21f', '#fca4e0', '#f20815']

const ENVIRONMENT_OPTIONS = [
  { value: 'indoor',  label: 'Indoors'    },
  { value: 'outdoor', label: 'Outdoors'   },
  { value: 'both',    label: 'Mix of both'},
]
const STIMULATION_OPTIONS = [
  { value: 'low',      label: 'Low-key'    },
  { value: 'moderate', label: 'Moderate'   },
  { value: 'high',     label: 'High energy' },
]
const CHALLENGE_OPTIONS = [
  { value: 'easy',        label: 'Easy & fun'   },
  { value: 'moderate',    label: 'Balanced'      },
  { value: 'challenging', label: 'Challenging'   },
]

const STEP_PROGRESS = { profile: 15, 'name-age': 35, interests: 60, prefs: 82 }

function ageFromBirthday(dob) {
  if (!dob) return null
  return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
}

function OptionGroup({ options, value, onChange }) {
  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 transition-all active:scale-95 ${
            value === opt.value ? 'bg-capp-blue/8 border-capp-blue' : 'bg-white border-capp-dark/10'
          }`}
        >
          <span className={`font-garet text-xs font-bold text-center leading-tight ${
            value === opt.value ? 'text-capp-blue' : 'text-capp-dark/55'
          }`}>{opt.label}</span>
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { user, completeOnboarding, updateProfile } = useAuth()
  const { kids, addKid, removeKid } = useKids()

  const [step, setStep] = useState('welcome')
  const [addedKids, setAddedKids] = useState([])

  const [profileName, setProfileName]   = useState(user?.name ?? '')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileZip, setProfileZip]     = useState('')
  const [profileNameError, setProfileNameError] = useState(false)

  const [kidName, setKidName]       = useState('')
  const [birthday, setBirthday]     = useState('')
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0])
  const [interests, setInterests]   = useState([])
  const [environment, setEnvironment] = useState('both')
  const [stimulation, setStimulation] = useState('moderate')
  const [challenge, setChallenge]   = useState('moderate')
  const [nameError, setNameError]   = useState(false)

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  function resetKidForm(index = 0) {
    setKidName('')
    setBirthday('')
    setAvatarColor(AVATAR_COLORS[index % AVATAR_COLORS.length])
    setInterests([])
    setEnvironment('both')
    setStimulation('moderate')
    setChallenge('moderate')
    setNameError(false)
  }

  function toggleInterest(cat) {
    setInterests(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  async function handleNext_Profile() {
    if (!profileName.trim()) { setProfileNameError(true); return }
    setProfileNameError(false)
    await updateProfile(profileName.trim(), user?.email, profilePhone.trim() || null, profileZip.trim() || null)
    setStep('name-age')
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
      birthday: birthday || null,
      age: ageFromBirthday(birthday),
      emoji: null,
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
    setAddedKids(prev => [...prev, kidData])
    setStep('more')
  }

  function handleAddAnother() {
    resetKidForm(addedKids.length)
    setStep('name-age')
  }

  function finish() {
    kids.filter(k => k.isExample).forEach(k => removeKid(k.id))
    completeOnboarding()
    navigate('/dashboard')
  }

  function handleSkip() {
    kids.filter(k => k.isExample).forEach(k => removeKid(k.id))
    completeOnboarding()
    navigate('/dashboard')
  }

  const progress = STEP_PROGRESS[step]

  return (
    <div className="min-h-screen bg-capp-bg flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}>

      {/* Progress bar */}
      {progress !== undefined && (
        <div className="h-1 bg-capp-dark/8 shrink-0">
          <div className="h-1 bg-capp-blue transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className="flex-1 flex flex-col px-5 pt-10 pb-6 overflow-y-auto">

        {/* ── Welcome ── */}
        {step === 'welcome' && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-6">
            <img src="/logo.png" alt="CAMPP" className="w-28 h-28 object-contain" />
            <div>
              <h1 className="font-garet font-black text-capp-dark text-3xl uppercase leading-tight mb-2">
                Welcome to CAMPP
              </h1>
              <p className="font-garet text-sm text-capp-dark/55 leading-relaxed max-w-xs mx-auto">
                Discover. Connect. Sort. All in CAMPP.
              </p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={() => setStep('profile')}
                className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
              >
                Get started
              </button>
              <button
                onClick={handleSkip}
                className="font-garet text-sm text-capp-dark/40 active:opacity-60"
              >
                Skip setup
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Your Profile ── */}
        {step === 'profile' && (
          <div className="flex flex-col gap-7">
            <div>
              <p className="font-garet text-xs font-bold text-capp-dark/40 uppercase tracking-wider mb-1">Step 1 of 3</p>
              <h2 className="font-garet font-black text-capp-dark text-2xl leading-snug uppercase">
                Create your profile
              </h2>
              <p className="font-garet text-sm text-capp-dark/45 mt-1">So other circle parents know who you are.</p>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Your name *</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => { setProfileName(e.target.value); setProfileNameError(false) }}
                  placeholder="e.g. Sarah M."
                  autoFocus
                  className={`w-full font-garet text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                    profileNameError ? 'border-capp-red' : 'border-capp-dark/10 focus:border-capp-blue/50'
                  }`}
                />
                {profileNameError && <p className="font-garet text-xs text-capp-red mt-1.5">Name is required</p>}
              </div>

              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Phone <span className="font-normal text-capp-dark/30 lowercase">(optional)</span></label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  placeholder="(760) 555-0100"
                  className="w-full font-garet text-base bg-white border-2 border-capp-dark/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-capp-blue/50 transition-colors"
                />
              </div>

              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Zip code <span className="font-normal text-capp-dark/30 lowercase">(optional)</span></label>
                <input
                  type="text"
                  value={profileZip}
                  onChange={e => setProfileZip(e.target.value)}
                  placeholder="92008"
                  maxLength={5}
                  className="w-full font-garet text-base bg-white border-2 border-capp-dark/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-capp-blue/50 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleNext_Profile}
              className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Next
            </button>
          </div>
        )}

        {/* ── Step 2: Add a kid ── */}
        {step === 'name-age' && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-garet text-xs font-bold text-capp-dark/40 uppercase tracking-wider mb-1">Step 2 of 3 · {addedKids.length === 0 ? 'Kid 1' : `Kid ${addedKids.length + 1}`}</p>
              <h2 className="font-garet font-black text-capp-dark text-2xl leading-snug uppercase">
                {addedKids.length === 0 ? "Tell us about your kid" : 'Add another kid'}
              </h2>
            </div>

            {/* Avatar preview */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 border-white font-garet font-black text-white text-3xl"
                style={{ backgroundColor: avatarColor }}
              >
                {kidName ? kidName[0].toUpperCase() : '?'}
              </div>
            </div>

            {/* Color */}
            <div>
              <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-2 block">Profile color</label>
              <div className="flex gap-3">
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => setAvatarColor(color)}
                    className="w-10 h-10 rounded-full active:scale-90 transition-transform"
                    style={{ backgroundColor: color, boxShadow: avatarColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : 'none' }}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Name</label>
              <input
                type="text"
                value={kidName}
                onChange={e => { setKidName(e.target.value); setNameError(false) }}
                placeholder="e.g. Emma"
                className={`w-full font-garet text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
                  nameError ? 'border-capp-red' : 'border-capp-dark/10 focus:border-capp-blue/50'
                }`}
              />
              {nameError && <p className="font-garet text-xs text-capp-red mt-1.5">Name is required</p>}
            </div>

            {/* Birthday */}
            <div>
              <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-1.5 block">Birthday</label>
              <input
                type="date"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                min="2000-01-01"
                className="w-full font-garet text-base bg-white border-2 border-capp-dark/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-capp-blue/50 transition-colors"
              />
              {birthday && ageFromBirthday(birthday) !== null && (
                <p className="font-garet text-sm text-capp-blue font-bold mt-2">Age {ageFromBirthday(birthday)}</p>
              )}
            </div>

            <button
              onClick={handleNext_NameAge}
              className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Next
            </button>
          </div>
        )}

        {/* ── Interests ── */}
        {step === 'interests' && (
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-garet text-xs font-bold text-capp-dark/40 uppercase tracking-wider mb-1">What does {kidName} love?</p>
              <h2 className="font-garet font-black text-capp-dark text-2xl leading-snug uppercase">Pick interests</h2>
              <p className="font-garet text-xs text-capp-dark/40 mt-1">Helps us suggest the best camps. Pick as many as you like.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map(cat => {
                const active = interests.includes(cat)
                return (
                  <button
                    key={cat}
                    onClick={() => toggleInterest(cat)}
                    className={`font-garet text-sm font-bold px-4 py-2.5 rounded-2xl border transition-colors active:scale-95 ${
                      active ? 'bg-capp-blue text-white border-capp-blue' : 'bg-white text-capp-dark/60 border-capp-dark/12'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
            <button
              onClick={handleNext_Interests}
              className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform mt-2"
            >
              {interests.length === 0 ? 'Skip for now' : 'Next'}
            </button>
          </div>
        )}

        {/* ── Camp prefs ── */}
        {step === 'prefs' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-garet font-black text-capp-dark text-2xl leading-snug uppercase">Camp preferences</h2>
              <p className="font-garet text-xs text-capp-dark/40 mt-1">Help us find the perfect vibe for {kidName}.</p>
            </div>
            <div className="flex flex-col gap-5">
              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-2 block">Setting</label>
                <OptionGroup options={ENVIRONMENT_OPTIONS} value={environment} onChange={setEnvironment} />
              </div>
              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-2 block">Energy level</label>
                <OptionGroup options={STIMULATION_OPTIONS} value={stimulation} onChange={setStimulation} />
              </div>
              <div>
                <label className="font-garet text-xs font-bold text-capp-dark/55 uppercase tracking-wider mb-2 block">Challenge level</label>
                <OptionGroup options={CHALLENGE_OPTIONS} value={challenge} onChange={setChallenge} />
              </div>
            </div>
            <button
              onClick={handleSaveKid}
              className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Save {kidName}
            </button>
          </div>
        )}

        {/* ── Add another? ── */}
        {step === 'more' && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white font-garet font-black text-white text-2xl"
              style={{ backgroundColor: addedKids[addedKids.length - 1]?.avatarColor }}>
              {addedKids[addedKids.length - 1]?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="font-garet font-black text-capp-dark text-2xl uppercase">{addedKids[addedKids.length - 1]?.name} added!</h2>
              <p className="font-garet text-sm text-capp-dark/50 mt-2">Do you have another kid to add?</p>
            </div>
            <div className="w-full flex flex-col gap-3">
              <button
                onClick={handleAddAnother}
                className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
              >
                + Add another kid
              </button>
              <button
                onClick={() => setStep('done')}
                className="w-full py-3.5 bg-white text-capp-dark font-garet font-bold text-base rounded-2xl border border-capp-dark/12 active:scale-95 transition-transform"
              >
                That's all my kids
              </button>
            </div>
          </div>
        )}

        {/* ── All set! ── */}
        {step === 'done' && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-capp-green flex items-center justify-center shadow-lg">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h2 className="font-garet font-black text-capp-dark text-3xl uppercase leading-tight mb-2">You're all set!</h2>
              <p className="font-garet text-sm text-capp-dark/55 leading-relaxed max-w-xs mx-auto">
                {addedKids.length > 0
                  ? `${addedKids.map(k => k.name).join(' & ')} ${addedKids.length === 1 ? 'is' : 'are'} ready for summer. Let's find some amazing camps!`
                  : "Your profile is ready. Let's find some amazing camps!"}
              </p>
            </div>

            {addedKids.length > 0 && (
              <div className="flex gap-3 justify-center">
                {addedKids.map(kid => (
                  <div key={kid.id} className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-md font-garet font-black text-white text-lg"
                      style={{ backgroundColor: kid.avatarColor }}>
                      {kid.name[0].toUpperCase()}
                    </div>
                    <p className="font-garet text-xs font-bold text-capp-dark">{kid.name}</p>
                    {kid.age !== null && <p className="font-garet text-[10px] text-capp-dark/40">Age {kid.age}</p>}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={finish}
              className="w-full py-4 bg-capp-blue text-white font-garet font-black text-base rounded-2xl shadow-md active:scale-95 transition-transform"
            >
              Browse Camps
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
