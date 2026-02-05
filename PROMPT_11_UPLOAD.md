# PROMPT 11 – UPLOAD IMMAGINI

## Obiettivo
Implementare upload immagini per il prodotto personalizzato con validazione, preview e salvataggio temporaneo.

## Funzionalità

### 1. Validazione File
- **Tipi supportati**: JPG, PNG, WebP
- **Dimensione max**: 5MB per file
- **Dimensioni**: Min 800x800px (opzionale)
- **Validazione lato client e server**

### 2. Preview Immagini
- **Anteprima immediata** dopo selezione
- **Multiple immagini** (max 4-5)
- **Rimozione** prima dell'upload
- **Loading state** durante upload

### 3. Salvataggio Temporaneo
- **Client-side**: Base64 o Blob URL per preview
- **Server-side**: Preparato per Supabase Storage o S3
- **API route**: `/api/upload` per gestire upload

## Struttura

### Componenti
- `components/customizer/ImageUpload.tsx` - Componente upload
- `components/customizer/ImagePreview.tsx` - Preview immagini
- `app/api/upload/route.ts` - API route upload

### Validazione
```typescript
interface UploadValidation {
  maxSize: number // 5MB
  allowedTypes: string[] // ['image/jpeg', 'image/png', 'image/webp']
  maxFiles: number // 5
}
```

## Preparazione Storage

### Supabase Storage
- Bucket: `custom-products`
- Path: `temp/{userId}/{timestamp}-{filename}`
- Public URL per preview

### Alternativa: S3/Cloudinary
- Configurazione simile
- Signed URLs per upload

## Note
- Usare `FormData` per upload
- Progress indicator
- Error handling robusto
- Cleanup file temporanei dopo 24h
