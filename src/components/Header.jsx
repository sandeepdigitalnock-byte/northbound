import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

const LINKS = ['About', 'Journey', 'Testimonials', 'Partners', 'News', 'FAQ', 'Contact']
export const NAV = ['About', 'Services', 'Industries', 'Insights', 'Careers', 'Contact']

export default function Header() {
  const [open, setOpen] = useState(false), [scrolled, setScrolled] = useState(false)
  const menu = useRef()
  useEffect(() => { const f = () => setScrolled(window.scrollY > 80); f(); window.addEventListener('scroll', f, { passive: true }); return () => window.removeEventListener('scroll', f) }, [])
  useEffect(() => {
    const el = menu.current
    document.documentElement.classList.toggle('lock', open)
    if (open) {
      gsap.set(el, { display: 'flex' })
      gsap.fromTo(el, { clipPath: 'circle(0% at 50% 0%)' }, { clipPath: 'circle(160% at 50% 0%)', duration: 1, ease: 'expo.out' })
      gsap.fromTo('.m-link > span', { yPercent: 110 }, { yPercent: 0, stagger: 0.06, duration: 0.9, ease: 'power4.out', delay: 0.25 })
    } else if (getComputedStyle(el).display !== 'none') {
      gsap.to(el, { clipPath: 'circle(0% at 50% 0%)', duration: 0.7, ease: 'expo.inOut', onComplete: () => gsap.set(el, { display: 'none' }) })
    }
  }, [open])
  const go = (id) => { setOpen(false); setTimeout(() => document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }), 450) }

  return (
    <>
      <header className={`hdr fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 md:px-10 h-[68px] md:h-[80px] ${scrolled ? 'hdr-solid' : ''}`} style={{ paddingTop: scrolled ? 0 : 44 }}>
        <a href="#top" className="font-display font-black tracking-tight text-xl md:text-[1.7rem] leading-none">{scrolled ? 'NB' : 'NORTHBOUND'}</a>
        <button onClick={() => setOpen(!open)} className={`label flex items-center gap-2 absolute left-1/2 -translate-x-1/2 md:left-[27%] md:translate-x-0 transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} aria-expanded={open}>
          <span className="tracking-[.3em]">•••</span>{open ? 'Close' : 'Menu'}
        </button>
        <div className={`hidden lg:block absolute left-[62%] w-[150px] overflow-hidden transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}>
          <div className="marquee label" style={{ animationDuration: '14s' }}>{Array(6).fill('• Follow us on LinkedIn ').join('')}</div>
        </div>
        <a href="#contact" className="pill !py-3 !px-5 md:!px-7">Work with us</a>
      </header>
      <nav ref={menu} className="fixed inset-0 z-[60] bg-ink hidden flex-col justify-center px-6 md:px-16" style={{ display: 'none' }}>
        <button onClick={() => setOpen(false)} className="absolute top-6 right-6 md:right-10 label">Close</button>
        {LINKS.map((l, i) => (
          <button key={l} onClick={() => go(l)} className="text-left overflow-hidden m-link group">
            <span className="block font-display font-bold uppercase text-[9vw] md:text-[5.5vw] leading-[1.15] group-hover:text-signal transition-colors"><sup className="label mr-3 align-top">0{i + 1}</sup>{l}</span>
          </button>
        ))}
        <p className="label text-white/50 mt-10">hello@northbound.example</p>
      </nav>
    </>
  )
}
