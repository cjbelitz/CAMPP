import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// ─── Step config ──────────────────────────────────────────────────────────────
const STEPS = ['About You', 'Experience', 'Availability']

const INTEREST_OPTIONS = [
  'Art', 'Sports', 'STEM', 'Nature', 'Music', 'Dance',
  'Academic', 'Animals', 'Swimming', 'Cooking', 'Theater', 'Multi-activity',
]
const MONTHS = ['June', 'July', 'August', 'All Summer', 'Flexible']
const DAYS   = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekends', 'Flexible']
const GRADES = ['9th', '10th', '11th', '12th', 'Graduated / Gap Year']
const HOURS  = ['Part-time (under 20 hrs/wk)', 'Full-time (20+ hrs/wk)', 'Flexible']

const EMPTY = {
  // Step 1
  firstName: '', lastName: '', age: '', grade: '', school: '', city: '', zip: '', phone: '',
  // Step 2
  interests: [], priorExperience: '', whyCounsel: '',
  // Step 3
  months: [], days: [], hours: '', transport: false, coverNote: '',
}

// ─── Field helpers ─────────────────────────────────────────────────────────────
function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-[Montserrat] text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="font-[Montserrat] text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function inp(error) {
  return `w-full font-[Montserrat] text-sm bg-white border-2 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors ${
    error ? 'border-red-300 focus:border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/50'
  }`
}

