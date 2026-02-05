-- ============================================
-- UNIKA - DATABASE SUPABASE
-- Schema per Ordini e Magazzino
-- ============================================

-- ============================================
-- ENUM TYPES
-- ============================================

-- Stato dell'ordine
CREATE TYPE order_status AS ENUM (
  'open',
  'closed',
  'completed'
);

-- Stato disponibilità prodotto
CREATE TYPE availability_status AS ENUM (
  'available',
  'out_of_stock'
);

-- Stato produzione
CREATE TYPE production_status AS ENUM (
  'in_processing',
  'to_create',
  'ready_to_ship'
);

-- Stato spedizione
CREATE TYPE shipping_status AS ENUM (
  'not_shipped',
  'processing',
  'shipped'
);

-- Stato contatto
CREATE TYPE contact_status AS ENUM (
  'unread',
  'read',
  'completed'
);

-- ============================================
-- TABELLA MAGAZZINO (inventory)
-- ============================================

CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  section TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  is_customizable BOOLEAN NOT NULL DEFAULT false,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index per ricerca rapida
CREATE INDEX idx_inventory_product_code ON inventory(product_code);
CREATE INDEX idx_inventory_section ON inventory(section);
CREATE INDEX idx_inventory_customizable ON inventory(is_customizable);

-- Commenti tabelle
COMMENT ON TABLE inventory IS 'Magazzino prodotti UNIKA - contenitore di quantità condiviso tra ordini';
COMMENT ON COLUMN inventory.product_code IS 'Codice univoco prodotto';
COMMENT ON COLUMN inventory.section IS 'Sezione prodotto (modello / kit / set)';
COMMENT ON COLUMN inventory.quantity IS 'Quantità disponibile in magazzino';
COMMENT ON COLUMN inventory.is_customizable IS 'Indica se il prodotto può essere personalizzato';

-- ============================================
-- TABELLA ORDINI (orders)
-- ============================================

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT NOT NULL,
  total_price NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
  order_status order_status NOT NULL DEFAULT 'open',
  invoice_done BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index per ricerca rapida
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Commenti tabelle
COMMENT ON TABLE orders IS 'Ordini clienti UNIKA';
COMMENT ON COLUMN orders.order_number IS 'Numero ordine univoco (es. ORD-2024-0001)';
COMMENT ON COLUMN orders.order_status IS 'Stato ordine: open, closed, completed';
COMMENT ON COLUMN orders.invoice_done IS 'Indica se la fattura è stata emessa';

-- ============================================
-- TABELLA RIGHE ORDINE (order_items)
-- ============================================

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES inventory(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL,
  section TEXT NOT NULL,
  is_custom BOOLEAN NOT NULL DEFAULT false,
  availability_status availability_status NOT NULL DEFAULT 'available',
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  weight NUMERIC(6,2) CHECK (weight >= 0),
  production_status production_status NOT NULL DEFAULT 'to_create',
  shipping_status shipping_status NOT NULL DEFAULT 'not_shipped',
  tracking_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index per ricerca rapida
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_inventory_id ON order_items(inventory_id);
CREATE INDEX idx_order_items_production_status ON order_items(production_status);
CREATE INDEX idx_order_items_shipping_status ON order_items(shipping_status);
CREATE INDEX idx_order_items_tracking_code ON order_items(tracking_code) WHERE tracking_code IS NOT NULL;

-- Commenti tabelle
COMMENT ON TABLE order_items IS 'Righe ordine - prodotti associati ad un ordine';
COMMENT ON COLUMN order_items.order_id IS 'Riferimento all''ordine padre';
COMMENT ON COLUMN order_items.inventory_id IS 'Riferimento al prodotto in magazzino';
COMMENT ON COLUMN order_items.is_custom IS 'Indica se il prodotto è personalizzato';
COMMENT ON COLUMN order_items.availability_status IS 'Stato disponibilità al momento dell''ordine';
COMMENT ON COLUMN order_items.production_status IS 'Stato produzione: in_processing, to_create, ready_to_ship';
COMMENT ON COLUMN order_items.shipping_status IS 'Stato spedizione: not_shipped, processing, shipped';

-- ============================================
-- TABELLA CONTATTI (contacts)
-- ============================================

CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status contact_status NOT NULL DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index per ricerca rapida
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);

-- Commenti tabelle
COMMENT ON TABLE contacts IS 'Messaggi di contatto da clienti';
COMMENT ON COLUMN contacts.status IS 'Stato contatto: unread, read, completed';

-- ============================================
-- TRIGGER per updated_at automatico
-- ============================================

-- Funzione per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger per inventory
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger per contacts
CREATE TRIGGER update_contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNZIONE per generare order_number automatico
-- ============================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  order_num TEXT;
BEGIN
  -- Estrai anno corrente
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  -- Trova il numero sequenziale per l'anno corrente
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 10) AS INTEGER)), 0) + 1
  INTO sequence_num
  FROM orders
  WHERE order_number LIKE 'ORD-' || year_part || '-%';
  
  -- Genera numero ordine: ORD-YYYY-XXXX
  order_num := 'ORD-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- POLITICHE RLS (Row Level Security)
-- ============================================

-- Abilita RLS su tutte le tabelle
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy per orders (solo lettura per utenti autenticati, scrittura per service role)
CREATE POLICY "Orders are viewable by authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Orders are insertable by service role"
  ON orders FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Orders are updatable by service role"
  ON orders FOR UPDATE
  TO service_role
  USING (true);

-- Policy per order_items
CREATE POLICY "Order items are viewable by authenticated users"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Order items are insertable by service role"
  ON order_items FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Order items are updatable by service role"
  ON order_items FOR UPDATE
  TO service_role
  USING (true);

-- Policy per inventory
CREATE POLICY "Inventory is viewable by authenticated users"
  ON inventory FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Inventory is manageable by service role"
  ON inventory FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy per contacts
CREATE POLICY "Contacts are viewable by authenticated users"
  ON contacts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Contacts are insertable by service role"
  ON contacts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Contacts are updatable by service role"
  ON contacts FOR UPDATE
  TO service_role
  USING (true);
