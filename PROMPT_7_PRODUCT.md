# PROMPT 7 – PAGINA PRODOTTO STANDARD

## Obiettivo
Creare pagina prodotto singolo con immagini, descrizione, prezzo e bottone aggiungi al carrello.

## Route
`app/[locale]/shop/[id]/page.tsx`

## Layout Pagina

### 1. Sezione Immagini
- **Gallery principale**: Immagine grande
- **Thumbnails**: Miniature cliccabili (se multiple immagini)
- **Zoom** (opzionale): Hover o click per zoom
- **Aspect ratio**: Mantenere proporzioni

### 2. Sezione Info Prodotto
- **Nome prodotto**: Titolo H1
- **Prezzo**: Formattato, evidenziato
- **Descrizione**: Testo formattato
- **Caratteristiche** (opzionale):
  - Materiale
  - Dimensioni
  - Colore
  - Disponibilità
- **Quantità selector**: Input number (min 1)
- **Bottone "Aggiungi al Carrello"**: 
  - Primary button
  - Disabled se esaurito
  - Feedback visivo dopo aggiunta

### 3. Sezione Dettagli (opzionale)
- Tab o sezioni:
  - Descrizione completa
  - Specifiche tecniche
  - Spedizione e reso
  - Recensioni (futuro)

## Componenti

### ProductGallery
`components/shop/ProductGallery.tsx`
- Gestisce immagini multiple
- Thumbnails navigation
- Zoom/lightbox (opzionale)

### ProductInfo
`components/shop/ProductInfo.tsx`
- Info prodotto
- Selector quantità
- Add to cart button

### AddToCartButton
`components/shop/AddToCartButton.tsx`
- Gestisce aggiunta al carrello
- Toast/notification feedback
- Disabled state

## Dati

### Fetch Prodotto
- Per ora: mock data da ID
- Futuro: API route o DB query
- Error handling: 404 se prodotto non trovato

### Struttura
```typescript
interface ProductDetail extends Product {
  description: string
  images: string[]
  specifications?: {
    material: string
    dimensions: string
    color: string
  }
  inStock: boolean
  stock?: number
}
```

## Funzionalità
- Aggiunta al carrello (prepara per Context/Zustand)
- Quantità selector
- Immagini ottimizzate
- SEO: metadata dinamica
- Breadcrumbs (opzionale)

## Design
- Layout responsive
- Immagini prominenti
- Info chiara e leggibile
- CTA ben visibile
- Spacing generoso

## Note
- Pronto per integrazione Stripe
- Type-safe con TypeScript
- Accessibilità: alt text immagini, ARIA labels
