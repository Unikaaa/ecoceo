# UNIKA - Ecommerce Ceramiche Artistiche

Ecommerce moderno per ceramiche artistiche costruito con Next.js 14, TypeScript, Tailwind CSS e Stripe.

## 🚀 Stack Tecnologico

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (design system personalizzato)
- **Zustand** (state management)
- **Stripe** (pagamenti)

## 📦 Installazione

```bash
npm install
```

## 🔧 Configurazione

1. Crea il file `.env.local` nella root del progetto
2. Aggiungi le variabili d'ambiente (vedi `ENV_SETUP.md` per il template completo)
   
   **Variabili minime richieste:**
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DASHBOARD_PASSWORD=your_secure_password_here
   ```
   
   **Nota**: Vedi `ENV_SETUP.md` per la configurazione completa con tutte le chiavi Stripe.

## 🏃 Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## 📁 Struttura Progetto

```
src/
├── app/                    # App Router
│   ├── [locale]/          # Route multilingua
│   │   ├── shop/          # Shop e prodotti
│   │   ├── cart/          # Carrello
│   │   └── checkout/      # Checkout Stripe
│   └── api/               # API routes
│       └── stripe/        # Stripe checkout
├── components/             # Componenti React
│   ├── ui/                # Componenti UI base
│   ├── layout/            # Header, Footer
│   ├── home/              # Componenti Home
│   ├── shop/              # Componenti Shop
│   └── cart/              # Componenti Carrello
├── lib/                   # Utilities
│   ├── i18n/              # Sistema multilingua
│   ├── store/             # Zustand stores
│   └── data/              # Dati mock
└── messages/              # File traduzioni
```

## ✨ Funzionalità

- ✅ Shop standard con prodotti
- ✅ Pagina prodotto singolo
- ✅ Carrello con persistenza localStorage
- ✅ Checkout Stripe
- ✅ Multilingua (IT, EN, ES, RS, CN)
- ✅ Design system personalizzato
- ✅ Responsive design

## 🎨 Design System

- **Colori**: Primary (terracotta), Accent (blu ceramico), Ceramic palette
- **Font**: Serif per titoli, Sans per testo
- **Border Radius**: Artistic custom

## 📝 Note

- Dati mock per prodotti (pronto per integrazione DB/API)
- Limite ordini 100/giorno (da implementare)
- Configuratore prodotto personalizzato (futuro)

## 🚢 Deploy

Il progetto è pronto per il deploy su Vercel:

```bash
vercel
```

## 📄 Licenza

Proprietario - UNIKA
