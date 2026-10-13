import { useState } from 'react'

const ROWS = [
  ['September 24, 2026', 'Ocean freight rates are moving higher — what importers should plan for', 'Asia Pacific', 215],
  ['September 15, 2026', 'Northbound named a 2026 local business awards finalist', 'Featured', 25],
  ['September 8, 2026', 'A new canal shortcut opens to South-East Asia: what it changes', 'Asia Pacific', 190],
  ['September 6, 2026', 'Introducing our new curbside pickup service', 'Featured', 350],
  ['September 3, 2026', 'Northbound achieves trusted trader accreditation', 'Featured', 140]
]

export default function News() {
  const [hover, setHover] = useState(0)
  return (
    <section id="news" data-theme="dark" className="bg-[#101010] text-white px-5 md:px-10 py-24 md:py-40">
      <div className="md:grid md:grid-cols-[1fr_330px] gap-16 md:ml-[26%]">
        <div>
          <h2 className="font-display font-black uppercase tracking-tight leading-[.98] text-[clamp(2rem,5.6vw,5.6rem)]"><span className="text-white/30">What's moving</span><br />in your industry</h2>
          <ul className="mt-20 md:mt-32">
            {ROWS.map(([d, t, tag, hue], i) => (
              <li key={t} onMouseEnter={() => setHover(i)} className="border-b border-white/20 py-5 grid grid-cols-[1fr_auto] gap-4 items-end group" data-hover>
                <a href="#news"><span className="label text-[.65rem] text-white/60 block">{d}</span><span className="block mt-1 font-medium text-sm md:text-base group-hover:text-signal transition-colors">{t}</span></a>
                <span className="label text-[.6rem] text-white/60">{tag}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="hidden md:flex flex-col justify-between">
          <div><p className="text-white/80 text-sm leading-snug">Stay ahead of the shifts shaping trade across APAC — from regulatory changes to new shipping routes and supply chain trends.</p><a href="#news" className="pill pill-o mt-8">View all</a></div>
          <div className="relative w-full aspect-[326/218] overflow-hidden mt-24">
            {ROWS.map((r, i) => (
              <div key={i} className="absolute inset-0 transition-opacity duration-500" style={{ opacity: hover === i ? 1 : 0, background: `linear-gradient(135deg, hsl(${r[3]} 60% 18%), hsl(${r[3] + 40} 70% 45%))` }}>
                <svg viewBox="0 0 326 218" className="w-full h-full"><path d="M0 170 L326 150 V218 H0Z" fill="rgba(0,0,0,.45)" /><rect x="70" y="118" width="170" height="32" fill="#e9e9e4" /><g fill="#ff5b1f">{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={84 + k * 30} y="100" width="26" height="18" opacity={0.5 + (k % 3) * 0.2} />)}</g></svg>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
