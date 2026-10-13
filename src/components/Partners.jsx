const GROUPS = [
  ['Airlines', ['Alturo', 'Vireo Air', 'Kestrel', 'Marlin Air', 'CORVANE', 'Solaris Jet', 'Halcyon', 'Tern Air', 'BLUEWING', 'Orrin', 'Stratus Cargo', 'Pelion', 'Aviora', 'Nimbus Air', 'ZENARA']],
  ['Shipping lines', ['Oceanis', 'Harborline', 'Tidewater', 'Polaris Marine', 'Tasman Star', 'Coral Route', 'IRONWAVE', 'Northtide', 'Cape Freight', 'Dockside', 'Marlow', 'Atlas Sea', 'Pacific Arc', 'Surge Line', 'Blue Anchor']]
]
const STYLES = ['font-black italic tracking-tight', 'font-light tracking-[.25em] uppercase', 'font-bold tracking-tighter', 'font-medium uppercase tracking-widest', 'font-black uppercase']
const Dots = () => ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'].map((c) => <i key={c} className={`absolute w-[3px] h-[3px] bg-ink ${c}`} />)

export default function Partners() {
  return (
    <section id="partners" data-theme="light" className="bg-paper text-ink px-5 md:px-10 py-16 md:py-28 space-y-16">
      {GROUPS.map(([title, names]) => (
        <div key={title} className="relative">
          <div className="grid grid-cols-[1fr_3fr] md:grid-cols-[27%_1fr] items-center h-[60px] md:h-[75px] relative"><span className="font-medium text-sm md:text-base">Our partners</span><span className="font-display font-bold uppercase text-base md:text-lg">{title}</span></div>
          <div className="grid grid-cols-2 md:grid-cols-5 border-t border-ink/10">
            {names.map((n, i) => (
              <div key={n} data-hover className="relative h-[100px] md:h-[217px] flex items-center justify-center hover:bg-black/[.05] transition-colors border-b border-r border-ink/10 -mb-px">
                <Dots /><span className={`text-lg md:text-2xl ${STYLES[i % STYLES.length]}`}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
