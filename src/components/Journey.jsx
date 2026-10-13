import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { createJourney } from '../scene/journeyScene'

const sm = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }
const SERVICES = ['Air freight', 'Ocean freight', 'Customs brokerage', 'Warehousing & 3PL', 'Project cargo', 'Linehaul transport']
const ICONS = {
  pin: ['..XXXXX..', '.XXXXXXX.', '.XXX.XXX.', '.XXXXXXX.', '..XXXXX..', '...XXX...', '....X....'],
  globe: ['.XXXXXXX.', 'XX..X..XX', 'X...X...X', 'XXXXXXXXX', 'X...X...X', 'XX..X..XX', '.XXXXXXX.'],
  headset: ['..XXXXX..', '.X.....X.', 'X.......X', 'XX.....XX', 'XX.....XX', '.X.XXX.X.', '...X.X...']
}
const FEATURES = [['pin', 'Real-time freight tracking', 'Know exactly where your cargo is at every milestone, from pickup to proof of delivery.'], ['globe', 'Global network coverage', 'Trusted road, sea and air partners across every major trade lane.'], ['headset', '24/7 customer support', 'Real people, always available. We pick up the phone and we own the outcome.']]
const WHY = ['One point of contact', 'Full shipment visibility', 'Licensed compliance in-house', 'Transparent pricing', 'Flexible, tailored solutions']

const DotIcon = ({ rows }) => (
  <svg width="64" height="64" viewBox="0 0 9 9" aria-hidden="true">{rows.flatMap((row, y) => [...row].map((c, x) => c === 'X' && <circle key={x + '-' + y} cx={x + 0.5} cy={y + 1} r=".38" fill="currentColor" />))}</svg>
)

