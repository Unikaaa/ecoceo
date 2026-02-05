-- ============================================
-- SCHEMA DATABASE CONFIGURATORE UNIKA
-- ============================================
-- Database per gestire il configuratore di fotoceramiche personalizzate

-- ============================================
-- TABELLA: categories
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_active ON categories(is_active) WHERE is_active = true;
CREATE INDEX idx_categories_order ON categories(display_order);

-- ============================================
-- TABELLA: product_types
-- ============================================
CREATE TABLE IF NOT EXISTS product_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

CREATE INDEX idx_product_types_category ON product_types(category_id);
CREATE INDEX idx_product_types_active ON product_types(is_active) WHERE is_active = true;

-- ============================================
-- TABELLA: styles
-- ============================================
CREATE TABLE IF NOT EXISTS styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  preview_url TEXT,
  price_extra DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_styles_active ON styles(is_active) WHERE is_active = true;

-- ============================================
-- TABELLA: sizes
-- ============================================
CREATE TABLE IF NOT EXISTS sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  width_cm DECIMAL(5, 2) NOT NULL,
  height_cm DECIMAL(5, 2) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sizes_active ON sizes(is_active) WHERE is_active = true;
CREATE INDEX idx_sizes_order ON sizes(display_order);

-- ============================================
-- TABELLA: decorations
-- ============================================
CREATE TABLE IF NOT EXISTS decorations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price_extra DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decorations_style ON decorations(style_id);
CREATE INDEX idx_decorations_category ON decorations(category_id);
CREATE INDEX idx_decorations_active ON decorations(is_active) WHERE is_active = true;

-- ============================================
-- TABELLA: backgrounds
-- ============================================
CREATE TABLE IF NOT EXISTS backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  style_id UUID REFERENCES styles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price_extra DECIMAL(10, 2) NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backgrounds_style ON backgrounds(style_id);
CREATE INDEX idx_backgrounds_category ON backgrounds(category_id);
CREATE INDEX idx_backgrounds_active ON backgrounds(is_active) WHERE is_active = true;

-- ============================================
-- TABELLA: configurations
-- ============================================
CREATE TABLE IF NOT EXISTS configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  product_type_id UUID NOT NULL REFERENCES product_types(id),
  style_id UUID NOT NULL REFERENCES styles(id),
  size_id UUID NOT NULL REFERENCES sizes(id),
  background_id UUID REFERENCES backgrounds(id),
  custom_text TEXT,
  custom_text_font TEXT,
  custom_text_color TEXT,
  custom_text_size INTEGER,
  user_images JSONB DEFAULT '[]'::jsonb,
  decorations JSONB DEFAULT '[]'::jsonb,
  canvas_data JSONB,
  total_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  stripe_checkout_session_id TEXT,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_configurations_session ON configurations(user_session_id);
CREATE INDEX idx_configurations_status ON configurations(status);
CREATE INDEX idx_configurations_stripe ON configurations(stripe_checkout_session_id);

-- ============================================
-- TRIGGERS per updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_types_updated_at BEFORE UPDATE ON product_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_styles_updated_at BEFORE UPDATE ON styles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sizes_updated_at BEFORE UPDATE ON sizes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_decorations_updated_at BEFORE UPDATE ON decorations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_backgrounds_updated_at BEFORE UPDATE ON backgrounds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configurations_updated_at BEFORE UPDATE ON configurations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES
-- ============================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE backgrounds ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono leggere categorie, tipi, stili, dimensioni, decorazioni, sfondi attivi
CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active product_types" ON product_types FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active styles" ON styles FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active sizes" ON sizes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active decorations" ON decorations FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active backgrounds" ON backgrounds FOR SELECT USING (is_active = true);

-- Policy: Service role può fare tutto
CREATE POLICY "Service role all categories" ON categories FOR ALL USING (true);
CREATE POLICY "Service role all product_types" ON product_types FOR ALL USING (true);
CREATE POLICY "Service role all styles" ON styles FOR ALL USING (true);
CREATE POLICY "Service role all sizes" ON sizes FOR ALL USING (true);
CREATE POLICY "Service role all decorations" ON decorations FOR ALL USING (true);
CREATE POLICY "Service role all backgrounds" ON backgrounds FOR ALL USING (true);

-- Policy: Configurations - utenti possono creare/leggere le proprie
CREATE POLICY "Users create configurations" ON configurations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users read own configurations" ON configurations FOR SELECT USING (true);
CREATE POLICY "Users update own configurations" ON configurations FOR UPDATE USING (true);
CREATE POLICY "Service role all configurations" ON configurations FOR ALL USING (true);

-- ============================================
-- COMMENTI
-- ============================================
COMMENT ON TABLE categories IS 'Categorie del configuratore (Funeraria, Ricordo, Artistica, etc.)';
COMMENT ON TABLE product_types IS 'Tipi di prodotto per categoria (Ovale, Quadrata, Rettangolare, etc.)';
COMMENT ON TABLE styles IS 'Stili disponibili (Alla romana, Moderna, Classica, Minimal)';
COMMENT ON TABLE sizes IS 'Dimensioni disponibili con prezzi base';
COMMENT ON TABLE decorations IS 'Decorazioni disponibili (nuvole, simboli, elementi grafici)';
COMMENT ON TABLE backgrounds IS 'Sfondi disponibili per i prodotti';
COMMENT ON TABLE configurations IS 'Configurazioni salvate degli utenti';
