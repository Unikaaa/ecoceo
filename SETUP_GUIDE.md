# 🚀 Guida Setup Completa - UNIKA

## 📋 Indice
1. [Setup Supabase](#1-setup-supabase)
2. [Setup Stripe](#2-setup-stripe)
3. [Configurazione Variabili d'Ambiente](#3-configurazione-variabili-dambiente)
4. [Test Finale](#4-test-finale)

---

## 1. Setup Supabase

### Passo 1.1: Accedi a Supabase
1. Vai su [https://supabase.com](https://supabase.com)
2. Accedi al tuo account
3. Seleziona il tuo progetto (o creane uno nuovo)

### Passo 1.2: Apri SQL Editor
1. Nel menu laterale, clicca su **"SQL Editor"**
2. Clicca su **"New query"** (o il pulsante "+")

### Passo 1.3: Importa lo Schema del Database
1. Apri il file `supabase/schema.sql` nel tuo editor
2. **Copia TUTTO il contenuto** del file
3. **Incolla** nel SQL Editor di Supabase
4. Clicca su **"Run"** (o premi `Cmd+Enter` / `Ctrl+Enter`)

✅ **Verifica**: Dovresti vedere un messaggio di successo. Controlla che siano state create:
- 5 ENUM types (order_status, availability_status, production_status, shipping_status, contact_status)
- 4 tabelle (inventory, orders, order_items, contacts)
- Indici e trigger

### Passo 1.4: Importa la Logica Magazzino
1. Apri il file `supabase/inventory_logic.sql` nel tuo editor
2. **Copia TUTTO il contenuto** del file
3. **Incolla** nel SQL Editor di Supabase (nuova query)
4. Clicca su **"Run"**

✅ **Verifica**: Dovresti vedere che sono state create 2 funzioni:
- `process_paid_order(order_id UUID)`
- `process_cancelled_order(order_id UUID)`

### Passo 1.5: Recupera le Credenziali Supabase
1. Vai su **"Settings"** (⚙️) → **"API"**
2. Trova la sezione **"Project API keys"**
3. Copia:
   - **Project URL** → sarà `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role key** (quella segreta, NON la anon key) → sarà `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **IMPORTANTE**: Usa la **service_role key**, non la anon key, perché serve per le operazioni server-side.

---

## 2. Setup Stripe

📖 **Guida Completa**: Vedi `SETUP_STRIPE.md` per i dettagli completi.

### Passo 2.1: Aggiungi Chiavi al `.env.local`
Le chiavi Stripe sono già disponibili. Aggiungile al tuo `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_51SpnYTCPFnuz5t8nKzAnEF3I7GvSAUTdA9I5d5Bu4HekjFglfd7BfPNxBWwbjx8osiVK3edYlVjiZ9ydMUyMGbZM00a3mOl4O0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SpnYTCPFnuz5t8n865FAojELH127IMwRYiDks3xP795qDATF54Ic7uTrZ0D6IlzSnJl4dnkRMB3wVL1QtgVtETh009piferXT
```

### Passo 2.2: Test Checkout
1. Riavvia il server dopo aver aggiunto le chiavi
2. Aggiungi un prodotto al carrello
3. Vai al checkout
4. Usa carta di test: `4242 4242 4242 4242`

### Passo 2.3: Configura Webhook (Opzionale)
- **Sviluppo locale**: Usa Stripe CLI (vedi `SETUP_STRIPE.md`)
- **Produzione**: Configura webhook in Stripe Dashboard

Vedi `SETUP_STRIPE.md` per la guida completa sui webhook.

---

## 3. Configurazione Variabili d'Ambiente

### Passo 3.1: Crea il file `.env.local`
1. Nella root del progetto, crea un file chiamato `.env.local`
2. Copia il contenuto da `ENV_SETUP.md` o usa questo template:

```env
# ============================================
# STRIPE CONFIGURATION (TEST MODE)
# ============================================
STRIPE_SECRET_KEY=sk_test_51SpnYTCPFnuz5t8nKzAnEF3I7GvSAUTdA9I5d5Bu4HekjFglfd7BfPNxBWwbjx8osiVK3edYlVjiZ9ydMUyMGbZM00a3mOl4O0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SpnYTCPFnuz5t8n865FAojELH127IMwRYiDks3xP795qDATF54Ic7uTrZ0D6IlzSnJl4dnkRMB3wVL1QtgVtETh009piferXT
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ============================================
# APP CONFIGURATION
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ============================================
# DASHBOARD AUTHENTICATION
# ============================================
DASHBOARD_PASSWORD=your_secure_password_here

# ============================================
# SUPABASE CONFIGURATION
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# CONTACT EMAIL
# ============================================
NEXT_PUBLIC_CONTACT_EMAIL=info@unika-ceramiche.it
CONTACT_EMAIL=info@unika-ceramiche.it
```

### Passo 3.2: Sostituisci i Valori
1. **NEXT_PUBLIC_SUPABASE_URL**: Incolla l'URL del progetto Supabase (dal Passo 1.5)
2. **SUPABASE_SERVICE_ROLE_KEY**: Incolla la service_role key (dal Passo 1.5)
3. **DASHBOARD_PASSWORD**: Scegli una password sicura per accedere a `/dashboard`
4. **STRIPE_WEBHOOK_SECRET**: Lascia `whsec_your_webhook_secret_here` per ora (o incolla il secret dal Passo 2.2)

### Passo 3.3: Salva e Riavvia
1. Salva il file `.env.local`
2. **Riavvia il server di sviluppo**:
   ```bash
   # Ferma il server (Ctrl+C)
   npm run dev
   ```

---

## 4. Test Finale

### Test 4.1: Verifica Supabase
1. Vai su Supabase Dashboard → **"Table Editor"**
2. Dovresti vedere 4 tabelle:
   - ✅ `inventory`
   - ✅ `orders`
   - ✅ `order_items`
   - ✅ `contacts`

### Test 4.2: Verifica Database Functions
1. Vai su Supabase Dashboard → **"Database"** → **"Functions"**
2. Dovresti vedere 2 funzioni:
   - ✅ `process_paid_order`
   - ✅ `process_cancelled_order`

### Test 4.3: Test Dashboard
1. Vai su `http://localhost:3000/dashboard`
2. Inserisci la password che hai configurato in `DASHBOARD_PASSWORD`
3. Dovresti vedere la dashboard con le sezioni

### Test 4.4: Test Contatti
1. Vai su `http://localhost:3000`
2. Clicca su "Contattaci" nell'header
3. Compila e invia il form
4. Vai su `http://localhost:3000/dashboard/contacts`
5. Dovresti vedere il messaggio nella lista

### Test 4.5: Test Stripe (Opzionale)
1. Aggiungi un prodotto al carrello
2. Vai al checkout
3. Usa una carta di test Stripe: `4242 4242 4242 4242`
4. Qualsiasi data futura e CVC

---

## ✅ Checklist Finale

- [ ] Schema SQL importato in Supabase
- [ ] Funzioni magazzino importate in Supabase
- [ ] Credenziali Supabase copiate
- [ ] File `.env.local` creato con tutte le variabili
- [ ] Server riavviato dopo la creazione di `.env.local`
- [ ] Dashboard accessibile con password
- [ ] Form contatti funzionante
- [ ] Database visibile in Supabase Table Editor

---

## 🆘 Problemi Comuni

### Errore: "relation does not exist"
**Soluzione**: Assicurati di aver eseguito `schema.sql` PRIMA di `inventory_logic.sql`

### Errore: "permission denied"
**Soluzione**: Verifica di usare la **service_role key**, non la anon key

### Dashboard non si apre
**Soluzione**: Verifica che `DASHBOARD_PASSWORD` sia impostato in `.env.local` e riavvia il server

### Contatti non si salvano
**Soluzione**: Verifica che `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` siano corretti

---

## 📚 File da Importare in Supabase

1. **`supabase/schema.sql`** → Prima (crea tabelle e strutture)
2. **`supabase/inventory_logic.sql`** → Dopo (crea funzioni)

**NON importare nulla in Stripe** - Le chiavi API sono sufficienti.

---

## 🎉 Fine Setup!

Ora il progetto è configurato e pronto per lo sviluppo. Se hai problemi, controlla i log del server e la console del browser.
