# UNIKA - Ecommerce Ceramiche Artistiche
## Linee Guida Progetto

### Stack Tecnologico
- **Framework**: Next.js 14 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS (custom design system)
- **Pagamenti**: Stripe Checkout
- **Deploy**: Vercel
- **Multilingua**: i18n con App Router (it/en/ES/RS/CN)

### Requisiti Business
- Shop standard con prodotti predefiniti
- Shop con prodotto personalizzato (configuratore)
- Limite ordini: max 100/giorno
- Design artistico, pulito, minimal

### Principi di Sviluppo
- Codice semplice e leggibile
- Production-ready
- Best practice moderne
- Evitare over-engineering
- Struttura chiara e manutenibile

### Struttura Progetto
```
src/
├── app/                    # App Router (Next.js 14)
│   ├── [locale]/          # Route multilingua
│   │   ├── layout.tsx
│   │   ├── page.tsx       # Home
│   │   ├── shop/
│   │   │   ├── page.tsx   # Shop standard
│   │   │   └── [id]/
│   │   │       └── page.tsx  # Prodotto singolo
│   │   ├── customizer/    # Configuratore prodotto
│   │   ├── cart/          # Carrello
│   │   └── checkout/      # Checkout Stripe
│   ├── api/               # API routes
│   │   └── stripe/
│   │       └── checkout/  # Stripe checkout endpoint
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Componenti UI riutilizzabili
│   ├── layout/            # Header, Footer
│   └── shop/              # Componenti shop-specific
├── lib/
│   ├── i18n/              # Configurazione multilingua
│   ├── stripe/            # Utilità Stripe
│   └── utils/             # Utility functions
├── messages/              # File traduzioni
│   ├── it.json
│   ├── en.json
│   ├── es.json
│   ├── rs.json
│   └── cn.json
├── types/                 # TypeScript types
└── public/                # Assets statici
```

### Design System
- **Colori**: primary, accent, ceramic (palette personalizzata)
- **Font**: serif per titoli, sans per testo
- **Border radius**: custom per design artistico
- **Spacing**: sistema coerente Tailwind

### Stato Applicazione
- **Carrello**: Client state (Context API o Zustand)
- **Persistenza**: localStorage per carrello
- **Ordini**: Server-side con limite 100/giorno

### Best Practices
1. Componenti riutilizzabili e modulari
2. Type safety con TypeScript
3. SEO-friendly con metadata Next.js
4. Performance optimization
5. Error handling robusto
6. Validazione input lato client e server
