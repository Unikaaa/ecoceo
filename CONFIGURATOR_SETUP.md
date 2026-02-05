# 🎨 Setup Configuratore UNIKA

## 📋 Panoramica

Sistema completo per la configurazione di fotoceramiche personalizzate con:
- Configuratore step-by-step per clienti
- Dashboard admin per gestione contenuti
- Canvas interattivo stile Canva
- Pricing dinamico
- Integrazione Stripe

---

## 🗄️ Setup Database

### 1. Esegui lo schema SQL

Vai su **Supabase Dashboard** → **SQL Editor** e esegui:

```sql
-- File: supabase/configurator_schema.sql
```

Questo creerà tutte le tabelle necessarie:
- `categories` - Categorie (Funeraria, Ricordo, Artistica, etc.)
- `product_types` - Tipi di prodotto (Ovale, Quadrata, Rettangolare)
- `styles` - Stili (Alla romana, Moderna, Classica, Minimal)
- `sizes` - Dimensioni con prezzi base
- `decorations` - Decorazioni disponibili
- `backgrounds` - Sfondi disponibili
- `configurations` - Configurazioni salvate degli utenti

### 2. Verifica le tabelle

Dopo l'esecuzione, verifica che tutte le tabelle siano state create correttamente in **Table Editor**.

---

## 🚀 Route Configuratore

### Route principale
- `/configura` - Configuratore step-by-step

### Step del configuratore:
1. **Step 1** - Scelta Categoria
2. **Step 2** - Scelta Tipo Prodotto
3. **Step 3** - Scelta Stile
4. **Step 4** - Personalizzazione (dimensioni, immagini, testo, decorazioni)
5. **Step 5** - Anteprima interattiva (Canvas)
6. **Step 6** - Checkout e pagamento

---

## 📁 Struttura File

```
src/
├── app/
│   ├── configura/
│   │   └── page.tsx          # Pagina principale configuratore
│   └── api/
│       └── configurator/
│           ├── categories/   # API categorie
│           ├── product-types/
│           ├── styles/
│           ├── sizes/
│           ├── decorations/
│           ├── backgrounds/
│           ├── save/         # Salvataggio configurazione
│           └── pricing/      # Calcolo prezzo dinamico
│
└── components/
    └── configurator/
        ├── Step1Category.tsx
        ├── Step2ProductType.tsx
        ├── Step3Style.tsx
        ├── Step4Customization.tsx
        ├── Step5Preview.tsx
        ├── Step6Checkout.tsx
        ├── CanvasEditor.tsx   # Canvas interattivo
        └── PriceCalculator.tsx
```

---

## 🎯 Prossimi Step

### Componenti da implementare:

1. **Step2ProductType** - Selezione tipo prodotto in base alla categoria
2. **Step3Style** - Selezione stile con preview
3. **Step4Customization** - Personalizzazione completa:
   - Selezione dimensione
   - Upload immagini
   - Inserimento testo
   - Selezione sfondo
   - Aggiunta decorazioni
4. **Step5Preview** - Canvas interattivo con drag & drop
5. **Step6Checkout** - Riepilogo e checkout Stripe

### Dashboard Admin:

1. **CRUD Categorie** - Gestione categorie
2. **CRUD Tipi Prodotto** - Gestione tipi prodotto
3. **CRUD Stili** - Gestione stili
4. **CRUD Dimensioni** - Gestione dimensioni e prezzi
5. **CRUD Decorazioni** - Gestione decorazioni con upload
6. **CRUD Sfondi** - Gestione sfondi con upload

---

## 💰 Logica Pricing

Il prezzo viene calcolato dinamicamente:

```
Prezzo Totale = 
  Prezzo Base (dimensione) +
  Prezzo Extra Stile +
  Prezzo Extra Sfondo +
  (Prezzo Extra Decorazione × Numero Decorazioni)
```

Esempio:
- Dimensione 20x30cm: €50 (base)
- Stile "Alla romana": +€10
- Sfondo "Marmo": +€5
- 2 Decorazioni: +€15 (€7.50 × 2)
- **Totale: €80**

---

## 🔧 Variabili d'Ambiente

Assicurati di avere in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📝 Note Implementazione

### Canvas Editor
Per il canvas interattivo, considera l'uso di:
- **Fabric.js** - Libreria canvas potente
- **Konva.js** - Alternativa leggera
- **React-Konva** - Wrapper React per Konva

### Upload Immagini
- Upload su Supabase Storage
- Validazione dimensioni e formato
- Preview immediata
- Compressione lato client (opzionale)

### Autosave
- Salvataggio automatico ad ogni step
- Recupero configurazione in caso di refresh
- Session storage per stato locale

---

## ✅ Checklist Setup

- [ ] Eseguito `configurator_schema.sql` su Supabase
- [ ] Verificate tutte le tabelle create
- [ ] Testato endpoint `/api/configurator/categories`
- [ ] Implementato Step 1 (Categorie)
- [ ] Implementato Step 2 (Tipi Prodotto)
- [ ] Implementato Step 3 (Stili)
- [ ] Implementato Step 4 (Personalizzazione)
- [ ] Implementato Step 5 (Canvas Preview)
- [ ] Implementato Step 6 (Checkout)
- [ ] Implementato Dashboard Admin
- [ ] Testato flusso completo

---

## 🎨 Design Guidelines

- **Colori principali**: `#663399` (viola), `#552288` (viola scuro)
- **Font**: Serif per titoli, Sans-serif per testo
- **Spacing**: Generoso, respirabile
- **Animazioni**: Smooth, non invasive
- **Mobile-first**: Responsive su tutti i dispositivi

---

## 🚨 Troubleshooting

### Errore "Database non configurato"
- Verifica variabili d'ambiente
- Controlla che Supabase sia accessibile

### Categorie non caricate
- Verifica RLS policies
- Controlla che `is_active = true`

### Errore salvataggio configurazione
- Verifica che tutti i campi obbligatori siano presenti
- Controlla foreign keys (category_id, product_type_id, etc.)
