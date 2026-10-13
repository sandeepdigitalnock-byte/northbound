import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const STATS = [{ n: 2500, s: '+', l: 'Shipments moved every month' }, { n: 98.2, s: '%', l: 'On-time delivery', d: 1 }, { n: 8, s: '+', l: 'Years in operation' }]

export default function About() {
  const root = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-count]').forEach((el) => {
        const o = { v: 0 }, d = +(el.dataset.dec || 0)
        gsap.to(o, { v: +el.dataset.count, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => (el.textContent = o.v.toLocaleString('en', { minimumFractionDigits: d, maximumFractionDigits: d })) })
      })
      gsap.from('.ab-fade', { y: 40, opacity: 0, duration: 1, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 70%' } })
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="about" ref={root} data-theme="light" className="bg-paper text-ink px-5 md:px-10 pt-28 md:pt-40 pb-20">
      <div className="md:grid md:grid-cols-[1fr_1fr] gap-12">
        {/* left column stays pinned while the right column scrolls */}
        <div className="md:sticky md:top-28 self-start">
          <svg className="ab-fade w-[220px] md:w-[326px] mb-10 md:mb-20" viewBox="0 0 326 207" role="img" aria-label="Placeholder highway artwork">
            <defs><linearGradient id="hw" x1="0" x2="1"><stop offset="0" stopColor="#3b4a3a" /><stop offset="1" stopColor="#6a7466" /></linearGradient></defs>
            <rect width="326" height="207" fill="url(#hw)" />
            {[0, 1, 2].map((i) => <path key={i} d={`M-10 ${150 - i * 45} C 90 ${40 - i * 20}, 200 ${230 - i * 40}, 340 ${60 + i * 25}`} stroke="#d8d8d4" strokeWidth="14" fill="none" opacity=".85" />)}
            {[0, 1, 2].map((i) => <path key={i} d={`M-10 ${150 - i * 45} C 90 ${40 - i * 20}, 200 ${230 - i * 40}, 340 ${60 + i * 25}`} stroke="#777" strokeWidth="1.5" strokeDasharray="6 8" fill="none" />)}
          </svg>
          <h2 className="ab-fade font-display font-black uppercase leading-[.98] tracking-tight text-[clamp(2rem,5.2vw,5.2rem)]">
            <span className="text-neutral-400">We move<br />freight.</span><br />We own<br />the outcome.
          </h2>
        </div>
        <div className="mt-14 md:mt-0">
          <p className="ab-fade text-[clamp(1.15rem,1.6vw,1.6rem)] leading-snug font-medium max-w-xl">With every service under one roof and one accountable team, your supply chain moves the way your business demands: predictably, transparently, and without excuses.</p>
          <p className="ab-fade text-[clamp(1.15rem,1.6vw,1.6rem)] leading-snug font-medium max-w-xl mt-10">That means no finger-pointing between vendors. No delays lost in handoffs. Just one team, accountable from origin to destination.</p>
          <a href="#journey" className="ab-fade pill pill-ko mt-12">Learn more about us</a>
          <p className="mt-[28vh] md:mt-[40vh] font-medium border-b border-ink/25 pb-3 max-w-xl">From countless journeys, clarity emerges</p>
          {STATS.map((s) => (
            <div key={s.l} className="min-h-[50vh] md:min-h-[70vh] flex flex-col justify-center">
              <div className="font-display font-black tracking-tighter leading-none text-[clamp(4rem,11vw,10rem)]"><span data-count={s.n} data-dec={s.d || 0}>0</span>{s.s}</div>
              <div className="text-xl md:text-2xl text-neutral-500 mt-4">{s.l}</div>
              <div className="h-px bg-ink/20 mt-16 max-w-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
