# 🐛 Debug Upload Immagini

## Problema: "Errore: il server ha restituito una risposta non valida"

### Step 1: Verifica Console Browser

1. Apri il browser → **F12** (DevTools)
2. Vai su **Console**
3. Prova a caricare un'immagine
4. Cerca messaggi che iniziano con `❌` o `Errore`

### Step 2: Verifica Console Server

1. Guarda il terminale dove gira `npm run dev`
2. Cerca messaggi che iniziano con `⚠️` o `Errore`
3. Copia gli errori che vedi

### Step 3: Verifica Bucket su Supabase

1. Vai su **Supabase Dashboard** → **Storage**
2. Verifica che esista il bucket `product-images`
3. **Screenshot**: Fai uno screenshot della lista bucket

### Step 4: Test API Diretto

Apri la console del browser (F12) e incolla questo codice:

```javascript
// Test upload API
const formData = new FormData()
const blob = new Blob(['test'], { type: 'image/jpeg' })
formData.append('files', blob, 'test.jpg')
formData.append('folder', 'products')

fetch('/api/upload', {
  method: 'POST',
  body: formData
})
.then(r => r.text())
.then(text => {
  console.log('Risposta:', text)
  try {
    const json = JSON.parse(text)
    console.log('JSON parsato:', json)
  } catch(e) {
    console.error('Non è JSON:', e)
  }
})
.catch(err => console.error('Errore:', err))
```

Cosa vedi nella console?

### Step 5: Verifica Policy Storage

1. Vai su **Supabase Dashboard** → **Storage** → **Policies**
2. Seleziona il bucket `product-images`
3. Verifica che ci siano almeno 2 policy:
   - Una per `SELECT` (public)
   - Una per `INSERT` (service_role)

### Step 6: Verifica Variabili d'Ambiente

Nel terminale, esegui:

```bash
cat .env.local | grep SUPABASE
```

Dovresti vedere:
- `NEXT_PUBLIC_SUPABASE_URL=https://...`
- `SUPABASE_SERVICE_ROLE_KEY=eyJ...`

### Step 7: Riavvia il Server

```bash
# Ferma il server (Ctrl+C)
npm run dev
```

## Cosa Inviare per Debug

Se il problema persiste, invia:

1. **Screenshot** della lista bucket su Supabase Storage
2. **Screenshot** delle policy Storage
3. **Output della console browser** (F12 → Console)
4. **Output della console server** (terminal)
5. **Risultato del test API** (Step 4)
