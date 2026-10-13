import { useEffect, useState } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Journey from './components/Journey'
import Testimonials from './components/Testimonials'
import Partners from './components/Partners'
import News from './components/News'
import Faq from './components/Faq'
import Footer from './components/Footer'

export default function App() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    if (!ready) return
    // header colour follows whichever section is under it (the pinned Journey sets its own theme per phase)
    const triggers = [...document.querySelectorAll('[data-theme]')].filter((el) => el.dataset.theme !== 'auto').map((el) =>
      ScrollTrigger.create({ trigger: el, start: 'top 60px', end: 'bottom 60px', onToggle: (s) => s.isActive && (document.documentElement.dataset.theme = el.dataset.theme) }))
    const r = () => { ScrollTrigger.sort(); ScrollTrigger.refresh() }
    r(); document.fonts?.ready.then(r); window.addEventListener('load', r)
    return () => { triggers.forEach((t) => t.kill()); window.removeEventListener('load', r) }
  }, [ready])
  return (
    <>
      <Preloader onDone={() => setReady(true)} />
      <Cursor />
      <Header />
      <main>
        <Hero ready={ready} /><About /><Journey /><Testimonials /><Partners /><News /><Faq />
      </main>
      <Footer />
    </>
  )
}
