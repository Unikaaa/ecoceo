-- ============================================
-- UNIKA - CONTENUTI GESTIBILI DA DASHBOARD
-- Schema per Chi Siamo, News e Favoriti
-- ============================================

-- ============================================
-- AGGIUNTA COLONNA is_featured a inventory
-- ============================================

ALTER TABLE inventory ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_inventory_featured ON inventory(is_featured) WHERE is_featured = true;

COMMENT ON COLUMN inventory.is_featured IS 'Indica se il prodotto deve apparire nella sezione "I Nostri Favoriti"';

-- ============================================
-- TABELLA CHI SIAMO (about_content)
-- ============================================

CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE, -- 'hero', 'story', 'philosophy', 'signature'
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserimento sezioni predefinite
INSERT INTO about_content (section_key, title, subtitle, content, display_order) VALUES
  ('hero', 'Chi Siamo', 'La Nostra Essenza', 'Dove l''arte incontra l''artigianato, dove ogni pezzo racconta una storia, dove la tradizione si fonde con l''innovazione', 1),
  ('story', 'Un Viaggio nell''Arte', 'La Nostra Storia', 'UNIKA nasce dalla passione per l''arte ceramica e dalla volontà di preservare tecniche tradizionali tramandate di generazione in generazione. Ogni pezzo che creiamo porta con sé l''essenza di un sapere antico, arricchito da una visione contemporanea.\n\nLa nostra storia inizia in un piccolo atelier dove l''argilla prende forma tra le mani esperte dei nostri artigiani. Ogni ceramica è frutto di ore di lavoro manuale, di attenzione ai dettagli e di un amore profondo per questo mestiere.\n\nCrediamo che ogni oggetto debba avere un''anima, che ogni creazione debba raccontare qualcosa di unico. Per questo ogni pezzo UNIKA è unico, irripetibile, portatore di un messaggio di bellezza e autenticità.', 2),
  ('philosophy', 'La Nostra Filosofia', 'Filosofia', 'Crediamo nella bellezza della manualità, nel valore del tempo dedicato, nell''importanza di creare oggetti che durino nel tempo e che portino gioia in ogni casa che li accoglie.', 3),
  ('signature', 'Ogni Pezzo è Unico', NULL, 'Non produciamo in serie. Ogni ceramica è pensata, modellata e finita a mano, con cura e dedizione. Ogni creazione porta con sé l''impronta dell''artigiano che l''ha realizzata.\n\nQuesto è il nostro modo di fare arte. Questo è UNIKA.', 4)
ON CONFLICT (section_key) DO NOTHING;

-- Trigger per updated_at
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELLA ARTICOLI NEWS (articles)
-- ============================================

CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author TEXT NOT NULL DEFAULT 'UNIKA Team',
  category TEXT NOT NULL DEFAULT 'News',
  image_url TEXT,
  tags TEXT[], -- Array di tag
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_published ON articles(is_published);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);

-- Trigger per updated_at
CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE articles IS 'Articoli per la sezione News del sito';
COMMENT ON COLUMN articles.is_featured IS 'Articolo in evidenza nella pagina News';

-- ============================================
-- POLITICHE RLS
-- ============================================

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Policy per about_content
CREATE POLICY "About content is viewable by everyone"
  ON about_content FOR SELECT
  USING (true);

CREATE POLICY "About content is manageable by service role"
  ON about_content FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy per articles
CREATE POLICY "Articles are viewable by everyone"
  ON articles FOR SELECT
  USING (true);

CREATE POLICY "Articles are manageable by service role"
  ON articles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
