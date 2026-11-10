import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ProfessionalsTeaser() {
  return (
    <section className="py-12 md:py-20 border-y border-[#e4dbd0] bg-[#2a2420] text-[#f7f3ee]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-white/60">
            Professionisti
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl mb-3">
            Partner, designer e rivenditori
          </h2>
          <p className="text-sm sm:text-base text-white/75 leading-relaxed mb-6">
            Un canale B2B dedicato a rivenditori, architetti, interior designer, marmisti,
            agenzie funebri e partner commerciali. Accesso su richiesta e approvazione.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/professionisti">
              <Button
                variant="primary"
                className="bg-white text-[#2a2420] hover:bg-[#f7f3ee] hover:text-[#663399]"
              >
                Area professionisti
              </Button>
            </Link>
            <Link href="/contatti">
              <Button
                variant="outline"
                className="border-white/40 text-white hover:bg-white hover:text-[#2a2420]"
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
