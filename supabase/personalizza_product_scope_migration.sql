-- Migration: rende le opzioni di personalizzazione scoped per product_type
-- Esegui questo script in Supabase SQL Editor.

BEGIN;

-- 1) Product type shape (canvas)
ALTER TABLE product_types
  ADD COLUMN IF NOT EXISTS canvas_shape TEXT;

UPDATE product_types
SET canvas_shape = 'oval'
WHERE canvas_shape IS NULL;

ALTER TABLE product_types
  ALTER COLUMN canvas_shape SET DEFAULT 'oval';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'product_types_canvas_shape_check'
  ) THEN
    ALTER TABLE product_types
      ADD CONSTRAINT product_types_canvas_shape_check
      CHECK (canvas_shape IN ('oval', 'square', 'triangle', 'rectangle', 'circle'));
  END IF;
END $$;

-- 2) Scope colonne per product_type
ALTER TABLE styles
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE;

ALTER TABLE sizes
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE;

ALTER TABLE decorations
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE;

ALTER TABLE backgrounds
  ADD COLUMN IF NOT EXISTS product_type_id UUID REFERENCES product_types(id) ON DELETE CASCADE;

-- 3) Rimuovi vincoli globali che bloccano duplicati tra prodotti diversi
ALTER TABLE styles DROP CONSTRAINT IF EXISTS styles_name_key;
ALTER TABLE styles DROP CONSTRAINT IF EXISTS styles_slug_key;
ALTER TABLE sizes DROP CONSTRAINT IF EXISTS sizes_name_key;

-- 4) Vincoli univoci per-prodotto
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'styles_product_type_name_key'
  ) THEN
    ALTER TABLE styles
      ADD CONSTRAINT styles_product_type_name_key
      UNIQUE (product_type_id, name);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'styles_product_type_slug_key'
  ) THEN
    ALTER TABLE styles
      ADD CONSTRAINT styles_product_type_slug_key
      UNIQUE (product_type_id, slug);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'sizes_product_type_name_key'
  ) THEN
    ALTER TABLE sizes
      ADD CONSTRAINT sizes_product_type_name_key
      UNIQUE (product_type_id, name);
  END IF;
END $$;

-- 5) Indici utili
CREATE INDEX IF NOT EXISTS idx_styles_product_type ON styles(product_type_id);
CREATE INDEX IF NOT EXISTS idx_sizes_product_type ON sizes(product_type_id);
CREATE INDEX IF NOT EXISTS idx_decorations_product_type ON decorations(product_type_id);
CREATE INDEX IF NOT EXISTS idx_backgrounds_product_type ON backgrounds(product_type_id);

COMMIT;

