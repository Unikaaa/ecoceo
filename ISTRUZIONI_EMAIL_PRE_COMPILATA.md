# 📧 Istruzioni: Email Pre-compilata per Notifiche Prodotto

## ✅ Cosa è stato implementato

### 1. **Pre-compilazione Email con localStorage**
- Quando un cliente inserisce la sua email per un prodotto, viene salvata in `localStorage`
- La prossima volta che lo stesso cliente apre il modal per lo stesso prodotto, l'email è già pre-compilata
- Chiave utilizzata: `notification_email_${product_id}`

### 2. **Vincolo UNIQUE su Supabase**
- La tabella `product_notifications` ha già un vincolo `UNIQUE(product_id, email)`
- Questo impedisce di inserire la stessa email due volte per lo stesso prodotto
- Il vincolo è definito nel file `supabase/create_product_notifications_table.sql` alla riga 17

### 3. **Gestione Duplicati nell'API**
- L'API route `/api/product-notifications` ora gestisce meglio i casi di email già esistente
- Se l'email è già registrata, ritorna un messaggio di successo (non un errore)
- Se la notifica era già stata inviata (`notified = true`), viene resettata per permettere una nuova notifica

## 📁 File Modificati

### 1. `src/components/shop/ProductNotification.tsx`
- ✅ Aggiunto `useEffect` per caricare email da `localStorage` quando il modal si apre
- ✅ Salvataggio email in `localStorage` dopo invio con successo
- ✅ L'email rimane visibile dopo l'invio (non viene svuotata)

### 2. `src/app/api/product-notifications/route.ts`
- ✅ Migliorata gestione dei duplicati
- ✅ Verifica se esiste già una notifica prima di inserirla
- ✅ Se esiste già, ritorna successo invece di errore
- ✅ Gestione del caso in cui la notifica era già stata inviata (reset)

## 🔍 Verifica Vincolo UNIQUE su Supabase

### Controlla se il vincolo esiste:
1. Vai su **Supabase Dashboard** → **Table Editor** → `product_notifications`
2. Clicca su **"View table structure"** o **"SQL Editor"**
3. Esegui questa query per verificare i vincoli:

```sql
SELECT 
  conname AS constraint_name,
  contype AS constraint_type,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'product_notifications'::regclass
  AND contype = 'u';  -- 'u' = UNIQUE constraint
```

### Se il vincolo NON esiste, esegui questo SQL:

```sql
-- Aggiungi vincolo UNIQUE se non esiste
ALTER TABLE product_notifications
ADD CONSTRAINT product_notifications_product_email_unique 
UNIQUE (product_id, email);
```

**Nota**: Il vincolo dovrebbe già esistere se hai eseguito `supabase/create_product_notifications_table.sql`. Se non esiste, esegui lo script SQL sopra.

## 🧪 Test della Funzionalità

### Test 1: Pre-compilazione Email
1. Apri un prodotto esaurito
2. Clicca sulla campanella
3. Inserisci un'email (es: `test@example.com`)
4. Invia la notifica
5. Chiudi il modal
6. Riapri il modal per lo stesso prodotto
7. ✅ L'email dovrebbe essere già pre-compilata

### Test 2: Vincolo UNIQUE
1. Inserisci la stessa email per lo stesso prodotto due volte
2. ✅ La seconda volta dovrebbe dire "Notifica già registrata" (non errore)
3. Verifica su Supabase che ci sia solo una riga per quella combinazione `product_id + email`

### Test 3: Email Diversa per Stesso Prodotto
1. Inserisci `email1@test.com` per un prodotto
2. Inserisci `email2@test.com` per lo stesso prodotto
3. ✅ Entrambe dovrebbero essere salvate (email diverse)

### Test 4: Stessa Email per Prodotti Diversi
1. Inserisci `test@example.com` per Prodotto A
2. Inserisci `test@example.com` per Prodotto B
3. ✅ Entrambe dovrebbero essere salvate (prodotti diversi)

## 📝 Note Tecniche

- **localStorage**: Usato per UX immediata, non richiede chiamate API
- **Vincolo UNIQUE**: Garantisce integrità dati a livello database
- **Case-insensitive**: Le email vengono salvate in lowercase (`email.trim().toLowerCase()`)
- **Persistenza**: L'email in localStorage persiste anche dopo chiusura browser (fino a quando non viene cancellata manualmente)

## 🚨 Troubleshooting

### Problema: Email non viene pre-compilata
- **Causa**: `localStorage` potrebbe essere disabilitato o bloccato
- **Soluzione**: Verifica nelle impostazioni del browser che `localStorage` sia abilitato

### Problema: Errore "duplicate key value violates unique constraint"
- **Causa**: Il vincolo UNIQUE esiste ma l'API non gestisce correttamente i duplicati
- **Soluzione**: Verifica che l'API route sia aggiornata con le ultime modifiche

### Problema: Email salvata ma non visibile al riaprire modal
- **Causa**: Il `product_id` potrebbe essere diverso tra le chiamate
- **Soluzione**: Verifica che `product.inventory_id` o `product.id` sia consistente
