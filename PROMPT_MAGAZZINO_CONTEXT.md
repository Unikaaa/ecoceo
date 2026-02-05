# PROMPT CONTEXT - UNIKA ECOMMERCE CERAMICHE ARTISTICHE
## Documento di Contesto per Integrazione Sistema Magazzino

---

## 📋 PANORAMICA PROGETTO

**UNIKA** è un e-commerce moderno per ceramiche artistiche artigianali, costruito con Next.js 14, TypeScript, Tailwind CSS e Stripe. Il sito vende prodotti standard e personalizzati, con gestione ordini, checkout Stripe e sistema multilingua.

### Business Model
- **Prodotti Standard**: Ceramiche predefinite vendute direttamente
- **Prodotti Personalizzati**: Configuratore per creare pezzi unici su misura
- **Limite Ordini**: Massimo 100 ordini/giorno
- **Categorie**: Gioielleria, Set e Kit, Collezionismo, Piatti e Oggetti d'Uso, Eventi e Regali

---

## 🛠️ STACK TECNOLOGICO

### Core
- **Next.js 14** (App Router) - Framework React
- **TypeScript** - Type safety
- **React 18.3** - UI Library
- **Tailwind CSS 3.4** - Styling utility-first

### State Management & Utilities
- **Zustand 4.5** - Client state management (carrello)
- **Zod 4.3** - Schema validation
- **clsx + tailwind-merge** - Class name utilities

### Pagamenti
- **Stripe 20.1** - Backend pagamenti
- **@stripe/stripe-js 8.6** - Frontend Stripe

### Deploy
- **Vercel** - Hosting e deployment

---

## 📁 STRUTTURA PROGETTO

```
src/
├── app/                          # Next.js App Router
│   ├── [locale]/                 # Route multilingua (it, en, es, rs, cn)
│   │   ├── layout.tsx            # Layout principale con Header/Footer
│   │   ├── page.tsx              # Homepage
│   │   ├── shop/                 # Shop e prodotti
│   │   │   ├── page.tsx          # Lista prodotti (tutti o per categoria)
│   │   │   └── [category]/       # Filtro per categoria
│   │   │       ├── page.tsx      # Prodotti categoria
│   │   │       └── [slug]/       # Dettaglio prodotto
│   │   │           └── page.tsx
│   │   ├── customizer/           # Configuratore prodotto personalizzato
│   │   │   └── page.tsx
│   │   ├── cart/                 # Carrello
│   │   │   └── page.tsx
│   │   ├── checkout/             # Checkout Stripe
│   │   │   ├── success/          # Pagina successo pagamento
│   │   │   └── cancel/           # Pagina annullamento
│   │   ├── news/                 # Blog/News
│   │   │   ├── page.tsx          # Lista articoli
│   │   │   └── [slug]/           # Dettaglio articolo
│   │   │       └── page.tsx
│   │   └── about/                # Chi Siamo
│   │       └── page.tsx
│   └── api/                      # API Routes
│       ├── contact/              # Form contatto
│       │   └── route.ts
│       ├── orders/               # Gestione ordini
│       │   ├── route.ts          # GET/POST ordini
│       │   └── [id]/             # Dettaglio ordine
│       │       └── route.ts
│       ├── stripe/               # Stripe integration
│       │   ├── checkout/         # Checkout standard
│       │   │   └── route.ts
│       │   └── checkout-custom/  # Checkout prodotto custom
│       │       └── route.ts
│       ├── upload/               # Upload immagini prodotto custom
│       │   └── route.ts
│       └── webhooks/              # Webhook Stripe
│           └── stripe/
│               └── route.ts
├── components/                   # Componenti React
│   ├── ui/                       # Componenti UI base riutilizzabili
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── SkeletonLoader.tsx
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Header con logo, nav, search, social, cart
│   │   ├── Footer.tsx
│   │   ├── SearchBar.tsx         # Barra ricerca con autocomplete
│   │   ├── CartIcon.tsx          # Icona carrello con badge
│   │   └── LanguageSwitcher.tsx  # (non più usato, sostituito da SearchBar)
│   ├── home/                     # Componenti homepage
│   │   ├── Hero.tsx
│   │   ├── Categories.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── Customization.tsx
│   │   ├── Artisan.tsx
│   │   └── CTA.tsx
│   ├── shop/                     # Componenti shop
│   │   ├── ProductCard.tsx       # Card prodotto in griglia
│   │   ├── ProductGrid.tsx        # Griglia prodotti
│   │   ├── ProductGallery.tsx     # Gallery immagini prodotto
│   │   ├── ProductInfo.tsx        # Info prodotto (prezzo, descrizione)
│   │   ├── AddToCartButton.tsx    # Bottone aggiungi al carrello
│   │   └── CategoryCard.tsx       # Card categoria
│   ├── cart/                     # Componenti carrello
│   │   ├── CartItem.tsx           # Singolo item carrello
│   │   ├── CartSummary.tsx       # Riepilogo totale
│   │   └── CheckoutButton.tsx    # Bottone checkout Stripe
│   ├── customizer/                # Configuratore prodotto
│   │   ├── ImageUpload.tsx        # Upload immagini
│   │   └── ImagePreview.tsx       # Preview immagini
│   ├── contact/                   # Form contatto
│   │   └── ContactModal.tsx      # Modal popup contatto
│   └── news/                      # Componenti blog
│       └── ArticleCard.tsx
├── lib/                          # Utilities e logica
│   ├── i18n/                     # Sistema multilingua
│   │   ├── hooks.ts              # useTranslations hook
│   │   ├── translations.ts       # Caricamento traduzioni
│   │   └── types.ts              # Tipi traduzioni
│   ├── store/                    # Zustand stores
│   │   └── cartStore.ts          # Store carrello (localStorage)
│   ├── data/                     # Dati mock (da sostituire con DB)
│   │   ├── mockProducts.ts       # Prodotti mock
│   │   ├── mockOrders.ts         # Ordini mock
│   │   └── mockArticles.ts       # Articoli blog mock
│   ├── utils/                    # Utility functions
│   │   ├── order.ts              # generateOrderNumber, etc.
│   │   └── utils.ts              # Utility generiche
│   ├── validations/              # Schema Zod
│   │   ├── checkout.ts           # Validazione checkout
│   │   └── upload.ts             # Validazione upload
│   ├── rateLimit.ts              # Rate limiting API
│   └── errors.ts                 # Error handling
├── types/                        # TypeScript types
│   ├── order.ts                  # Order, OrderItem, OrderStatus
│   └── article.ts                # Article type
├── middleware.ts                 # Next.js middleware (i18n routing)
└── messages/                     # File traduzioni JSON
    ├── it.json
    ├── en.json
    ├── es.json
    ├── rs.json
    └── cn.json
```

