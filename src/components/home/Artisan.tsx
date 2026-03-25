import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Artisan() {
  return (
    <section className="py-8 sm:py-12 md:py-20 lg:py-24 bg-site">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-lg sm:text-2xl md:text-5xl font-serif text-gray-900 mb-4 sm:mb-6 md:mb-8 lg:mb-10">
            L'Arte della Ceramica
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-gray-700 mb-3 sm:mb-5 md:mb-6 lg:mb-7 leading-relaxed">
            Ogni pezzo nasce dalle mani esperte dei nostri artigiani, che con passione e 
            dedizione trasformano l'argilla in opere d'arte. La lavorazione è completamente 
            manuale, seguendo tecniche tradizionali tramandate di generazione in generazione.
          </p>
          <p className="text-sm sm:text-base md:text-xl text-gray-700 mb-5 sm:mb-8 md:mb-10 lg:mb-12 leading-relaxed">
            Questo è il nostro segreto: ogni ceramica porta con sé l'energia e l'amore 
            di chi l'ha creata, rendendola unica e speciale.
          </p>
          <Link href="/about">
            <Button size="lg" variant="outline" className="text-sm sm:text-base md:text-lg px-5 sm:px-8">
              Scopri Chi Siamo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
