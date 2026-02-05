# 💳 Guida Setup Stripe - UNIKA

## 📋 Indice
1. [Verifica Chiavi API](#1-verifica-chiavi-api)
2. [Configurazione Variabili d'Ambiente](#2-configurazione-variabili-dambiente)
3. [Test Checkout](#3-test-checkout)
4. [Configurazione Webhook (Opzionale)](#4-configurazione-webhook-opzionale)

---

## 1. Verifica Chiavi API

### ✅ Le tue chiavi sono già disponibili:

**Secret Key (Server-side):**
```
sk_test_51SpnYTCPFnuz5t8nKzAnEF3I7GvSAUTdA9I5d5Bu4HekjFglfd7BfPNxBWwbjx8osiVK3edYlVjiZ9ydMUyMGbZM00a3mOl4O0
```

**Publishable Key (Client-side):**
```
pk_test_51SpnYTCPFnuz5t8n865FAojELH127IMwRYiDks3xP795qDATF54Ic7uTrZ0D6IlzSnJl4dnkRMB3wVL1QtgVtETh009piferXT
```

⚠️ **Nota**: Queste sono chiavi di **TEST MODE**. Per produzione, dovrai usare le chiavi **LIVE** (che iniziano con `sk_live_` e `pk_live_`).

---

## 2. Configurazione Variabili d'Ambiente

### Passo 2.1: Aggiungi al `.env.local`

Apri il file `.env.local` nella root del progetto e aggiungi/modifica queste righe:

```env
# ============================================
# STRIPE CONFIGURATION (TEST MODE)
# ============================================
STRIPE_SECRET_KEY=sk_test_51SpnYTCPFnuz5t8nKzAnEF3I7GvSAUTdA9I5d5Bu4HekjFglfd7BfPNxBWwbjx8osiVK3edYlVjiZ9ydMUyMGbZM00a3mOl4O0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SpnYTCPFnuz5t8n865FAojELH127IMwRYiDks3xP795qDATF54Ic7uTrZ0D6IlzSnJl4dnkRMB3wVL1QtgVtETh009piferXT
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### Passo 2.2: Riavvia il Server

Dopo aver salvato `.env.local`, **riavvia il server**:

```bash
# Ferma il server (Ctrl+C)
npm run dev
```

---

## 3. Test Checkout

### Passo 3.1: Test Checkout Standard

1. Vai su `http://localhost:3000`
2. Aggiungi un prodotto al carrello
3. Vai al carrello e clicca "Procedi al Checkout"
4. Dovresti essere reindirizzato a Stripe Checkout

### Passo 3.2: Carta di Test Stripe

Usa queste credenziali per testare i pagamenti:

**Carta di Test:**
```
Numero: 4242 4242 4242 4242
Data: Qualsiasi data futura (es. 12/25)
CVC: Qualsiasi 3 cifre (es. 123)
ZIP: Qualsiasi 5 cifre (es. 12345)
```

**Altre Carte di Test:**
- **Pagamento rifiutato**: `4000 0000 0000 0002`
- **Richiede autenticazione 3D Secure**: `4000 0025 0000 3155`

### Passo 3.3: Verifica Successo

Dopo il pagamento di test:
1. Dovresti essere reindirizzato a `/checkout/success`
2. L'ordine dovrebbe essere processato
3. Controlla i log del server per eventuali errori

---

## 4. Configurazione Webhook (Opzionale)

I webhook sono necessari per:
- Creare ordini nel database dopo pagamento riuscito
- Gestire eventi di pagamento (successo, fallimento, rimborsi)

### Opzione A: Stripe CLI (Sviluppo Locale) ⭐ Consigliato

**Per testare i webhook in locale senza deploy:**

1. **Installa Stripe CLI**:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Windows (con Scoop)
   scoop install stripe
   
   # Linux
   # Vedi: https://stripe.com/docs/stripe-cli
   ```

2. **Login a Stripe**:
   ```bash
   stripe login
   ```

3. **Inoltra webhook al server locale**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. **Copia il Webhook Signing Secret**:
   - Stripe CLI ti darà un secret che inizia con `whsec_...`
   - Aggiungilo al `.env.local`:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_... (quello che ti ha dato Stripe CLI)
     ```

5. **Riavvia il server** e testa un pagamento

### Opzione B: Webhook Online (Produzione)

**Per configurare webhook in produzione:**

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com)
2. Vai su **"Developers"** → **"Webhooks"**
3. Clicca **"Add endpoint"**
4. **Endpoint URL**: `https://tuodominio.com/api/webhooks/stripe`
5. **Eventi da ascoltare**:
   - ✅ `checkout.session.completed`
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
6. Clicca **"Add endpoint"**
7. **Copia il Signing Secret** (inizia con `whsec_...`)
8. Aggiungilo al `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_... (il secret che hai copiato)
   ```

---

## 5. Verifica Configurazione

### Checklist Stripe:

- [ ] Chiavi API aggiunte al `.env.local`
- [ ] Server riavviato dopo modifica `.env.local`
- [ ] Checkout funzionante (reindirizza a Stripe)
- [ ] Pagamento di test completato con successo
- [ ] Webhook configurato (opzionale ma consigliato)

### Test Completo:

1. **Test Checkout**:
   - Aggiungi prodotto → Carrello → Checkout
   - Usa carta `4242 4242 4242 4242`
   - Verifica redirect a success page

2. **Test Webhook** (se configurato):
   - Controlla i log del server dopo il pagamento
   - Verifica che l'ordine sia stato creato nel database
   - Controlla Stripe Dashboard → Payments per vedere la transazione

---

## 🆘 Problemi Comuni

### Errore: "Invalid API Key"
**Soluzione**: 
- Verifica che le chiavi siano corrette in `.env.local`
- Assicurati di aver riavviato il server dopo aver modificato `.env.local`
- Controlla che non ci siano spazi extra nelle chiavi

### Errore: "No such checkout session"
**Soluzione**: 
- Verifica che `NEXT_PUBLIC_APP_URL` sia corretto
- Assicurati che le URL di success/cancel siano corrette

### Webhook non funziona
**Soluzione**: 
- Per sviluppo locale, usa Stripe CLI (Opzione A)
- Per produzione, verifica che l'URL del webhook sia accessibile pubblicamente
- Controlla che `STRIPE_WEBHOOK_SECRET` sia corretto

---

## 📝 Note Importanti

1. **Test Mode vs Live Mode**:
   - Le chiavi fornite sono in **TEST MODE**
   - Per produzione, genera nuove chiavi **LIVE** da Stripe Dashboard
   - Le chiavi LIVE iniziano con `sk_live_` e `pk_live_`

2. **Webhook Secret**:
   - Ogni endpoint webhook ha il suo secret univoco
   - Non condividere mai il webhook secret pubblicamente
   - Se cambi endpoint, devi generare un nuovo secret

3. **Sicurezza**:
   - Non committare mai `.env.local` (è già nel `.gitignore`)
   - Usa variabili d'ambiente diverse per sviluppo e produzione
   - Rotazione periodica delle chiavi API

---

## ✅ Setup Completo!

Se hai completato tutti i passaggi:
- ✅ Chiavi configurate
- ✅ Checkout funzionante
- ✅ Webhook configurato (opzionale)

Il sistema di pagamento è pronto! 🎉

Per domande o problemi, controlla i log del server e la console del browser.
