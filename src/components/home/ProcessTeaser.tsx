import Link from 'next/link'
import Button from '@/components/ui/Button'

const steps = [
  {
    title: 'Idea e brief',
    text: 'Partiamo da un’esigenza concreta: un oggetto per la casa, un ricordo, un’opera o un progetto su misura.',
  },
  {
    title: 'Progettazione',
    text: 'Definiamo forma, materiali, finiture e personalizzazioni, con anteprima quando il percorso lo consente.',
  },
  {
    title: 'Produzione',
    text: 'Lavoriamo ceramica, fotoceramica, stampa e finiture nel laboratorio, con controlli di qualità.',
  },
]

export default function ProcessTeaser() {
  return (
    <section className="py-12 md:py-20 bg-site">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80">
            Processo
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-3">
            Dal progetto al pezzo finito
          </h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Un percorso chiaro, pensato per privati e professionisti, senza promettere
            riproduzioni digitali perfette del risultato fisico.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {steps.map((step, index) => (
            <div key={step.title}>
              <p className="text-xs tracking-[0.14em] uppercase text-[#663399]/70 mb-2">
                0{index + 1}
              </p>
              <h3 className="font-serif text-xl text-[#2a2420] mb-2">{step.title}</h3>
              <p className="text-sm text-[#6b635c] leading-relaxed">{step.text}</p>
            </div>
          ))}
        </div>
        <Link href="/processo">
          <Button variant="outline">Scopri materiali e lavorazioni</Button>
        </Link>
      </div>
    </section>
  )
}
