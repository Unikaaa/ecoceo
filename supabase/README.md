# 🗄️ Database Supabase - UNIKA

## 📋 Spiegazione del Modello Dati

### Architettura Generale

Il database è strutturato in **3 tabelle principali** che gestiscono ordini e magazzino per UNIKA:

1. **`inventory`** - Magazzino prodotti (fonte di verità per disponibilità)
2. **`orders`** - Ordini clienti (testata ordine)
3. **`order_items`** - Righe ordine (dettaglio prodotti)

### 🔗 Relazioni

```
orders (1) ──→ (N) order_items
inventory (1) ──→ (N) order_items
```

- Un **ordine** può contenere **più righe ordine** (prodotti)
- Un **prodotto in magazzino** può essere referenziato da **più righe ordine** (stesso prodotto in ordini diversi)
- Ogni **riga ordine** è collegata a **un ordine** e **un prodotto in magazzino**

### 📦 Tabella `inventory` (Magazzino)

**Scopo**: Contenitore centralizzato di prodotti e quantità disponibili.

**Caratteristiche**:
- `product_code`: Codice univoco prodotto (es. "CER-001")
- `quantity`: Quantità disponibile (condivisa tra tutti gli ordini)
- `is_customizable`: Indica se il prodotto può essere personalizzato
- Quando un ordine viene creato, le righe referenziano `inventory.id` ma **NON** decrementano automaticamente la quantità (gestione manuale o tramite trigger futuri)

**Vantaggi**:
- Un solo punto di verità per disponibilità
- Facile gestione stock centralizzato
- Supporto prodotti standard e personalizzabili

### 🧾 Tabella `orders` (Ordini)

**Scopo**: Testata ordine con informazioni cliente e totale.

**Caratteristiche**:
- `order_number`: Generato automaticamente (ORD-YYYY-XXXX)
- `order_status`: Stato ordine (open → closed → completed)
- `invoice_done`: Flag per fatturazione
- `email` e `phone`: Opzionali (alcuni clienti potrebbero non fornirli)

**Workflow**:
1. Ordine creato con status `open` dopo pagamento Stripe
2. Gestione produzione → status `closed`
3. Spedizione completata → status `completed`

### 📦 Tabella `order_items` (Righe Ordine)

**Scopo**: Dettaglio prodotti di ogni ordine.

**Caratteristiche**:
- `inventory_id`: Riferimento al prodotto in magazzino
- `is_custom`: Indica se questa specifica riga è personalizzata
- `availability_status`: Stato disponibilità al momento dell'ordine (snapshot)
- `production_status`: Stato produzione (to_create → in_processing → ready_to_ship)
- `shipping_status`: Stato spedizione (not_shipped → processing → shipped)
- `tracking_code`: Codice tracciamento (popolato quando spedito)

**Workflow per ogni riga**:
1. Creata con `production_status = 'to_create'` e `shipping_status = 'not_shipped'`
2. Produzione inizia → `production_status = 'in_processing'`
3. Prodotto pronto → `production_status = 'ready_to_ship'`
4. Spedizione in corso → `shipping_status = 'processing'`
5. Spedito → `shipping_status = 'shipped'` + `tracking_code` popolato

## 🔒 Integrità Dati

### Constraints Implementati

1. **Foreign Keys**:
   - `order_items.order_id` → `orders.id` (CASCADE delete)
   - `order_items.inventory_id` → `inventory.id` (RESTRICT delete - previene eliminazione prodotto con ordini attivi)

2. **Check Constraints**:
   - `quantity >= 0` (inventory)
   - `price >= 0` (inventory, orders, order_items)
   - `weight >= 0` (order_items)

3. **Unique Constraints**:
   - `orders.order_number` (univoco)

4. **NOT NULL**:
   - Campi obbligatori come specificato nel prompt

### Row Level Security (RLS)

- **Lettura**: Utenti autenticati possono vedere ordini e magazzino
- **Scrittura**: Solo `service_role` può inserire/aggiornare (tramite API server-side)

## 🚀 Future Estensioni

### 1. Gestione Stock Automatica
```sql
-- Trigger per decrementare quantity quando ordine creato
-- Trigger per incrementare quantity quando ordine cancellato
```

### 2. Storico Movimenti
```sql
-- Tabella inventory_movements per tracciare ogni variazione stock
```

### 3. Integrazione Stripe
```sql
-- Campo stripe_payment_intent_id in orders
-- Campo stripe_customer_id per clienti ricorrenti
```

### 4. Fatturazione
```sql
-- Tabella invoices collegata a orders
-- Campo invoice_number, invoice_date, etc.
```

### 5. Notifiche
```sql
-- Tabella notifications per alert produzione/spedizione
```

### 6. Analytics
```sql
-- View materializzate per report vendite
-- Statistiche per sezione/prodotto
```

## 📝 Note Implementative

1. **Order Number**: Generato automaticamente con formato `ORD-YYYY-XXXX` (es. ORD-2024-0001)

2. **Timestamps**: `created_at` e `updated_at` gestiti automaticamente tramite trigger

3. **Custom Products**: Prodotti personalizzati hanno `is_custom = true` in `order_items`, ma possono comunque referenziare un `inventory_id` se il prodotto base esiste

4. **Quantity Management**: La quantità in `inventory` è condivisa. Per decrementarla quando un ordine viene creato, implementare un trigger o gestirlo via API

5. **Production Workflow**: Gli stati `production_status` e `shipping_status` permettono tracking completo del ciclo di vita prodotto

## 🧠 Logica Magazzino (Post-Pagamento)

Nel file `supabase/inventory_logic.sql` trovi due funzioni **atomiche** (transazionali) per gestire lo stock:

- `process_paid_order(order_id UUID)`: scala lo stock (1 unità per riga ordine) e imposta `availability_status` / `production_status` su `order_items`
- `process_cancelled_order(order_id UUID)`: ripristina lo stock (1 unità per riga ordine) e aggiorna `availability_status`

> Nota: lo schema attuale non prevede `order_items.quantity`, quindi la logica scala/ripristina **sempre 1** per riga. Se serviranno quantità variabili, aggiungere `quantity` a `order_items` e aggiornare le funzioni.

## 🔧 Utilizzo

1. **Eseguire lo schema**:
   ```sql
   -- Copia e incolla il contenuto di schema.sql nel SQL Editor di Supabase
   ```

2. **Creare ordine dopo pagamento Stripe**:
   ```sql
   -- Inserire ordine con order_number generato automaticamente
   -- Inserire righe ordine collegate
   ```

3. **Aggiornare stati**:
   ```sql
   -- Aggiornare production_status e shipping_status durante workflow
   ```
