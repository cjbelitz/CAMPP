import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const stats = [
  { value: '150+', label: 'Camps listed' },
  { value: 'Ages 4–18', label: 'All ages covered' },
  { value: 'North County SD', label: 'Local & trusted' },
]

const steps = [
  {
    number: '01',
    color: 'bg-capp-coral',
    textColor: 'text-capp-coral',
    icon: '🔍',
    title: 'Browse',
    desc: 'Filter by age, dates, category, and price. Find camps that actually fit your summer.',
  },
  {
    number: '02',
    color: 'bg-capp-yellow',
    textColor: 'text-amber-500',
    icon: '⭐',
    title: 'Compare',
    desc: "Read real reviews from other North County moms. See what's included, what to pack, what to skip.",
  },
  {
    number: '03',
    color: 'bg-capp-mint',
    textColor: 'text-capp-mint',
    icon: '✅',
    title: 'Book',
    desc: 'Save your spots in seconds. No more juggling twelve browser tabs.',
  },
]

const testimonials = [
  {
    quote: "I planned our entire summer in one afternoon. My kids are thrilled and I am not stressed. 10/10.",
    name: 'Jess M.',
    location: 'Encinitas',
    borderColor: '#FF6B6B',
    initial: '#FF6B6B',
  },
  {
    quote: "Finally — a site that actually lists what camps are available near me. Such a game changer.",
    name: 'Taryn L.',
    location: 'Carlsbad',
    borderColor: '#FFD166',
    initial: '#f59e0b',
  },
  {
    quote: "My son is doing surf camp AND robotics this summer. CAMPP made it stupidly easy to find both.",
    name: 'Brianna K.',
    location: 'Oceanside',
    borderColor: '#06D6A0',
    initial: '#06D6A0',
  },
]

