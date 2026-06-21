-- =====================================================================
-- FIX PARA EL ERROR "could not find the 'shipping_city' column"
-- =====================================================================
-- Pega y ejecuta esto en el SQL Editor de tu Dashboard de Supabase
-- (https://supabase.com/dashboard/project/_/sql)

-- 1. Aplicamos los campos de envío a la tabla orders si no existen
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_name    text,
  ADD COLUMN IF NOT EXISTS shipping_phone   text,
  ADD COLUMN IF NOT EXISTS shipping_street  text,
  ADD COLUMN IF NOT EXISTS shipping_city    text,
  ADD COLUMN IF NOT EXISTS shipping_state   text,
  ADD COLUMN IF NOT EXISTS shipping_zip     text,
  ADD COLUMN IF NOT EXISTS shipping_country text NOT NULL DEFAULT 'MX';

ALTER TABLE orders DROP COLUMN IF EXISTS shipping_address;

-- 2. Reflejamos los cambios del diseño en order_items
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS design_url    text,
  ADD COLUMN IF NOT EXISTS design_width  integer,
  ADD COLUMN IF NOT EXISTS design_height integer;

ALTER TABLE order_items DROP COLUMN IF EXISTS design_id;

-- 3. Tabla de diseños eliminada (ya se integró en order_items)
DROP TABLE IF EXISTS designs CASCADE;

-- 4. Añadimos el campo para rastreo de pedidos (si no lo tenías)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS production_stage TEXT DEFAULT NULL;
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);
COMMENT ON COLUMN orders.production_stage IS 'Internal production stage shown in customer tracker. Values: dtf_printing | dtf_pressing | packing | shipped_out';

-- 5. RECARGAR EL CACHÉ DEL ESQUEMA (ÉSTE ES EL PASO CLAVE PARA QUITAR EL ERROR)
NOTIFY pgrst, 'reload schema';
