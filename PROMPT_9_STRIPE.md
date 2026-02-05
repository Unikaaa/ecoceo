# PROMPT 9 – STRIPE CHECKOUT STANDARD

## Obiettivo
Integrare Stripe Checkout per prodotti standard con API route e redirect.

## Setup Stripe

### Dipendenze
```json
{
  "stripe": "^14.0.0",
  "@stripe/stripe-js": "^2.0.0"
}
```

### Variabili Ambiente
```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## API Route

### File
`app/api/stripe/checkout/route.ts`

### Endpoint
`POST /api/stripe/checkout`

### Request Body
```typescript
interface CheckoutRequest {
  items: {
    id: string
    name: string
    price: number
    quantity: number
  }[]
  locale?: string
}
```

### Implementazione
1. **Validazione**: Verifica items e quantità
2. **Stripe Session**: Crea checkout session
3. **Line Items**: Converti items carrello in Stripe format
4. **Metadata**: Aggiungi metadata utile (order_id, user_id se disponibile)
5. **Success/Cancel URLs**: Redirect con locale
6. **Response**: Restituisci session URL

### Codice Struttura
```typescript
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  // 1. Parse body
  // 2. Validazione
  // 3. Crea line items
  // 4. Crea session
  // 5. Return { url: session.url }
}
```

## Pagine Redirect

### Success Page
**File**: `app/[locale]/checkout/success/page.tsx`

**Funzionalità**:
- Mostra messaggio successo
- Mostra order details (se disponibili da session)
- Link a shop/home
- Clear carrello (opzionale)

**Query Params**:
- `session_id`: Stripe session ID (opzionale)

### Cancel Page
**File**: `app/[locale]/checkout/cancel/page.tsx`

**Funzionalità**:
- Messaggio cancellazione
- Link torna al carrello
- Mantiene items nel carrello

## Integrazione Frontend

### Checkout Button
**File**: `components/cart/CartSummary.tsx` o `components/checkout/CheckoutButton.tsx`

**Funzionalità**:
1. Raccoglie items da carrello
2. Chiama `/api/stripe/checkout`
3. Redirect a Stripe Checkout URL
4. Loading state durante chiamata

### Codice Esempio
```typescript
const handleCheckout = async () => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems })
    })
    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    // Error handling
  }
}
```

## Configurazione Stripe

### Checkout Session Options
- **Mode**: `payment` (one-time) o `subscription` (se necessario)
- **Payment Methods**: Card, se necessario altri
- **Locale**: Da request o default
- **Currency**: EUR (o configurabile)
- **Success URL**: `{APP_URL}/{locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL**: `{APP_URL}/{locale}/checkout/cancel`

## Sicurezza
- **Server-side only**: Secret key mai esposta
- **Validazione**: Verifica items e prezzi
- **Rate limiting**: Proteggi endpoint (opzionale)
- **CORS**: Configura se necessario

## Error Handling
- Try/catch in API route
- Error response con messaggio
- Frontend: mostra errori utente
- Logging errori (opzionale)

## Testing
- Stripe test mode
- Test cards: `4242 4242 4242 4242`
- Verifica redirect success/cancel
- Test errori (card declined, etc.)

## File Struttura
```
app/
├── api/
│   └── stripe/
│       └── checkout/
│           └── route.ts
└── [locale]/
    └── checkout/
        ├── success/
        │   └── page.tsx
        └── cancel/
            └── page.tsx

components/
└── checkout/
    └── CheckoutButton.tsx
```

## Note
- Usa Stripe test mode durante sviluppo
- Verifica webhook setup (futuro)
- Considera limite 100 ordini/giorno (da implementare)
- Metadata utile per tracking ordini
