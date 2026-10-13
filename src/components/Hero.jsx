import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import Globe from './Globe'
import Split from './Split'
import { NAV } from './Header'

export default function Hero({ ready }) {
  const root = useRef()
  const stars = useMemo(() => Array.from({ length: 150 }, () => `${(Math.random() * 100).toFixed(1)}vw ${(Math.random() * 100).toFixed(1)}vh 0 0 rgba(255,255,255,${(Math.random() * 0.7 + 0.15).toFixed(2)})`).join(','), [])
  useEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power4.out' } })
        .from('.hero-globe', { opacity: 0, x: 120, duration: 2 })
        .from('.hero .w > span', { yPercent: 115, duration: 1.2, stagger: 0.07 }, 0.1)
        .from('.hero-fade', { opacity: 0, y: 20, duration: 1, stagger: 0.08 }, 0.5)
      gsap.to('.hero-globe', { xPercent: 6, yPercent: 8, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <section id="top" ref={root} data-theme="dark" className="hero relative min-h-[100svh] overflow-hidden bg-ink text-white">
      <div className="absolute w-px h-px" style={{ boxShadow: stars }} />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_8%_95%,rgba(120,70,20,.25),transparent)]" />
      <div className="hero-globe"><Globe className="w-full h-full" /></div>
<div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent pointer-events-none md:hidden" />

      <div className="relative z-10 flex items-center justify-between gap-6 px-5 md:px-10 h-10 border-b border-white/10 label text-[.65rem] text-white/80">
        <div className="overflow-hidden w-[60%] md:w-[40%]"><div className="marquee">{Array(4).fill('NEWS: Rates are moving on the Asia–Pacific lane • Northbound named 2026 finalist • ').join('')}</div></div>
        <div className="hidden sm:flex gap-3"><a href="#contact">Carbon calculator</a><span>|</span><a href="#contact">Live tracking portal</a></div>
      </div>

      <div className="relative z-10 pointer-events-none px-5 md:px-10 pt-24 md:pt-32 pb-12 md:ml-[28%]">
        <ul className="hidden md:block space-y-[18px] pointer-events-auto mb-7">
          {NAV.map((n) => <li key={n} className="hero-fade"><a href={`#${n === 'About' ? 'about' : n === 'Contact' ? 'contact' : 'journey'}`} className="label text-[.8rem] hover:text-signal transition">{n}</a></li>)}
        </ul>
        <p className="hero-fade font-display font-medium uppercase text-lg md:text-2xl mb-3">One operator</p>
        <h1 className="font-display font-black uppercase leading-[.98] text-[clamp(2.1rem,7.2vw,9rem)] tracking-tight">
          <Split text="Every" /><br /><Split text="leg of the" /><br /><Split text="journey" />
        </h1>
        <p className="hero-fade mt-8 md:mt-14 max-w-[22rem] text-white/75 text-base md:text-lg leading-snug">Freight forwarding, land transport and customs brokerage, unified under one accountable team.</p>
        <div className="hero-fade mt-8 md:mt-16 flex flex-wrap gap-3 pointer-events-auto">
          <a href="#contact" className="pill pill-w">Talk with us</a><a href="#journey" className="pill pill-o">Our services</a>
        </div>
      </div>
    </section>
  )
}
