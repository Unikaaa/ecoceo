import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ProfessionalsTeaser() {
  return (
    <section className="section-shell bg-[#262522] text-[#f7f5f0]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[color:var(--soft-gold)]">
            Professionisti
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl mb-3">UNIKA per i professionisti</h2>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6">
            Rivenditori, architetti, designer, marmisti e partner commerciali. Accesso B2B
            su richiesta, con condizioni verificate dall’amministrazione.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/professionisti">
              <Button
                variant="primary"
                className="bg-[color:var(--warm-white)] text-[color:var(--anthracite)] hover:bg-[color:var(--sand)] hover:text-[color:var(--brand)]"
              >
                Area professionisti
              </Button>
            </Link>
            <Link href="/contatti">
              <Button
                variant="outline"
                className="border-white/35 text-white hover:bg-white hover:text-[color:var(--anthracite)]"
              >
                Richiedi informazioni
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
