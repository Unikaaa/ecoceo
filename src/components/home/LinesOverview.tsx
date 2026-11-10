import Link from 'next/link'
import { UNIKA_LINES } from '@/lib/lines'

export default function LinesOverview() {
  return (
    <section className="py-12 md:py-20 border-y border-[#e4dbd0] bg-white/40">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80">
            Linee
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-3">
            Quattro linee, un laboratorio
          </h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Home, Memorial, Art e Custom raccontano l’offerta principale. Printing Services
            resta una divisione distinta, a supporto dei progetti.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {UNIKA_LINES.map((line) => (
            <Link
              key={line.id}
              href={`/${line.slug}`}
              className="group block border-b border-[#e4dbd0] pb-5 transition-colors hover:border-[#663399]/40"
            >
              <p className="text-[11px] uppercase tracking-[0.14em] text-[#6b635c] mb-2">
                {line.distinct ? 'Servizi' : 'Linea'}
              </p>
              <h3 className="font-serif text-xl sm:text-2xl text-[#2a2420] mb-2 group-hover:text-[#663399] transition-colors">
                {line.shortName}
              </h3>
              <p className="text-sm text-[#6b635c] leading-relaxed">{line.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
