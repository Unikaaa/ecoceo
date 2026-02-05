-- ============================================
-- FUNZIONE PER INVIARE EMAIL QUANDO PRODOTTO TORNA DISPONIBILE
-- ============================================
-- Questa funzione viene chiamata quando un prodotto passa da quantity = 0 a quantity > 0
-- Invia email a tutti i clienti che hanno richiesto di essere avvisati

-- Funzione per inviare notifiche quando un prodotto torna disponibile
CREATE OR REPLACE FUNCTION notify_product_available()
RETURNS TRIGGER AS $$
DECLARE
  notification_record RECORD;
  product_name TEXT;
BEGIN
  -- Controlla se il prodotto è passato da esaurito (OLD.quantity = 0) a disponibile (NEW.quantity > 0)
  IF OLD.quantity = 0 AND NEW.quantity > 0 THEN
    -- Recupera il nome del prodotto
    product_name := NEW.product_name;
    
    -- Trova tutte le notifiche non ancora inviate per questo prodotto
    FOR notification_record IN 
      SELECT id, email, product_id
      FROM product_notifications
      WHERE product_id = NEW.id
        AND notified = false
    LOOP
      -- Aggiorna la notifica come "da inviare" (sarà inviata dall'API)
      -- Qui potresti anche chiamare un servizio di email esterno
      -- Per ora, lasciamo che l'API Next.js gestisca l'invio
      
      -- Marca come "da notificare" (l'API controllerà e invierà)
      UPDATE product_notifications
      SET notified = false, -- Mantieni false finché l'email non è effettivamente inviata
          updated_at = NOW()
      WHERE id = notification_record.id;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per chiamare la funzione quando quantity cambia
DROP TRIGGER IF EXISTS trigger_notify_product_available ON inventory;
CREATE TRIGGER trigger_notify_product_available
  AFTER UPDATE OF quantity ON inventory
  FOR EACH ROW
  WHEN (OLD.quantity = 0 AND NEW.quantity > 0)
  EXECUTE FUNCTION notify_product_available();

-- Commenti
COMMENT ON FUNCTION notify_product_available() IS 'Trigger che rileva quando un prodotto torna disponibile e prepara le notifiche email';
