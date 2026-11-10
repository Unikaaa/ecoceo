import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="py-12 md:py-20 bg-site">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <h2 className="text-2xl sm:text-4xl font-serif mb-4 text-[#2a2420]">
          Shop o progetto su misura
        </h2>
        <p className="text-sm sm:text-base mb-8 text-[#6b635c] leading-relaxed">
          Scegli un pezzo dal catalogo oppure avvia una personalizzazione con il laboratorio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/shop">
            <Button size="lg" variant="primary">
              Esplora lo Shop
            </Button>
          </Link>
          <Link href="/personalizza">
            <Button size="lg" variant="outline">
              Personalizza
            </Button>
          </Link>
          <Link href="/contatti">
            <Button size="lg" variant="outline">
              Richiedi un progetto
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
