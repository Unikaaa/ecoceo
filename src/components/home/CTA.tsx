import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CTA() {
  return (
    <section className="section-shell bg-site">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <div className="organic-divider mb-10" />
        <h2 className="section-title mb-4">Shop o progetto su misura</h2>
        <p className="section-lead mx-auto mb-8">
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
              Contattaci
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
