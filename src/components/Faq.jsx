import { useState } from 'react'

const QA = [
  ['What does Northbound do?', 'Placeholder answer: integrated freight forwarding across road, ocean and air, with customs brokerage and warehousing.'],
  ['What industries do you specialise in?', 'Placeholder answer: retail, technology, energy, automotive, mining and more.'],
  ['What shipping methods do you offer?', 'Placeholder answer: FCL and LCL ocean, air freight, linehaul road transport and multimodal combinations.'],
  ['Do you provide customs clearance services?', 'Placeholder answer: yes — licensed brokers handle classification, duties and compliance.'],
  ['How is freight pricing calculated?', 'Placeholder answer: by mode, weight/volume, lane, service level and any special handling.'],
  ['Do you offer warehousing and 3PL services?', 'Placeholder answer: yes, storage, pick-and-pack and distribution tied to every freight leg.'],
  ['Can you handle oversized or heavy cargo?', 'Placeholder answer: yes — project cargo including out-of-gauge and heavy-lift moves.']
]

export default function Faq() {
  const [open, setOpen] = useState(2)
  return (
    <section id="faq" data-theme="light" className="bg-paper text-ink px-5 md:px-10 py-24 md:py-40">
      <div className="md:grid md:grid-cols-[26%_1fr_240px] gap-10">
        <div><h2 className="font-display font-black text-[clamp(3rem,6vw,6rem)] leading-none tracking-tight">F.A.Q</h2><p className="mt-6 max-w-[16rem] text-neutral-700">Straightforward answers, so you can move forward with confidence.</p></div>
        <div className="border-t border-ink/25 mt-12 md:mt-0">
          {QA.map(([q, a], i) => (
            <div key={q} className="border-b border-ink/25">
              <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full grid grid-cols-[48px_1fr_auto] md:grid-cols-[116px_1fr_auto] items-center py-6 md:py-7 text-left" aria-expanded={open === i}>
                <span className="label text-[.65rem]">0{i + 1}</span>
                <span className={`font-medium text-base md:text-lg transition-colors ${open === i ? 'text-ink' : 'text-neutral-600'}`}>{q}</span>
                <span className={`w-2 h-2 rounded-full transition-colors ${open === i ? 'bg-ink' : 'bg-neutral-300'}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${open === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}><p className="overflow-hidden md:pl-[116px] pl-[48px] text-neutral-600 max-w-xl">{<span className="block pb-6">{a}</span>}</p></div>
            </div>
          ))}
        </div>
        <div className="mt-10 md:mt-0"><p className="max-w-[12rem]">Still have questions? Our team is here to help.</p><a href="mailto:hello@northbound.example" className="label inline-block mt-6 underline underline-offset-4">Email us</a></div>
      </div>
    </section>
  )
}
