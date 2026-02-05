# 📋 ISTRUZIONI COMPLETE: Setup Collezioni su Supabase

## 🎯 Obiettivo
Creare la tabella `collections` su Supabase e collegarla ai prodotti tramite il campo `section` della tabella `inventory`.

---

## 📝 STEP 1: Crea la Tabella Collections

### Passaggi:

1. **Apri Supabase Dashboard**
   - Vai su https://app.supabase.com
   - Accedi e seleziona il tuo progetto

2. **Vai su SQL Editor**
   - Nel menu laterale sinistro, clicca su **"SQL Editor"** (icona `</>`)

3. **Crea Nuova Query**
   - Clicca su **"New query"** in alto a sinistra

4. **Copia e Incolla lo Script SQL**
   - Apri il file `supabase/create_collections_table.sql` nel tuo progetto
   - **Copia TUTTO il contenuto** del file
   - **Incolla** nel SQL Editor di Supabase

5. **Esegui lo Script**
   - Clicca su **"Run"** (o premi `Cmd+Enter` su Mac / `Ctrl+Enter` su Windows)
   - Attendi il completamento

6. **Verifica il Risultato**
   - Dovresti vedere: **"Success. No rows returned"** o un messaggio di successo
   - Se vedi errori, copiali e inviameli

---

## ✅ STEP 2: Verifica la Tabella

1. **Vai su Table Editor**
   - Nel menu laterale, clicca su **"Table Editor"**

2. **Cerca la Tabella `collections`**
   - Dovresti vedere una nuova tabella chiamata `collections`

3. **Verifica le Collezioni Inserite**
   - Clicca sulla tabella `collections`
   - Dovresti vedere **5 collezioni** già inserite:
     - ✅ Gioielleria (slug: `gioielleria`)
     - ✅ Set e Kit (slug: `set-e-kit`)
     - ✅ Collezionismo (slug: `collezionismo`)
     - ✅ Piatti e Oggetti d'Uso (slug: `piatti`)
     - ✅ Eventi e Regali (slug: `eventi-e-regali`)

---

## 🔗 STEP 3: Collega i Prodotti alle Collezioni

### Come Funziona il Collegamento:

I prodotti nella tabella `inventory` hanno il campo `section` che deve corrispondere allo `slug` delle collezioni.

**Esempio:**
- Prodotto con `section = 'set-e-kit'` → Appartiene alla collezione **"Set e Kit"**
- Prodotto con `section = 'gioielleria'` → Appartiene alla collezione **"Gioielleria"**

### Verifica i Prodotti:

1. **Vai su Table Editor** → `inventory`
2. **Controlla il Campo `section`**
   - Ogni prodotto deve avere `section` compilato
   - Il valore deve corrispondere a uno `slug` di una collezione

### Se i Prodotti Non Hanno `section`:

1. **Modifica Manualmente**:
   - Clicca su un prodotto
   - Compila il campo `section` con uno degli slug delle collezioni:
     - `gioielleria`
     - `set-e-kit`
     - `collezionismo`
     - `piatti`
     - `eventi-e-regali`

2. **Oppure Usa la Dashboard**:
   - Vai su `/dashboard` → Magazzino
   - Modifica ogni prodotto
   - Seleziona la **Sezione** dal menu a tendina
   - Salva

---

## 🖼️ STEP 4: Aggiungi Immagini alle Collezioni

### Opzione A: Dalla Dashboard (Consigliato)

1. **Vai su Dashboard**
   - `/dashboard` → Scorri fino a **"Collezioni"**

2. **Modifica una Collezione**
   - Clicca **"Modifica"** su una collezione
   - Clicca **"Carica Immagine"** per l'immagine principale
   - Clicca **"Carica Immagine"** per l'immagine hover
   - Salva

### Opzione B: Manualmente su Supabase

1. **Vai su Table Editor** → `collections`
2. **Clicca su una Collezione**
3. **Compila i Campi**:
   - `image_url`: URL immagine principale
   - `hover_image_url`: URL immagine hover
4. **Salva**

**Come Ottenere gli URL:**
- Carica le immagini su Supabase Storage (bucket `product-images`)
- Copia l'URL pubblico dell'immagine
- Incollalo nel campo corrispondente

---

## 📊 STEP 5: Verifica il Collegamento

### Test Completo:

1. **Dashboard** → **Collezioni**
   - Verifica che le collezioni siano visibili
   - Modifica una collezione e aggiungi immagini

2. **Dashboard** → **Magazzino**
   - Verifica che i prodotti abbiano `section` compilato
   - Il valore di `section` deve corrispondere a uno `slug` di una collezione

3. **Frontend** → **Shop**
   - Le collezioni dovrebbero essere caricate da Supabase
   - I prodotti dovrebbero essere filtrati per collezione

---

## 🎨 Struttura Dati

### Tabella `collections`:
```
id              → UUID (chiave primaria)
name            → Nome collezione (es. "Gioielleria")
slug            → Slug URL (es. "gioielleria")
description     → Descrizione (opzionale)
image_url       → URL immagine principale
hover_image_url → URL immagine hover
display_order   → Ordine visualizzazione (0 = primo)
is_active       → Collezione attiva (true/false)
created_at      → Data creazione
updated_at      → Data ultimo aggiornamento
```

### Tabella `inventory` (già esistente):
```
section → Deve corrispondere a collections.slug
```

---

## ✅ Checklist Finale

- [ ] Tabella `collections` creata su Supabase
- [ ] 5 collezioni iniziali inserite
- [ ] Prodotti in `inventory` hanno `section` compilato
- [ ] I valori di `section` corrispondono agli `slug` delle collezioni
- [ ] Immagini collezioni caricate (opzionale, puoi farlo dalla dashboard)

---

## 🚀 Dopo il Setup

Una volta completato il setup su Supabase:

1. **Riavvia il server**: `npm run dev`
2. **Vai su Dashboard**: `/dashboard` → Sezione "Collezioni"
3. **Gestisci le Collezioni**: Aggiungi, modifica, elimina collezioni
4. **Aggiungi Immagini**: Carica immagini principale e hover
5. **Collega Prodotti**: Assicurati che i prodotti abbiano `section` corretto

Il frontend leggerà automaticamente le collezioni da Supabase invece che dal codice!
