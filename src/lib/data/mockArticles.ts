import { Article } from '@/types/article'

export const mockArticles: Article[] = [
  {
    id: '1',
    slug: 'storia-ceramica-artistica',
    title: 'La Storia della Ceramica Artistica',
    excerpt: 'Un viaggio attraverso i secoli alla scoperta dell\'arte ceramica e delle sue tecniche tradizionali.',
    content: `
# La Storia della Ceramica Artistica

La ceramica artistica ha una storia millenaria che affonda le sue radici nelle antiche civiltà. 

## Le Origini

Le prime testimonianze di ceramica risalgono a oltre 10.000 anni fa, quando l'uomo iniziò a modellare l'argilla per creare oggetti utili e decorativi.

## L'Evoluzione

Nel corso dei secoli, le tecniche si sono evolute, dando vita a stili unici in ogni cultura: dalla porcellana cinese alla terracotta italiana.

## L'Arte Moderna

Oggi, la ceramica artistica combina tradizione e innovazione, creando pezzi unici che raccontano storie e emozioni.
    `,
    author: 'Maria Rossi',
    publishedAt: new Date('2024-01-10'),
    category: 'Storia',
    image: '/placeholder-article.jpg',
    tags: ['storia', 'ceramica', 'arte'],
  },
  {
    id: '2',
    slug: 'tecniche-modellazione',
    title: 'Tecniche di Modellazione della Ceramica',
    excerpt: 'Scopri le principali tecniche per modellare l\'argilla e creare pezzi unici.',
    content: `
# Tecniche di Modellazione della Ceramica

Esistono diverse tecniche per modellare la ceramica, ognuna con le sue caratteristiche.

## Colombino

Una delle tecniche più antiche, che prevede la creazione di rotoli di argilla sovrapposti.

## Lastra

La tecnica della lastra permette di creare forme geometriche precise.

## Tornio

Il tornio è lo strumento classico per creare forme circolari perfette.
    `,
    author: 'Giuseppe Bianchi',
    publishedAt: new Date('2024-01-15'),
    category: 'Tecniche',
    image: '/placeholder-article.jpg',
    tags: ['tecniche', 'modellazione', 'tutorial'],
  },
  {
    id: '3',
    slug: 'cura-manutenzione',
    title: 'Come Curare e Mantenere le Ceramiche',
    excerpt: 'Consigli pratici per preservare la bellezza delle tue ceramiche nel tempo.',
    content: `
# Come Curare e Mantenere le Ceramiche

Le ceramiche artistiche richiedono cure particolari per mantenere la loro bellezza.

## Pulizia

Usa detergenti delicati e acqua tiepida per pulire le ceramiche.

## Conservazione

Mantieni le ceramiche lontane da fonti di calore e umidità eccessiva.

## Riparazioni

In caso di danni, consulta sempre un esperto per riparazioni professionali.
    `,
    author: 'Anna Verdi',
    publishedAt: new Date('2024-01-20'),
    category: 'Consigli',
    image: '/placeholder-article.jpg',
    tags: ['manutenzione', 'cura', 'consigli'],
  },
]
