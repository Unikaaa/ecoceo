# PROMPT 5 – HOME PAGE

## Obiettivo
Creare Home page con Hero, categorie, prodotti in evidenza e CTA.

## Sezioni Home

### 1. Hero Section
- **Immagine di background**: Ceramiche artistiche
- **Titolo principale**: Branding forte
- **Sottotitolo**: Messaggio value proposition
- **CTA Buttons**:
  - "Esplora lo Shop" → `/shop`
  - "Crea il Tuo Prodotto" → `/customizer`

### 2. Sezione Categorie
- **Layout**: Griglia responsive (3-4 categorie)
- **Card Categoria**:
  - Immagine rappresentativa
  - Nome categoria
  - Link a `/shop?category=...`
- **Categorie esempio**:
  - Piatti e Vasi
  - Sculture
  - Accessori
  - Personalizzati

### 3. Prodotti in Evidenza
- **Titolo sezione**: "I Nostri Favoriti" / "Featured Products"
- **Layout**: Carousel o griglia (4-6 prodotti)
- **Card Prodotto**:
  - Immagine
  - Nome
  - Prezzo
  - Link a `/shop/[id]`
- **CTA**: "Vedi Tutti i Prodotti" → `/shop`

### 4. CTA Finale
- **Messaggio**: Invito all'azione
- **Buttons**: Shop e Customizer
- **Design**: Sezione con background colorato

## Design
- **Stile**: Pulito, artistico, minimal
- **Colori**: Palette design system
- **Spacing**: Generoso, respirabile
- **Immagini**: High quality, artistiche
- **Typography**: Serif per titoli, sans per testo

## File
- `app/[locale]/page.tsx` - Home page component
- `components/home/` - Componenti specifici home:
  - `Hero.tsx`
  - `Categories.tsx`
  - `FeaturedProducts.tsx`
  - `CTA.tsx`

## Dati Mock
- Categorie hardcoded per ora
- Prodotti featured da array mock
- Immagini placeholder o da public/

## Responsive
- Mobile-first approach
- Breakpoints Tailwind
- Immagini ottimizzate (next/image)
