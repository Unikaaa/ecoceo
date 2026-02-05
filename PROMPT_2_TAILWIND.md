# PROMPT 2 – TAILWIND PERSONALIZZATO

## Obiettivo
Configurare Tailwind CSS con un design system personalizzato per ceramiche artistiche.

## Design System

### Colori
```typescript
colors: {
  primary: {
    // Palette principale (es. terracotta, beige caldo)
    50: '#...',
    100: '#...',
    // ... fino a 900
    DEFAULT: '#...', // Colore principale
  },
  accent: {
    // Colore di accento (es. blu ceramico, verde)
    // Stessa struttura
  },
  ceramic: {
    // Colori specifici ceramiche (es. bianco porcellana, terracotta)
    white: '#...',
    terracotta: '#...',
    // ...
  }
}
```

### Typography
```typescript
fontFamily: {
  serif: ['Playfair Display', 'Georgia', 'serif'], // Titoli
  sans: ['Inter', 'system-ui', 'sans-serif'],      // Testo
}
```

### Border Radius
```typescript
borderRadius: {
  'none': '0',
  'sm': '0.125rem',
  DEFAULT: '0.5rem',
  'md': '0.75rem',
  'lg': '1rem',
  'xl': '1.5rem',
  '2xl': '2rem',
  'artistic': '0.75rem', // Custom per design artistico
  'full': '9999px',
}
```

### Spacing Custom
- Sistema coerente per padding/margin
- Valori aggiuntivi se necessari per design

## File da Modificare
- `tailwind.config.ts` - Estendere tema con custom values
- `src/app/globals.css` - Variabili CSS custom, @layer base/components/utilities

## Note
- Mantenere coerenza con design artistico
- Colori ispirati a ceramiche (terracotta, porcellana, smalti)
- Font serif elegante per titoli
- Border radius più morbidi per estetica artistica
