-- supabase/migrations/007_redesign.sql

-- 1. Aplanar shipping_address en columns en orders
ALTER TABLE orders
  ADD COLUMN shipping_name    text,
  ADD COLUMN shipping_phone   text,
  ADD COLUMN shipping_street  text,
  ADD COLUMN shipping_city    text,
  ADD COLUMN shipping_state   text,
  ADD COLUMN shipping_zip     text,
  ADD COLUMN shipping_country text NOT NULL DEFAULT 'MX';

ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address;

-- 2. order_items absorbe los campos de designs
ALTER TABLE order_items
  ADD COLUMN design_url    text,
  ADD COLUMN design_width  integer,
  ADD COLUMN design_height integer;

ALTER TABLE order_items DROP COLUMN IF EXISTS design_id;

-- 3. Eliminar tabla designs
DROP TABLE IF EXISTS designs CASCADE;
