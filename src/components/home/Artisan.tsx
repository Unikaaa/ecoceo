import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Artisan() {
  return (
    <section className="py-20 bg-site">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
            L'Arte della Ceramica
          </h2>
          <p className="text-xl text-gray-700 mb-6 leading-relaxed">
            Ogni pezzo nasce dalle mani esperte dei nostri artigiani, che con passione e 
            dedizione trasformano l'argilla in opere d'arte. La lavorazione è completamente 
            manuale, seguendo tecniche tradizionali tramandate di generazione in generazione.
          </p>
          <p className="text-xl text-gray-700 mb-10 leading-relaxed">
            Questo è il nostro segreto: ogni ceramica porta con sé l'energia e l'amore 
            di chi l'ha creata, rendendola unica e speciale.
          </p>
          <Link href="/about">
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Scopri Chi Siamo
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
