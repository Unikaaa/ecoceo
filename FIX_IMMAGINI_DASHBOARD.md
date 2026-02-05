# 🔧 Fix: Caricamento Immagini Dashboard → Supabase

## Problema
- Su Supabase Dashboard vedi un campo `images` con errore "Value is an invalid array"
- Vuoi caricare immagini dalla dashboard senza inserire URL manualmente

## ✅ Soluzione

### 1. Rimuovi la colonna `images` da Supabase (se esiste)

Esegui questo SQL nel SQL Editor di Supabase:

```sql
ALTER TABLE inventory DROP COLUMN IF EXISTS images;
```

### 2. Verifica che esista solo `image_url`

La tabella `inventory` deve avere solo:
- ✅ `image_url` (TEXT, può essere NULL)
- ❌ NON deve avere `images` (array)

### 3. Crea il bucket Storage su Supabase

1. Vai su **Storage** nel menu Supabase
2. Clicca **New bucket**
3. Nome: `product-images`
4. ✅ **Public bucket**: Sì
5. Clicca **Create bucket**

### 4. Configura le Policy Storage

Vai su **Storage** → **Policies** → `product-images` e aggiungi:

**Policy per lettura pubblica:**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

**Policy per upload (service role):**
```sql
CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'product-images');
```

## 🎯 Come Funziona Ora

1. **Vai su Dashboard** → `/dashboard` → Sezione "Magazzino"
2. **Clicca "Aggiungi Prodotto"** o modifica un prodotto esistente
3. **Scorri fino a "Immagine Prodotto"**
4. **Clicca "Carica Immagine"** (NON inserire URL manualmente!)
5. **Seleziona un file** dal tuo computer
6. L'immagine viene caricata automaticamente su Supabase Storage
7. L'URL viene salvato automaticamente nel campo `image_url`
8. **Clicca "Salva Prodotto"**

## ✅ Verifica

- ✅ Non devi inserire URL manualmente
- ✅ Il pulsante "Carica Immagine" carica direttamente su Supabase Storage
- ✅ L'immagine appare nel sito automaticamente
- ✅ Non c'è più il campo `images` con errore

## 🐛 Se Non Funziona

1. **Verifica il bucket Storage**: Deve esistere `product-images` e essere pubblico
2. **Verifica le variabili d'ambiente**: `.env.local` deve avere:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. **Controlla la console del browser**: Apri DevTools (F12) → Console per vedere eventuali errori
4. **Verifica le policy Storage**: Devono permettere lettura pubblica e upload da service role
