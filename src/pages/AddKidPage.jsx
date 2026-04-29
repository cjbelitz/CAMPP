import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useKids } from '../context/KidsContext'
const INTEREST_OPTIONS = ['STEM', 'Academic', 'Multi-activity', 'Sports', 'Nature', 'Art', 'Dance', 'Music']

const AVATAR_COLORS = [
  '#155fcc',
  '#11a253',
  '#826dee',
  '#ffd21f',
  '#fca4e0',
  '#f20815',
]

const ENVIRONMENT_OPTIONS = [
  { value: 'indoor',  label: 'Indoors'    },
  { value: 'outdoor', label: 'Outdoors'   },
  { value: 'both',    label: 'Mix of both'},
]

const STIMULATION_OPTIONS = [
  { value: 'low',      label: 'Low-key'    },
  { value: 'moderate', label: 'Moderate'   },
  { value: 'high',     label: 'High energy'},
]

const CHALLENGE_OPTIONS = [
  { value: 'easy',        label: 'Easy & fun'  },
  { value: 'moderate',    label: 'Balanced'     },
  { value: 'challenging', label: 'Challenging'  },
]

function PreferenceGroup({ label, hint, options, value, onChange }) {
  return (
    <div>
      <label className="font-garet text-xs font-bold text-capp-dark/60 uppercase tracking-wider mb-1 block">
        {label}
      </label>
      {hint && <p className="font-garet text-xs text-capp-dark/40 mb-3">{hint}</p>}
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 flex items-center justify-center py-3 px-1 rounded-2xl border-2 transition-all active:scale-95 ${
              value === opt.value
                ? 'bg-capp-blue/8 border-capp-blue'
                : 'bg-white border-capp-dark/10'
            }`}
          >
            <span
              className={`font-garet text-xs font-bold leading-tight text-center ${
                value === opt.value ? 'text-capp-blue' : 'text-capp-dark/60'
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
  const [birthday, setBirthday] = useState(existing?.birthday ?? '')
  const [avatarColor, setAvatarColor] = useState(existing?.avatarColor ?? '#155fcc')

  // Auto-calculate age from birthday
  const age = birthday
    ? Math.floor((Date.now() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : (existing?.age ?? null)
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
    const kidData = { name: name.trim(), age, birthday: birthday || null, emoji: null, avatarColor, photo, interests, environment, stimulation, challenge }
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
            <span className="font-garet text-white text-sm font-bold">C</span>
          </div>
          <span className="font-garet font-bold text-capp-dark">
            {isEditing ? 'Edit kid' : 'Add a kid'}
          </span>
        </div>
        {isEditing && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="font-garet text-xs font-medium text-red-400 px-3 py-1.5 rounded-xl bg-red-50 active:scale-95 transition-transform"
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
                className="w-28 h-28 rounded-full flex items-center justify-center shadow-lg border-4 border-white font-garet font-black text-white text-4xl"
                style={{ backgroundColor: avatarColor }}
              >
                {name ? name[0].toUpperCase() : '?'}
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-capp-blue flex items-center justify-center shadow-md border-2 border-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handlePhotoChange}
            />
          </label>
          <p className="font-garet text-xs text-capp-dark/40">
            {photo ? 'Tap to change photo' : 'Tap to add a photo'}
          </p>
          {photo && (
            <button
              onClick={() => setPhoto(null)}
              className="font-garet text-xs text-red-400 font-medium"
            >
              Remove photo
            </button>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="font-garet text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-2 block">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Emma"
            className={`w-full font-garet text-base bg-white border-2 rounded-2xl px-4 py-3.5 focus:outline-none transition-colors ${
              nameError ? 'border-red-400' : 'border-capp-dark/10 focus:border-capp-blue/50'
            }`}
          />
          {nameError && (
            <p className="font-garet text-xs text-red-400 mt-1.5">Name is required</p>
          )}
        </div>

        {/* Birthday */}
        <div>
          <label className="font-garet text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-2 block">
            Birthday
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            min="2000-01-01"
            className="w-full font-garet text-base bg-white border-2 border-capp-dark/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:border-capp-blue/50 transition-colors"
          />
          {age !== null && birthday && (
            <p className="font-garet text-xs text-capp-dark/40 mt-1.5">
              {age} years old
            </p>
          )}
        </div>

        {/* Avatar color */}
        <div>
          <label className="font-garet text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-3 block">
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
          <label className="font-garet text-xs font-semibold text-capp-dark/60 uppercase tracking-wider mb-1 block">
            Interests
          </label>
          <p className="font-garet text-xs text-capp-dark/40 mb-3">
            Helps the AI suggest the best camps
          </p>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((cat) => {
              const active = interests.includes(cat)
              return (
                <button
                  key={cat}
                  onClick={() => toggleInterest(cat)}
                  className={`font-garet text-sm font-medium px-4 py-2 rounded-2xl border transition-colors active:scale-95 ${
                    active
                      ? 'bg-capp-blue text-white border-capp-blue'
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
            className="w-full bg-capp-blue text-white font-garet font-bold text-base py-4 rounded-2xl shadow-md active:scale-95 transition-transform"
          >
            {isEditing ? 'Save changes' : 'Add kid'}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full bg-transparent text-capp-dark/50 font-garet font-medium text-base py-3 rounded-2xl border border-capp-dark/12 active:scale-95 transition-transform"
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
            <h3 className="font-garet font-bold text-capp-dark text-xl mb-2 uppercase">
              Remove {existing?.name}?
            </h3>
            <p className="font-garet text-sm text-capp-dark/55 leading-relaxed mb-6">
              This will delete their profile and suggested camps. Your saved camps in My Summer will not be affected.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                className="w-full bg-red-500 text-white font-garet font-semibold py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Yes, remove {existing?.name}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full bg-capp-dark/5 text-capp-dark font-garet font-medium py-3.5 rounded-2xl active:scale-95 transition-transform"
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
