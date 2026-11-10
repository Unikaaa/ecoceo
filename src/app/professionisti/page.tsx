import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Professionisti',
  description: 'Area B2B UNIKA per rivenditori, designer, marmisti e partner commerciali.',
}

export default function ProfessionistiPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="border-b border-[#e4dbd0] bg-[#2a2420] text-[#f7f3ee]">
        <div className="container mx-auto px-4 py-12 sm:py-20 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/60 mb-2">B2B</p>
          <h1 className="font-serif text-3xl sm:text-5xl mb-3">Area professionisti</h1>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed">
            Canale dedicato a rivenditori, architetti, interior designer, marmisti,
            agenzie funebri e partner commerciali. L’accesso è su richiesta e soggetto ad approvazione.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl space-y-8">
        <div>
          <h2 className="font-serif text-2xl text-[#2a2420] mb-3">Cosa prevede il portale</h2>
          <ul className="space-y-3 text-sm sm:text-base text-[#6b635c]">
            <li className="border-b border-[#e4dbd0] pb-3">Richiesta di accesso con dati fiscali e settore</li>
            <li className="border-b border-[#e4dbd0] pb-3">Listini e condizioni dedicate, configurabili dalla dashboard</li>
            <li className="border-b border-[#e4dbd0] pb-3">Preventivi, campionari e riordino rapido</li>
            <li className="border-b border-[#e4dbd0] pb-3">Documenti commerciali e tracking ordini</li>
          </ul>
        </div>
        <p className="text-sm text-[#6b635c] leading-relaxed">
          Lo sconto B2B indicativo del Business Plan (circa 20%) è un’ipotesi commerciale,
          non una regola automatica. Ogni condizione è verificata e approvata dall’amministrazione.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/contatti"><Button variant="primary">Richiedi accesso B2B</Button></Link>
          <Link href="/printing"><Button variant="outline">Printing Services</Button></Link>
        </div>
      </section>
    </div>
  )
}
