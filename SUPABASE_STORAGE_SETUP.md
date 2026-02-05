# Setup Supabase Storage per Immagini Prodotti

## 📋 Passaggi per configurare il bucket Storage

### 1. Crea il bucket su Supabase Dashboard

1. Vai su [Supabase Dashboard](https://app.supabase.com)
2. Seleziona il tuo progetto
3. Vai su **Storage** nel menu laterale
4. Clicca su **New bucket**
5. Configurazione:
   - **Name**: `product-images`
   - **Public bucket**: ✅ **Sì** (per permettere accesso pubblico alle immagini)
   - **File size limit**: 5MB (o il limite che preferisci)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`

### 2. Configura le policy RLS (Row Level Security)

Dopo aver creato il bucket, vai su **Policies** e aggiungi:

#### Policy per lettura pubblica:
```sql
-- Permetti lettura pubblica delle immagini
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

#### Policy per upload (solo service role):
```sql
-- Permetti upload solo tramite service role (API)
CREATE POLICY "Service Role Upload"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'product-images');
```

### 3. Esegui la migration SQL

Esegui il file `supabase/add_image_url_to_inventory.sql` nel SQL Editor di Supabase per aggiungere i campi immagine alla tabella `inventory`.

```sql
-- Esegui questo nel SQL Editor di Supabase
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
```

### 4. Verifica le variabili d'ambiente

Assicurati che nel tuo `.env.local` ci siano:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=la-tua-service-role-key
```

## 🎯 Come funziona

1. **Upload dalla Dashboard**:
   - Vai su `/dashboard` → Sezione "Magazzino"
   - Clicca "Aggiungi Prodotto" o modifica un prodotto esistente
   - Clicca "Carica Immagine" e seleziona un file
   - L'immagine viene caricata su Supabase Storage nel bucket `product-images`
   - L'URL pubblico viene salvato nel campo `image_url` della tabella `inventory`

2. **Visualizzazione nel sito**:
   - Le immagini vengono mostrate automaticamente nei prodotti dello shop
   - Se un prodotto ha `image_url`, viene usata quella
   - Altrimenti viene mostrato un placeholder

## 📝 Note importanti

- **Dimensione massima**: 5MB per file (configurabile)
- **Formati supportati**: JPG, PNG, WebP
- **URL pubblico**: Le immagini sono accessibili pubblicamente tramite URL Supabase
- **Organizzazione**: Le immagini sono salvate in `products/{timestamp}-{random}.{ext}`

## 🔧 Troubleshooting

### Errore "Storage non configurato"
- Verifica che `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` siano configurate correttamente

### Errore "Bucket non trovato"
- Assicurati che il bucket `product-images` esista e sia pubblico

### Immagini non visibili
- Verifica che le policy RLS permettano la lettura pubblica
- Controlla che l'URL nell'`image_url` sia corretto
