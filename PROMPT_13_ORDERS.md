# PROMPT 13 – ORDINI

## Obiettivo
Creare logica di gestione ordini: salvataggio dopo pagamento, associazione configurazione prodotto, struttura per tracking stato.

## Struttura Dati Ordine

### Tipo Order
```typescript
interface Order {
  id: string
  orderNumber: string // ORD-YYYYMMDD-XXXX
  userId?: string
  email: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentIntentId: string
  createdAt: Date
  updatedAt: Date
  shippingAddress?: Address
  customProductConfig?: CustomProductConfig
}
```

### OrderItem
```typescript
interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  type: 'standard' | 'custom'
  configuration?: any
  imageUrls?: string[]
}
```

## Funzionalità

### 1. Salvataggio Ordine
- **Dopo pagamento**: Webhook Stripe o success page
- **Database**: Preparato per Supabase/PostgreSQL
- **Fallback**: JSON file o in-memory per sviluppo

### 2. Associazione Configurazione
- **Standard**: Riferimento a prodotto esistente
- **Custom**: Salva configurazione completa
- **Immagini**: URL o riferimento storage

### 3. Tracking Stato
- **Stati**: pending → paid → processing → shipped → delivered
- **Aggiornamenti**: Via webhook o admin
- **Notifiche**: Email (futuro)

## Struttura File

### Database Schema (Preparato)
```sql
-- orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  order_number TEXT UNIQUE,
  email TEXT,
  total DECIMAL,
  status TEXT,
  payment_intent_id TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id TEXT,
  name TEXT,
  price DECIMAL,
  quantity INTEGER,
  type TEXT,
  configuration JSONB
);
```

### File Mock (Sviluppo)
- `lib/data/mockOrders.ts` - Array ordini per sviluppo
- `lib/store/orderStore.ts` - Store Zustand (opzionale)

## API Routes
- `POST /api/orders` - Crea ordine
- `GET /api/orders/[id]` - Dettaglio ordine
- `PATCH /api/orders/[id]` - Aggiorna stato

## Note
- Generazione order number univoco
- Idempotenza creazione ordine
- Validazione dati input
- Preparato per integrazione DB
