import Link from 'next/link'

export default function BrandIntro() {
  return (
    <section className="py-12 md:py-20 bg-site">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="mb-3 text-[11px] sm:text-xs uppercase tracking-[0.18em] text-[#663399]/85">
          Laboratorio creativo e produttivo
        </p>
        <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-4 leading-tight">
          Made in Italy, tra ceramica, design e personalizzazione
        </h2>
        <p className="text-sm sm:text-base text-[#6b635c] leading-relaxed mb-6">
          UNIKA unisce ceramica artistica, fotoceramica, oggetti per la casa, stampa 3D,
          progettazione digitale e lavorazioni complementari. Non un semplice negozio,
          ma un laboratorio dove qualità, personalizzazione e artigianalità contemporanea
          convivono nello stesso processo.
        </p>
        <Link
          href="/about"
          className="text-sm text-[#663399] hover:text-[#c45824] transition-colors underline-offset-4 hover:underline"
        >
          Scopri il laboratorio
        </Link>
      </div>
    </section>
  )
}
