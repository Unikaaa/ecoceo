# PROMPT 14 – STRIPE WEBHOOK

## Obiettivo
Implementare webhook Stripe per gestire eventi pagamento: completato, salvataggio ordine, sicurezza con signature.

## Eventi Stripe

### Eventi da Gestire
- `checkout.session.completed` - Pagamento completato
- `payment_intent.succeeded` - Pagamento riuscito
- `payment_intent.payment_failed` - Pagamento fallito

## Sicurezza

### 1. Signature Verification
- **Stripe Signature**: Header `stripe-signature`
- **Webhook Secret**: `STRIPE_WEBHOOK_SECRET` in env
- **Verifica**: `stripe.webhooks.constructEvent()`

### 2. Idempotenza
- **Event ID**: Tracciare eventi processati
- **Prevenire duplicati**: Check prima di processare
- **Store**: In-memory o DB per event IDs

## API Route

### `/api/webhooks/stripe/route.ts`
```typescript
export async function POST(request: Request) {
  // 1. Leggi body e signature
  // 2. Verifica signature
  // 3. Parse event
  // 4. Gestisci evento
  // 5. Salva ordine se checkout.session.completed
  // 6. Return 200
}
```

## Flusso

### checkout.session.completed
1. Estrai `session_id` da evento
2. Recupera session da Stripe
3. Estrai metadata (configurazione, immagini)
4. Crea ordine nel database
5. Invia conferma (opzionale)

### payment_intent.succeeded
1. Aggiorna stato ordine a "paid"
2. Trigger notifiche (futuro)

## Struttura

### Event Handler
```typescript
async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session
  // Crea ordine
}

async function handlePaymentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent
  // Aggiorna ordine
}
```

## Testing

### Stripe CLI
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Test Events
- Usa Stripe Dashboard per inviare test events
- Verifica logging e error handling

## Note
- Sempre return 200 per Stripe (anche in caso di errore interno)
- Logging errori per debug
- Retry logic per operazioni fallite
- Validazione dati prima di salvare
