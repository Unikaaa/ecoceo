# Checklist Implementazione

## Setup Iniziale
- [ ] PROMPT 1: Setup progetto Next.js 14
  - [ ] package.json con dipendenze
  - [ ] tsconfig.json
  - [ ] tailwind.config.ts
  - [ ] Struttura cartelle src/
  - [ ] Layout base con Header/Footer
  - [ ] globals.css

- [ ] PROMPT 2: Tailwind personalizzato
  - [ ] Colori custom (primary, accent, ceramic)
  - [ ] Font serif/sans
  - [ ] Border radius custom
  - [ ] Aggiornamento globals.css

- [ ] PROMPT 3: Componenti UI base
  - [ ] Button component
  - [ ] Input component
  - [ ] Select component
  - [ ] Modal component
  - [ ] Export barrel (index.ts)

- [ ] PROMPT 4: Multilingua (i18n)
  - [ ] Middleware per routing [locale]
  - [ ] File traduzioni (it.json, en.json, ...)
  - [ ] Provider traduzioni
  - [ ] Hook useTranslations
  - [ ] Language switcher component

## Pagine e Funzionalità
- [ ] PROMPT 5: Home page
  - [ ] Hero section
  - [ ] Sezione categorie
  - [ ] Prodotti in evidenza
  - [ ] CTA sezioni

- [ ] PROMPT 6: Shop standard
  - [ ] Pagina shop con griglia
  - [ ] ProductCard component
  - [ ] ProductGrid component
  - [ ] Dati mock prodotti

- [ ] PROMPT 7: Pagina prodotto
  - [ ] Route [id]/page.tsx
  - [ ] ProductGallery component
  - [ ] ProductInfo component
  - [ ] AddToCartButton component
  - [ ] Fetch prodotto (mock)

- [ ] PROMPT 8: Carrello
  - [ ] Cart store (Zustand o Context)
  - [ ] Persistenza localStorage
  - [ ] CartIcon component
  - [ ] CartPage
  - [ ] CartItem component
  - [ ] CartSummary component
  - [ ] Funzionalità add/remove/update

- [ ] PROMPT 9: Stripe Checkout
  - [ ] Installazione Stripe SDK
  - [ ] API route /api/stripe/checkout
  - [ ] Success page
  - [ ] Cancel page
  - [ ] CheckoutButton component
  - [ ] Integrazione con carrello

## Testing e Deploy
- [ ] Test funzionalità base
- [ ] Test multilingua
- [ ] Test carrello persistenza
- [ ] Test Stripe (test mode)
- [ ] Configurazione Vercel
- [ ] Variabili ambiente produzione
- [ ] Deploy su Vercel

## Note Aggiuntive
- Mantenere codice semplice e leggibile
- TypeScript strict mode
- Responsive design
- Performance optimization
- SEO basics
- Error handling
