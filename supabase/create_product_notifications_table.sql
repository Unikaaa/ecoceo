-- ============================================
-- TABELLA NOTIFICHE PRODOTTI ESAURITI
-- ============================================
-- Tabella per salvare le email dei clienti che vogliono essere avvisati
-- quando un prodotto esaurito torna disponibile

CREATE TABLE IF NOT EXISTS product_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES inventory(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  notified BOOLEAN NOT NULL DEFAULT false, -- Se è già stata inviata la notifica
  notified_at TIMESTAMP WITH TIME ZONE, -- Data quando è stata inviata la notifica
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Evita duplicati: stessa email per stesso prodotto
  UNIQUE(product_id, email)
);

-- Index per ricerca rapida
CREATE INDEX IF NOT EXISTS idx_product_notifications_product_id ON product_notifications(product_id);
CREATE INDEX IF NOT EXISTS idx_product_notifications_email ON product_notifications(email);
CREATE INDEX IF NOT EXISTS idx_product_notifications_notified ON product_notifications(notified) WHERE notified = false;

-- Trigger per aggiornare updated_at
CREATE OR REPLACE FUNCTION update_product_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_notifications_updated_at
  BEFORE UPDATE ON product_notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_product_notifications_updated_at();

-- Commenti
COMMENT ON TABLE product_notifications IS 'Email dei clienti che vogliono essere avvisati quando un prodotto esaurito torna disponibile';
COMMENT ON COLUMN product_notifications.product_id IS 'ID del prodotto (inventory.id)';
COMMENT ON COLUMN product_notifications.email IS 'Email del cliente che vuole essere avvisato';
COMMENT ON COLUMN product_notifications.notified IS 'Se è già stata inviata la notifica';
COMMENT ON COLUMN product_notifications.notified_at IS 'Data quando è stata inviata la notifica';

-- RLS Policies (se necessario)
ALTER TABLE product_notifications ENABLE ROW LEVEL SECURITY;

-- Policy: chiunque può inserire una notifica (per i clienti)
CREATE POLICY "Allow insert product notifications"
  ON product_notifications
  FOR INSERT
  WITH CHECK (true);

-- Policy: solo service_role può vedere le notifiche (per invio email)
CREATE POLICY "Allow select product notifications for service"
  ON product_notifications
  FOR SELECT
  USING (true);

-- Policy: solo service_role può aggiornare le notifiche
CREATE POLICY "Allow update product notifications for service"
  ON product_notifications
  FOR UPDATE
  USING (true);
