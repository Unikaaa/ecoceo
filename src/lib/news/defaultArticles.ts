export interface DefaultArticleSeed {
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  category: string
  image_url: string
  tags: string[]
  is_featured: boolean
  is_published: boolean
  published_at: string
}

export const DEFAULT_ARTICLES_SEED: DefaultArticleSeed[] = [
  {
    title: 'La Storia della Ceramica Artistica',
    slug: 'storia-ceramica-artistica',
    excerpt: 'Un viaggio attraverso i secoli alla scoperta dell\'arte ceramica e delle sue tecniche tradizionali.',
    content: `# La Storia della Ceramica Artistica

La ceramica artistica ha una storia millenaria che affonda le sue radici nelle antiche civiltà.

## Le Origini

Le prime testimonianze di ceramica risalgono a oltre 10.000 anni fa, quando l'uomo iniziò a modellare l'argilla per creare oggetti utili e decorativi.

## L'Evoluzione

Nel corso dei secoli, le tecniche si sono evolute, dando vita a stili unici in ogni cultura: dalla porcellana cinese alla terracotta italiana.

## L'Arte Moderna

Oggi, la ceramica artistica combina tradizione e innovazione, creando pezzi unici che raccontano storie e emozioni.`,
    author: 'Maria Rossi',
    category: 'Storia',
    image_url: '/placeholder-article.jpg',
    tags: ['storia', 'ceramica', 'arte'],
    is_featured: true,
    is_published: true,
    published_at: '2024-01-10T10:00:00.000Z',
  },
  {
    title: 'Tecniche di Modellazione della Ceramica',
    slug: 'tecniche-modellazione',
    excerpt: 'Scopri le principali tecniche per modellare l\'argilla e creare pezzi unici.',
    content: `# Tecniche di Modellazione della Ceramica

Esistono diverse tecniche per modellare la ceramica, ognuna con le sue caratteristiche.

## Colombino

Una delle tecniche più antiche, che prevede la creazione di rotoli di argilla sovrapposti.

## Lastra

La tecnica della lastra permette di creare forme geometriche precise.

## Tornio

Il tornio è lo strumento classico per creare forme circolari perfette.`,
    author: 'Giuseppe Bianchi',
    category: 'Tecniche',
    image_url: '/placeholder-article.jpg',
    tags: ['tecniche', 'modellazione', 'tutorial'],
    is_featured: false,
    is_published: true,
    published_at: '2024-01-15T10:00:00.000Z',
  },
  {
    title: 'Come Curare e Mantenere le Ceramiche',
    slug: 'cura-manutenzione',
    excerpt: 'Consigli pratici per preservare la bellezza delle tue ceramiche nel tempo.',
    content: `# Come Curare e Mantenere le Ceramiche

Le ceramiche artistiche richiedono cure particolari per mantenere la loro bellezza.

## Pulizia

Usa detergenti delicati e acqua tiepida per pulire le ceramiche.

## Conservazione

Mantieni le ceramiche lontane da fonti di calore e umidità eccessiva.

## Riparazioni

In caso di danni, consulta sempre un esperto per riparazioni professionali.`,
    author: 'Anna Verdi',
    category: 'Consigli',
    image_url: '/placeholder-article.jpg',
    tags: ['manutenzione', 'cura', 'consigli'],
    is_featured: false,
    is_published: true,
    published_at: '2024-01-20T10:00:00.000Z',
  },
]
