export default function MaterialsTeaser() {
  const items = [
    {
      title: 'Ceramica',
      text: 'Forme, finiture e pezzi per la casa o per progetti artistici.',
    },
    {
      title: 'Metallo',
      text: 'Dettagli e lavorazioni che dialogano con la materia ceramica.',
    },
    {
      title: 'Stampa 3D',
      text: 'Prototipi e forme contemporanee al servizio del progetto.',
    },
    {
      title: 'Progettazione digitale',
      text: 'Dal brief all’anteprima, fino alla produzione controllata.',
    },
    {
      title: 'Decorazione e fotoceramica',
      text: 'Immagini e finiture per pezzi commemorativi e personalizzati.',
    },
  ]

  return (
    <section className="section-shell bg-warm border-y border-sand">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <p className="section-eyebrow">Materiali e lavorazioni</p>
          <h2 className="section-title mb-3">Tradizione e innovazione, insieme</h2>
          <p className="section-lead">
            Competenze integrate nel laboratorio, senza effetti spettacolari inutili.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item) => (
            <div key={item.title} className="border-l border-sand pl-4">
              <h3 className="font-serif text-xl text-ink mb-2">{item.title}</h3>
              <p className="text-sm text-muted-ink leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
