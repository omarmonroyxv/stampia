# Stampia — Rediseño Arquitectura + UI

**Fecha:** 2026-06-11  
**Estado:** Aprobado  
**Fases:** 2 (Arquitectura primero, UI después)

---

## Resumen

Rediseño completo de Stampia en dos fases: primero simplificar el modelo de datos y la capa de backend para eliminar sobre-ingeniería, luego rediseñar toda la interfaz con un look moderno y minimalista editorial con animaciones expresivas. No hay datos reales en producción, por lo que se permiten cambios que rompen compatibilidad.

---

## Fase 1 — Arquitectura y Data Model

### Decisiones clave

| Área | Antes | Después |
|------|-------|---------|
| Tabla `designs` | Entidad separada con FK en `order_items` | Eliminada; campos absorbidos en `order_items` |
| `orders.shipping_address` | JSONB con 7 campos | 7 columnas planas en `orders` |
| `products.print_area` | JSONB | Se mantiene JSONB (config de producto, no transaccional) |
| Capa de pagos | `lib/payment/` con factory + interface + impl (3 archivos) | MercadoPago llamado directo en `createOrder` |
| Capa de fulfillment | `lib/fulfillment/` con 4 archivos | `lib/fulfillment.ts` único (~100 líneas) |
| `saveDesign` Server Action | Necesario antes de agregar al carrito | Eliminado |
| API stubs | `app/api/checkout/` y `app/api/print-file/` (ambos 501) | Eliminados |

### Schema resultante — 5 tablas

#### `profiles` — sin cambios
```
id, full_name, role, created_at
```

#### `products` — sin cambios
```
id, name, slug, description, base_price_mxn, print_area (jsonb), mockup_front_url, active, created_at
```

#### `product_variants` — sin cambios
```
id, product_id, color_name, color_hex, size, sku, extra_price_mxn, printful_variant_id, active
```

#### `orders` — shipping_address aplanado
```
id, user_id, status, total_mxn, shipping_mxn,
payment_id, fulfillment_ref,
shipping_name, shipping_phone, shipping_street,
shipping_city, shipping_state, shipping_zip,
shipping_country (default 'MX'),
created_at
```

#### `order_items` — absorbe designs
```
id, order_id, variant_id,
design_url,           -- era designs.file_url
design_width,         -- px originales (para cálculo DPI)
design_height,        -- px originales
placement (jsonb),    -- {x_pct, y_pct, scale, rotation}
quantity, unit_price_mxn
```

### Migración: `007_redesign.sql`

Una sola migración atómica. Sin data migration (no hay datos reales).

```sql
-- Aplanar shipping en orders
ALTER TABLE orders
  ADD COLUMN shipping_name    text,
  ADD COLUMN shipping_phone   text,
  ADD COLUMN shipping_street  text,
  ADD COLUMN shipping_city    text,
  ADD COLUMN shipping_state   text,
  ADD COLUMN shipping_zip     text,
  ADD COLUMN shipping_country text NOT NULL DEFAULT 'MX';
ALTER TABLE orders DROP COLUMN shipping_address;

-- order_items absorbe designs
ALTER TABLE order_items
  ADD COLUMN design_url    text,
  ADD COLUMN design_width  integer,
  ADD COLUMN design_height integer;
ALTER TABLE order_items DROP COLUMN design_id;

-- Eliminar tabla designs
DROP TABLE designs;
```

### Cambios en lib/

**Archivos eliminados (7):**
- `lib/designs/actions.ts`
- `lib/payment/types.ts`
- `lib/payment/mercadopago.ts`
- `lib/payment/index.ts`
- `app/api/checkout/route.ts`
- `app/api/print-file/route.ts`

**Archivos fusionados (4→1):**
- `lib/fulfillment/{types,manual,printful,index}.ts` → `lib/fulfillment.ts`

**Archivos actualizados:**
- `lib/orders/actions.ts` — llama MercadoPago SDK directo, usa columnas planas de envío, elimina validación de `designId`
- `lib/store/cart.ts` — `CartItem` pierde `designId`, gana `designWidth` + `designHeight`
- `types/domain.ts` — elimina `ShippingAddress` (queda en DB), `Placement` se mantiene
- `types/database.ts` — refleja nuevo schema

### Flujo de upload sin saveDesign

Con la tabla `designs` eliminada, el flujo del customizer cambia:

1. `UploadZone` sube el archivo al bucket `designs/{userId}/{uuid}` (el **bucket de Storage se mantiene**)
2. `UploadZone` obtiene las dimensiones con `new Image()` (ya lo hace hoy)
3. En lugar de llamar `saveDesign`, devuelve `{ url, width, height }` al `CustomizerClient`
4. `CustomizerClient` guarda esos valores en estado local + los pasa al `CartItem` al agregar
5. `createOrder` SA recibe `design_url`, `design_width`, `design_height` desde el cart y los inserta en `order_items`

### Resultado Fase 1

- **−10 archivos** netos en el proyecto
- **−1 tabla** (5 en lugar de 6)
- **0 casts JSONB** en el flujo de checkout (shipping ahora son columnas tipadas)
- El customizer ya no necesita `saveDesign` antes de agregar al carrito — `designUrl` + `placement` van directo al `CartItem` y luego a `order_items` al crear la orden

---

## Fase 2 — Rediseño UI

### Enfoque de implementación

