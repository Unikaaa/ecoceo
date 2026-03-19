'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
    <section className="relative h-[700px] md:h-[800px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/home-bg.png"
          alt="Ceramiche artistiche"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="container mx-auto px-4 text-center z-10 relative">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-tight drop-shadow-lg">
          Arte e Ceramiche
        </h1>
        <p className="text-xl md:text-2xl lg:text-3xl text-white mb-10 max-w-3xl mx-auto font-light drop-shadow-md">
          Ogni pezzo racconta una storia, ogni creazione è un'opera d'arte unica
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <Button size="lg" variant="primary" className="text-lg px-8 py-4">
              Scopri lo Shop
            </Button>
          </Link>
          <Link href="/personalizza">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Crea la tua Ceramica
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-primary"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-accent"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-ceramic-terracotta"></div>
      </div>
    </section>
  )
}
