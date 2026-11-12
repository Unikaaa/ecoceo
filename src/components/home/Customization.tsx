import Link from 'next/link'
import Button from '@/components/ui/Button'

const steps = [
  {
    title: 'Scegli',
    text: 'Parti da un prodotto, una linea o un’idea: casa, memorial, arte o progetto custom.',
  },
  {
    title: 'Personalizza',
    text: 'Forma, dimensioni, testo e immagini. L’anteprima 2D guida la scelta, senza sostituire il pezzo fisico.',
  },
  {
    title: 'Ricevi',
    text: 'Produzione in laboratorio, controllo qualità e consegna protetta del tuo pezzo.',
  },
]

export default function Customization() {
  return (
    <section className="section-shell bg-warm border-y border-sand">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="section-eyebrow">Personalizzazione</p>
          <h2 className="section-title mb-3">La tua idea, la nostra materia</h2>
          <p className="section-lead">
            Un percorso chiaro, collegato al configuratore già attivo sul sito.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {steps.map((step, index) => (
            <div key={step.title} className="border-l border-sand pl-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-bronze mb-2">
                0{index + 1}
              </p>
              <h3 className="font-serif text-xl text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted-ink leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>

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
    </section>
  )
}
