import Link from 'next/link'
import type { UnikaLine } from '@/lib/lines'
import Button from '@/components/ui/Button'

export default function LinePage({ line }: { line: UnikaLine }) {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="relative overflow-hidden border-b border-[#e4dbd0]">
        <div
          className={`absolute inset-0 ${
            line.distinct
              ? 'bg-gradient-to-br from-[#2a2420]/08 via-transparent to-[#6b635c]/10'
              : 'bg-gradient-to-br from-[#663399]/08 via-transparent to-[#c45824]/08'
          }`}
        />
        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#663399]/85 mb-3">
            {line.distinct ? 'Divisione servizi' : 'Linea UNIKA'}
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3 max-w-3xl">
            {line.name}
          </h1>
          <p className="text-base sm:text-xl text-[#2a2420]/85 max-w-2xl mb-4 leading-relaxed">
            {line.tagline}
          </p>
          <p className="text-sm sm:text-base text-[#6b635c] max-w-2xl leading-relaxed">
            {line.description}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href={line.ctaPrimary.href}>
              <Button variant="primary" size="lg">
                {line.ctaPrimary.label}
              </Button>
            </Link>
            {line.ctaSecondary ? (
              <Link href={line.ctaSecondary.href}>
                <Button variant="outline" size="lg">
                  {line.ctaSecondary.label}
                </Button>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-16 max-w-4xl">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#2a2420] mb-6">Cosa trovi in questa linea</h2>
        <ul className="space-y-3">
          {line.highlights.map((item) => (
            <li
              key={item}
              className="border-b border-[#e4dbd0] pb-3 text-sm sm:text-base text-[#2a2420]/85"
            >
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-[#6b635c] leading-relaxed max-w-2xl">
          I prodotti disponibili variano in base a produzione e magazzino. Per pezzi su misura
          o richieste speciali, puoi partire dal configuratore o contattare il laboratorio.
        </p>
      </section>
    </div>
  )
}
