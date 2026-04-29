import { useNavigate } from 'react-router-dom'

const BENEFITS = [
  { icon: '💰', title: 'Earn money', body: 'Get paid to do something you love all summer.' },
  { icon: '📋', title: 'Build your résumé', body: 'Leadership, childcare, and teamwork — colleges notice.' },
  { icon: '☀️', title: 'Live for summer', body: 'Skip the desk job. Work outside with kids who look up to you.' },
  { icon: '🤝', title: 'Give back', body: "Help kids have the summer memories you'll always remember." },
]

const HOW = [
  { step: '01', title: 'Create your profile', body: "Tell us about yourself, your skills, and when you're available. Takes 3 minutes." },
  { step: '02', title: 'Browse camps', body: 'Explore camps across North County and apply to the ones that excite you.' },
  { step: '03', title: 'We connect you', body: "Camp directors reach out directly when they're hiring. No chasing required." },
]

const FAQ = [
  { q: 'What age do I need to be?', a: "Most camps hire counselors ages 14–18. Some roles require 16+. We'll match you with camps that fit your age." },
  { q: 'When do camps start hiring?', a: 'Most North County camps hire January through April for the summer season. Apply early for the best selection!' },
  { q: 'Do I need experience?', a: "Not necessarily. Babysitting, tutoring, coaching a sibling's team — it all counts. Show us who you are." },
  { q: 'Is it paid?', a: 'Most counselor roles are paid hourly or by the week. Pay varies by camp — typically $12–$18/hr for high schoolers.' },
]

export default function CounselorsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-capp-warm-bg pb-nav">

      {/* ── Hero ── */}
      <div className="relative bg-capp-dark px-5 pt-14 pb-12 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-capp-coral/20 blur-2xl" />
        <div className="absolute bottom-0 -left-10 w-32 h-32 rounded-full bg-capp-periwinkle/20 blur-2xl" />

        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-6 active:scale-95 transition-transform"
        >
          ←
        </button>

        <div className="w-14 h-14 rounded-2xl bg-capp-coral flex items-center justify-center text-3xl mb-4 shadow-lg">
          🏕️
        </div>

        <h1 className="font-garet font-bold text-white text-3xl leading-tight uppercase mb-2">
          Work at Camp This Summer
        </h1>
        <p className="font-garet text-sm text-white/65 leading-relaxed mb-6">
          CAMPP connects North County high schoolers with local summer camps looking for counselors. Get paid to make summer amazing.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/counselors/apply')}
            className="w-full py-4 rounded-2xl bg-capp-coral text-capp-dark font-garet font-bold text-sm active:scale-95 transition-transform"
          >
            Apply to the General Pool 🎉
          </button>
          <button
            onClick={() => navigate('/camps')}
            className="w-full py-3.5 rounded-2xl bg-white/10 text-white font-garet font-semibold text-sm active:scale-95 transition-transform"
          >
            Browse Specific Camps →
          </button>
        </div>
      </div>

      <div className="px-4 py-6 flex flex-col gap-6">

        {/* ── Benefits ── */}
        <section>
          <h2 className="font-garet font-bold text-capp-dark text-xl uppercase mb-4">Why counsel at camp?</h2>
          <div className="grid grid-cols-2 gap-3">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-white rounded-2xl p-4 shadow-sm">
                <span className="text-2xl block mb-2">{b.icon}</span>
                <p className="font-garet text-sm font-semibold text-capp-dark leading-tight mb-1">{b.title}</p>
                <p className="font-garet text-xs text-capp-dark/55 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section>
          <h2 className="font-garet font-bold text-capp-dark text-xl uppercase mb-4">How it works</h2>
          <div className="flex flex-col gap-3">
            {HOW.map((h, i) => (
              <div key={h.step} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4">
                <span
                  className="font-garet font-bold text-sm w-9 h-9 rounded-xl bg-capp-coral/15 flex items-center justify-center shrink-0 text-capp-coral"
                >
                  {h.step}
                </span>
                <div>
                  <p className="font-garet text-sm font-semibold text-capp-dark leading-tight mb-0.5">{h.title}</p>
                  <p className="font-garet text-xs text-capp-dark/55 leading-relaxed">{h.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <h2 className="font-garet font-bold text-capp-dark text-xl uppercase mb-4">Common questions</h2>
          <div className="bg-white rounded-2xl shadow-sm divide-y divide-capp-dark/6">
            {FAQ.map(f => (
              <div key={f.q} className="px-4 py-4">
                <p className="font-garet text-sm font-semibold text-capp-dark mb-1">{f.q}</p>
                <p className="font-garet text-xs text-capp-dark/60 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <div className="bg-capp-dark rounded-2xl p-5 text-center">
          <p className="font-garet font-bold text-white text-lg uppercase mb-2">Ready to make this summer count?</p>
          <p className="font-garet text-xs text-white/55 mb-4">Applications take about 3 minutes on your phone.</p>
          <button
            onClick={() => navigate('/counselors/apply')}
            className="w-full py-4 rounded-2xl bg-capp-coral text-capp-dark font-garet font-bold text-sm active:scale-95 transition-transform"
          >
            Apply Now — It's Free 🏕️
          </button>
        </div>

      </div>
    </div>
  )
}
