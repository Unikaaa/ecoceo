# 🔐 Configurazione Variabili d'Ambiente

## File da Creare

Crea un file `.env.local` nella root del progetto con le seguenti variabili:

## Variabili Stripe (Test Mode)

```env
# Stripe Secret Key (Server-side)
STRIPE_SECRET_KEY=sk_test_51SpnYTCPFnuz5t8nKzAnEF3I7GvSAUTdA9I5d5Bu4HekjFglfd7BfPNxBWwbjx8osiVK3edYlVjiZ9ydMUyMGbZM00a3mOl4O0

# Stripe Publishable Key (Client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SpnYTCPFnuz5t8n865FAojELH127IMwRYiDks3xP795qDATF54Ic7uTrZ0D6IlzSnJl4dnkRMB3wVL1QtgVtETh009piferXT

# Stripe Webhook Secret (da configurare dopo aver creato il webhook)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## Altre Variabili

```env
# URL dell'applicazione
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Password per la dashboard admin
DASHBOARD_PASSWORD=your_secure_password_here

# Supabase (se usato)
NEXT_PUBLIC_SUPABASE_URL=https://flwnnpvnknmrmjhcfkya.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Email di contatto
NEXT_PUBLIC_CONTACT_EMAIL=info@unika-ceramiche.it
CONTACT_EMAIL=info@unika-ceramiche.it
```

## ⚠️ Note Importanti

1. **Non committare `.env.local`** - È già nel `.gitignore`
2. **Stripe Webhook Secret**: Dovrai creare un webhook in Stripe Dashboard e copiare il secret
3. **Modalità Test**: Le chiavi fornite sono in modalità test. Per produzione, usa le chiavi live
4. **Riavvia il server**: Dopo aver creato/modificato `.env.local`, riavvia `npm run dev`

## 📝 Template Completo

Copia questo nel tuo `.env.local`:

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
# SUPABASE (se usato)
# ============================================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ============================================
# CONTACT EMAIL
# ============================================
NEXT_PUBLIC_CONTACT_EMAIL=info@unika-ceramiche.it
CONTACT_EMAIL=info@unika-ceramiche.it
```
