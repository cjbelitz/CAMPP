import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useKids } from '../context/KidsContext'
import { categories } from '../data/camps'

const INTEREST_OPTIONS = categories.filter((c) => c !== 'All')

const AVATAR_COLORS = [
  '#FF6B6B',
  '#FFD166',
  '#06D6A0',
  '#118AB2',
  '#A78BFA',
  '#FB923C',
  '#34D399',
  '#F472B6',
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

function PreferenceGroup({ label, hint, options, value, onChange }) {
  return (
    <div>
      <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-1 block">
        {label}
      </label>
      {hint && <p className="font-[DM_Sans] text-xs text-capp-dark/40 mb-3">{hint}</p>}
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border-2 transition-all active:scale-95 ${
              value === opt.value
                ? 'bg-capp-coral/8 border-capp-coral'
                : 'bg-white border-capp-dark/10'
            }`}
          >
            <span className="text-xl">{opt.icon}</span>
            <span
              className={`font-[DM_Sans] text-xs font-semibold leading-tight text-center ${
                value === opt.value ? 'text-capp-coral' : 'text-capp-dark/60'
              }`}
            >
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AddKidPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getKid, addKid, updateKid, removeKid } = useKids()

  const existing = id ? getKid(id) : null
  const isEditing = !!existing

  const [name, setName] = useState(existing?.name ?? '')
  const [age, setAge] = useState(existing?.age ?? 8)
  const [avatarColor, setAvatarColor] = useState(existing?.avatarColor ?? '#FF6B6B')
  const [interests, setInterests] = useState(existing?.interests ?? [])
  const [environment, setEnvironment] = useState(existing?.environment ?? 'both')
  const [stimulation, setStimulation] = useState(existing?.stimulation ?? 'moderate')
  const [challenge, setChallenge] = useState(existing?.challenge ?? 'moderate')
  const [photo, setPhoto] = useState(existing?.photo ?? null)
  const [submitted, setSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target.result)
    reader.readAsDataURL(file)
  }

  const nameError = submitted && !name.trim()

  function toggleInterest(cat) {
    setInterests((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  function handleSave() {
    setSubmitted(true)
    if (!name.trim()) return
    const kidData = { name: name.trim(), age, avatarColor, photo, interests, environment, stimulation, challenge }
    if (isEditing) {
      updateKid(id, kidData)
    } else {
      addKid({
        id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        ...kidData,
        pastCampIds: [],
        isExample: false,
      })
    }
    navigate('/dashboard')
  }

  function handleDelete() {
    removeKid(id)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">
      {/* Header */}
      <div className="px-4 pt-12 pb-5 flex items-center gap-3 border-b border-capp-dark/5">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform"
        >
          ←
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-7 h-7 rounded-lg bg-capp-coral flex items-center justify-center">
            <span className="font-[Fraunces] text-white text-sm font-bold">C</span>
          </div>
          <span className="font-[Fraunces] font-bold text-capp-dark">
            {isEditing ? 'Edit kid' : 'Add a kid'}
          </span>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-[DM_Sans] text-xs font-medium text-red-400 px-3 py-1.5 rounded-xl bg-red-50 active:scale-95 transition-transform"
          >
            Remove
          </button>
        )}
      </div>

      <div className="px-4 pt-6 flex flex-col gap-7">

        {/* Photo + avatar preview */}
        <div className="flex flex-col items-center gap-3">
          <label className="relative cursor-pointer active:scale-95 transition-transform">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white"
              />
            ) : (
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-4xl font-bold text-white font-[Fraunces] shadow-lg border-4 border-white"
                style={{ backgroundColor: avatarColor }}
              >
                {name.trim() ? name.trim()[0].toUpperCase() : '?'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-capp-coral flex items-center justify-center shadow-md border-2 border-white">
              <span className="text-base">📷</span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </label>
          <p className="font-[DM_Sans] text-xs text-capp-dark/40">
            {photo ? 'Tap to change photo' : 'Tap to add a photo'}
          </p>
          {photo && (
            <button
              onClick={() => setPhoto(null)}
              className="font-[DM_Sans] text-xs text-red-400 font-medium"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-2 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma"
            className={`w-full font-[DM_Sans] text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
              nameError ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/50'
            }`}
          />
          {nameError && (
            <p className="font-[DM_Sans] text-xs text-red-400 mt-1.5">Name is required</p>
          )}
        </div>

        {/* Age stepper */}
        <div>
          <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-2 block">
            Age
          </label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAge((a) => Math.max(1, a - 1))}
              className="w-12 h-12 rounded-2xl bg-white border border-capp-dark/10 text-capp-dark text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            >
              −
            </button>
            <div className="flex-1 text-center">
              <span className="font-[Fraunces] font-bold text-capp-dark text-4xl">{age}</span>
              <span className="font-[DM_Sans] text-sm text-capp-dark/40 ml-1">yrs old</span>
            </div>
            <button
              onClick={() => setAge((a) => Math.min(18, a + 1))}
              className="w-12 h-12 rounded-2xl bg-white border border-capp-dark/10 text-capp-dark text-xl font-bold flex items-center justify-center active:scale-95 transition-transform shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Avatar color */}
        <div>
          <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-3 block">
            Profile color
          </label>
          <div className="flex gap-3 flex-wrap">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => setAvatarColor(color)}
                className="w-10 h-10 rounded-full active:scale-90 transition-transform"
                style={{
                  backgroundColor: color,
                  boxShadow: avatarColor === color ? `0 0 0 3px white, 0 0 0 5px ${color}` : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="font-[DM_Sans] text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-1 block">
            Interests
          </label>
          <p className="font-[DM_Sans] text-xs text-capp-dark/40 mb-3">
            Helps the AI suggest the best camps
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((cat) => {
              const active = interests.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`font-[DM_Sans] text-sm font-medium px-4 py-2 rounded-2xl border transition-colors active:scale-95 ${
                    active
                      ? 'bg-capp-coral text-capp-dark border-capp-coral'
                      : 'bg-white text-capp-dark/60 border-capp-dark/12'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Camp setting */}
        <PreferenceGroup
          label="Camp setting"
          hint="Does your kid prefer being inside or outside?"
          options={ENVIRONMENT_OPTIONS}
          value={environment}
          onChange={setEnvironment}
        />

        {/* Energy level */}
        <PreferenceGroup
          label="Energy level"
          hint="How much activity and stimulation do they thrive with?"
          options={STIMULATION_OPTIONS}
          value={stimulation}
          onChange={setStimulation}
        />

        {/* Challenge level */}
        <PreferenceGroup
          label="Challenge level"
          hint="Should camps be relaxed and fun, or push them a bit?"
          options={CHALLENGE_OPTIONS}
          value={challenge}
          onChange={setChallenge}
        />

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2 pb-8">
          <button
            onClick={handleSave}
            className="w-full bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold text-base py-4 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            {isEditing ? 'Save changes' : 'Add kid'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-transparent text-capp-dark/50 font-[DM_Sans] font-medium text-base py-3 rounded-2xl border border-capp-dark/12 active:scale-95 transition-transform"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Delete confirm sheet */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative w-full bg-white rounded-t-3xl px-5 pt-6 pb-10">
            <h3 className="font-[Fraunces] font-bold text-capp-dark text-xl mb-2">
              Remove {existing?.name}?
            </h3>
            <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed mb-6">
              This will delete their profile and suggested camps. Your saved camps in My Summer will not be affected.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 text-white font-[DM_Sans] font-semibold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Yes, remove {existing?.name}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-capp-dark/5 text-capp-dark font-[DM_Sans] font-medium py-3.5 rounded-2xl active:scale-95 transition-transform"
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
