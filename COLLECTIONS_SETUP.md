# 📋 Setup Collezioni su Supabase

## 🎯 Obiettivo
Sostituire le categorie hardcoded con una tabella `collections` su Supabase che comunica con i prodotti tramite il campo `section`.

## 📝 Passaggi per Supabase

### 1. Crea la Tabella Collections

1. Vai su **Supabase Dashboard** → https://app.supabase.com
2. Seleziona il tuo progetto
3. Vai su **SQL Editor** (menu laterale)
4. Clicca **New query**
5. Copia e incolla tutto il contenuto del file `supabase/create_collections_table.sql`
6. Clicca **Run** (o premi `Cmd+Enter` / `Ctrl+Enter`)
7. Verifica che appaia "Success. No rows returned" o un messaggio di successo

### 2. Verifica la Tabella

1. Vai su **Table Editor** (menu laterale)
2. Cerca la tabella `collections`
3. Dovresti vedere 5 collezioni già inserite:
   - Gioielleria
   - Set e Kit
   - Collezionismo
   - Piatti e Oggetti d'Uso
   - Eventi e Regali

### 3. Collega i Prodotti alle Collezioni

I prodotti nella tabella `inventory` hanno già il campo `section` che corrisponde allo `slug` delle collezioni.

**Esempio:**
- Prodotto con `section = 'set-e-kit'` → Appartiene alla collezione "Set e Kit"
- Prodotto con `section = 'gioielleria'` → Appartiene alla collezione "Gioielleria"

**Verifica:**
1. Vai su **Table Editor** → `inventory`
2. Controlla che i prodotti abbiano il campo `section` compilato
3. Il valore di `section` deve corrispondere allo `slug` di una collezione

### 4. Aggiungi Immagini alle Collezioni

1. Vai su **Table Editor** → `collections`
2. Clicca su una collezione per modificarla
3. Compila:
   - `image_url`: URL immagine principale (carica su Supabase Storage bucket `product-images`)
   - `hover_image_url`: URL immagine hover (carica su Supabase Storage bucket `product-images`)
4. Salva

**Come caricare le immagini:**
- Usa la dashboard (sezione Collezioni) che creeremo
- Oppure carica manualmente su Supabase Storage e copia l'URL

## 🔗 Come Funziona il Collegamento

### Flusso Dati:

```
COLLECTIONS (Supabase)
  ↓
  id, name, slug, image_url, hover_image_url
  ↓
INVENTORY (Supabase)
  ↓
  section (deve corrispondere a collections.slug)
  ↓
PRODOTTI (Frontend)
  ↓
  Filtro per collezione tramite section
```

### Esempio Pratico:

1. **Collezione "Set e Kit"**:
   - `slug = 'set-e-kit'`
   - `image_url = 'https://...'`
   - `hover_image_url = 'https://...'`

2. **Prodotto "Set Piatti Completo"**:
   - `section = 'set-e-kit'` ← Questo collega il prodotto alla collezione!

3. **Frontend**:
   - Mostra collezione "Set e Kit" con le sue immagini
   - Quando clicchi, filtra prodotti con `section = 'set-e-kit'`
   - Mostra solo i prodotti di quella collezione

## ✅ Checklist

- [ ] Tabella `collections` creata su Supabase
- [ ] 5 collezioni iniziali inserite
- [ ] Prodotti in `inventory` hanno `section` compilato
- [ ] I valori di `section` corrispondono agli `slug` delle collezioni
- [ ] Immagini collezioni caricate (opzionale, puoi farlo dalla dashboard)

## 🎨 Prossimi Passi

Dopo aver eseguito lo SQL, creeremo:
1. Sezione Dashboard per gestire le collezioni
2. Upload immagini collezioni (normale + hover)
3. Modifica componenti frontend per leggere da Supabase
