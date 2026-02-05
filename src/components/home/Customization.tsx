import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Customization() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
              Crea la Tua Ceramica Unica
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Ogni pezzo può essere personalizzato secondo i tuoi desideri. Scegli forma, 
              colore, decorazioni e crea un'opera d'arte che rispecchi la tua personalità.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              I nostri artigiani lavoreranno con te per trasformare la tua visione in realtà, 
              creando un pezzo unico e irripetibile.
            </p>
            <Link href="/personalizza">
              <Button size="lg" variant="primary" className="text-lg px-8 py-4">
                Personalizza Ora
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-ceramic-beige to-ceramic-terracotta rounded-artistic overflow-hidden shadow-xl">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-lg">Immagine Personalizzazione</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
