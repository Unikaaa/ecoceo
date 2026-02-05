export interface Product {
  id: string
  inventory_id?: string // UUID da Supabase
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inStock: boolean
  slug: string
  featured?: boolean
}

// I prodotti mock sono stati rimossi - ora vengono letti da Supabase tramite /api/products
// Manteniamo solo l'interface Product e le categorie

export const categories = [
  {
    id: 'gioielleria',
    name: 'Gioielleria',
    description: 'Pezzi unici di alta fascia, ciondoli, orecchini e bracciali in ceramica',
    image: '/placeholder-category.jpg',
    slug: 'gioielleria',
  },
  {
    id: 'set-e-kit',
    name: 'Set e Kit',
    description: 'Confezioni di piatti, kit regalo, box multiprodotto',
    image: '/placeholder-category.jpg',
    slug: 'set-e-kit',
  },
  {
    id: 'collezionismo',
    name: 'Collezionismo',
    description: 'Pezzi unici, limitati, artistici da collezione',
    image: '/placeholder-category.jpg',
    slug: 'collezionismo',
  },
  {
    id: 'piatti',
    name: 'Piatti e Oggetti d\'Uso',
    description: 'Piatti singoli, ciotole, vasi per uso quotidiano',
    image: '/placeholder-category.jpg',
    slug: 'piatti',
  },
  {
    id: 'eventi-e-regali',
    name: 'Eventi e Regali',
    description: 'Laurea, matrimonio, ceramica funeraria, regali personalizzati',
    image: '/placeholder-category.jpg',
    slug: 'eventi-e-regali',
  },
]
