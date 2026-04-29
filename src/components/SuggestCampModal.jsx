import { useState, useEffect } from 'react'

const CATEGORIES = ['Arts', 'Sports', 'STEM', 'Outdoors', 'Music', 'Surf', 'Dance', 'Cooking', 'Theater', 'Multi-activity', 'Other']
const CITIES = ['Carlsbad', 'Encinitas', 'Oceanside', 'San Marcos', 'Escondido', 'Solana Beach', 'Del Mar', 'Vista', 'La Jolla', 'Other North County']

const EMPTY = {
  campName: '', organization: '', category: '', city: '',
  url: '', ageMin: '', ageMax: '', cost: '', dates: '', notes: '',
}

export default function SuggestCampModal({ isOpen, onClose }) {
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [submitted, setSubmitted] = useState(false)

  // Reset on open
  useEffect(() => {
    if (isOpen) { setForm(EMPTY); setErrors({}); setSubmitted(false) }
  }, [isOpen])

  // Auto-close success screen after 3s
  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [submitted, onClose])

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
    setErrors(e => ({ ...e, [field]: undefined }))
  }

  function validate() {
    const e = {}
    if (!form.campName.trim())  e.campName = 'Required'
    if (!form.category)         e.category  = 'Required'
    if (!form.city)             e.city      = 'Required'
    if (!form.url.trim())       e.url       = 'Required'
    else if (!/^https?:\/\//i.test(form.url.trim())) e.url = 'Must start with http:// or https://'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }

    const suggestion = {
      id: crypto.randomUUID(),
      ...form,
      campName: form.campName.trim(),
      organization: form.organization.trim(),
      url: form.url.trim(),
      notes: form.notes.trim(),
      submittedAt: new Date().toISOString(),
      status: 'pending',
      source: 'community',
    }

    const existing = JSON.parse(localStorage.getItem('capp-suggestions') || '[]')
    localStorage.setItem('capp-suggestions', JSON.stringify([suggestion, ...existing]))
    setSubmitted(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex flex-col justify-end" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-capp-warm-bg rounded-t-3xl max-h-[92dvh] flex flex-col animate-[page-enter_0.25s_ease-out]">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-capp-dark/15 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 shrink-0">
          <div>
            <h2 className="font-garet font-bold text-capp-dark text-xl uppercase">Suggest a Camp</h2>
            <p className="font-garet text-xs text-capp-dark/50 mt-0.5">Help other families discover great camps!</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-capp-dark/8 flex items-center justify-center text-capp-dark/50 text-sm active:scale-90 transition-transform"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          /* ── Success ── */
          <div className="flex-1 flex flex-col items-center justify-center px-6 pb-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center text-4xl mb-4">🎉</div>
            <h3 className="font-garet font-bold text-capp-dark text-xl uppercase mb-2">Thanks for the suggestion!</h3>
            <p className="font-garet text-sm text-capp-dark/60 leading-relaxed">
              We'll review <span className="font-semibold text-capp-dark">{form.campName}</span> and add it to the directory if it's a great fit. Closing in a moment…
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <div className="flex-1 overflow-y-auto px-5 pb-8">
            <div className="flex flex-col gap-4">

              {/* Camp Name */}
              <Field label="Camp Name" required error={errors.campName}>
                <input
                  type="text"
                  placeholder="e.g. Surf Camp SoCal"
                  value={form.campName}
                  onChange={e => set('campName', e.target.value)}
                  className={input(errors.campName)}
                />
              </Field>

              {/* Organization */}
              <Field label="Organization / Provider">
                <input
                  type="text"
                  placeholder="e.g. North County YMCA"
                  value={form.organization}
                  onChange={e => set('organization', e.target.value)}
                  className={input()}
                />
              </Field>

              {/* Category + City row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Category" required error={errors.category}>
                  <select value={form.category} onChange={e => set('category', e.target.value)} className={input(errors.category)}>
                    <option value="">Pick one</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="City" required error={errors.city}>
                  <select value={form.city} onChange={e => set('city', e.target.value)} className={input(errors.city)}>
                    <option value="">Pick one</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>

              {/* URL */}
              <Field label="Registration Website" required error={errors.url}>
                <input
                  type="url"
                  placeholder="https://"
                  value={form.url}
                  onChange={e => set('url', e.target.value)}
                  className={input(errors.url)}
                  inputMode="url"
                />
              </Field>

              {/* Age + Cost row */}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Age Range">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={form.ageMin}
                      onChange={e => set('ageMin', e.target.value)}
                      min={3} max={18}
                      className={`${input()} flex-1 min-w-0`}
                    />
                    <span className="font-garet text-xs text-capp-dark/40 shrink-0">–</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={form.ageMax}
                      onChange={e => set('ageMax', e.target.value)}
                      min={3} max={18}
                      className={`${input()} flex-1 min-w-0`}
                    />
                  </div>
                </Field>
                <Field label="Approx. Cost">
                  <input
                    type="text"
                    placeholder='e.g. $350/week'
                    value={form.cost}
                    onChange={e => set('cost', e.target.value)}
                    className={input()}
                  />
                </Field>
              </div>

              {/* Dates */}
              <Field label="Dates (if known)">
                <input
                  type="text"
                  placeholder="e.g. June–August, weekly"
                  value={form.dates}
                  onChange={e => set('dates', e.target.value)}
                  className={input()}
                />
              </Field>

              {/* Notes */}
              <Field label="Anything else we should know?">
                <textarea
                  rows={3}
                  placeholder="Special programs, why you love it, etc."
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  className={`${input()} resize-none`}
                />
              </Field>

              <button
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl bg-capp-coral text-capp-dark font-garet font-bold text-sm active:scale-95 transition-transform mt-1"
              >
                Submit Suggestion →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <div>
      <label className="block font-garet text-xs font-semibold text-capp-dark/55 uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="font-garet text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function input(error) {
  return `w-full font-garet text-sm bg-white border-2 rounded-xl px-3.5 py-2.5 focus:outline-none transition-colors ${
    error ? 'border-red-300 focus:border-red-400' : 'border-capp-dark/10 focus:border-capp-coral/50'
  }`
}