export default function Journey() {
  const root = useRef(), canvas = useRef(), r = useRef({ feat: [], why: [] })
  const set = (k) => (el) => { r.current[k] = el }

  useLayoutEffect(() => {
    const state = { p: 0 }, R = r.current
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: root.current, start: 'top top', end: () => `+=${window.innerHeight * (window.innerWidth < 768 ? 10 : 14)}`, pin: true, anticipatePin: 1, onUpdate: (s) => (state.p = s.progress) })
    }, root)

    const fade = (el, p, a, b, e = 0.02) => { if (!el) return; const o = sm(a, a + e, p) * (1 - sm(b - e, b, p)); el.style.opacity = o; el.style.transform = `translateY(${(1 - o) * 28}px)`; el.style.visibility = o < 0.01 ? 'hidden' : 'visible' }
    let lastTheme = ''
    const j = createJourney(canvas.current, state, (p, info) => {
      R.bg.style.background = info.bg
      const theme = p >= 0.22 && p < 0.34 ? 'dark' : 'light'
      if (theme !== lastTheme) { document.documentElement.dataset.theme = theme; lastTheme = theme }
      R.hud.style.color = (p > 0.235 && p < 0.34) || (p > 0.6 && p < 0.82) ? '#fff' : '#0b0b0c'
      R.spd.textContent = String(Math.round(info.speed)).padStart(2, '0')
      R.unit.textContent = info.mode === 'ocean' ? 'KN' : 'KM/H'
      R.ghost.style.transform = `translateX(${(1 - sm(0.15, 0.3, p)) * 70 - sm(0.15, 0.3, p) * 60}vw)`
      R.ghost.style.opacity = 1 - sm(0.215, 0.24, p)
      fade(R.dark, p, 0.235, 0.345)
      const si = Math.min(5, Math.floor(sm(0.25, 0.33, p) * 6)); R.chipEls.forEach((c, i) => (c.style.opacity = i <= si ? 1 : 0.3))
      fade(R.road, p, 0.4, 0.58)
      R.feat.forEach((el, i) => fade(el, p, 0.41 + i * 0.055, 0.46 + i * 0.055, 0.015))
      fade(R.why, p, 0.64, 0.8)
      R.whyItems.forEach((el, i) => (el.style.opacity = sm(0.7 + i * 0.015, 0.73 + i * 0.015, p) * (1 - sm(0.8, 0.83, p))))
      fade(R.sky, p, 0.9, 1, 0.03)
      R.fade.style.opacity = sm(0.975, 1, p)
    })
    return () => { j.dispose(); ctx.revert() }
  }, [])

  return (
    <section id="journey" ref={root} data-theme="auto" className="relative h-[100svh] overflow-hidden">
      <div ref={set('bg')} className="absolute inset-0">
        <div ref={set('ghost')} className="absolute top-[14%] left-0 whitespace-nowrap font-display font-black text-[24vw] leading-none text-black/[.07] select-none">OUR SERVICES</div>
        <canvas ref={canvas} className="absolute inset-0 w-full h-full" />

        <div ref={set('hud')} className="absolute top-24 md:top-28 left-5 md:left-10 label text-sm z-10"><span ref={set('spd')}>00</span> <span ref={set('unit')}>KM/H</span></div>

        {/* services (dark phase) */}
        <div ref={set('dark')} className="absolute inset-x-5 md:inset-x-10 bottom-[7vh] text-white z-10 opacity-0">
          <div className="grid md:grid-cols-[1.4fr_1fr] gap-6 items-end">
            <h2 className="font-display font-black uppercase leading-[.98] tracking-tight text-[clamp(1.7rem,5.2vw,5.5rem)]">Everything your<br />freight needs.<br /><span className="text-white/40">Under one group.</span></h2>
            <div className="md:pb-3"><p className="text-white/80 text-sm md:text-base max-w-sm">From air to sea, from clearance to final delivery — one partner, one point of contact, total visibility from origin to destination.</p><a href="#journey" className="pill pill-o mt-6 hidden md:inline-flex">Our services</a></div>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-6 md:mt-8 label text-[.65rem] md:text-xs">{SERVICES.map((s, i) => <li key={s} ref={(el) => ((r.current.chipEls ||= [])[i] = el)} style={{ opacity: 0.3 }}>0{i + 1} {s}</li>)}</ul>
        </div>

        {/* road phase */}
        <div ref={set('road')} className="absolute left-5 md:left-10 bottom-[6vh] max-w-[16rem] md:max-w-sm text-ink z-10 opacity-0"><p className="font-medium text-sm md:text-lg leading-snug">With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses.</p></div>
        {FEATURES.map(([ic, t, d], i) => (
          <div key={t} ref={(el) => (r.current.feat[i] = el)} className="absolute right-5 md:right-[12%] bottom-[6vh] md:bottom-auto md:top-[34%] max-w-[15rem] md:max-w-xs text-ink z-10 opacity-0 bg-paper/80 md:bg-transparent p-3 md:p-0">
            <div className="hidden md:block"><DotIcon rows={ICONS[ic]} /></div><h3 className="font-display font-bold uppercase text-lg md:text-3xl leading-tight md:mt-5">{t}</h3><p className="text-sm md:text-base mt-2 md:mt-3">{d}</p>
          </div>
        ))}

        {/* ocean phase */}
        <div ref={set('why')} className="absolute inset-x-0 top-[17%] text-center text-white z-10 opacity-0 px-5">
          <p className="label mb-4">Why us</p>
          <h2 className="font-display font-black uppercase leading-[1.02] tracking-tight text-[clamp(1.8rem,5vw,5.2rem)] max-w-[11ch] md:max-w-[14ch] mx-auto" style={{ textShadow: '0 2px 30px rgba(0,30,120,.5)' }}>Logistics that works as hard as you do.</h2>
        </div>
        <ul className="absolute inset-x-5 md:inset-x-10 bottom-[5vh] grid grid-cols-2 md:grid-cols-5 gap-3 text-white z-10">
          {WHY.map((w, i) => <li key={w} ref={(el) => ((r.current.whyItems ||= [])[i] = el)} className="label text-[.62rem] md:text-xs border-t border-white/50 pt-2 opacity-0" style={{ opacity: 0 }}>0{i + 1} — {w}</li>)}
        </ul>

        {/* sky phase */}
        <div ref={set('sky')} className="absolute left-5 md:left-10 bottom-[8vh] text-ink z-10 opacity-0"><p className="label mb-2">Altitude 10,670 m</p><p className="font-display font-black uppercase text-[clamp(1.5rem,3.6vw,3.4rem)] leading-tight">Same container.<br />Other side of the world.</p></div>
        <div ref={set('fade')} className="absolute inset-0 bg-paper pointer-events-none opacity-0 z-20" />
      </div>
    </section>
  )
}
