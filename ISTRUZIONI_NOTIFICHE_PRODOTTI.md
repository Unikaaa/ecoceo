# ISTRUZIONI - Sistema Notifiche Prodotti Esauriti

## 📋 Panoramica

Sistema completo per gestire i prodotti esauriti con notifiche email automatiche quando tornano disponibili.

## 🗄️ Setup Supabase

### 1. Crea la tabella `product_notifications`

Esegui il file SQL in Supabase Dashboard → SQL Editor:

```sql
-- File: supabase/create_product_notifications_table.sql
```

Questo crea:
- Tabella `product_notifications` per salvare le email dei clienti
- Index per performance
- Trigger per aggiornare `updated_at`
- RLS policies per sicurezza

### 2. Crea il trigger per rilevare prodotti disponibili (opzionale)

Esegui il file SQL in Supabase Dashboard → SQL Editor:

```sql
-- File: supabase/notify_product_available.sql
```

Questo crea un trigger che rileva quando un prodotto passa da `quantity = 0` a `quantity > 0`.

## 🎨 Funzionalità Frontend

### Prodotti Esauriti Visibili

- I prodotti con `quantity = 0` ora **rimangono visibili** nella shop
- Mostrano badge **"ESAURITO"** invece di scomparire
- Design elegante con overlay e badge rosso

### Componente Notifica

Quando un prodotto è esaurito, appare un componente elegante con:
- Icona campanella
- Testo professionale inerente alla fotoceramica
- Form per inserire email
- Design minimal luxury coerente con il brand

### Posizioni Componente

1. **ProductCard** (griglia prodotti): Badge "ESAURITO" visibile
2. **ProductInfo** (pagina prodotto): Componente notifica completo con form email

## 📧 Sistema Email

### API Routes

1. **POST `/api/product-notifications`**
   - Salva email del cliente per un prodotto esaurito
   - Valida email e prodotto
   - Previene duplicati (stessa email + stesso prodotto)

2. **POST `/api/product-notifications/send`**
   - Invia email a tutti i clienti che hanno richiesto notifica
   - Chiamata automaticamente quando un prodotto torna disponibile
   - Marca le notifiche come inviate

### Invio Email Automatico

Quando nella dashboard si aggiorna un prodotto da `quantity = 0` a `quantity > 0`:
1. L'API `/api/inventory` rileva il cambio
2. Restituisce `is_now_available: true`
3. `InventorySection` chiama automaticamente `/api/product-notifications/send`
4. Le email vengono inviate a tutti i clienti registrati

### Implementazione Email (TODO)

Attualmente l'invio email è **simulato** (log in console). Per implementare l'invio reale:

1. Scegli un servizio email (Resend, SendGrid, AWS SES, ecc.)
2. Aggiungi API key in `.env.local`
3. Modifica `src/app/api/product-notifications/send/route.ts`
4. Implementa la funzione `sendEmailNotification()`

**Esempio con Resend:**
```typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'UNIKA <noreply@unika.it>',
  to: email,
  subject: `Il prodotto ${productName} è di nuovo disponibile!`,
  html: `
    <h1>Buone notizie!</h1>
    <p>Il prodotto <strong>${productName}</strong> è di nuovo disponibile nel nostro shop.</p>
    <a href="https://unika.it/shop/${productSlug}">Visualizza Prodotto</a>
  `
})
```

## 🔄 Flusso Completo

1. **Cliente vede prodotto esaurito** → Badge "ESAURITO" visibile
2. **Cliente inserisce email** → Salvata in `product_notifications`
3. **Admin aggiorna quantità** → Da 0 a > 0 nella dashboard
4. **Sistema rileva cambio** → API restituisce `is_now_available: true`
5. **Email inviate automaticamente** → A tutti i clienti registrati
6. **Notifiche marcate come inviate** → `notified = true`, `notified_at = NOW()`

## 📝 Note Importanti

- I prodotti esauriti **non scompaiono** più dalla shop
- Le email sono **opzionali** - il cliente può scegliere se registrarsi
- Le notifiche sono **automatiche** quando si aggiorna la quantità
- Il sistema previene **duplicati** (stessa email + stesso prodotto)
- Design **professionale e coerente** con il brand UNIKA

## ✅ Checklist Setup

- [ ] Eseguire `create_product_notifications_table.sql` su Supabase
- [ ] (Opzionale) Eseguire `notify_product_available.sql` su Supabase
- [ ] Verificare che i prodotti esauriti siano visibili nella shop
- [ ] Testare il form di notifica su un prodotto esaurito
- [ ] Testare l'aggiornamento quantità nella dashboard
- [ ] Implementare servizio email reale (Resend/SendGrid/altro)
- [ ] Configurare variabili ambiente per servizio email
