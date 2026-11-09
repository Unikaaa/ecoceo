'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[320px] sm:h-[520px] md:h-[720px] flex items-end sm:items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/home-bg.png"
          alt="Ceramiche artistiche"
          fill
          className="object-contain md:object-cover scale-[1.01]"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-black/10" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 z-10 relative pb-7 sm:pb-0">
        <div className="mx-auto max-w-3xl text-center fade-rise">
          <p className="mb-2 sm:mb-3 text-[11px] sm:text-sm uppercase tracking-[0.18em] text-white/85">
            UNIKA
          </p>
          <h1 className="font-serif text-white text-[2rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-3 sm:mb-5 drop-shadow-md">
            Arte e Ceramiche
          </h1>
          <p className="text-white/90 text-sm sm:text-lg md:text-xl max-w-2xl mx-auto mb-5 sm:mb-8 font-light leading-relaxed">
            Ogni pezzo racconta una storia, ogni creazione è un'opera d'arte unica
          </p>
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
            <Link href="/shop">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 shadow-lg border-2 border-transparent hover:bg-white hover:text-[#663399] hover:border-[#663399]"
              >
                Scopri lo Shop
              </Button>
            </Link>
            <Link href="/personalizza">
              <Button
                size="lg"
                variant="primary"
                className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 bg-[#c45824] hover:bg-white hover:text-[#c45824] hover:border-[#c45824] border-2 border-transparent focus:ring-[#c45824] shadow-lg"
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
