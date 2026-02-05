# PROMPT 17 – SICUREZZA E PERFORMANCE

## Obiettivo
Aggiungere validazione input, rate limiting base API, loading e error states, best practice sicurezza Next.js.

## Sicurezza

### 1. Validazione Input
- **Client-side**: React Hook Form o Zod
- **Server-side**: Zod schema validation
- **Sanitizzazione**: Input utente
- **XSS Prevention**: React escape automatico

### 2. Rate Limiting
- **API Routes**: Limite richieste per IP
- **Libreria**: `@upstash/ratelimit` o custom
- **Limiti**: 
  - Checkout: 5/min
  - Upload: 10/min
  - Generale: 100/min

### 3. Best Practice Next.js
- **CSRF**: Next.js built-in
- **CORS**: Configurato per API
- **Env Variables**: Mai esporre secrets
- **Headers Security**: Helmet o custom headers

## Performance

### 1. Loading States
- **Skeleton**: Per liste e card
- **Spinner**: Per azioni
- **Progress**: Per upload
- **Optimistic UI**: Dove possibile

### 2. Error States
- **Error Boundaries**: React error boundaries
- **Error Pages**: 404, 500 custom
- **Toast Notifications**: Per errori utente
- **Fallback**: Contenuto alternativo

### 3. Ottimizzazioni
- **Image Optimization**: next/image
- **Code Splitting**: Automatico Next.js
- **Lazy Loading**: Componenti pesanti
- **Caching**: API responses

## Implementazione

### Rate Limiting
```typescript
// lib/rateLimit.ts
export async function rateLimit(identifier: string) {
  // Check limit
  // Return { success: boolean, remaining: number }
}
```

### Validation Schema
```typescript
// lib/validations.ts
import { z } from 'zod'

export const checkoutSchema = z.object({
  items: z.array(...),
  // ...
})
```

### Error Handling
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500
  ) {
    super(message)
  }
}
```

## Componenti

### LoadingSpinner
- Componente riutilizzabile
- Varianti: small, medium, large

### ErrorMessage
- Mostra errori utente
- Retry button opzionale

### SkeletonLoader
- Placeholder durante loading
- Match layout finale

## Headers Security
```typescript
// next.config.js
headers: async () => [
  {
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  },
]
```

## Note
- Logging errori per monitoraggio
- Monitoring (Sentry opzionale)
- Performance monitoring
- Security headers production
