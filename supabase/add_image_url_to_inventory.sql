-- ============================================
-- AGGIUNTA CAMPO IMMAGINE ALLA TABELLA INVENTORY
-- ============================================

-- Aggiungi colonna image_url per URL singola immagine
ALTER TABLE inventory 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Index per ricerca rapida prodotti con immagini
CREATE INDEX IF NOT EXISTS idx_inventory_has_image ON inventory(image_url) WHERE image_url IS NOT NULL;

-- Commenti
COMMENT ON COLUMN inventory.image_url IS 'URL principale immagine prodotto (Supabase Storage)';

-- Se esiste già la colonna images (array), rimuovila perché non la usiamo
-- ALTER TABLE inventory DROP COLUMN IF EXISTS images;
