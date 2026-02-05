# PROMPT 4 – MULTILINGUA (i18n)

## Obiettivo
Implementare sistema multilingua con App Router usando route `/[locale]/...`

## Lingue Supportate
- `it` - Italiano (default)
- `en` - Inglese
- `es` - Spagnolo
- `rs` - Serbo
- `cn` - Cinese

## Struttura Route
```
app/
├── [locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── shop/
│   └── ...
└── layout.tsx (root)
```

## File Traduzioni
```
messages/
├── it.json
├── en.json
├── es.json
├── rs.json
└── cn.json
```

## Struttura JSON Traduzioni
```json
{
  "common": {
    "home": "Home",
    "shop": "Shop",
    "cart": "Carrello",
    "checkout": "Checkout"
  },
  "home": {
    "title": "Ceramiche Artistiche",
    "subtitle": "..."
  },
  "shop": {
    "title": "Il Nostro Shop",
    "addToCart": "Aggiungi al Carrello"
  }
}
```

## Implementazione

### 1. Middleware
**File**: `middleware.ts` (root)
- Rileva locale da header/URL
- Redirect a `/[locale]` se mancante
- Gestisce default locale (it)

### 2. Provider Traduzioni
**File**: `lib/i18n/provider.tsx`
- Context per traduzioni
- Hook `useTranslations()`
- Carica file JSON in base a locale

### 3. Hook useTranslations
```typescript
const t = useTranslations('home')
t('title') // "Ceramiche Artistiche"
```

### 4. Language Switcher
**Componente**: `components/layout/LanguageSwitcher.tsx`
- Dropdown/select per cambio lingua
- Aggiorna URL mantenendo path corrente

## Configurazione
- Middleware Next.js per routing
- Context API per stato traduzioni
- Lazy loading traduzioni se necessario
- SEO: hreflang tags in metadata

## Note
- Locale sempre in URL
- Default fallback a 'it'
- Traduzioni nested per organizzazione
- Type-safe con TypeScript