---

## 📊 STRUTTURA DATI

### Product (Prodotto)
```typescript
interface Product {
  id: string                    // ID univoco prodotto
  name: string                  // Nome prodotto
  description: string           // Descrizione completa
  price: number                 // Prezzo in euro (es. 85.00)
  images: string[]              // Array URL immagini
  category: string              // Slug categoria (es. "gioielleria")
  inStock: boolean              // Disponibilità (true/false)
  slug: string                 // URL slug (es. "ciondolo-ceramica-artigianale")
  featured?: boolean            // Prodotto in evidenza (opzionale)
}
```

**Categorie Prodotti:**
- `gioielleria` - Gioielleria (ciondoli, orecchini, bracciali)
- `set-e-kit` - Set e Kit (confezioni, box regalo)
- `collezionismo` - Collezionismo (pezzi unici, limitati)
- `piatti` - Piatti e Oggetti d'Uso (piatti singoli, ciotole, vasi)
- `eventi-e-regali` - Eventi e Regali (laurea, matrimonio, funeraria)

**File**: `src/lib/data/mockProducts.ts`

---

### Category (Categoria)
```typescript
interface Category {
  id: string                    // ID categoria
  name: string                  // Nome categoria
  description: string           // Descrizione categoria
  image: string                 // URL immagine categoria
  slug: string                  // Slug URL (es. "gioielleria")
}
```

**File**: `src/lib/data/mockProducts.ts` (esportato come `categories`)

---

### Order (Ordine)
```typescript
type OrderStatus = 
  | 'pending'      // In attesa pagamento
  | 'paid'         // Pagato
  | 'processing'   // In lavorazione
  | 'shipped'      // Spedito
  | 'delivered'    // Consegnato
  | 'cancelled'    // Cancellato

interface OrderItem {
  productId: string             // ID prodotto
  name: string                  // Nome prodotto al momento ordine
  price: number                 // Prezzo unitario al momento ordine
  quantity: number              // Quantità ordinata
  type: 'standard' | 'custom'  // Tipo prodotto
  configuration?: Record<string, any>  // Configurazione (per custom)
  imageUrls?: string[]          // URL immagini (per custom)
}

interface Order {
  id: string                    // ID ordine (es. "order_1234567890")
  orderNumber: string            // Numero ordine (es. "ORD-20240115-0001")
  email: string                 // Email cliente
  items: OrderItem[]            // Array prodotti ordinati
  total: number                 // Totale ordine
  status: OrderStatus           // Stato ordine
  paymentIntentId: string       // Stripe Payment Intent ID
  createdAt: Date              // Data creazione
  updatedAt: Date              // Data ultimo aggiornamento
  shippingAddress?: Address     // Indirizzo spedizione (opzionale)
  customProductConfig?: Record<string, any>  // Config prodotto custom
}
```

