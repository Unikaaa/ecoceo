nn-- ============================================
-- RIMOZIONE CAMPO IMAGES (ARRAY) - NON NECESSARIO
-- ============================================
-- Esegui questo se hai già creato la colonna images e vuoi rimuoverla

ALTER TABLE inventory DROP COLUMN IF EXISTS images;
