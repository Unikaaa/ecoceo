import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function Customization() {
  return (
    <section className="py-12 md:py-20 bg-white/40 border-y border-[#e4dbd0]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
          <div>
            <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80">
              Personalizzazione
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-4 leading-tight">
              Configura il tuo pezzo, passo dopo passo
            </h2>
            <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed mb-4">
              Il configuratore guida la scelta di prodotto, dimensioni, forma, testo e immagini.
              L’anteprima aiuta a decidere, senza sostituire il risultato fisico della produzione.
            </p>
            <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed mb-6">
              Per Memorial parti dalla fotoceramica; per Home dai numeri civici e oggetti
              personalizzabili; per Art e Custom apri un brief di progetto.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/personalizza">
                <Button size="lg" variant="primary">
                  Apri il configuratore
                </Button>
              </Link>
              <Link href="/custom">
                <Button size="lg" variant="outline">
                  Richiedi un progetto
                </Button>
              </Link>
            </div>
          </div>
          <div className="border-l border-[#e4dbd0] pl-6 sm:pl-8">
            <ul className="space-y-4 text-sm text-[#2a2420]/85">
              <li>Selezione prodotto e dimensioni</li>
              <li>Forma, finitura e decorazioni</li>
              <li>Caricamento foto e testo</li>
              <li>Anteprima 2D e invio a carrello o preventivo</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
