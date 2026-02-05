-- ============================================
-- UNIKA - AGGIUNTA CAMPI IDEMPOTENZA WEBHOOK
-- Esegui questo PRIMA di usare il webhook
-- ============================================

-- Aggiungi campi per tracciare pagamenti Stripe (idempotenza)
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Crea indici per ricerca rapida
CREATE INDEX IF NOT EXISTS idx_orders_payment_intent ON orders(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(stripe_session_id) WHERE stripe_session_id IS NOT NULL;

-- Aggiungi constraint UNIQUE per evitare duplicati
-- Nota: UNIQUE permette NULL, quindi più ordini possono avere NULL
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'orders_stripe_payment_intent_id_unique'
  ) THEN
    CREATE UNIQUE INDEX orders_stripe_payment_intent_id_unique 
    ON orders(stripe_payment_intent_id) 
    WHERE stripe_payment_intent_id IS NOT NULL;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'orders_stripe_session_id_unique'
  ) THEN
    CREATE UNIQUE INDEX orders_stripe_session_id_unique 
    ON orders(stripe_session_id) 
    WHERE stripe_session_id IS NOT NULL;
  END IF;
END $$;

COMMENT ON COLUMN orders.stripe_payment_intent_id IS 'ID del Payment Intent Stripe per idempotenza webhook';
COMMENT ON COLUMN orders.stripe_session_id IS 'ID della Checkout Session Stripe per idempotenza webhook';
