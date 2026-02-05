# 🎯 PROMPT 20 – LOGICA MAGAZZINO DOPO ORDINE PAGATO

Sei un Backend Engineer senior esperto in Supabase (PostgreSQL) e logica transazionale.

Sto lavorando a un ecommerce artigianale chiamato **UNIKA – Ceramiche Artistiche**.  
Il database (**orders**, **order_items**, **inventory**) è già stato creato.

Ora devo definire **SOLO la logica backend** che gestisce il rapporto tra ordini e magazzino.

⚠️ Non creare frontend, UI o dashboard. Solo logica.

## 🧠 Contesto fondamentale

- Il database viene usato solo dopo pagamento Stripe riuscito
- Ogni ordine può contenere più prodotti
- Ogni prodotto è una riga in `order_items`
- Il magazzino (`inventory`) è condiviso tra più ordini
- Le quantità devono essere scalate in modo sicuro

> Nota importante: nello schema attuale `order_items` **non** ha un campo `quantity`.  
> Quindi la logica sottostante considera **1 unità per riga ordine**.  
> Se in futuro serviranno quantità > 1 per riga, sarà necessario aggiungere un campo `quantity` (non incluso qui perché non richiesto).

## 🔁 Logica principale richiesta

### 1) Quando un ordine è pagato (paid / completed)

Per ogni `order_item`:

- Recupera il record `inventory` collegato
- Scala `inventory.quantity` di 1
- Se `inventory.quantity` arriva a 0:
  - imposta `order_items.availability_status = out_of_stock` (per la riga)
- Se `order_items.is_custom = true` **oppure** il prodotto non è disponibile:
  - `order_items.production_status = to_create`
- Altrimenti:
  - `order_items.production_status = ready_to_ship` (o `in_processing`, a scelta operativa)

⚠️ Tutte le operazioni devono essere atomiche (transaction).

### 2) Quantità insufficiente

Se `inventory.quantity` è minore della quantità ordinata (qui: 1):

- bloccare l’operazione
- non applicare modifiche (rollback)
- restituire errore `INSUFFICIENT_STOCK`

### 3) Ordine annullato

Per ogni `order_item`:

- ripristina `inventory.quantity` (+1)
- imposta `order_items.availability_status = available` se la quantità torna > 0

### 4) Ordine completato / chiuso

- Nessuna modifica al magazzino (solo gestione stato amministrativo)

## 🧱 Output richiesto

1) Pseudocodice dettagliato con transazioni, step-by-step  
2) Esempio di funzione (es. `processPaidOrder(orderId)`) solo DB logic  
3) Best practice (transaction, lock, race condition)

## ❌ Cosa NON fare

- NON creare webhook Stripe
- NON creare UI o dashboard
- NON inventare nuove tabelle
- NON usare codice frontend

## ✅ Obiettivo finale

Una logica magazzino affidabile per:

- artigianato
- prodotti fisici
- personalizzazioni
- gestione manuale ordini

