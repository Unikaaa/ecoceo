# PROMPT 16 – NEWS / BLOG

## Obiettivo
Creare sezione News con lista articoli, pagina articolo e dati mock, SEO friendly.

## Struttura

### Route
- `/[locale]/news` - Lista articoli
- `/[locale]/news/[slug]` - Articolo singolo

## Funzionalità

### 1. Lista Articoli
- **Layout**: Griglia o lista
- **Card articolo**: Immagine, titolo, excerpt, data, autore
- **Paginazione**: Se necessario
- **Filtri**: Categoria, data (opzionale)

### 2. Pagina Articolo
- **Contenuto**: Markdown o HTML
- **Metadata**: Titolo, data, autore, categoria
- **Immagini**: Ottimizzate con next/image
- **Related**: Articoli correlati (opzionale)

### 3. SEO
- **Metadata dinamica**: title, description, og:image
- **Structured data**: Article schema
- **Sitemap**: Includere articoli
- **Canonical URL**

## Dati Mock

### Struttura Articolo
```typescript
interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  category: string
  image: string
  tags?: string[]
}
```

### File
- `lib/data/mockArticles.ts` - Array articoli mock

## Componenti

### ArticleCard
- Immagine
- Titolo
- Excerpt
- Data e autore
- Link a articolo

### ArticleList
- Grid di ArticleCard
- Paginazione

### ArticleContent
- Header con metadata
- Contenuto formattato
- Related articles

## SEO Implementation

### Metadata
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
    },
  }
}
```

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": {...},
  "datePublished": "..."
}
```

## Note
- Markdown support (opzionale con remark)
- Reading time calcolo
- Share buttons (opzionale)
- Comments (futuro)
