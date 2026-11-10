import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Processo e materiali',
  description: 'Materiali, tecnologie e fasi di lavorazione del laboratorio UNIKA.',
}

const phases = [
  { title: 'Brief', text: 'Raccolta esigenze, riferimenti e vincoli di progetto.' },
  { title: 'Progettazione', text: 'Scelte di forma, dimensioni, materiali e personalizzazioni.' },
  { title: 'Produzione', text: 'Lavorazioni ceramiche, fotoceramica, stampa e finiture.' },
  { title: 'Controllo', text: 'Verifica dimensioni, colore, integrità e imballaggio.' },
  { title: 'Consegna', text: 'Spedizione protetta o ritiro concordato.' },
]

const materials = [
  { title: 'Ceramica artistica', text: 'Oggetti per la casa, pezzi decorativi e produzioni artistiche.' },
  { title: 'Fotoceramica', text: 'Immagini trasferite su supporto ceramico per pezzi commemorativi.' },
  { title: 'Stampa grafica', text: 'Adesivi, poster, decalcomanie e packaging a supporto dei progetti.' },
  { title: 'Progettazione digitale', text: 'Configurazione 2D, brief e sviluppo collaborativo.' },
]

export default function ProcessoPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="border-b border-[#e4dbd0]">
        <div className="container mx-auto px-4 py-12 sm:py-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Laboratorio</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Processo e materiali</h1>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Come lavoriamo: un percorso chiaro dal brief alla consegna, con tecnologie integrate
            e attenzione alla qualità artigianale.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-4xl space-y-12">
        <div>
          <h2 className="font-serif text-2xl text-[#2a2420] mb-6">Fasi</h2>
          <div className="space-y-5">
            {phases.map((phase, i) => (
              <div key={phase.title} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-[#e4dbd0] pb-4">
                <span className="text-xs tracking-widest text-[#663399]/70">0{i + 1}</span>
                <div>
                  <h3 className="font-serif text-xl text-[#2a2420] mb-1">{phase.title}</h3>
                  <p className="text-sm text-[#6b635c]">{phase.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-2xl text-[#2a2420] mb-6">Materiali e tecnologie</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {materials.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-lg text-[#2a2420] mb-1">{item.title}</h3>
                <p className="text-sm text-[#6b635c] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/personalizza"><Button variant="primary">Inizia a personalizzare</Button></Link>
          <Link href="/contatti"><Button variant="outline">Richiedi un progetto</Button></Link>
        </div>
      </section>
    </div>
  )
}