**File**: `src/types/order.ts`, `src/app/api/orders/route.ts`

**Nota**: Attualmente gli ordini sono salvati in-memory (array). In produzione serve database (Supabase/PostgreSQL).

---

### CartItem (Item Carrello)
```typescript
interface CartItem {
  id: string                    // ID prodotto
  name: string                  // Nome prodotto
  price: number                 // Prezzo unitario
  quantity: number              // Quantità
  image: string                 // URL immagine
  type: 'standard' | 'custom'   // Tipo prodotto
  configuration?: Record<string, any>  // Configurazione (per custom)
}
```

**File**: `src/lib/store/cartStore.ts`

**Persistenza**: localStorage (Zustand con persist middleware)

---

## 🔄 FLUSSO ORDINI

### 1. Aggiunta al Carrello
- Utente clicca "Aggiungi al Carrello" su prodotto
- Prodotto aggiunto a `cartStore` (Zustand)
- Salvataggio automatico in `localStorage`

### 2. Checkout
- Utente va su `/cart`
- Clicca "Vai al Checkout"
- Chiamata API `/api/stripe/checkout` o `/api/stripe/checkout-custom`
- Stripe crea Checkout Session
- Redirect a Stripe Checkout

### 3. Pagamento Completato
- Stripe webhook chiama `/api/webhooks/stripe`
- Webhook verifica `checkout.session.completed`
- Chiamata API `/api/orders` (POST) per creare ordine
- Ordine salvato con status `pending` → `paid`

### 4. Success Page
- Utente reindirizzato a `/checkout/success`
- Mostra numero ordine e riepilogo

---

## 💳 INTEGRAZIONE STRIPE

### Checkout Standard
**Endpoint**: `POST /api/stripe/checkout`

**Input**:
```typescript
{
  items: CartItem[]  // Array prodotti carrello
}
```

**Output**: Stripe Checkout Session URL

### Checkout Custom (Prodotto Personalizzato)
**Endpoint**: `POST /api/stripe/checkout-custom`

**Input**:
```typescript
{
  price: number                    // Prezzo calcolato
  configuration: Record<string, any>  // Configurazione prodotto
  imageUrls: string[]              // URL immagini caricate
}
```

**Output**: Stripe Checkout Session URL con metadata

### Webhook Stripe
**Endpoint**: `POST /api/webhooks/stripe`

**Eventi gestiti**:
- `checkout.session.completed` - Crea ordine dopo pagamento

**Sicurezza**: Verifica signature Stripe con `STRIPE_WEBHOOK_SECRET`

---

## 🎨 DESIGN SYSTEM

### Colori
- **Primary**: `#663399` (Viola) - Colore principale brand
- **Accent**: `#c45824` (Terracotta) - Hover bottoni, CTA
- **Ceramic Beige**: `#E8D5C4` - Sfondo categorie
- **Ceramic Sand**: `#D4C4B0` - Gradienti
- **Ceramic White**: `#F5F1ED` - Sfondo sezioni
- **Background Site**: `#ffffff` (bianco) - Sfondo generale sito (CSS variable `--site-background`)

### Font
- **Serif**: `Playfair Display` - Titoli, heading
- **Sans**: `Inter` - Testo corpo, UI

### Border Radius
- **Artistic**: `rounded-artistic` (custom Tailwind class) - Border radius personalizzato per design artistico

### Componenti UI
- **Button**: Varianti `primary`, `outline`, `ghost`
- **Input**: Styled con focus ring primary
- **Modal**: Backdrop blur, slide-up animation

---

## 🌐 MULTILINGUA (i18n)

### Lingue Supportate
- `it` - Italiano (default)
- `en` - Inglese
- `es` - Spagnolo
- `rs` - Serbo
- `cn` - Cinese

### Routing
- Route formato: `/[locale]/shop`, `/[locale]/cart`, etc.
- Middleware gestisce routing automatico
- File traduzioni in `messages/[locale].json`

### Hook
```typescript
const t = useTranslations('shop')  // Namespace traduzioni
t('addToCart')  // "Aggiungi al Carrello"
```

---

## 🔍 FUNZIONALITÀ ESISTENTI

