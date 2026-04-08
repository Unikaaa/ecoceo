'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[320px] sm:h-[500px] md:h-[720px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/home-bg.png"
          alt="Ceramiche artistiche"
          fill
          className="object-contain md:object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/25 md:bg-black/20"></div>
      </div>
      <div className="container mx-auto px-3 sm:px-4 text-center z-10 relative">
        <div className="mx-auto max-w-xl md:max-w-4xl rounded-2xl bg-black/20 backdrop-blur-[1px] px-3 py-2.5">
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-serif text-white mb-2 sm:mb-5 leading-tight md:whitespace-nowrap drop-shadow-lg">
            Arte e Ceramiche
          </h1>
          <p className="text-sm sm:text-base md:text-2xl lg:text-3xl text-white mb-3 sm:mb-8 max-w-3xl mx-auto font-light drop-shadow-md px-1">
            Ogni pezzo racconta una storia, ogni creazione è un'opera d'arte unica
          </p>
        </div>
        <div className="mt-2.5 flex flex-col sm:flex-row gap-2.5 sm:gap-4 justify-center">
          <Link href="/shop">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto text-sm sm:text-lg px-4.5 sm:px-8 shadow-md border-2 border-transparent hover:bg-white hover:text-[#663399] hover:border-[#663399]"
            >
              Scopri lo Shop
            </Button>
          </Link>
          <Link href="/personalizza">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto text-sm sm:text-lg px-4.5 sm:px-8 bg-[#c45824] hover:bg-white hover:text-[#c45824] hover:border-[#c45824] border-2 border-transparent focus:ring-[#c45824] shadow-md"
            >
              Crea la tua Ceramica
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 opacity-5 hidden md:block">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-primary"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-ceramic-terracotta"></div>
      </div>
    </section>
  )
}
