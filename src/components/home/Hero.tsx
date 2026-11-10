'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[360px] sm:h-[560px] md:h-[780px] flex items-end sm:items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.jpg"
          alt="Laboratorio creativo UNIKA — ceramica e design Made in Italy"
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f7f3ee]/80 via-[#f7f3ee]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f7f3ee]/50 via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 z-10 relative pb-8 sm:pb-0">
        <div className="max-w-xl text-left fade-rise">
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm uppercase tracking-[0.18em] text-[#663399]">
            UNIKA
          </p>
          <h1 className="font-serif text-[#2a2420] text-[2rem] sm:text-5xl md:text-6xl leading-[1.05] mb-3 sm:mb-5">
            Laboratorio creativo Made in Italy
          </h1>
          <p className="text-[#2a2420]/75 text-sm sm:text-lg md:text-xl max-w-lg mb-5 sm:mb-8 font-light leading-relaxed">
            Ceramica, fotoceramica, personalizzazione e design contemporaneo
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
            <Link href="/shop">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8"
              >
                Scopri lo Shop
              </Button>
            </Link>
            <Link href="/personalizza">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 bg-white/70"
              >
                Crea la tua Ceramica
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
