'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ReturnsPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="relative overflow-hidden border-b border-[#e4dbd0]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c45824]/10 via-transparent to-[#663399]/8" />
        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Supporto</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Resi</h1>
          <p className="text-[#6b635c] max-w-2xl text-sm sm:text-base leading-relaxed">
            Vogliamo che tu sia contento del tuo pezzo. Se qualcosa non torna, siamo qui per aiutarti.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#e4dbd0] bg-white/70 p-5 sm:p-7">
          <h2 className="font-serif text-xl text-[#2a2420] mb-2">Prodotti standard</h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Puoi richiedere un reso entro 14 giorni dalla consegna, se il prodotto è integro e non usato.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e4dbd0] bg-white/70 p-5 sm:p-7">
          <h2 className="font-serif text-xl text-[#2a2420] mb-2">Prodotti personalizzati</h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Essendo pezzi unici realizzati su misura, i prodotti personalizzati non sono generalmente restituibili,
            salvo difetti di produzione.
          </p>
        </div>
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link href="/?openContact=true">
            <Button variant="primary">Contattaci</Button>
          </Link>
          <Link href="/shop">
            <Button variant="outline">Torna allo Shop</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
