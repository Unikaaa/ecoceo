# PROMPT 6 – SHOP STANDARD

## Obiettivo
Creare pagina Shop con griglia prodotti e card prodotto.

## Struttura Pagina

### Route
`app/[locale]/shop/page.tsx`

### Layout
- **Header sezione**: Titolo "Shop" / "Il Nostro Shop"
- **Filtri** (opzionale per ora):
  - Categoria
  - Prezzo
  - Disponibilità
- **Griglia prodotti**: Responsive grid
- **Paginazione** (se necessario)

## Card Prodotto

### Componente
`components/shop/ProductCard.tsx`

### Props
```typescript
interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  slug?: string
  inStock?: boolean
}
```

### Contenuto Card
- **Immagine prodotto**: Aspect ratio 1:1 o 4:3
- **Nome prodotto**: Titolo
- **Prezzo**: Formattato (es. € 45,00)
- **Badge** (opzionale): "Nuovo", "In Saldo", "Esaurito"
- **Link**: Click su card → `/shop/[id]`

### Design
- Hover effect elegante
- Shadow/border subtle
- Immagine con overlay su hover (opzionale)
- Transizioni smooth

## Griglia Prodotti

### Layout
- **Desktop**: 3-4 colonne
- **Tablet**: 2 colonne
- **Mobile**: 1 colonna

### Componente
`components/shop/ProductGrid.tsx`

## Dati Mock

### Struttura Prodotto
```typescript
interface Product {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  inStock: boolean
  slug: string
}
```

### File Mock
`lib/data/mockProducts.ts` - Array di prodotti mock

## Funzionalità
- Link a pagina prodotto singolo
- Immagini ottimizzate (next/image)
- Loading states (skeleton)
- Empty state se nessun prodotto

## Note
- Dati mock per ora, pronti per integrazione DB/API
- TypeScript types per type safety
- Responsive design
- Performance: lazy loading immagini
