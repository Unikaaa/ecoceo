export type UnikaLineId = 'home' | 'memorial' | 'art' | 'custom' | 'printing'

export type UnikaLine = {
  id: UnikaLineId
  slug: string
  name: string
  shortName: string
  tagline: string
  description: string
  highlights: string[]
  ctaPrimary: { href: string; label: string }
  ctaSecondary?: { href: string; label: string }
  shopHint?: string
  distinct?: boolean
}

/**
 * Linee di offerta UNIKA 3.0.
 * Contenuti istituzionali (non inventano catalogo/recensioni/numeri).
 */
export const UNIKA_LINES: UnikaLine[] = [
  {
    id: 'home',
    slug: 'home',
    name: 'UNIKA Home',
    shortName: 'Home',
    tagline: 'Oggetti per la casa, personalizzati e duraturi',
    description:
      'Numeri civici, vasi, complementi d’arredo e pezzi personalizzabili pensati per vivere lo spazio con carattere Made in Italy.',
    highlights: [
      'Numeri civici personalizzati',
      'Vasi e complementi d’arredo',
      'Decorazioni e finiture su misura',
    ],
    ctaPrimary: { href: '/personalizza', label: 'Personalizza' },
    ctaSecondary: { href: '/shop', label: 'Vai allo Shop' },
    shopHint: 'home',
  },
  {
    id: 'memorial',
    slug: 'memorial',
    name: 'UNIKA Memorial',
    shortName: 'Memorial',
    tagline: 'Fotoceramica e pezzi destinati al ricordo',
    description:
      'Fotoceramiche, targhe e prodotti commemorativi realizzati con cura, rispetto e qualità artigianale.',
    highlights: [
      'Fotoceramica su misura',
      'Forme, dimensioni e finiture dedicate',
      'Percorso guidato di personalizzazione',
    ],
    ctaPrimary: { href: '/personalizza', label: 'Configura fotoceramica' },
    ctaSecondary: { href: '/contatti', label: 'Richiedi informazioni' },
    shopHint: 'memorial',
  },
  {
    id: 'art',
    slug: 'art',
    name: 'UNIKA Art',
    shortName: 'Art',
    tagline: 'Opere, sculture ed edizioni selezionate',
    description:
      'Produzioni artistiche, pezzi unici ed edizioni limitate dove il design e la materia ceramica diventano linguaggio.',
    highlights: [
      'Sculture e opere uniche',
      'Edizioni e pezzi premium',
      'Racconto del processo creativo',
    ],
    ctaPrimary: { href: '/shop', label: 'Scopri le opere' },
    ctaSecondary: { href: '/progetti', label: 'Vedi i progetti' },
    shopHint: 'art',
  },
  {
    id: 'custom',
    slug: 'custom',
    name: 'UNIKA Custom',
    shortName: 'Custom',
    tagline: 'Co-design e progetti su richiesta',
    description:
      'Progetti personalizzati, lavorazioni speciali e percorsi di co-design per esigenze private o professionali.',
    highlights: [
      'Brief e sviluppo progetto',
      'Prototipi e lavorazioni speciali',
      'Supporto a designer e partner',
    ],
    ctaPrimary: { href: '/contatti', label: 'Invia un brief' },
    ctaSecondary: { href: '/professionisti', label: 'Area professionisti' },
    shopHint: 'custom',
  },
  {
    id: 'printing',
    slug: 'printing',
    name: 'Printing Services',
    shortName: 'Printing',
    tagline: 'Stampa grafica e lavorazioni complementari',
    description:
      'Adesivi, poster, decalcomanie, packaging e servizi di stampa. Divisione con identità commerciale distinta, a supporto dei progetti creativi e produttivi.',
    highlights: [
      'Stampa grafica e decalcomanie',
      'Packaging e supporti',
      'Servizi per progetti e partner',
    ],
    ctaPrimary: { href: '/contatti', label: 'Richiedi un preventivo' },
    ctaSecondary: { href: '/professionisti', label: 'Per professionisti' },
    distinct: true,
    shopHint: 'printing',
  },
]

export function getLineBySlug(slug: string): UnikaLine | undefined {
  return UNIKA_LINES.find((line) => line.slug === slug)
}
