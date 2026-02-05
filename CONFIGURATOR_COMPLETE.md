# 🎨 Configuratore UNIKA - Documentazione Completa

## ✅ Cosa è stato implementato

### 1. **Schema Database** ✅
- File: `supabase/configurator_schema.sql`
- Tabelle create:
  - `categories` - Categorie (Funeraria, Ricordo, Artistica)
  - `product_types` - Tipi prodotto (Ovale, Quadrata, Rettangolare)
  - `styles` - Stili (Alla romana, Moderna, Classica, Minimal)
  - `sizes` - Dimensioni con prezzi base
  - `decorations` - Decorazioni disponibili
  - `backgrounds` - Sfondi disponibili
  - `configurations` - Configurazioni salvate

### 2. **Route Configuratore** ✅
- `/configura` - Pagina principale configuratore
- Progress bar con 6 step
- Gestione stato con session storage
- Autosave configurazione

### 3. **Step Implementati** ✅

#### Step 1 - Categorie ✅
- Componente: `Step1Category.tsx`
- API: `/api/configurator/categories`
- Selezione categoria con preview

#### Step 2 - Tipi Prodotto ✅
- Componente: `Step2ProductType.tsx`
- API: `/api/configurator/product-types`
- Filtro per categoria selezionata

#### Step 3 - Stili ✅
- Componente: `Step3Style.tsx`
- API: `/api/configurator/styles`
- Preview stili con prezzi extra

#### Step 4 - Personalizzazione ✅
- Componente: `Step4Customization.tsx`
- Selezione dimensione
- Upload immagini (placeholder)
- Testo personalizzato (font, colore, dimensione)
- Calcolo prezzo in tempo reale

#### Step 5 - Anteprima ✅
- Componente: `Step5Preview.tsx`
- Canvas editor (placeholder)

#### Step 6 - Checkout ✅
- Componente: `Step6Checkout.tsx`
- Riepilogo configurazione
- Integrazione Stripe (da completare)

### 4. **Logica Pricing** ✅
- File: `src/lib/configurator/pricing.ts`
- Calcolo dinamico:
  - Prezzo base (dimensione)
  - Prezzo extra stile
  - Prezzo extra sfondo
  - Prezzo extra decorazioni
- Componente: `PriceCalculator.tsx`

### 5. **API Routes** ✅
- `/api/configurator/categories` - GET categorie
- `/api/configurator/product-types` - GET tipi prodotto
- `/api/configurator/styles` - GET stili
- `/api/configurator/save` - POST salvataggio configurazione

---

## 🚧 Da completare

### 1. **API Routes mancanti**
- [ ] `/api/configurator/sizes` - GET dimensioni
- [ ] `/api/configurator/sizes/[id]` - GET singola dimensione
- [ ] `/api/configurator/decorations` - GET decorazioni
- [ ] `/api/configurator/backgrounds` - GET sfondi
- [ ] `/api/configurator/styles/[id]` - GET singolo stile
- [ ] `/api/configurator/pricing` - POST calcolo prezzo

### 2. **Canvas Editor**
- [ ] Implementare con Fabric.js o Konva.js
- [ ] Drag & drop elementi
- [ ] Resize elementi
- [ ] Rotazione elementi
- [ ] Layer management
- [ ] Undo/Redo
- [ ] Zoom in/out

### 3. **Upload Immagini**
- [ ] Upload su Supabase Storage
- [ ] Validazione dimensioni
- [ ] Compressione immagini
- [ ] Preview immediata

### 4. **Step 4 - Decorazioni e Sfondi**
- [ ] Selezione decorazioni
- [ ] Selezione sfondi
- [ ] Preview decorazioni/sfondi

### 5. **Checkout Stripe**
- [ ] Creare endpoint `/api/stripe/checkout-custom`
- [ ] Passare configurazione a Stripe
- [ ] Gestire webhook per completamento ordine
- [ ] Aggiornare status configurazione

### 6. **Dashboard Admin**
- [ ] Route `/dashboard/configuratore`
- [ ] CRUD Categorie
- [ ] CRUD Tipi Prodotto
- [ ] CRUD Stili
- [ ] CRUD Dimensioni
- [ ] CRUD Decorazioni
- [ ] CRUD Sfondi
- [ ] Drag & drop per ordinamento
- [ ] Autosave

---

## 📚 Librerie Consigliate

### Canvas Editor
```bash
npm install fabric
# oppure
npm install konva react-konva
```

### Drag & Drop (Dashboard)
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
# oppure
npm install react-beautiful-dnd
```

### Upload Immagini
```bash
npm install react-dropzone
```

---

## 🎯 Prossimi Step

### Priorità Alta
1. Completare API routes mancanti
2. Implementare upload immagini su Supabase Storage
3. Implementare canvas editor con Fabric.js
4. Completare checkout Stripe

### Priorità Media
5. Aggiungere decorazioni e sfondi in Step 4
6. Implementare dashboard admin base
7. Aggiungere validazioni form

### Priorità Bassa
8. Ottimizzazioni performance
9. Aggiungere animazioni
10. Migliorare UX mobile

---

## 🔧 Setup

### 1. Esegui schema database
```sql
-- Supabase Dashboard → SQL Editor
-- Esegui: supabase/configurator_schema.sql
```

### 2. Installa dipendenze (se necessario)
```bash
npm install fabric
# oppure
npm install konva react-konva
```

### 3. Configura variabili ambiente
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
SUPABASE_SERVICE_ROLE_KEY=your_key
STRIPE_SECRET_KEY=your_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_key
```

### 4. Testa configuratore
1. Vai su `/configura`
2. Completa tutti gli step
3. Verifica salvataggio in Supabase

---

## 📝 Note Implementazione

### Session Storage
- Session ID salvato in `sessionStorage`
- Configurazione salvata automaticamente ad ogni step
- Recupero configurazione in caso di refresh

### Pricing
- Calcolo in tempo reale
- Aggiornamento automatico quando cambiano:
  - Dimensione
  - Stile
  - Sfondo
  - Decorazioni

### Stato Configuratore
- Gestito in `ConfiguratorState` interface
- Aggiornato con `updateState`
- Persistito in Supabase

---

## 🎨 Design

### Colori
- Primary: `#663399` (viola)
- Hover: `#552288` (viola scuro)
- Success: `#10b981` (verde)
- Background: `bg-gradient-to-br from-gray-50 via-white to-gray-100`

### Tipografia
- Titoli: `font-serif`
- Testo: `font-sans`
- Dimensioni: `text-4xl md:text-5xl` per titoli principali

---

## ✅ Checklist Finale

- [x] Schema database creato
- [x] Route configuratore creata
- [x] Step 1-6 componenti creati
- [x] Logica pricing implementata
- [x] API routes base create
- [ ] API routes complete
- [ ] Canvas editor implementato
- [ ] Upload immagini funzionante
- [ ] Checkout Stripe completo
- [ ] Dashboard admin implementata
- [ ] Test end-to-end completato

---

## 🚀 Deploy

Quando tutto è pronto:
1. Testa localmente
2. Verifica Supabase
3. Verifica Stripe
4. Deploy su Vercel
5. Configura webhook Stripe produzione

---

**Sistema pronto per essere completato e testato!** 🎉
