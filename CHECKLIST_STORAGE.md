# ✅ Checklist: Configurazione Storage Supabase

## 🔴 ERRORE COMUNE: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

Questo errore significa che **il bucket Storage non esiste** o **non è configurato correttamente**.

## ✅ Checklist Completa

### 1. ✅ Verifica SQL (già fatto)
Hai eseguito correttamente:
```sql
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS image_url TEXT;
```

**Opzionale**: Se vuoi rimuovere la colonna `images`:
```sql
ALTER TABLE inventory DROP COLUMN IF EXISTS images;
```

### 2. 🔴 CREA IL BUCKET STORAGE (IMPORTANTE!)

1. Vai su **Supabase Dashboard** → https://app.supabase.com
2. Seleziona il tuo progetto
3. Nel menu laterale, clicca su **Storage**
4. Clicca su **New bucket** (pulsante in alto)
5. Configurazione:
   - **Name**: `product-images` (esatto, con il trattino!)
   - ✅ **Public bucket**: Sì (deve essere pubblico!)
   - **File size limit**: 5MB (o il limite che preferisci)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp`
6. Clicca **Create bucket**

### 3. 🔴 CONFIGURA LE POLICY STORAGE (IMPORTANTE!)

Dopo aver creato il bucket:

1. Vai su **Storage** → **Policies**
2. Seleziona il bucket `product-images`
3. Clicca **New Policy**

**Policy 1 - Lettura Pubblica:**
- **Policy name**: `Public Access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **Policy definition**: 
```sql
(bucket_id = 'product-images')
```

**Policy 2 - Upload Service Role:**
- **Policy name**: `Service Role Upload`
- **Allowed operation**: `INSERT`
- **Target roles**: `service_role`
- **Policy definition**:
```sql
(bucket_id = 'product-images')
```

### 4. ✅ Verifica Variabili d'Ambiente

Nel file `.env.local` (nella root del progetto):

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuo-progetto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=la-tua-service-role-key
```

**Dove trovare le chiavi:**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard → Settings → API → Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API → service_role key (secret)

### 5. ✅ Test Upload

1. Riavvia il server di sviluppo (`npm run dev`)
2. Vai su `/dashboard` → Magazzino
3. Clicca "Aggiungi Prodotto"
4. Scorri fino a "Immagine Prodotto"
5. Clicca "Carica Immagine"
6. Seleziona un'immagine

**Se funziona:**
- ✅ L'immagine viene caricata
- ✅ Vedi la preview
- ✅ Quando salvi il prodotto, l'immagine appare nel sito

**Se NON funziona:**
- 🔴 Verifica che il bucket `product-images` esista
- 🔴 Verifica che sia pubblico
- 🔴 Verifica le policy Storage
- 🔴 Controlla la console del browser (F12) per errori dettagliati

## 🐛 Troubleshooting

### Errore: "Bucket not found"
→ Il bucket `product-images` non esiste. Crealo seguendo il punto 2.

### Errore: "new row violates row-level security"
→ Le policy Storage non sono configurate. Configurale seguendo il punto 3.

### Errore: "Storage non configurato"
→ Le variabili d'ambiente non sono configurate. Verifica il punto 4.

### Errore: "Unexpected token '<'"
→ Il bucket non esiste o le policy non permettono l'accesso. Segui i punti 2 e 3.
