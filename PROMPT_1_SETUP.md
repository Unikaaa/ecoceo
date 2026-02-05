# PROMPT 1 – SETUP PROGETTO

## Obiettivo
Creare la struttura iniziale di un progetto Next.js 14 con App Router, TypeScript e Tailwind CSS.

## Struttura da Creare

### File di Configurazione
- `package.json` - Dipendenze e scripts
- `tsconfig.json` - Configurazione TypeScript
- `tailwind.config.ts` - Configurazione Tailwind
- `postcss.config.js` - Config PostCSS
- `next.config.js` - Config Next.js
- `.env.local.example` - Template variabili ambiente
- `.gitignore` - File da ignorare

### Struttura Cartelle
```
src/
├── app/
│   ├── layout.tsx         # Root layout con metadata
│   ├── page.tsx           # Root page (redirect a [locale])
│   ├── globals.css        # Stili globali + Tailwind
│   └── [locale]/
│       ├── layout.tsx     # Layout con Header/Footer
│       └── page.tsx       # Home page
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
└── lib/
    └── utils.ts           # Utility functions
```

## Dipendenze Principali
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0"
}
```

## Layout Base
- **Root Layout**: Metadata, font loading, providers globali
- **Header**: Logo, navigazione, carrello icon, language switcher
- **Footer**: Link utili, social, copyright

## Note Implementazione
- Usare `src/` come root directory
- Configurare path aliases in tsconfig.json
- Setup Tailwind con @tailwind directives in globals.css
- Header e Footer devono essere responsive
