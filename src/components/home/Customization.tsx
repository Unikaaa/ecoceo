import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Customization() {
  return (
    <section className="py-8 sm:py-12 md:py-20 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 md:gap-12 lg:gap-16 items-center">
          <div>
            <h2 className="text-lg sm:text-2xl md:text-5xl font-serif text-gray-900 mb-3 sm:mb-5 md:mb-6 lg:mb-7">
              Crea la Tua Ceramica Unica
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-3 sm:mb-5 md:mb-6 lg:mb-7 leading-relaxed">
              Ogni pezzo può essere personalizzato secondo i tuoi desideri. Scegli forma, 
              colore, decorazioni e crea un'opera d'arte che rispecchi la tua personalità.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 mb-4 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed">
              I nostri artigiani lavoreranno con te per trasformare la tua visione in realtà, 
              creando un pezzo unico e irripetibile.
            </p>
            <Link href="/personalizza">
              <Button size="lg" variant="primary" className="text-sm sm:text-base md:text-lg px-5 sm:px-8">
                Personalizza Ora
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-ceramic-beige to-ceramic-terracotta rounded-artistic overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm sm:text-lg">Immagine Personalizzazione</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
