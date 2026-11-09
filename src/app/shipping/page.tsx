'use client'

import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ShippingPage() {
  return (
    <div className="min-h-[70vh] bg-site">
      <section className="relative overflow-hidden border-b border-[#e4dbd0]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#663399]/8 via-transparent to-[#c45824]/10" />
        <div className="container mx-auto px-4 py-12 sm:py-20 relative">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Supporto</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Spedizioni</h1>
          <p className="text-[#6b635c] max-w-2xl text-sm sm:text-base leading-relaxed">
            Consegniamo con attenzione ogni pezzo, protetto e tracciato, per arrivare a casa tua senza sorprese.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-3xl space-y-6">
        <div className="rounded-2xl border border-[#e4dbd0] bg-white/70 p-5 sm:p-7">
          <h2 className="font-serif text-xl text-[#2a2420] mb-2">Tempi di consegna</h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            I prodotti pronti a magazzino partono in 2–4 giorni lavorativi. Le ceramiche personalizzate
            richiedono tempi di produzione dedicati: ti aggiorniamo sempre durante il processo.
          </p>
        </div>
        <div className="rounded-2xl border border-[#e4dbd0] bg-white/70 p-5 sm:p-7">
          <h2 className="font-serif text-xl text-[#2a2420] mb-2">Imballaggio</h2>
          <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed">
            Ogni pezzo viene imballato con materiali antiurto e protezione multi-strato, pensati per la ceramica.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/shop">
            <Button variant="primary">Torna allo Shop</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
