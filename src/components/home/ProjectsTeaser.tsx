import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function ProjectsTeaser() {
  return (
    <section className="py-12 md:py-20 bg-site">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80">
          Progetti
        </p>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-3">
          Realizzazioni del laboratorio
        </h2>
        <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed mb-6">
          Il portfolio mostrerà progetti selezionati quando i contenuti saranno pubblicati
          dalla dashboard. Nessun case study inventato: solo realizzazioni verificate.
        </p>
        <Link href="/progetti">
          <Button variant="outline">Apri i progetti</Button>
        </Link>
      </div>
    </section>
  )
}
