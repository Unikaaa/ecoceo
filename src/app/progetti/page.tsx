import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Progetti',
  description: 'Portfolio di realizzazioni del laboratorio UNIKA.',
}

export default function ProgettiPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="border-b border-[#e4dbd0]">
        <div className="container mx-auto px-4 py-12 sm:py-16 max-w-3xl">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Portfolio</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Progetti e realizzazioni</h1>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Qui verranno pubblicati progetti selezionati del laboratorio. Non mostriamo
            case study inventati: i contenuti compariranno quando saranno disponibili e verificati.
          </p>
        </div>
      </section>
      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl">
        <div className="border border-[#e4dbd0] bg-white/60 rounded-2xl p-6 sm:p-8">
          <h2 className="font-serif text-xl text-[#2a2420] mb-2">Portfolio in aggiornamento</h2>
          <p className="text-sm text-[#6b635c] leading-relaxed mb-6">
            Nel frattempo puoi esplorare lo shop, avviare una personalizzazione o contattarci
            per un progetto su misura.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/shop"><Button variant="primary">Shop</Button></Link>
            <Link href="/contatti"><Button variant="outline">Proponi un progetto</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
