-- Script para añadir productos estrella al catálogo de Stampia

-- 1. Playera Premium Unisex
DO $$
DECLARE
  p_id uuid := uuid_generate_v4();
BEGIN
  INSERT INTO products (id, slug, name, description, base_price_mxn, print_area, mockup_front_url, active)
  VALUES (
    p_id,
    'playera-premium-unisex',
    'Playera Premium Unisex',
    'La playera premium unisex es el lienzo perfecto para tus diseños. Fabricada con algodón 100% peinado e hilado en anillos, ofrece una suavidad inigualable y un corte moderno que se ajusta perfectamente a cualquier silueta. Ideal para impresión DTG (Direct to Garment), garantizando colores vibrantes y duraderos.',
    349.00,
    '{"front": {"width_cm": 30, "height_cm": 40, "offset_x_pct": 50, "offset_y_pct": 50}}',
    '/reallogo.png',
    true
  );

  -- Variantes Blanco
  INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, extra_price_mxn) VALUES
  (p_id, 'Blanco', '#ffffff', 'S', 'TS-PREM-WHI-S', 0),
  (p_id, 'Blanco', '#ffffff', 'M', 'TS-PREM-WHI-M', 0),
  (p_id, 'Blanco', '#ffffff', 'L', 'TS-PREM-WHI-L', 0),
  (p_id, 'Blanco', '#ffffff', 'XL', 'TS-PREM-WHI-XL', 20);

  -- Variantes Negro
  INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, extra_price_mxn) VALUES
  (p_id, 'Negro', '#111111', 'S', 'TS-PREM-BLK-S', 0),
  (p_id, 'Negro', '#111111', 'M', 'TS-PREM-BLK-M', 0),
  (p_id, 'Negro', '#111111', 'L', 'TS-PREM-BLK-L', 0),
  (p_id, 'Negro', '#111111', 'XL', 'TS-PREM-BLK-XL', 20);
END $$;

-- 2. Sudadera Clásica con Capucha
DO $$
DECLARE
  p_id uuid := uuid_generate_v4();
BEGIN
  INSERT INTO products (id, slug, name, description, base_price_mxn, print_area, mockup_front_url, active)
  VALUES (
    p_id,
    'sudadera-clasica-capucha',
    'Sudadera Clásica con Capucha (Hoodie)',
    'Nuestra sudadera clásica con capucha es la definición de comodidad y estilo. Confeccionada con una mezcla equitativa de algodón y poliéster (50/50), proporciona una sensación de calidez y suavidad, ideal para el clima frío. Cuenta con un bolsillo frontal tipo canguro y cordones ajustables.',
    699.00,
    '{"front": {"width_cm": 35, "height_cm": 35, "offset_x_pct": 50, "offset_y_pct": 50}}',
    '/reallogo.png',
    true
  );

  INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, extra_price_mxn) VALUES
  (p_id, 'Negro', '#111111', 'M', 'HD-CLAS-BLK-M', 0),
  (p_id, 'Negro', '#111111', 'L', 'HD-CLAS-BLK-L', 0),
  (p_id, 'Gris Jaspeado', '#9e9e9e', 'M', 'HD-CLAS-GRY-M', 0),
  (p_id, 'Gris Jaspeado', '#9e9e9e', 'L', 'HD-CLAS-GRY-L', 0);
END $$;

-- 3. Taza de Cerámica Blanca
DO $$
DECLARE
  p_id uuid := uuid_generate_v4();
BEGIN
  INSERT INTO products (id, slug, name, description, base_price_mxn, print_area, mockup_front_url, active)
  VALUES (
    p_id,
    'taza-ceramica-blanca-11oz',
    'Taza de Cerámica Blanca (11 oz)',
    'Comienza tus mañanas con estilo usando nuestra clásica taza de cerámica blanca de 11 oz. Fabricada con cerámica resistente y de alta calidad, es perfecta para café, té o chocolate caliente. Su acabado brillante resalta los colores de cualquier diseño impreso. Apta para microondas y lavavajillas.',
    199.00,
    '{"front": {"width_cm": 20, "height_cm": 9, "offset_x_pct": 50, "offset_y_pct": 50}}',
    '/reallogo.png',
    true
  );

  INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, extra_price_mxn) VALUES
  (p_id, 'Blanco', '#ffffff', '11 oz', 'MG-CER-WHI-11', 0);
END $$;

-- 4. Tote Bag Ecológica
DO $$
DECLARE
  p_id uuid := uuid_generate_v4();
BEGIN
  INSERT INTO products (id, slug, name, description, base_price_mxn, print_area, mockup_front_url, active)
  VALUES (
    p_id,
    'tote-bag-ecologica',
    'Tote Bag de Algodón Ecológica',
    'Lleva todo lo que necesitas mientras cuidas el planeta con nuestra Tote Bag Ecológica. Hecha de lona de algodón 100% natural, esta bolsa es duradera, resistente y lo suficientemente espaciosa para tus compras, libros o esenciales diarios. Excelente alternativa a las bolsas de plástico.',
    249.00,
    '{"front": {"width_cm": 25, "height_cm": 25, "offset_x_pct": 50, "offset_y_pct": 50}}',
    '/reallogo.png',
    true
  );

  INSERT INTO product_variants (product_id, color_name, color_hex, size, sku, extra_price_mxn) VALUES
  (p_id, 'Natural', '#f5f5dc', 'Unitalla', 'TB-ECO-NAT-U', 0),
  (p_id, 'Negro', '#111111', 'Unitalla', 'TB-ECO-BLK-U', 0);
END $$;
