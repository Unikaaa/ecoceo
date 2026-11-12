'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[380px] sm:h-[580px] md:min-h-[86vh] md:h-[820px] flex items-end sm:items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/hero.webp" type="image/webp" />
          <img
            src="/hero.jpg"
            alt="Laboratorio creativo UNIKA — ceramica e design Made in Italy"
            className="absolute inset-0 h-full w-full object-cover object-[center_42%]"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f5f0]/82 via-[#f7f5f0]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f5f0]/45 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10 relative pb-9 sm:pb-0">
        <div className="max-w-xl text-left fade-rise">
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm uppercase tracking-[0.18em] text-[color:var(--bronze)]">
            UNIKA
          </p>
          <h1 className="font-serif text-[color:var(--anthracite)] text-[2.05rem] sm:text-5xl md:text-6xl leading-[1.05] mb-3 sm:mb-5">
            Laboratorio creativo Made in Italy
          </h1>
          <p className="text-[color:var(--muted)] text-sm sm:text-lg md:text-xl max-w-lg mb-6 sm:mb-8 font-light leading-relaxed">
            Ceramica, fotoceramica, personalizzazione e design contemporaneo
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link href="/shop">
              <Button size="lg" variant="primary" className="w-full sm:w-auto px-6 sm:px-8">
                Esplora le collezioni
              </Button>
            </Link>
            <Link href="/personalizza">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto px-6 sm:px-8 bg-[color:var(--warm-white)]/75 border-[color:var(--bronze)] text-[color:var(--anthracite)] hover:bg-[color:var(--bronze)] hover:text-white hover:border-[color:var(--bronze)]"
              >
                Crea su misura
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