### ✅ Implementate
1. **Homepage** - Hero, categorie, prodotti in evidenza, sezione personalizzazione, chi siamo, CTA
2. **Shop** - Lista prodotti, filtri categoria, ricerca
3. **Prodotto Singolo** - Gallery immagini, info prodotto, aggiunta carrello
4. **Carrello** - Gestione items, quantità, totale, checkout
5. **Checkout Stripe** - Pagamento standard e custom
6. **Ordini** - Creazione ordine, tracking stato, webhook Stripe
7. **News/Blog** - Lista articoli, dettaglio articolo
8. **Contatto** - Form popup con apertura Gmail precompilato
9. **Ricerca** - Barra ricerca con autocomplete (prodotti, categorie, pagine)
10. **Social Icons** - WhatsApp, Instagram, TikTok in header

### ⚠️ Mock Data
- Prodotti: `src/lib/data/mockProducts.ts` (array statico)
- Ordini: In-memory array in `src/app/api/orders/route.ts`
- Articoli: `src/lib/data/mockArticles.ts`

**Nota**: Pronto per integrazione database (Supabase/PostgreSQL)

---

## 📦 GESTIONE CARRELLO

### Store Zustand
**File**: `src/lib/store/cartStore.ts`

**Funzioni**:
- `addItem(item)` - Aggiungi prodotto
- `removeItem(id)` - Rimuovi prodotto
- `updateQuantity(id, quantity)` - Aggiorna quantità
- `clearCart()` - Svuota carrello
- `getTotal()` - Calcola totale

**Persistenza**: `localStorage` (automatica con Zustand persist)

---

## 🔐 SICUREZZA & PERFORMANCE

### Rate Limiting
- **File**: `src/lib/rateLimit.ts`
- Limite 100 ordini/giorno (da implementare completamente)

### Validazione
- **Zod schemas** in `src/lib/validations/`
- Validazione client e server

### Error Handling
- Error boundaries
- Loading states
- Error messages user-friendly

---

## 🚀 DEPLOY

### Vercel
- Build automatico da Git
- Environment variables:
  - `STRIPE_SECRET_KEY`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_APP_URL`
  - `NEXT_PUBLIC_CONTACT_EMAIL`

### Build
```bash
npm run build
npm run start
```

---

## 📝 NOTE IMPORTANTI PER INTEGRAZIONE MAGAZZINO

### Dati Prodotti Attuali
- **Stock**: Solo `inStock: boolean` (true/false)
- **Quantità**: Non tracciata (solo disponibile/non disponibile)
- **Location**: Non presente
- **Movimenti**: Non tracciati

### Ordini Attuali
- **Items**: Contengono `productId`, `name`, `price`, `quantity`
- **Status**: Tracking base (pending → paid → processing → shipped → delivered)
- **Inventory Update**: Non implementato (non si aggiorna stock dopo ordine)

### Cosa Serve per Magazzino
1. **Schema Database**:
   - Tabella `products` con campi: `id`, `name`, `price`, `stock_quantity`, `location`, `category`
   - Tabella `inventory_movements` per tracciare movimenti (entrate/uscite)
   - Tabella `warehouses` o `locations` per ubicazioni magazzino

2. **API Endpoints**:
   - `GET /api/inventory` - Lista prodotti con stock
   - `GET /api/inventory/[id]` - Dettaglio stock prodotto
   - `POST /api/inventory/movement` - Registra movimento (entrata/uscita)
   - `PUT /api/inventory/[id]` - Aggiorna quantità stock

3. **Integrazione Ordini**:
   - Quando ordine passa a `paid` → decrementa stock prodotti
   - Quando ordine `cancelled` → incrementa stock prodotti
   - Validazione stock prima checkout (verificare disponibilità)

4. **UI Admin**:
   - Dashboard stock
   - Gestione movimenti
   - Alert stock basso
   - Report inventario

---

## 🔗 FILE CHIAVE DA MODIFICARE PER MAGAZZINO

1. **`src/lib/data/mockProducts.ts`** - Aggiungere campo `stock` a `Product`
2. **`src/types/order.ts`** - Eventuali nuovi tipi per inventory
3. **`src/app/api/orders/route.ts`** - Integrare decremento stock
4. **`src/app/api/webhooks/stripe/route.ts`** - Aggiornare stock dopo pagamento
5. **`src/components/shop/ProductCard.tsx`** - Mostrare stock disponibile
6. **`src/components/shop/AddToCartButton.tsx`** - Validare stock prima aggiunta

---

## 📞 CONTATTI & SUPPORTO

**Email**: Configurabile via `NEXT_PUBLIC_CONTACT_EMAIL` (default: `info@unika-ceramiche.it`)

**Form Contatto**: Popup modale che apre Gmail con dati precompilati

---

**Ultimo aggiornamento**: Gennaio 2024
**Versione Progetto**: 0.1.0
