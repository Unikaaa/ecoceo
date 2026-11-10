export default function MaterialsTeaser() {
  const items = [
    {
      title: 'Ceramica e clay',
      text: 'Forme, finiture e pezzi per la casa o per progetti artistici.',
    },
    {
      title: 'Fotoceramica',
      text: 'Trasferimento fotografico su supporto ceramico per Memorial e pezzi commemorativi.',
    },
    {
      title: 'Stampa e decalcomanie',
      text: 'Lavorazioni grafiche complementari, packaging e supporti di stampa.',
    },
    {
      title: 'Progettazione digitale',
      text: 'Dal brief all’anteprima 2D, fino alla produzione e al controllo qualità.',
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-white/50 border-y border-[#e4dbd0]">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <p className="mb-2 text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80">
            Tecnologie e materiali
          </p>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#2a2420] mb-3">
            Competenze integrate nel laboratorio
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {items.map((item) => (
            <div key={item.title} className="border-l border-[#e4dbd0] pl-4">
              <h3 className="font-serif text-xl text-[#2a2420] mb-2">{item.title}</h3>
              <p className="text-sm text-[#6b635c] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
