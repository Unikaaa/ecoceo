/**
 * Mappatura di sola presentazione (frontend).
 * Non modifica slug/ID Supabase: collega etichette commerciali alle route e collezioni esistenti.
 */

export type PresentationCategory = {
  id: string
  title: string
  description: string
  href: string
  /** Slug collezioni reali da cui tentare di prendere un'immagine */
  collectionSlugs: string[]
  lineSlug?: string
}

export const PRESENTATION_CATEGORIES: PresentationCategory[] = [
  {
    id: 'casa-design',
    title: 'Casa & Design',
    description: 'Numeri civici, vasi e complementi d’arredo per vivere lo spazio con carattere.',
    href: '/home',
    collectionSlugs: ['gioielleria', 'piatti', 'set-e-kit'],
    lineSlug: 'home',
  },
  {
    id: 'fotoceramica',
    title: 'Fotoceramica',
    description: 'Ricordo e materia: pezzi commemorativi e fotoceramiche realizzate con cura.',
    href: '/memorial',
    collectionSlugs: ['funeraria', 'eventi-e-regali'],
    lineSlug: 'memorial',
  },
  {
    id: 'arte-sculture',
    title: 'Arte & Sculture',
    description: 'Opere, edizioni e pezzi scultorei dove il design incontra l’artigianato.',
    href: '/art',
    collectionSlugs: ['colezioni', 'collezionismo'],
    lineSlug: 'art',
  },
  {
    id: 'su-misura',
    title: 'Creazioni su misura',
    description: 'Co-design e progetti personalizzati, dal brief al pezzo finito.',
    href: '/custom',
    collectionSlugs: [],
    lineSlug: 'custom',
  },
]
