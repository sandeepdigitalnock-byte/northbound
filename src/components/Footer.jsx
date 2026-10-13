import { useEffect, useRef, useState } from 'react'
import { isLand, LABELS } from '../lib/geo'

function DotMap() {
  const cv = useRef()
  useEffect(() => {
    const c = cv.current, w = c.clientWidth, h = Math.round(w * 0.5), d = window.devicePixelRatio || 1
    c.width = w * d; c.height = h * d; const x = c.getContext('2d'); x.scale(d, d)
    const step = Math.max(4, w / 90)
    for (let px = 0; px < w; px += step) for (let py = 0; py < h; py += step) { const lon = (px / w) * 360 - 180, lat = 80 - (py / h) * 140; if (isLand(lat, lon)) { x.fillStyle = '#b9b9b6'; x.beginPath(); x.arc(px, py, step * 0.22, 0, 7); x.fill() } }
    ;[['Australia'], ['China'], ['India']].forEach(([n]) => { const [, la, lo] = LABELS.find((l) => l[0] === n); x.fillStyle = '#1a3cff'; x.beginPath(); x.arc(((lo + 180) / 360) * w, ((80 - la) / 140) * h, step * 0.4, 0, 7); x.fill() })
  }, [])
  return <canvas ref={cv} className="w-full" style={{ aspectRatio: '2/1' }} role="img" aria-label="Placeholder dotted world map" />
}

function DotText({ text }) {
  const cv = useRef()
  useEffect(() => {
    const draw = async () => {
      await document.fonts.load('900 100px Unbounded'); const c = cv.current, w = c.parentElement.clientWidth, d = window.devicePixelRatio || 1
      const off = document.createElement('canvas'), o = off.getContext('2d'); o.font = '900 100px Unbounded'; const tw = o.measureText(text).width, fs = (100 * w) / tw, h = Math.ceil(fs * 0.85)
      off.width = w; off.height = h; o.font = `900 ${fs}px Unbounded`; o.textBaseline = 'alphabetic'; o.fillText(text, 0, h * 0.92)
      const data = o.getImageData(0, 0, w, h).data; c.width = w * d; c.height = h * d; c.style.height = h + 'px'; const x = c.getContext('2d'); x.scale(d, d); x.fillStyle = '#c9c9c6'
      const step = Math.max(5, w / 200)
      for (let px = 0; px < w; px += step) for (let py = 0; py < h; py += step) if (data[(Math.floor(py) * w + Math.floor(px)) * 4 + 3] > 128) { x.beginPath(); x.arc(px, py, step * 0.28, 0, 7); x.fill() }
    }
    draw(); const ro = new ResizeObserver(draw); ro.observe(cv.current.parentElement); return () => ro.disconnect()
  }, [text])
  return <canvas ref={cv} className="w-full" aria-hidden="true" />
}

const LISTS = { Industries: ['Retail & e-commerce', 'Technology & electronics', 'Energy & renewables', 'Automotive & industrial equipment', 'Mining & resources'], Services: ['Air freight', 'Ocean freight', 'Customs brokerage', 'Warehousing & 3PL', 'Project cargo', 'Linehaul'] }

export default function Footer() {
  const [tab, setTab] = useState('Industries')
  return (
    <footer id="contact" data-theme="light" className="bg-paper text-ink px-5 md:px-10 pt-24 pb-6">
      <div className="md:grid md:grid-cols-[26%_1fr_24%] gap-10 border-b border-ink/15 pb-12">
        <p className="text-sm">One operator.<br />Every leg of the journey.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 mt-8 md:mt-0">
          <span className="label text-[.65rem] col-span-full">Company</span>
          {['Home', 'Insights', 'Industries', 'About us', 'Merchandise', 'Services', 'Careers', 'Community', 'Contact us'].map((l) => <a key={l} href="#top" className="text-lg hover:text-signal transition-colors">{l}</a>)}
        </div>
        <div className="mt-8 md:mt-0"><span className="label text-[.65rem]">Secure payments</span><p className="mt-3 text-sm text-neutral-600">Placeholder: payments handled by a PCI-DSS compliant gateway. Card details are not stored.</p></div>
      </div>

      <div className="md:grid md:grid-cols-[26%_1fr_24%] gap-10 pt-8">
        <div className="flex gap-3 items-start"><span className="label text-[.65rem] mr-2 pt-3">Socials</span>{['in', 'ig', 'f'].map((s) => <a key={s} href="#contact" className="w-11 h-11 rounded-full border border-ink/25 grid place-items-center font-bold text-sm hover:bg-ink hover:text-white transition">{s}</a>)}</div>
        <div className="mt-10 md:mt-0">
          <div className="inline-flex bg-black/5 rounded-full p-1 label text-[.65rem]">{Object.keys(LISTS).map((k) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded-full transition ${tab === k ? 'bg-white shadow' : ''}`}>{k}</button>)}</div>
          <div className="overflow-hidden mt-8 border-b border-ink/15 pb-6"><div className="marquee text-[clamp(1.5rem,3vw,2.8rem)] text-neutral-400 font-medium" key={tab}>{[...Array(3)].flatMap(() => LISTS[tab]).concat(...[...Array(3)].flatMap(() => LISTS[tab])).map((t, i) => <span key={i} className="mr-8">{t} <span className="mx-4">•</span></span>)}</div></div>
        </div>
        <div />
      </div>

      <div className="md:grid md:grid-cols-[26%_1fr_24%] gap-10 mt-12">
        <div className="hidden md:block aspect-[326/207] bg-[radial-gradient(ellipse_at_50%_100%,#fff_0%,#555_45%,#111_100%)]" role="img" aria-label="Placeholder tunnel image" />
        <div className="grid sm:grid-cols-2 gap-8 text-sm">
          <div><span className="label text-[.65rem]">Head office</span><p className="text-lg font-medium mt-2">100 Harbour Street,<br />Sample City 0000.</p><a href="#contact" className="underline mt-3 inline-block">↳ Direction on map</a></div>
          <div><span className="label text-[.65rem]">Email</span><p className="text-lg font-medium mt-2">hello@northbound.example</p><span className="label text-[.65rem] block mt-6">Hotline</span><p className="text-lg font-medium mt-2">1300 000 000</p></div>
          <div><span className="label text-[.65rem]">Operating across</span><p className="text-lg font-medium mt-2">Australia / New Zealand / Hong Kong / China</p></div>
          <div><span className="label text-[.65rem]">Office hours</span><p className="text-lg font-medium mt-2">Monday – Friday / 8:30AM – 5PM</p></div>
        </div>
        <div className="mt-10 md:mt-0"><DotMap /></div>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-between label text-[.6rem] border-t border-ink/15 pt-4 mt-14"><span>© 2026 Northbound Freight — fictional placeholder brand</span><span>Privacy · Terms · Cookies</span><span>Inspired-by demo · no affiliation with any real company</span></div>
      <div className="mt-8"><DotText text="NORTHBOUND" /></div>
    </footer>
  )
}
