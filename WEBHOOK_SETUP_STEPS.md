# 🚀 Passi per Configurare il Webhook Stripe

## 📋 CHECKLIST COMPLETA

Segui questi passi **NEL PRECISO ORDINE** indicato:

---

## ✅ PASSO 1: Aggiungi Campi Idempotenza al Database

### DOVE ANDARE:
1. Apri **Supabase Dashboard** nel browser
2. Vai su **"SQL Editor"** (menu laterale sinistro)
3. Clicca su **"New query"** (pulsante verde in alto)

### COSA FARE:
1. Apri il file `supabase/webhook_idempotency.sql` nel tuo editor
2. **Copia TUTTO il contenuto** del file
3. **Incolla** nel SQL Editor di Supabase
4. Clicca su **"Run"** (o premi `Cmd+Enter` / `Ctrl+Enter`)

### VERIFICA:
Dovresti vedere "Success. No rows returned" (è normale).

**Se vedi errori**: Probabilmente i campi esistono già. Controlla la console.

---

## ✅ PASSO 2: Verifica File Webhook

### DOVE ANDARE:
1. Apri il file: `src/app/api/webhooks/stripe/route.ts`
2. Verifica che il file sia stato aggiornato con il nuovo codice

### COSA CONTROLLARE:
- Il file deve contenere la funzione `handleCheckoutCompleted`
- Deve usare `createClient` da `@supabase/supabase-js`
- Deve chiamare `process_paid_order` per scalare il magazzino

### SE IL FILE NON È AGGIORNATO:
Il file è già stato aggiornato automaticamente. Se vedi ancora il vecchio codice, ricarica l'editor.

---

## ✅ PASSO 3: Verifica Variabili d'Ambiente

### DOVE ANDARE:
1. Apri il file `.env.local` nella root del progetto
2. Verifica che contenga:

```env
NEXT_PUBLIC_SUPABASE_URL=https://flwnnpvnknmrmjhcfkya.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (la tua chiave)
STRIPE_SECRET_KEY=sk_test_51SpnYTCPFnuz5t8n...
STRIPE_WEBHOOK_SECRET=whsec_... (se configurato)
```

### COSA FARE:
- Se mancano variabili, aggiungile
- **RIAVVIA IL SERVER** dopo ogni modifica a `.env.local`

---

## ✅ PASSO 4: Configura Stripe Webhook (Sviluppo Locale)

### OPZIONE A: Stripe CLI (Consigliato per sviluppo)

#### DOVE ANDARE:
1. Apri il **Terminal** (non l'editor)
2. Assicurati di essere nella root del progetto

#### COSA FARE:

1. **Installa Stripe CLI** (se non l'hai già fatto):
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (con Scoop)
   scoop install stripe
   ```

2. **Login a Stripe**:
   ```bash
   stripe login
   ```
   - Si aprirà il browser per autenticarti

3. **Inoltra webhook al server locale**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   - Stripe CLI ti darà un **webhook secret** che inizia con `whsec_...`
   - **COPIALO** e aggiungilo al `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_... (quello che ti ha dato Stripe CLI)
     ```

4. **Riavvia il server** dopo aver aggiunto il secret

### OPZIONE B: Webhook Online (Solo per produzione)

Se stai testando in produzione, configura il webhook in Stripe Dashboard:
1. Vai su [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Clicca **"Add endpoint"**
3. URL: `https://tuodominio.com/api/webhooks/stripe`
4. Eventi: `checkout.session.completed`
5. Copia il **Signing Secret** e aggiungilo a `.env.local`

---

## ✅ PASSO 5: Test Completo

### DOVE ANDARE:
1. Apri il browser su `http://localhost:3000`
2. Apri la **Console del Terminal** dove gira `npm run dev`
3. Apri la **Console del Browser** (F12 → Console)

### COSA FARE:

1. **Aggiungi prodotto al carrello**
2. **Vai al checkout**
3. **Usa carta di test**: `4242 4242 4242 4242`
4. **Completa il pagamento**

### VERIFICA:

1. **Nel Terminal del server** dovresti vedere:
   ```
   ✅ Ordine ORD-2024-0001 processato con successo!
   ✅ Magazzino scalato per ordine [uuid]
   ```

2. **In Supabase Dashboard**:
   - Vai su **"Table Editor"** → **"orders"**
   - Dovresti vedere il nuovo ordine
   - Vai su **"order_items"**
   - Dovresti vedere le righe ordine
   - Vai su **"inventory"**
   - Le quantità dovrebbero essere state scalate

3. **Se vedi errori**:
   - Controlla i log nel Terminal
   - Verifica che tutte le variabili d'ambiente siano corrette
   - Verifica che il database abbia i campi di idempotenza

---

## 🆘 RISOLUZIONE PROBLEMI

### Errore: "Supabase non configurato"
**Soluzione**: Verifica che `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` siano nel `.env.local` e riavvia il server.

### Errore: "Webhook signature verification failed"
**Soluzione**: 
- Per sviluppo locale: usa Stripe CLI e copia il secret corretto
- Verifica che `STRIPE_WEBHOOK_SECRET` sia corretto nel `.env.local`

### Errore: "INSUFFICIENT_STOCK"
**Soluzione**: Aggiungi prodotti in `inventory` con `quantity > 0` per testare.

### Errore: "inventory_id non trovato"
**Soluzione**: Verifica che i prodotti nel carrello abbiano un `inventory_id` valido che esiste nella tabella `inventory`.

### Ordine duplicato
**Soluzione**: Verifica che i campi `stripe_session_id` e `stripe_payment_intent_id` siano stati aggiunti alla tabella `orders` (Passo 1).

---

## ✅ CHECKLIST FINALE

- [ ] Campi idempotenza aggiunti al database (Passo 1)
- [ ] File webhook aggiornato (Passo 2)
- [ ] Variabili d'ambiente configurate (Passo 3)
- [ ] Stripe CLI configurato o webhook online configurato (Passo 4)
- [ ] Test completato con successo (Passo 5)
- [ ] Ordine visibile in Supabase
- [ ] Magazzino scalato correttamente

---

## 📝 NOTE IMPORTANTI

1. **Idempotenza**: Il webhook controlla automaticamente se un ordine è già stato processato usando `stripe_session_id` o `stripe_payment_intent_id`.

2. **Transazioni**: L'ordine e gli order_items vengono creati insieme. Se qualcosa fallisce, tutto viene rollback.

3. **Magazzino**: Dopo aver creato l'ordine, viene chiamata automaticamente la funzione `process_paid_order` che scala il magazzino in modo atomico.

4. **Logging**: Tutti gli step vengono loggati nella console del server per debugging.

---

## 🎉 COMPLETATO!

Se hai completato tutti i passi e il test funziona, il webhook è configurato correttamente! 🚀
