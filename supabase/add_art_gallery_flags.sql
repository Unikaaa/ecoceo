-- UNIKA — Proposta B (approvata)
-- Colonne per galleria "Materia che diventa arte"
-- Non distruttivo. Nessuna DROP/TRUNCATE. Eseguire manualmente su Supabase SQL Editor.

-- Prodotti / creazioni (inventory)
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS show_in_art_gallery boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS art_gallery_order integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS short_description text;

COMMENT ON COLUMN inventory.show_in_art_gallery IS 'Mostra il prodotto nella sezione homepage Materia che diventa arte';
COMMENT ON COLUMN inventory.art_gallery_order IS 'Ordine nella galleria artistica (0 = primo)';
COMMENT ON COLUMN inventory.short_description IS 'Descrizione breve per galleria / schede';

CREATE INDEX IF NOT EXISTS idx_inventory_art_gallery
  ON inventory (show_in_art_gallery, art_gallery_order)
  WHERE show_in_art_gallery = true;

-- Collezioni
ALTER TABLE collections
  ADD COLUMN IF NOT EXISTS show_in_art_gallery boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS art_gallery_order integer NOT NULL DEFAULT 0;

COMMENT ON COLUMN collections.show_in_art_gallery IS 'Mostra la collezione nella sezione homepage Materia che diventa arte';
COMMENT ON COLUMN collections.art_gallery_order IS 'Ordine collezione nella galleria artistica';

CREATE INDEX IF NOT EXISTS idx_collections_art_gallery
  ON collections (show_in_art_gallery, art_gallery_order)
  WHERE show_in_art_gallery = true;