import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ITEMS = [
  ['Maya Okafor', 'Director', 'Harbourline Co.', 'My business wouldn\'t function without this team. Every consignment is handled on its merits, and our account manager knows our operation inside out.', 210],
  ['Daniel Sørensen', 'Head of Procurement', 'Tideway Industrial', 'Our first project shipment was uncharted territory. They planned the whole move, kept us informed, and delivered on the date they promised.', 150],
  ['Priya Raman', 'Operations Lead', 'Veridian Retail', 'One call, one team, one answer. Peak season used to be stressful; now it is simply scheduled.', 330]
]
const Portrait = ({ hue }) => (
  <svg viewBox="0 0 210 210" className="w-[150px] md:w-[210px]" role="img" aria-label="Placeholder portrait">
    <rect width="210" height="210" fill={`hsl(${hue} 18% 28%)`} /><circle cx="105" cy="82" r="38" fill={`hsl(${hue} 25% 72%)`} />
    <path d="M25 210c4-52 40-72 80-72s76 20 80 72z" fill={`hsl(${hue} 30% 14%)`} />
  </svg>
)

export default function Testimonials() {
  const root = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.tm-row').forEach((el) => gsap.from(el, { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } }))
    }, root)
    return () => ctx.revert()
  }, [])
  return (
    <section id="testimonials" ref={root} data-theme="light" className="bg-paper text-ink px-5 md:px-10 py-24 md:py-40">
      <div className="md:ml-[26%]">
        <h2 className="font-display font-black uppercase tracking-tight leading-[.98] text-[clamp(2rem,6vw,6rem)]">Trusted by businesses <span className="text-neutral-400">across APAC</span></h2>
        <p className="mt-6 max-w-md text-neutral-600">Placeholder testimonials, written for this demo. Replace with real client stories.</p>
        <div className="mt-16 md:mt-24 border-t border-ink/15">
          {ITEMS.map(([n, role, co, q, hue]) => (
            <article key={n} className="tm-row grid md:grid-cols-[210px_1fr] gap-8 md:gap-20 py-12 md:py-20 border-b border-ink/15">
              <div><Portrait hue={hue} /><h3 className="font-display font-bold uppercase text-sm md:text-base mt-5">{n}</h3><p className="text-sm mt-4">{role}<br />at {co}</p></div>
              <p className="text-[clamp(1.25rem,2.1vw,2.2rem)] leading-[1.25] font-medium">{q}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
