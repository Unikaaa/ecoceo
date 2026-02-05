# 🎯 Implementazione Webhook Stripe → Database + Magazzino

## 📍 DOVE TROVARE I FILE

### File da Modificare:
1. **`src/app/api/webhooks/stripe/route.ts`** 
   - Percorso: `src/app/api/webhooks/stripe/route.ts`
   - Questo è il file principale del webhook che devi riscrivere completamente

### File da Consultare (NON modificare):
1. **`supabase/schema.sql`** 
   - Percorso: `supabase/schema.sql`
   - Contiene la struttura del database (tabelle orders, order_items, inventory)

2. **`supabase/inventory_logic.sql`**
   - Percorso: `supabase/inventory_logic.sql`
   - Contiene la funzione `process_paid_order(order_id UUID)` che scala il magazzino

3. **`src/app/api/stripe/checkout/route.ts`**
   - Percorso: `src/app/api/stripe/checkout/route.ts`
   - Mostra come vengono passati i metadata a Stripe

---

## 🔧 MODIFICA 1: Aggiungi Campo per Idempotenza

### DOVE ANDARE:
1. Vai su **Supabase Dashboard**
2. Clicca su **"SQL Editor"**
3. Crea una nuova query

### COSA FARE:
Esegui questo SQL per aggiungere un campo per tracciare i pagamenti Stripe:

```sql
-- Aggiungi campo per idempotenza (se non esiste già)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE;
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT UNIQUE;

-- Crea indice per ricerca rapida
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(stripe_session_id);
```

### PERCHÉ:
Questo campo ci permette di verificare se un ordine è già stato creato per questo pagamento, evitando duplicati.

---

## 🔧 MODIFICA 2: Riscrivi il Webhook

### DOVE ANDARE:
1. Apri il file: `src/app/api/webhooks/stripe/route.ts`
2. **SOSTITUISCI TUTTO IL CONTENUTO** con il nuovo codice

### COSA FARE:
Sostituisci completamente il file con il codice che ti fornirò dopo.

---

## 📋 PSEUDOCODICE COMPLETO

```
FUNZIONE handleCheckoutCompleted(session):
  1. VERIFICA idempotenza
     - Cerca ordine esistente con stripe_session_id = session.id
     - Se esiste: LOG "Ordine già processato" e RETURN
  
  2. VERIFICA pagamento riuscito
     - Se session.payment_status !== 'paid': LOG e RETURN
  
  3. ESTRAI dati cliente da session.customer_details
     - first_name = session.customer_details.name.split(' ')[0]
     - last_name = session.customer_details.name.split(' ').slice(1).join(' ')
     - email = session.customer_email || session.customer_details.email
     - phone = session.customer_details.phone
     - address = session.customer_details.address (formattato)
  
  4. ESTRAI dati ordine da metadata
     - order_items = JSON.parse(session.metadata.order_items)
     - total_price = session.amount_total / 100
  
  5. APRI TRANSACTION Supabase
     - BEGIN TRANSACTION
  
  6. GENERA order_number
     - Chiama funzione SQL generate_order_number()
  
  7. CREA ordine in orders
     - INSERT INTO orders (order_number, first_name, last_name, email, phone, address, total_price, stripe_payment_intent_id, stripe_session_id)
     - Salva order_id
  
  8. PER OGNI item in order_items:
     - CREA order_item
       - INSERT INTO order_items (order_id, inventory_id, product_name, section, is_custom, price, weight)
     - Se inventory_id non esiste: ROLLBACK e ERRORE
  
  9. CHIAMA funzione magazzino
     - SELECT process_paid_order(order_id)
     - Se fallisce: ROLLBACK e ERRORE
  
  10. COMMIT TRANSACTION
  
  11. LOG successo
     - console.log(`Ordine ${order_number} creato con successo`)
  
  12. GESTISCI ERRORI
     - Se qualsiasi step fallisce: ROLLBACK
     - LOG errore dettagliato
     - Rilancia errore per retry Stripe
```

---

## 🔐 STRUTTURA METADATA STRIPE

### Come vengono passati i dati al webhook:

Nel file `src/app/api/stripe/checkout/route.ts` (linea 78-81), i metadata vengono passati così:

```typescript
metadata: {
  order_type: 'standard',
  order_items: JSON.stringify([
    {
      inventory_id: 'uuid-del-prodotto',
      product_name: 'Nome Prodotto',
      section: 'gioielleria',
      is_custom: false,
      price: 50.00,
      weight: 0.5,
      quantity: 1
    },
    // ... altri prodotti
  ])
}
```

### Dati Cliente (raccolti automaticamente da Stripe):
- `session.customer_email` - Email cliente
- `session.customer_details.name` - Nome completo
- `session.customer_details.phone` - Telefono (opzionale)
- `session.customer_details.address` - Indirizzo completo

---

## ✅ BEST PRACTICE IMPLEMENTATE

1. **Idempotenza**: Verifica ordine esistente prima di creare
2. **Transazioni**: Tutto in una transaction atomica
3. **Validazione**: Verifica dati prima di inserire
4. **Error Handling**: Rollback completo su errore
5. **Logging**: Log dettagliati per debugging
6. **Sicurezza**: Verifica signature webhook Stripe

---

## 🚨 GESTIONE ERRORI

- **Ordine già esistente**: Log e return (idempotenza)
- **Stock insufficiente**: Rollback, log errore, Stripe può ritentare
- **Dati mancanti**: Rollback, log errore
- **Errore database**: Rollback completo, log errore

---

Ora procedo con il codice completo del webhook.
