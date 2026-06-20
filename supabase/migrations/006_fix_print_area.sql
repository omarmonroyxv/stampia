-- Corrige la posición del print area para que quede en el pecho (no en el cuello)
-- offset_y_pct: 0.354 (y=163) estaba en la zona del cuello/hombro
-- offset_y_pct: 0.435 (y=200) queda en el pecho, debajo de la sisa

update products
set print_area = '{
  "front": {
    "width_cm": 30,
    "height_cm": 35,
    "offset_x_pct": 0.25,
    "offset_y_pct": 0.435,
    "width_pct": 0.5,
    "height_pct": 0.326
  }
}'
where slug = 'playera-basica';
