import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const el = useRef()
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const x = gsap.quickTo(el.current, 'x', { duration: 0.35, ease: 'power3' }), y = gsap.quickTo(el.current, 'y', { duration: 0.35, ease: 'power3' })
    const mv = (e) => { x(e.clientX); y(e.clientY) }
    const ov = (e) => el.current.classList.toggle('big', !!e.target.closest('a,button,[data-hover]'))
    window.addEventListener('pointermove', mv); window.addEventListener('pointerover', ov)
    return () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerover', ov) }
  }, [])
  return <div ref={el} className="cursor hidden md:block"><i /></div>
}
