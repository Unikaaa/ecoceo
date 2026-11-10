import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Domande frequenti su prodotti, personalizzazione, spedizioni e collaborazioni UNIKA.',
}

const faqs = [
  {
    q: 'UNIKA è solo un negozio di ceramiche?',
    a: 'No. È un laboratorio creativo e produttivo Made in Italy che unisce ceramica, fotoceramica, personalizzazione, design e servizi di stampa.',
  },
  {
    q: 'Posso personalizzare un prodotto?',
    a: 'Sì. Dal percorso Personalizza puoi configurare pezzi supportati dal catalogo. Per progetti speciali usa Contatti o Custom.',
  },
  {
    q: 'L’anteprima digitale è identica al pezzo fisico?',
    a: 'No. L’anteprima è un supporto alla scelta. Il risultato fisico dipende da materiali, finiture e processo produttivo.',
  },
  {
    q: 'Lavorate con professionisti?',
    a: 'Sì. L’area Professionisti è pensata per partner B2B, con accesso su richiesta e approvazione.',
  },
  {
    q: 'Come funzionano spedizioni e resi?',
    a: 'Trovi le informazioni aggiornate nelle pagine Spedizioni e Resi. Per casi particolari contattaci.',
  },
]

export default function FaqPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="border-b border-[#e4dbd0]">
        <div className="container mx-auto px-4 py-12 sm:py-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Supporto</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Domande frequenti</h1>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl space-y-6">
        {faqs.map((item) => (
          <div key={item.q} className="border-b border-[#e4dbd0] pb-5">
            <h2 className="font-serif text-xl text-[#2a2420] mb-2">{item.q}</h2>
            <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">{item.a}</p>
          </div>
        ))}
        <p className="text-sm text-[#6b635c]">
          Non hai trovato risposta?{' '}
          <Link href="/contatti" className="text-[#663399] hover:underline">Contattaci</Link>
        </p>
      </section>
    </div>
  )
}