Landing como referencia: rediseñar la landing completa primero. Se convierte en el "design system en acción" del que se extraen los patrones para el resto de páginas.

### Design System

#### Tipografía

| Rol | Fuente | Estilo |
|-----|--------|--------|
| Display / Headings | Fraunces (Google Fonts) | Italic, variable optical |
| Body / UI | Plus Jakarta Sans | Regular / SemiBold / Bold |

Escala:
- Hero: 72–96px, Fraunces italic, tracking -.03em
- H1: 56px, Fraunces italic
- H2: 40px, Fraunces italic o sans bold
- H3: 24px, Plus Jakarta Sans bold
- Body: 16px, regular
- Label: 11px, semibold, uppercase, tracking .1em

#### Paleta de colores

```css
--bg:          #fafaf9   /* blanco cálido, fondo base */
--surface:     #ffffff   /* cards, modals */
--border:      #ebebeb
--text:        #0a0a0a
--text-muted:  #6b7280
--text-faint:  #9ca3af
--brand:       #6c47ff   /* sin cambios */
--brand-soft:  #f0ecff   /* fondo suave para highlights */
```

#### Animaciones (globals.css)

```css
/* fade-up: reveal al entrar en viewport */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* scale-reveal: aparición con escala */
@keyframes scale-reveal {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}
```

- Stagger: `animation-delay: calc(var(--i, 0) * 0.1s)` — se aplica con CSS custom property `--i`
- Parallax hero: `requestAnimationFrame` en JS, sin librería extra — `translateY` proporcional a `scrollY`
- Trigger: `IntersectionObserver` con threshold 0.15 para activar animaciones al scroll

#### Espaciado

- Padding de sección: `120px` vertical desktop / `64px` mobile
- Container: `max-width: 1200px`
- Contenido editorial: `max-width: 960px` (más estrecho = más respirable)

---

### Landing Page — 8 secciones

#### 1. Hero — Split
- Izquierda: label uppercase + headline Fraunces italic + párrafo corto + CTA brand
- Derecha: `MockupPlayera` SVG flotando con parallax lento (translateY negativo al scroll)
- Entrada: `fade-up` escalonado por línea del headline (stagger 0.1s)

#### 2. Stats Bar
- Tres números grandes en Fraunces + label sans debajo
- Sin fondo — solo `border-top` + `border-bottom` en `--border`
- Animación: `scale-reveal` al entrar en viewport

#### 3. Cómo Funciona
- Grid de 3 pasos
- Número del paso en Fraunces italic grande, semitransparente (decorativo)
- Título + descripción corta en sans
- Cada card: `fade-up` escalonado

#### 4. Catálogo / Showcase
- Grid 2 columnas desktop
- `ProductCard` sin sombra, solo `--border`; hover: `scale(1.04)` suave en la playera
- Headline de sección en Fraunces italic

#### 5. Beneficios
- Layout asimétrico: headline grande izquierda, bullets derecha
- Bullets con borde izquierdo en `--brand` (sin iconos)
- Fondo `--brand-soft` muy sutil

#### 6. Testimonios
- Citas en Fraunces italic (el serif da peso)
- Nombre + ciudad en sans muted
- Sin estrellas — solo el texto
- 2 columnas desktop, scroll horizontal mobile

#### 7. Comparativa
- Tabla minimalista: headers sans bold uppercase
- Columna Stampia: fondo `--brand-soft`
- Borde solo en la fila de header
- Animación: `fade-up` por fila

#### 8. CTA Final
- Fondo `--bg`, sin gradientes
- Headline Fraunces italic centrado, grande
- Un botón
- El espacio en blanco hace el trabajo visual

---

### Otras páginas

#### Catálogo (`/catalog`)
Grid 3 columnas desktop. Header con Fraunces italic + contador sans muted. Cards con `--border`, hover sutil.

#### Detalle de producto (`/product/[slug]`)
Split: mockup izquierda sticky, selector de color/talla + CTA derecha. Color swatches circulares con borde activo `--brand`. Precio en Fraunces. `scale-reveal` en mockup al cargar.

#### Customizer (`/customize/[variantId]`)
El canvas es el protagonista — cambios mínimos. Mejoras: toolbar más limpia, DPIWarning en toolbar integrado, CTA en `position: fixed` bottom en mobile.

#### Carrito (`/cart`)
Todo en blanco, items separados por `--border`. Resumen sticky en sidebar desktop, abajo en mobile.

#### Checkout (`/checkout`)
Form columna única, campos grandes. Labels flotantes. Select estilizado para 32 estados. Resumen colapsable en mobile. Sin wizard/pasos.

#### Auth (`/login`, `/register`)
Card centrada sobre `--bg`. Headline en Fraunces italic. Form minimalista.

#### Órdenes del usuario (`/orders`, `/orders/[id]`)
Lista con `StatusBadge` rediseñado (dot + texto, sin color de fondo fuerte). Timeline de estado en el detalle.

#### Admin (`/dashboard`)
Sidebar más delgada, sin gradientes. Tipografía consistente con el sistema. Cambios mínimos — el admin no necesita la expresividad de la tienda.

---

## Orden de implementación

1. **Fase 1 completa** — migración DB + cambios en lib/ + tipos
2. **Design system** — tokens en `globals.css`, Fraunces en `layout.tsx`
3. **Landing** como referencia
4. Extraer patrones → aplicar a catálogo, detalle, carrito, checkout
5. Auth, orders, admin (cambios menores)
