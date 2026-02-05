# Deploy su Vercel - Checklist

## Environment Variables

Configura le seguenti variabili ambiente in Vercel Dashboard:

### Required
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional (se usi database/storage)
```
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

## Build Settings

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)
- **Node Version**: 18.x o superiore

## Webhook Stripe

1. Vai su Stripe Dashboard → Developers → Webhooks
2. Aggiungi endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Seleziona eventi:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copia il Webhook Signing Secret e aggiungilo a `STRIPE_WEBHOOK_SECRET`

## Post-Deploy Checklist

- [ ] Test homepage
- [ ] Test shop e prodotti
- [ ] Test carrello
- [ ] Test checkout Stripe (test mode)
- [ ] Test webhook (usando Stripe CLI o Dashboard)
- [ ] Verifica SEO (metadata, sitemap)
- [ ] Test multilingua
- [ ] Verifica performance (Lighthouse)
- [ ] Test su mobile

## Custom Domain

1. Vai su Vercel Dashboard → Project → Settings → Domains
2. Aggiungi il tuo dominio
3. Configura DNS secondo le istruzioni Vercel
4. SSL sarà automatico

## Monitoring

Considera di aggiungere:
- Vercel Analytics (opzionale)
- Error tracking (Sentry, opzionale)
- Performance monitoring

## Note

- Il progetto è pronto per il deploy
- Tutti i file necessari sono presenti
- Sitemap generata dinamicamente
- Robots.txt configurato
- Security headers configurati