function ChipGroup({ options, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const on = selected.includes(opt)
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={`font-[Montserrat] text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
              on ? 'bg-capp-coral text-capp-dark border-capp-coral' : 'bg-white text-capp-dark/55 border-capp-dark/15'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function CounselorApplyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const campId   = searchParams.get('camp_id')
  const campName = searchParams.get('camp_name')

  const [step, setStep]       = useState(0)
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [done, setDone]       = useState(false)

  // Check if profile already exists
  useEffect(() => {
    const existing = localStorage.getItem('capp-counselor-profile')
    if (existing) {
      try {
        const p = JSON.parse(existing)
        setForm(f => ({ ...f, ...p }))
      } catch {}
    }
  }, [])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function toggle(field, value) {
    setForm(f => {
      const arr = f[field]
      return { ...f, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] }
    })
  }

  // ── Validation per step ────────────────────────────────────────────────────
  function validateStep(s) {
    const e = {}
    if (s === 0) {
      if (!form.firstName.trim()) e.firstName = 'Required'
      if (!form.lastName.trim())  e.lastName  = 'Required'
      if (!form.age)              e.age       = 'Required'
      else if (Number(form.age) < 14 || Number(form.age) > 20) e.age = 'Must be 14–20'
    }
    if (s === 1) {
      if (!form.whyCounsel.trim())              e.whyCounsel = 'Required'
      else if (form.whyCounsel.trim().length < 50) e.whyCounsel = 'Please write at least 50 characters'
      else if (form.whyCounsel.trim().length > 500) e.whyCounsel = 'Maximum 500 characters'
    }
    if (s === 2) {
      if (!form.hours) e.hours = 'Required'
    }
    return e
  }

  function next() {
    const e = validateStep(step)
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    if (step < STEPS.length - 1) { setStep(s => s + 1); return }
    // Final submit
    submit()
  }

  function submit() {
    const profile = {
      ...form,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    const application = {
      id: crypto.randomUUID(),
      profileId: profile.id,
      campId: campId ?? null,
      campName: campName ?? null,
      type: campId ? 'specific_camp' : 'general',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    }

    localStorage.setItem('capp-counselor-profile', JSON.stringify(profile))

    const apps = JSON.parse(localStorage.getItem('capp-counselor-apps') || '[]')
    localStorage.setItem('capp-counselor-apps', JSON.stringify([application, ...apps]))

    setDone(true)
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-capp-warm-bg flex flex-col items-center justify-center px-6 text-center">
        <div className="w-24 h-24 rounded-full bg-capp-coral/15 flex items-center justify-center text-5xl mb-5">🎉</div>
        <h2 className="font-[League_Spartan] font-bold text-capp-dark text-2xl uppercase mb-3">
          {campId ? `Application Sent!` : `You're in the Pool!`}
        </h2>
        <p className="font-[Montserrat] text-sm text-capp-dark/60 leading-relaxed mb-6 max-w-xs">
          {campId
            ? `Your application for ${campName} is in. Camp directors will reach out when they're hiring.`
            : `We'll reach out when a camp match looks good. Keep an eye on your messages!`}
        </p>
        <button
          onClick={() => navigate('/counselors/profile')}
          className="w-full max-w-xs py-4 rounded-2xl bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-sm active:scale-95 transition-transform mb-3"
        >
          View My Profile
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="font-[Montserrat] text-sm font-semibold text-capp-dark/50"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-capp-warm-bg flex flex-col">

      {/* ── Header ── */}
      <div className="shrink-0 px-4 pt-12 pb-4 bg-capp-warm-bg border-b border-capp-dark/6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => step === 0 ? navigate(-1) : setStep(s => s - 1)}
            className="w-9 h-9 rounded-xl bg-white border border-capp-dark/10 flex items-center justify-center shadow-sm active:scale-95 transition-transform shrink-0"
          >
            ←
          </button>
          <div className="flex-1">
            <p className="font-[Montserrat] text-xs text-capp-dark/40 mb-0.5">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="font-[League_Spartan] font-bold text-capp-dark text-lg uppercase leading-tight">
              {STEPS[step]}
            </h1>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-capp-dark/8 rounded-full overflow-hidden">
          <div
            className="h-full bg-capp-coral rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {campId && (
          <div className="mt-3 flex items-center gap-2 bg-capp-coral/10 border border-capp-coral/20 rounded-xl px-3 py-2">
            <span className="text-sm">🏕️</span>
            <p className="font-[Montserrat] text-xs font-semibold text-capp-dark/70">
              Applying for: <span className="text-capp-dark">{campName}</span>
            </p>
          </div>
        )}
      </div>

      {/* ── Form body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="flex flex-col gap-4 pb-32">

          {/* ── Step 1: About You ── */}
          {step === 0 && <>
            <div className="grid grid-cols-2 gap-3">
              <Field label="First Name" required error={errors.firstName}>
                <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} className={inp(errors.firstName)} placeholder="First" />
              </Field>
              <Field label="Last Name" required error={errors.lastName}>
                <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} className={inp(errors.lastName)} placeholder="Last" />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Age" required error={errors.age}>
                <input type="number" value={form.age} onChange={e => set('age', e.target.value)} min={14} max={20} className={inp(errors.age)} placeholder="15" />
              </Field>
              <Field label="Grade (Fall)">
                <select value={form.grade} onChange={e => set('grade', e.target.value)} className={inp()}>
                  <option value="">Select</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>

            <Field label="School Name">
              <input type="text" value={form.school} onChange={e => set('school', e.target.value)} className={inp()} placeholder="e.g. La Costa Canyon High School" />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="City">
                <input type="text" value={form.city} onChange={e => set('city', e.target.value)} className={inp()} placeholder="Encinitas" />
              </Field>
              <Field label="ZIP">
                <input type="text" inputMode="numeric" value={form.zip} onChange={e => set('zip', e.target.value)} className={inp()} placeholder="92024" maxLength={5} />
              </Field>
            </div>

            <Field label="Phone Number">
              <input type="tel" inputMode="tel" value={form.phone} onChange={e => set('phone', e.target.value)} className={inp()} placeholder="(760) 555-0100" />
            </Field>
          </>}

          {/* ── Step 2: Experience ── */}
          {step === 1 && <>
            <Field label="Interests & Skills">
              <ChipGroup options={INTEREST_OPTIONS} selected={form.interests} onToggle={v => toggle('interests', v)} />
            </Field>

            <Field label="Prior Experience">
              <textarea
                rows={4}
                value={form.priorExperience}
                onChange={e => set('priorExperience', e.target.value)}
                placeholder="Tell us about any camp, coaching, babysitting, tutoring, or volunteer experience…"
                className={`${inp()} resize-none`}
              />
            </Field>

            <Field label="Why do you want to be a camp counselor?" required error={errors.whyCounsel}>
              <textarea
                rows={5}
                value={form.whyCounsel}
                onChange={e => set('whyCounsel', e.target.value)}
                placeholder="Share what excites you about working with kids at camp…"
                className={`${inp(errors.whyCounsel)} resize-none`}
              />
              <p className="font-[Montserrat] text-xs text-capp-dark/30 mt-1 text-right">
                {form.whyCounsel.length}/500 chars · min 50
              </p>
            </Field>
          </>}

          {/* ── Step 3: Availability ── */}
          {step === 2 && <>
            <Field label="Which months are you available?">
              <ChipGroup options={MONTHS} selected={form.months} onToggle={v => toggle('months', v)} />
            </Field>

            <Field label="Which days?">
              <ChipGroup options={DAYS} selected={form.days} onToggle={v => toggle('days', v)} />
            </Field>

            <Field label="Hours per week?" required error={errors.hours}>
              <div className="flex flex-col gap-2">
                {HOURS.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => { set('hours', h) }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-[Montserrat] text-sm transition-colors ${
                      form.hours === h
                        ? 'bg-capp-coral/10 border-capp-coral text-capp-dark font-semibold'
                        : 'bg-white border-capp-dark/10 text-capp-dark/70'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              {errors.hours && <p className="font-[Montserrat] text-xs text-red-400 mt-1">{errors.hours}</p>}
            </Field>

            {/* Transport toggle */}
            <div className="bg-white rounded-xl border-2 border-capp-dark/10 px-4 py-3.5 flex items-center justify-between">
              <div>
                <p className="font-[Montserrat] text-sm font-semibold text-capp-dark">Own transportation?</p>
                <p className="font-[Montserrat] text-xs text-capp-dark/45 mt-0.5">Can you drive yourself to camp?</p>
              </div>
              <button
                type="button"
                onClick={() => set('transport', !form.transport)}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${form.transport ? 'bg-capp-coral' : 'bg-capp-dark/20'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${form.transport ? 'left-6' : 'left-0.5'}`} />
              </button>
            </div>

            <Field label="Cover note (optional)">
              <textarea
                rows={3}
                value={form.coverNote}
                onChange={e => set('coverNote', e.target.value)}
                placeholder={campId ? `Why do you want to work at ${campName ?? 'this camp'} specifically?` : 'Anything else you want camps to know about you?'}
                className={`${inp()} resize-none`}
              />
            </Field>
          </>}

        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div
        className="shrink-0 px-4 py-3 bg-white/95 backdrop-blur-sm border-t border-capp-dark/8"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
      >
        <button
          onClick={next}
          className="w-full py-4 rounded-2xl bg-capp-coral text-capp-dark font-[Montserrat] font-bold text-sm active:scale-95 transition-transform"
        >
          {step < STEPS.length - 1 ? `Next: ${STEPS[step + 1]} →` : '🎉 Submit Application'}
        </button>
      </div>
    </div>
  )
}
