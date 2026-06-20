-- Seed: Playera Básica Unisex
-- Correr después de 001_schema.sql y 002_rls.sql

insert into products (id, slug, name, description, base_price_mxn, print_area, mockup_front_url, active)
values (
  '00000000-0000-0000-0000-000000000001',
  'playera-basica',
  'Playera Básica Unisex',
  'Playera 100% algodón, corte recto, cuello redondo. Ideal para imprimir tu diseño con máxima calidad.',
  299.00,
  '{
    "front": {
      "width_cm": 30,
      "height_cm": 35,
      "offset_x_pct": 0.25,
      "offset_y_pct": 0.435,
      "width_pct": 0.5,
      "height_pct": 0.326
    }
  }',
  '/mockups/playera-blanco.svg',
  true
);

-- ─── Variantes: Blanco ────────────────────────────────────────────────────────
insert into product_variants (product_id, color_name, color_hex, size, sku) values
  ('00000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'S',   'PLAY-BLC-S'),
  ('00000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'M',   'PLAY-BLC-M'),
  ('00000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'L',   'PLAY-BLC-L'),
  ('00000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'XL',  'PLAY-BLC-XL'),
  ('00000000-0000-0000-0000-000000000001', 'Blanco', '#FFFFFF', 'XXL', 'PLAY-BLC-XXL');

-- ─── Variantes: Negro ────────────────────────────────────────────────────────
insert into product_variants (product_id, color_name, color_hex, size, sku) values
  ('00000000-0000-0000-0000-000000000001', 'Negro', '#1C1C1C', 'S',   'PLAY-NGR-S'),
  ('00000000-0000-0000-0000-000000000001', 'Negro', '#1C1C1C', 'M',   'PLAY-NGR-M'),
  ('00000000-0000-0000-0000-000000000001', 'Negro', '#1C1C1C', 'L',   'PLAY-NGR-L'),
  ('00000000-0000-0000-0000-000000000001', 'Negro', '#1C1C1C', 'XL',  'PLAY-NGR-XL'),
  ('00000000-0000-0000-0000-000000000001', 'Negro', '#1C1C1C', 'XXL', 'PLAY-NGR-XXL');

-- ─── Variantes: Gris ─────────────────────────────────────────────────────────
insert into product_variants (product_id, color_name, color_hex, size, sku) values
  ('00000000-0000-0000-0000-000000000001', 'Gris',  '#9CA3AF', 'S',   'PLAY-GRS-S'),
  ('00000000-0000-0000-0000-000000000001', 'Gris',  '#9CA3AF', 'M',   'PLAY-GRS-M'),
  ('00000000-0000-0000-0000-000000000001', 'Gris',  '#9CA3AF', 'L',   'PLAY-GRS-L'),
  ('00000000-0000-0000-0000-000000000001', 'Gris',  '#9CA3AF', 'XL',  'PLAY-GRS-XL'),
  ('00000000-0000-0000-0000-000000000001', 'Gris',  '#9CA3AF', 'XXL', 'PLAY-GRS-XXL');