const categories = [
  { label: 'Sports', icon: '⚽', bg: '#FF6B6B15', border: '#FF6B6B40' },
  { label: 'Arts',   icon: '🎨', bg: '#FFD16630', border: '#FFD16650' },
  { label: 'STEM',   icon: '🔬', bg: '#06D6A015', border: '#06D6A040' },
  { label: 'Outdoors', icon: '🏕️', bg: '#118AB215', border: '#118AB240' },
  { label: 'Surf',   icon: '🏄', bg: '#FF6B6B15', border: '#FF6B6B40' },
  { label: 'Music',  icon: '🎵', bg: '#FFD16630', border: '#FFD16650' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(query.trim() ? `/camps?q=${encodeURIComponent(query.trim())}` : '/camps')
  }

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* ── Top header ── */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 active:opacity-70 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-capp-coral flex items-center justify-center shadow-sm">
            <span className="font-[Fraunces] text-capp-dark text-lg font-bold leading-none">C</span>
          </div>
          <span className="font-[Fraunces] font-bold text-capp-dark text-xl">CAMPP</span>
        </button>
        <div className="inline-flex items-center gap-1.5 bg-capp-coral/10 border border-capp-coral/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-capp-coral" />
          <span className="font-[DM_Sans] text-xs font-semibold text-capp-coral">North County SD</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 pt-6 pb-8">
        {/* Headline */}
        <h1 className="font-[Fraunces] text-[2.6rem] font-bold text-capp-dark leading-[1.1] mb-2">
          Find the perfect<br />
          <span className="text-capp-coral italic">summer camp</span><br />
          for your kid.
        </h1>
        <p className="font-[DM_Sans] text-sm text-capp-dark/55 leading-relaxed mb-7 max-w-xs">
          Browse, compare, and book the best local camps — all in one place, built for busy North County moms.
        </p>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg pointer-events-none">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surf, STEM, arts…"
            className="w-full font-[DM_Sans] text-sm bg-white border-2 border-capp-dark/10 rounded-2xl pl-11 pr-28 py-4 shadow-sm placeholder:text-capp-dark/30 focus:outline-none focus:border-capp-coral/50 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-capp-coral text-capp-dark font-[DM_Sans] font-semibold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Search
          </button>
        </form>

        {/* Quick-search chips */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {['Surf', 'STEM', 'Arts', 'Outdoors', 'Sports', 'Music'].map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/camps?category=${tag}`)}
              className="shrink-0 font-[DM_Sans] text-xs font-medium px-3.5 py-1.5 rounded-full bg-white border border-capp-dark/12 text-capp-dark/60 active:scale-95 transition-transform"
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="mx-4 mb-10 bg-white rounded-2xl shadow-sm px-4 py-5 flex justify-around divide-x divide-capp-dark/10">
        {stats.map((s) => (
          <div key={s.label} className="flex-1 flex flex-col items-center gap-0.5 px-2">
            <span className="font-[Fraunces] font-bold text-lg text-capp-dark">{s.value}</span>
            <span className="font-[DM_Sans] text-xs text-capp-dark/50 text-center leading-tight">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Categories ── */}
      <section className="px-4 mb-12">
        <div className="flex items-baseline justify-between mb-4 px-1">
          <div>
            <h2 className="font-[Fraunces] text-2xl font-bold text-capp-dark">Browse by type</h2>
            <p className="font-[DM_Sans] text-sm text-capp-dark/50">Something for every kid</p>
          </div>
          <button
            onClick={() => navigate('/camps')}
            className="font-[DM_Sans] text-xs font-semibold text-capp-coral"
          >
            See all →
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/camps?category=${cat.label}`)}
              className="rounded-2xl py-4 flex flex-col items-center gap-2 active:scale-95 transition-transform border"
              style={{ backgroundColor: cat.bg, borderColor: cat.border }}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="font-[DM_Sans] text-xs font-semibold text-capp-dark">{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 mb-12">
        <div className="px-1 mb-6">
          <h2 className="font-[Fraunces] text-2xl font-bold text-capp-dark">How it works</h2>
          <p className="font-[DM_Sans] text-sm text-capp-dark/50">Three steps to a sorted summer</p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <div key={step.number} className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-start">
              <div className={`w-11 h-11 rounded-xl ${step.color} flex items-center justify-center text-xl shrink-0 shadow-sm`}>
                {step.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-[DM_Sans] text-xs font-bold ${step.textColor}`}>{step.number}</span>
                  <h3 className="font-[Fraunces] font-bold text-capp-dark text-base">{step.title}</h3>
                </div>
                <p className="font-[DM_Sans] text-sm text-capp-dark/60 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 mb-12">
        <div className="px-1 mb-5">
          <h2 className="font-[Fraunces] text-2xl font-bold text-capp-dark">What moms are saying</h2>
          <p className="font-[DM_Sans] text-sm text-capp-dark/50">Real reviews from your neighborhood</p>
        </div>
        <div className="flex flex-col gap-4">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-5 shadow-sm border-l-4"
              style={{ borderLeftColor: t.borderColor }}
            >
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-capp-yellow text-xs">★</span>
                ))}
              </div>
              <p className="font-[DM_Sans] text-sm text-capp-dark/80 leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white font-[DM_Sans]"
                  style={{ backgroundColor: t.initial }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-[DM_Sans] text-xs font-semibold text-capp-dark">{t.name}</p>
                  <p className="font-[DM_Sans] text-xs text-capp-dark/40">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="mx-4 mb-10 bg-capp-coral rounded-3xl px-6 py-10 text-center overflow-hidden relative">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
        <h2 className="font-[Fraunces] text-2xl font-bold text-capp-dark mb-2 relative">
          Ready to sort your summer?
        </h2>
        <p className="font-[DM_Sans] text-sm text-capp-dark/65 mb-6 leading-relaxed relative">
          Join hundreds of North County moms who've already found their perfect camps.
        </p>
        <button
          onClick={() => navigate('/camps')}
          className="w-full bg-white text-capp-dark font-[DM_Sans] font-semibold text-base px-8 py-4 rounded-2xl shadow active:scale-95 transition-transform relative"
        >
          Browse All Camps
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-capp-coral flex items-center justify-center">
            <span className="font-[Fraunces] text-capp-dark text-xs font-bold">C</span>
          </div>
          <span className="font-[Fraunces] font-bold text-capp-dark text-sm">CAMPP</span>
        </div>
        <p className="font-[DM_Sans] text-xs text-capp-dark/35">© 2025 CAMPP · Made with ☀️ in North County San Diego</p>
      </footer>
    </div>
  )
}
