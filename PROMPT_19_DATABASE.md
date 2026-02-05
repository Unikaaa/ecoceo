# 🎯 PROMPT 19 – DATABASE SUPABASE (ORDINI + MAGAZZINO)

## Obiettivo
Creare il database per UNIKA – Ceramiche Artistiche su Supabase/PostgreSQL.

## Requisiti
- Database: Supabase (PostgreSQL)
- Ordini multi-prodotto
- Magazzino condiviso tra più ordini
- Supporto prodotti standard e personalizzati
- Database usato SOLO dopo pagamento riuscito

## Struttura Database

### 🧾 TABELLA ORDINI
**orders**

Campi obbligatori:
- `id` UUID PK
- `order_number` TEXT (es. ORD-2024-0001)
- `first_name` TEXT
- `last_name` TEXT
- `email` TEXT NULL
- `phone` TEXT NULL
- `address` TEXT
- `total_price` NUMERIC(10,2)
- `order_status` ENUM: `open`, `closed`, `completed`
- `invoice_done` BOOLEAN
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

### 📦 RIGHE ORDINE (PRODOTTI)
**order_items**

Ogni riga rappresenta 1 prodotto dell'ordine.

Campi:
- `id` UUID PK
- `order_id` UUID FK → orders.id
- `inventory_id` UUID FK → inventory.id
- `product_name` TEXT
- `section` TEXT (modello / kit / set)
- `is_custom` BOOLEAN
- `availability_status` ENUM: `available`, `out_of_stock`
- `price` NUMERIC(10,2)
- `weight` NUMERIC(6,2)
- `production_status` ENUM: `in_processing`, `to_create`, `ready_to_ship`
- `shipping_status` ENUM: `not_shipped`, `processing`, `shipped`
- `tracking_code` TEXT NULL
- `created_at` TIMESTAMP

### 🏭 MAGAZZINO
**inventory**

Il magazzino non è un singolo prodotto, ma un contenitore di quantità.

Campi:
- `id` UUID PK
- `product_code` TEXT
- `product_name` TEXT
- `section` TEXT
- `quantity` INTEGER
- `is_customizable` BOOLEAN
- `price` NUMERIC(10,2)
- `created_at` TIMESTAMP
- `updated_at` TIMESTAMP

### 🔗 RELAZIONI
- `orders` 1 → N `order_items`
- `inventory` 1 → N `order_items`

## Output Richiesto
1. SQL completo Supabase (ENUM, CREATE TABLE, FOREIGN KEY, INDEX)
2. Breve spiegazione testuale del modello dati
3. Note su integrità dati e future estensioni

## Note
- NON creare webhook
- NON creare API
- NON creare frontend
- NON inventare campi non richiesti
