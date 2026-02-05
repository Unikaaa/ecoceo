-- ============================================
-- AGGIORNAMENTO TABELLA CONTACTS
-- ============================================
-- Aggiunge campi per sistema ticket con tre stati

-- Modifica enum contact_status per includere 'in_elaboration'
-- Prima rimuoviamo il tipo esistente e lo ricreiamo
ALTER TABLE contacts DROP CONSTRAINT IF EXISTS contacts_status_check;

-- Aggiungi nuovo valore all'enum (se non esiste già)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'in_elaboration' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'contact_status')) THEN
    ALTER TYPE contact_status ADD VALUE 'in_elaboration';
  END IF;
END $$;

-- Aggiungi campi per gestione ticket
ALTER TABLE contacts 
ADD COLUMN IF NOT EXISTS assigned_to TEXT, -- Nome di chi sta lavorando sull'email
ADD COLUMN IF NOT EXISTS reply_message TEXT, -- Messaggio di risposta (salvato durante elaborazione)
ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE, -- Data quando è stata inviata la risposta
ADD COLUMN IF NOT EXISTS priority_color TEXT DEFAULT 'green'; -- 'red', 'yellow', 'green' per semaforo

-- Index per ricerca rapida
CREATE INDEX IF NOT EXISTS idx_contacts_assigned_to ON contacts(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_contacts_priority ON contacts(priority_color);
CREATE INDEX IF NOT EXISTS idx_contacts_status_priority ON contacts(status, priority_color, created_at DESC);

-- Commenti
COMMENT ON COLUMN contacts.assigned_to IS 'Nome di chi sta lavorando su questo ticket';
COMMENT ON COLUMN contacts.reply_message IS 'Messaggio di risposta salvato durante elaborazione';
COMMENT ON COLUMN contacts.replied_at IS 'Data e ora quando è stata inviata la risposta';
COMMENT ON COLUMN contacts.priority_color IS 'Colore priorità: red (alta), yellow (media), green (bassa) basato sui giorni passati';

-- Funzione per calcolare priority_color in base ai giorni passati
CREATE OR REPLACE FUNCTION calculate_contact_priority()
RETURNS TRIGGER AS $$
DECLARE
  days_passed INTEGER;
BEGIN
  -- Calcola giorni passati dalla creazione
  days_passed := EXTRACT(DAY FROM (NOW() - NEW.created_at));
  
  -- Rosso: più di 7 giorni (priorità alta)
  IF days_passed > 7 THEN
    NEW.priority_color := 'red';
  -- Giallo: tra 3 e 7 giorni (priorità media)
  ELSIF days_passed >= 3 THEN
    NEW.priority_color := 'yellow';
  -- Verde: meno di 3 giorni (priorità bassa)
  ELSE
    NEW.priority_color := 'green';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger per aggiornare priority_color automaticamente
DROP TRIGGER IF EXISTS update_contact_priority ON contacts;
CREATE TRIGGER update_contact_priority
  BEFORE INSERT OR UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_contact_priority();

-- Aggiorna priority_color per i record esistenti
UPDATE contacts SET priority_color = 
  CASE
    WHEN EXTRACT(DAY FROM (NOW() - created_at)) > 7 THEN 'red'
    WHEN EXTRACT(DAY FROM (NOW() - created_at)) >= 3 THEN 'yellow'
    ELSE 'green'
  END
WHERE priority_color IS NULL OR priority_color = 'green';
