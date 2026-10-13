import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Preloader({ onDone }) {
  const root = useRef(), num = useRef(), bar = useRef()
  useEffect(() => {
    document.documentElement.classList.add('lock')
    const o = { v: 0 }
    const tl = gsap.timeline()
    tl.to(o, { v: 100, duration: 2.2, ease: 'power2.inOut', onUpdate: () => { num.current.textContent = String(Math.round(o.v)).padStart(2, '0'); bar.current.style.transform = `scaleX(${o.v / 100})` } })
      .to('.pl-in', { yPercent: -120, opacity: 0, duration: 0.6, ease: 'power3.in' })
      .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 1, ease: 'expo.inOut', onStart: () => { document.documentElement.classList.remove('lock'); onDone() } })
      .set(root.current, { display: 'none' })
    return () => tl.kill()
  }, [])
  return (
    <div ref={root} className="fixed inset-0 z-[100] bg-ink flex flex-col justify-between p-6 md:p-10" style={{ clipPath: 'inset(0 0 0 0)' }}>
      <div className="label text-bone/60 pl-in">Northbound / Placeholder Freight</div>
      <div className="pl-in flex items-end justify-between">
        <div ref={num} className="text-[28vw] md:text-[18vw] leading-[.8] font-semibold tracking-tighter">00</div>
        <div className="label text-signal mb-2">Routing…</div>
      </div>
      <div className="h-px bg-bone/15"><div ref={bar} className="h-full bg-signal origin-left" style={{ transform: 'scaleX(0)' }} /></div>
    </div>
  )
}
