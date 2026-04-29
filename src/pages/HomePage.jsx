import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    number: '01',
    bg: '#155fcc',
    title: 'Discover',
    desc: "Find camps you didn't know existed.",
    path: '/camps',
  },
  {
    number: '02',
    bg: '#ffd21f',
    title: 'Connect',
    desc: "Use your circle to find out who's doing what.",
    path: '/circle',
  },
  {
    number: '03',
    bg: '#11a253',
    title: 'Sort',
    desc: 'See your whole summer laid out.',
    path: '/my-summer',
  },
]

const testimonials = [
  {
    quote: "I planned our entire summer in one afternoon. My kids are thrilled and I am not stressed. 10/10.",
    name: 'Jess M.',
    location: 'Encinitas',
    borderColor: '#155fcc',
    initial: '#155fcc',
  },
  {
    quote: "Finally — a site that actually lists what camps are available near me. Such a game changer.",
    name: 'Taryn L.',
    location: 'Carlsbad',
    borderColor: '#ffd21f',
    initial: '#b45309',
  },
  {
    quote: "My son is doing surf camp AND robotics this summer. CAMPP made it stupidly easy to find both.",
    name: 'Brianna K.',
    location: 'Oceanside',
    borderColor: '#826dee',
    initial: '#826dee',
  },
]

const categories = [
  { label: 'Sports',   img: 'https://images.unsplash.com/photo-1587329310686-91414b8e3cb7?w=400&q=80' },
  { label: 'Arts',     img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80' },
  { label: 'STEM',     img: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=400&q=80' },
  { label: 'Outdoors', img: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80' },
  { label: 'Surf',     img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&q=80' },
  { label: 'Music',    img: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearch(e) {
    e.preventDefault()
    navigate(query.trim() ? `/camps?q=${encodeURIComponent(query.trim())}` : '/camps')
  }

  return (
    <div className="min-h-screen bg-capp-bg pb-nav">

      {/* ── Top header ── */}
      <header className="px-5 pt-12 pb-4 flex items-center justify-between">
        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 active:opacity-70 transition-opacity">
          <img src="/logo.png" alt="CAMPP" className="w-9 h-9 object-contain" />
          <span className="font-garet font-black text-capp-dark text-xl uppercase tracking-wide">CAMPP</span>
        </button>
        <div className="inline-flex items-center gap-1.5 bg-capp-blue/10 border border-capp-blue/20 rounded-full px-3 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-capp-blue" />
          <span className="font-garet text-xs font-bold text-capp-blue">North County SD</span>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="px-5 pt-6 pb-8">
        {/* Headline */}
        <h1 className="font-garet text-[2.6rem] font-black text-capp-dark leading-[1.1] mb-2 uppercase">
          Find the perfect<br />
          <span className="text-capp-blue">summer camp</span><br />
          for your kid.
        </h1>
        <p className="font-garet text-sm text-capp-dark/55 leading-relaxed mb-7 max-w-xs">
          Browse, compare, and book the best local camps — all in one place, built for busy North County families.
        </p>

        {/* ── Search bar ── */}
        <form onSubmit={handleSearch} className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-30">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surf, STEM, arts…"
            className="w-full font-garet text-sm bg-white border-2 border-capp-dark/10 rounded-2xl pl-11 pr-28 py-4 shadow-sm placeholder:text-capp-dark/30 focus:outline-none focus:border-capp-blue/50 transition-colors"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-capp-blue text-white font-garet font-bold text-sm px-4 py-2 rounded-xl active:scale-95 transition-transform"
          >
            Search
          </button>
        </form>
      </section>

      {/* ── Categories ── */}
      <section className="px-4 mb-12">
        <div className="flex items-baseline justify-between mb-4 px-1">
          <div>
            <h2 className="font-garet text-2xl font-black text-capp-dark uppercase">Browse by type</h2>
            <p className="font-garet text-sm text-capp-dark/50">Something for every kid</p>
          </div>
          <button
            onClick={() => navigate('/camps')}
            className="font-garet text-xs font-bold text-capp-blue"
          >
            See all
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(`/camps?category=${cat.label}`)}
              className="rounded-2xl overflow-hidden active:scale-95 transition-transform relative h-24"
            >
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-end justify-center pb-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 70%)' }}>
                <span className="font-garet text-xs font-black text-white uppercase tracking-wide">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="px-4 mb-12">
        <div className="px-1 mb-6">
          <h2 className="font-garet text-2xl font-black text-capp-dark uppercase">How it works</h2>
          <p className="font-garet text-sm text-capp-dark/50">Three steps to a sorted summer</p>
        </div>
        <div className="flex flex-col gap-4">
          {steps.map((step) => (
            <button
              key={step.number}
              onClick={() => navigate(step.path)}
              className="bg-white rounded-2xl p-5 shadow-sm flex gap-4 items-start text-left w-full active:scale-[0.98] transition-transform"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-garet font-black text-white text-base shrink-0 shadow-sm"
                style={{ backgroundColor: step.bg }}
              >
                {step.number}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-garet font-black text-capp-dark text-base uppercase mb-1">{step.title}</h3>
                <p className="font-garet text-sm text-capp-dark/60 leading-relaxed">{step.desc}</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-1 opacity-20">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="px-4 mb-12">
        <div className="px-1 mb-5">
          <h2 className="font-garet text-2xl font-black text-capp-dark uppercase">What parents are saying</h2>
          <p className="font-garet text-sm text-capp-dark/50">Real reviews from your neighborhood</p>
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
              <p className="font-garet text-sm text-capp-dark/80 leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white font-garet"
                  style={{ backgroundColor: t.initial }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-garet text-xs font-bold text-capp-dark">{t.name}</p>
                  <p className="font-garet text-xs text-capp-dark/40">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="mx-4 mb-10 bg-capp-blue rounded-3xl px-6 py-10 text-center overflow-hidden relative">
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />
        <h2 className="font-garet text-2xl font-black text-white mb-2 relative uppercase">
          Ready to sort your summer?
        </h2>
        <p className="font-garet text-sm text-white/75 mb-6 leading-relaxed relative">
          Join hundreds of North County families who've already found their perfect camps.
        </p>
        <button
          onClick={() => navigate('/camps')}
          className="w-full bg-white text-capp-blue font-garet font-black text-base px-8 py-4 rounded-2xl shadow active:scale-95 transition-transform relative"
        >
          Browse All Camps
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="px-6 pb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="/logo.png" alt="CAMPP" className="w-6 h-6 object-contain" />
          <span className="font-garet font-black text-capp-dark text-sm uppercase">CAMPP</span>
        </div>
        <p className="font-garet text-xs text-capp-dark/35">© 2026 CAMPP · North County San Diego</p>
      </footer>
    </div>
  )
}
