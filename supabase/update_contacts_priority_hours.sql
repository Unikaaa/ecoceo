-- ============================================
-- AGGIORNAMENTO LOGICA PRIORITÀ CONTATTI
-- ============================================
-- Modifica la logica di priorità basata su ORE invece che GIORNI
-- 0-6 ore: priorità bassa (verde)
-- 6-12 ore: priorità media (giallo)
-- 12+ ore: priorità altissima (rosso)

-- Funzione per calcolare priority_color in base alle ORE passate
CREATE OR REPLACE FUNCTION calculate_contact_priority()
RETURNS TRIGGER AS $$
DECLARE
  hours_passed NUMERIC;
BEGIN
  -- Calcola ore passate dalla creazione
  hours_passed := EXTRACT(EPOCH FROM (NOW() - NEW.created_at)) / 3600;
  
  -- Rosso: più di 12 ore (priorità altissima)
  IF hours_passed >= 12 THEN
    NEW.priority_color := 'red';
  -- Giallo: tra 6 e 12 ore (priorità media)
  ELSIF hours_passed >= 6 THEN
    NEW.priority_color := 'yellow';
  -- Verde: meno di 6 ore (priorità bassa)
  ELSE
    NEW.priority_color := 'green';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aggiorna priority_color per i record esistenti basandosi sulle ORE
UPDATE contacts SET priority_color = 
  CASE
    WHEN EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 >= 12 THEN 'red'
    WHEN EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600 >= 6 THEN 'yellow'
    ELSE 'green'
  END;

-- Il trigger è già stato creato in update_contacts_table.sql
-- Se non esiste, crealo:
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_contact_priority'
  ) THEN
    CREATE TRIGGER update_contact_priority
      BEFORE INSERT OR UPDATE ON contacts
      FOR EACH ROW
      EXECUTE FUNCTION calculate_contact_priority();
  END IF;
END $$;
