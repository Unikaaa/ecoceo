import Link from 'next/link'

export default function BrandIntro() {
  return (
    <section className="section-shell bg-site">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <p className="section-eyebrow">Chi siamo</p>
        <h2 className="section-title mb-4">Un laboratorio, infinite possibilità</h2>
        <p className="section-lead mx-auto mb-6">
          UNIKA è un laboratorio creativo e produttivo Made in Italy: ceramica artistica,
          fotoceramica, oggetti per la casa, progettazione digitale e lavorazioni
          complementari. Arte, materia e personalizzazione nello stesso processo.
        </p>
        <Link
          href="/about"
          className="text-sm text-[color:var(--bronze)] hover:text-[color:var(--brand)] transition-colors underline-offset-4 hover:underline"
        >
          Scopri il laboratorio
        </Link>
      </div>
    </section>
  )
}
