import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CustomProjectTeaser() {
  return (
    <section className="section-shell bg-site">
      <div className="container mx-auto px-4 max-w-3xl">
        <p className="section-eyebrow">Progetti su misura</p>
        <h2 className="section-title mb-3">Immagina qualcosa che ancora non esiste</h2>
        <p className="section-lead mb-6">
          Raccontaci brief, riferimenti e tempi desiderati. Usiamo il modulo contatti già
          attivo: nessuna nuova integrazione, stesso flusso verso il laboratorio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/contatti">
            <Button variant="primary" size="lg">
              Invia una richiesta
            </Button>
          </Link>
          <Link href="/custom">
            <Button variant="outline" size="lg">
              Scopri Custom
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
