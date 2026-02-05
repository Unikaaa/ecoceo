-- ============================================
-- UNIKA - LOGICA MAGAZZINO (POST-PAGAMENTO)
-- SOLO LOGICA DB (transaction + lock)
-- ============================================

-- Nota: nello schema attuale order_items NON ha quantity.
-- Questa logica scala/ripristina SEMPRE 1 unità per riga ordine.

-- ==========================================================
-- 1) PROCESSA ORDINE PAGATO
-- - Atomico
-- - Lock pessimista (FOR UPDATE) su righe inventory coinvolte
-- - Se stock insufficiente: RAISE EXCEPTION 'INSUFFICIENT_STOCK'
-- ==========================================================

CREATE OR REPLACE FUNCTION process_paid_order(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  oi RECORD;
  inv_qty INTEGER;
BEGIN
  -- Validazione ordine esistente (lock su ordine per evitare doppi processamenti concorrenti)
  PERFORM 1 FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  -- Itera righe ordine
  FOR oi IN
    SELECT
      id,
      inventory_id,
      is_custom
    FROM order_items
    WHERE order_id = p_order_id
    FOR UPDATE
  LOOP
    -- Lock riga inventory e leggi quantità
    SELECT quantity
    INTO inv_qty
    FROM inventory
    WHERE id = oi.inventory_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'INVENTORY_NOT_FOUND';
    END IF;

    -- Stock insufficiente (qui: serve almeno 1)
    IF inv_qty < 1 THEN
      RAISE EXCEPTION 'INSUFFICIENT_STOCK';
    END IF;

    -- Scala quantity di 1
    UPDATE inventory
    SET quantity = quantity - 1
    WHERE id = oi.inventory_id;

    -- Aggiorna availability_status della riga se, dopo lo scale, non resta stock
    -- (Nota: availability_status è su order_items, non su inventory)
    SELECT quantity INTO inv_qty FROM inventory WHERE id = oi.inventory_id;

    UPDATE order_items
    SET
      availability_status = CASE WHEN inv_qty = 0 THEN 'out_of_stock'::availability_status ELSE 'available'::availability_status END,
      production_status = CASE
        WHEN oi.is_custom = true THEN 'to_create'::production_status
        WHEN inv_qty = 0 THEN 'to_create'::production_status
        ELSE 'ready_to_ship'::production_status
      END
    WHERE id = oi.id;
  END LOOP;

  RETURN;
END;
$$;

-- ==========================================================
-- 2) PROCESSA ORDINE ANNULLATO
-- - Atomico
-- - Ripristina stock (+1 per riga)
-- - availability_status torna available se quantity > 0
-- ==========================================================

CREATE OR REPLACE FUNCTION process_cancelled_order(p_order_id UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
  oi RECORD;
  inv_qty INTEGER;
BEGIN
  PERFORM 1 FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'ORDER_NOT_FOUND';
  END IF;

  FOR oi IN
    SELECT id, inventory_id
    FROM order_items
    WHERE order_id = p_order_id
    FOR UPDATE
  LOOP
    -- Lock inventory
    SELECT quantity
    INTO inv_qty
    FROM inventory
    WHERE id = oi.inventory_id
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'INVENTORY_NOT_FOUND';
    END IF;

    -- Ripristina
    UPDATE inventory
    SET quantity = quantity + 1
    WHERE id = oi.inventory_id;

    -- Rileggi e aggiorna availability_status della riga
    SELECT quantity INTO inv_qty FROM inventory WHERE id = oi.inventory_id;

    UPDATE order_items
    SET availability_status = CASE WHEN inv_qty > 0 THEN 'available'::availability_status ELSE 'out_of_stock'::availability_status END
    WHERE id = oi.id;
  END LOOP;

  RETURN;
END;
$$;

