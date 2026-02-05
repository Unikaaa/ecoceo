# PROMPT 18 – DEPLOY VERCEL

## Obiettivo
Preparare il progetto per deploy su Vercel: env variables, build check, suggerimenti SEO.

## Preparazione Deploy

### 1. Environment Variables
- **Stripe**: Secret e Publishable keys
- **App URL**: Production URL
- **Database**: Se presente (Supabase, etc.)
- **Storage**: Se presente (Supabase Storage, S3)
- **Webhook Secret**: Stripe webhook secret

### 2. Build Check
- **TypeScript**: `npm run build` senza errori
- **Linting**: `npm run lint` pulito
- **Dependencies**: Tutte installate
- **Static Files**: Public folder configurato

### 3. Vercel Config
- **vercel.json**: Configurazione opzionale
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables Checklist

### Required
```
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_APP_URL=https://yourdomain.com
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Optional
```
DATABASE_URL=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

## SEO Setup

### 1. Metadata
- **Default metadata**: In root layout
- **Dynamic metadata**: Per pagine
- **Open Graph**: Immagini e descrizioni
- **Twitter Card**: Configurato

### 2. Sitemap
- **sitemap.xml**: Generato dinamicamente
- **robots.txt**: Configurato
- **Canonical URLs**: Ogni pagina

### 3. Performance
- **Core Web Vitals**: Ottimizzato
- **Image Optimization**: next/image
- **Font Optimization**: next/font

## File da Creare

### vercel.json (opzionale)
```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### robots.txt
```
User-agent: *
Allow: /
Sitemap: https://yourdomain.com/sitemap.xml
```

### sitemap.xml (o dinamico)
- Generato da `/app/sitemap.ts`

## Build Checklist

- [ ] `npm run build` successo
- [ ] Nessun errore TypeScript
- [ ] Tutte env variables configurate
- [ ] Test locale funzionante
- [ ] Immagini ottimizzate
- [ ] Metadata SEO completo
- [ ] Webhook Stripe configurato
- [ ] Domain configurato in Vercel

## Deploy Steps

1. **Push to Git**: Repository GitHub/GitLab
2. **Connect Vercel**: Import project
3. **Configure Env**: Aggiungi variabili ambiente
4. **Deploy**: Automatico o manuale
5. **Test**: Verifica funzionamento
6. **Webhook**: Configura Stripe webhook URL

## Post-Deploy

- [ ] Test checkout Stripe
- [ ] Test webhook
- [ ] Verifica SEO
- [ ] Test performance
- [ ] Monitoraggio errori

## Note
- Usa preview deployments per test
- Configura custom domain
- SSL automatico con Vercel
- Analytics opzionale (Vercel Analytics)
