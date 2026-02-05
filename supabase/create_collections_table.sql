-- ============================================
-- TABELLA COLLEZIONI (collections)
-- ============================================
-- Questa tabella sostituisce le categorie hardcoded
-- Ogni collezione può avere 2 immagini (normale e hover)

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT, -- Immagine principale (normale)
  hover_image_url TEXT, -- Immagine quando passi il mouse sopra
  display_order INTEGER DEFAULT 0, -- Ordine di visualizzazione
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index per ricerca rapida
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_collections_active ON collections(is_active);
CREATE INDEX IF NOT EXISTS idx_collections_display_order ON collections(display_order);

-- Commenti
COMMENT ON TABLE collections IS 'Collezioni prodotti UNIKA (es. Gioielleria, Set e Kit, ecc.)';
COMMENT ON COLUMN collections.name IS 'Nome della collezione (es. "Gioielleria")';
COMMENT ON COLUMN collections.slug IS 'Slug URL univoco (es. "gioielleria")';
COMMENT ON COLUMN collections.image_url IS 'URL immagine principale collezione';
COMMENT ON COLUMN collections.hover_image_url IS 'URL immagine hover collezione';
COMMENT ON COLUMN collections.display_order IS 'Ordine di visualizzazione (0 = primo)';

-- Trigger per updated_at automatico
CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AGGIORNA TABELLA INVENTORY
-- ============================================
-- Assicurati che il campo section esista e faccia riferimento alle collezioni

-- Verifica che section esista (dovrebbe già esistere)
-- Se non esiste, aggiungilo:
-- ALTER TABLE inventory ADD COLUMN IF NOT EXISTS section TEXT;

-- Aggiungi foreign key opzionale (se vuoi integrità referenziale)
-- ALTER TABLE inventory 
-- ADD CONSTRAINT fk_inventory_collection 
-- FOREIGN KEY (section) REFERENCES collections(slug);

-- ============================================
-- INSERISCI COLLEZIONI ESISTENTI
-- ============================================
-- Inserisci le collezioni che hai già nel codice

INSERT INTO collections (name, slug, description, display_order) VALUES
  ('Gioielleria', 'gioielleria', 'Pezzi unici di alta fascia, ciondoli, orecchini e bracciali in ceramica', 1),
  ('Set e Kit', 'set-e-kit', 'Confezioni di piatti, kit regalo, box multiprodotto', 2),
  ('Collezionismo', 'collezionismo', 'Pezzi unici, limitati, artistici da collezione', 3),
  ('Piatti e Oggetti d''Uso', 'piatti', 'Piatti singoli, ciotole, vasi per uso quotidiano', 4),
  ('Eventi e Regali', 'eventi-e-regali', 'Laurea, matrimonio, ceramica funeraria, regali personalizzati', 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- POLITICHE RLS (Row Level Security)
-- ============================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Policy per lettura pubblica
CREATE POLICY "Collections are viewable by authenticated users"
  ON collections FOR SELECT
  TO authenticated
  USING (true);

-- Policy per gestione service role
CREATE POLICY "Collections are manageable by service role"
  ON collections FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
