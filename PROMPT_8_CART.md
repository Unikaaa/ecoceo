# PROMPT 8 – CARRELLO (CLIENT STATE)

## Obiettivo
Implementare carrello lato client con persistenza localStorage.

## Gestione Stato

### Opzioni
1. **Context API** (React Context)
2. **Zustand** (lightweight state management)

### Scelta Consigliata
Zustand per semplicità e performance.

## Struttura Stato Carrello

### Tipo Item
```typescript
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  slug: string
}
```

### Stato Carrello
```typescript
interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}
```

## Persistenza localStorage

### Implementazione
- Salva stato carrello in `localStorage`
- Sync su ogni modifica
- Load al mount dell'app
- Key: `unika-cart`

### Serializzazione
- JSON.stringify/parse
- Gestione errori (localStorage unavailable)

## Componenti

### 1. CartProvider / Store
**File**: `lib/store/cartStore.ts` (Zustand) o `context/CartContext.tsx`

### 2. CartIcon
**File**: `components/layout/CartIcon.tsx`
- Badge con count items
- Link a `/cart`
- Mostra count in header

### 3. CartPage
**File**: `app/[locale]/cart/page.tsx`
- Lista items carrello
- Riepilogo prezzi
- Bottone checkout

### 4. CartItem
**File**: `components/cart/CartItem.tsx`
- Immagine prodotto
- Nome, prezzo
- Quantity selector (+/-)
- Bottone rimuovi
- Subtotal (price × quantity)

### 5. CartSummary
**File**: `components/cart/CartSummary.tsx`
- Subtotale
- Spedizione (calcolo o fisso)
- Totale
- Bottone "Procedi al Checkout"

## Funzionalità

### Aggiunta Prodotto
- Se già presente: incrementa quantity
- Se nuovo: aggiungi item
- Toast/notification feedback

### Rimozione
- Rimuovi item completamente
- Conferma (opzionale)

### Update Quantità
- Min: 1
- Max: disponibilità prodotto (se disponibile)
- Re-calcola subtotal

### Riepilogo
- Subtotale: somma (price × quantity)
- Spedizione: calcolo o fisso
- Totale: subtotale + spedizione

## UI/UX
- Empty state: "Il tuo carrello è vuoto"
- Loading states
- Animazioni smooth
- Mobile-friendly
- Persistenza tra sessioni

## File Struttura
```
lib/
└── store/
    └── cartStore.ts       # Zustand store

components/
└── cart/
    ├── CartItem.tsx
    ├── CartSummary.tsx
    └── CartIcon.tsx

app/
└── [locale]/
    └── cart/
        └── page.tsx
```

## Note
- Client-side only (no SSR per carrello)
- Gestione errori localStorage
- Type-safe con TypeScript
- Pronto per integrazione Stripe checkout
