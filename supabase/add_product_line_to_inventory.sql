-- UNIKA 3.0 — Estensione non distruttiva per linee di offerta
-- Eseguire manualmente su Supabase. Non elimina dati esistenti.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'product_line'
  ) THEN
    CREATE TYPE product_line AS ENUM (
      'home',
      'memorial',
      'art',
      'custom',
      'printing',
      'unassigned'
    );
  END IF;
END $$;

ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS product_line product_line NOT NULL DEFAULT 'unassigned';

ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS short_description text,
  ADD COLUMN IF NOT EXISTS materials text,
  ADD COLUMN IF NOT EXISTS dimensions text,
  ADD COLUMN IF NOT EXISTS weight_grams numeric,
  ADD COLUMN IF NOT EXISTS production_days_min integer,
  ADD COLUMN IF NOT EXISTS production_days_max integer,
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

COMMENT ON COLUMN inventory.product_line IS 'Linea commerciale UNIKA (home/memorial/art/custom/printing)';
COMMENT ON COLUMN inventory.status IS 'active | draft | archived';

CREATE INDEX IF NOT EXISTS idx_inventory_product_line ON inventory (product_line);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory (status);

-- Mapping suggerito dalle collection slug esistenti (facoltativo, non forzato)
-- UPDATE inventory SET product_line = 'home' WHERE section IN ('gioielleria', 'piatti', 'set-e-kit');
-- UPDATE inventory SET product_line = 'memorial' WHERE section ILIKE '%funeral%' OR section ILIKE '%memorial%';
