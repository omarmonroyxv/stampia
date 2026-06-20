# Stampia Fase 1 — Arquitectura y Data Model

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Simplificar el modelo de datos y la capa de backend eliminando la tabla `designs`, aplanando `shipping_address` en columnas, removiendo la abstracción de pagos y consolidando fulfillment en un solo archivo.

**Architecture:** Una migración SQL atómica (007_redesign.sql) aplica todos los cambios de schema. Los tipos TypeScript se actualizan para reflejar el nuevo schema. MercadoPago se llama directo desde `createOrder`. `lib/fulfillment/` (4 archivos) colapsa a `lib/fulfillment.ts` (1 archivo). El customizer ya no llama `saveDesign` — la URL y dimensiones del diseño van directo al CartItem.

**Tech Stack:** Next.js 16.2.7 App Router, TypeScript strict, Supabase CLI, MercadoPago SDK v3, Zustand v5

---

## File Map

| Acción | Archivo |
|--------|---------|
| Crear | `supabase/migrations/007_redesign.sql` |
| Modificar | `types/database.ts` |
| Modificar | `types/domain.ts` |
| Crear | `lib/fulfillment.ts` |
| Eliminar | `lib/fulfillment/types.ts`, `lib/fulfillment/manual.ts`, `lib/fulfillment/printful.ts`, `lib/fulfillment/index.ts` |
| Eliminar | `lib/payment/types.ts`, `lib/payment/mercadopago.ts`, `lib/payment/index.ts` |
| Eliminar | `lib/designs/actions.ts` |
| Eliminar | `app/api/checkout/route.ts`, `app/api/print-file/route.ts` |
| Modificar | `lib/store/cart.ts` |
| Modificar | `lib/orders/actions.ts` |
| Modificar | `lib/admin/actions.ts` |
| Modificar | `components/customizer/UploadZone.tsx` |
| Modificar | `components/customizer/CustomizerClient.tsx` |
| Modificar | `app/(shop)/checkout/page.tsx` |
| Modificar | `app/api/webhook/mercadopago/route.ts` |
| Modificar | `app/(account)/orders/[orderId]/page.tsx` |
| Modificar | `app/(admin)/dashboard/orders/[orderId]/page.tsx` |

---

### Task 1: Migración de schema (007_redesign.sql)

**Files:**
- Create: `supabase/migrations/007_redesign.sql`

- [ ] **Step 1: Crear la migración**

```sql
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
```

- [ ] **Step 2: Aplicar la migración**

```bash
npx supabase db reset
```

Resultado esperado: `Resetting local database...` seguido de `Database reset successful.` sin errores. Si aparece un error de FK (por el `CASCADE` en `designs`), es correcto — los índices dependientes se eliminan automáticamente.

- [ ] **Step 3: Verificar schema**

```bash
npx supabase db diff
```

Resultado esperado: diff vacío (todo está sincronizado con las migraciones).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/007_redesign.sql
git commit -m "chore(db): add migration 007 — remove designs table, flatten shipping, add design cols to order_items"
```

---

### Task 2: Actualizar types/database.ts

**Files:**
- Modify: `types/database.ts`

- [ ] **Step 1: Leer el archivo actual**

Abre `types/database.ts` y localiza las entradas de `designs`, `orders` y `order_items`.

- [ ] **Step 2: Reescribir types/database.ts**

Reemplaza el contenido completo con el nuevo schema (sin tabla `designs`, con shipping columns, con design cols en order_items):

```typescript
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      order_items: {
        Row: {
          id: string
          order_id: string
          variant_id: string
          design_url: string | null
          design_width: number | null
          design_height: number | null
          placement: Json | null
          quantity: number
          unit_price_mxn: number
        }
        Insert: {
          id?: string
          order_id: string
          variant_id: string
          design_url?: string | null
          design_width?: number | null
          design_height?: number | null
          placement?: Json | null
          quantity: number
          unit_price_mxn: number
        }
        Update: {
          id?: string
          order_id?: string
          variant_id?: string
          design_url?: string | null
          design_width?: number | null
          design_height?: number | null
          placement?: Json | null
          quantity?: number
          unit_price_mxn?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: Database['public']['Enums']['order_status']
          total_mxn: number
          shipping_mxn: number
          payment_id: string | null
          fulfillment_ref: string | null
          shipping_name: string | null
          shipping_phone: string | null
          shipping_street: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_zip: string | null
          shipping_country: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: Database['public']['Enums']['order_status']
          total_mxn: number
          shipping_mxn: number
          payment_id?: string | null
          fulfillment_ref?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shipping_country?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: Database['public']['Enums']['order_status']
          total_mxn?: number
          shipping_mxn?: number
          payment_id?: string | null
          fulfillment_ref?: string | null
          shipping_name?: string | null
          shipping_phone?: string | null
          shipping_street?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_zip?: string | null
          shipping_country?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          color_name: string
          color_hex: string
          size: string
          sku: string
          extra_price_mxn: number
          printful_variant_id: string | null
          active: boolean
        }
        Insert: {
          id?: string
          product_id: string
          color_name: string
          color_hex: string
          size: string
          sku: string
          extra_price_mxn?: number
          printful_variant_id?: string | null
          active?: boolean
        }
        Update: {
          id?: string
          product_id?: string
          color_name?: string
          color_hex?: string
          size?: string
          sku?: string
          extra_price_mxn?: number
          printful_variant_id?: string | null
          active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          base_price_mxn: number
          print_area: Json | null
          mockup_front_url: string | null
          active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          base_price_mxn: number
          print_area?: Json | null
          mockup_front_url?: string | null
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          base_price_mxn?: number
          print_area?: Json | null
          mockup_front_url?: string | null
          active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: Database['public']['Enums']['user_role']
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: Database['public']['Enums']['user_role']
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      order_status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
      user_role: 'user' | 'admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Resultado esperado: errores de tipo que mencionan `designs`, `shipping_address`, `design_id` o `designId` — son las referencias viejas que corregiremos en los siguientes tasks. Si ves otro tipo de error no relacionado, investígalo antes de continuar.

- [ ] **Step 4: Commit**

```bash
git add types/database.ts
git commit -m "chore(types): update Database types — remove designs table, flatten orders shipping, update order_items"
```

---

### Task 3: Actualizar types/domain.ts

**Files:**
- Modify: `types/domain.ts`

- [ ] **Step 1: Actualizar types/domain.ts**

Elimina `ShippingAddress`, elimina `designId` de `CartItem`, agrega `designWidth` y `designHeight`:

```typescript
export interface Placement {
  x_pct: number
  y_pct: number
  scale: number
  rotation: number
}

export interface PrintArea {
  width_cm: number
  height_cm: number
  offset_x_pct: number
  offset_y_pct: number
  width_pct: number
  height_pct: number
}

export interface ProductPrintAreas {
  front: PrintArea
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  colorName: string
  colorHex: string
  size: string
  designUrl?: string
  designWidth?: number
  designHeight?: number
  placement?: Placement
  quantity: number
  unitPriceMxn: number
  mockupFrontUrl?: string
}

export interface DPIValidation {
  level: 'ok' | 'warn' | 'error'
  dpi: number
  message: string
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Resultado esperado: errores ahora apuntan a archivos que usan `designId` (cart store, customizer) — se corrigen en los siguientes tasks.

- [ ] **Step 3: Commit**

```bash
git add types/domain.ts
git commit -m "chore(types): remove ShippingAddress, update CartItem (designId → designWidth/Height)"
```

---

### Task 4: Crear lib/fulfillment.ts y eliminar lib/fulfillment/

**Files:**
- Create: `lib/fulfillment.ts`
- Delete: `lib/fulfillment/types.ts`, `lib/fulfillment/manual.ts`, `lib/fulfillment/printful.ts`, `lib/fulfillment/index.ts`

- [ ] **Step 1: Crear lib/fulfillment.ts**

```typescript
// lib/fulfillment.ts

export interface FulfillmentItem {
  variantId: string
  printfulVariantId?: string
  designUrl: string
  quantity: number
}

export interface FulfillmentOrder {
  orderId: string
  items: FulfillmentItem[]
  shipping: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface FulfillmentResult {
  success: boolean
  externalRef?: string
  error?: string
}

export interface FulfillmentProvider {
  createOrder(order: FulfillmentOrder): Promise<FulfillmentResult>
}

class ManualProvider implements FulfillmentProvider {
  async createOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    console.log('[ManualFulfillment] New order:', order.orderId)
    return { success: true, externalRef: order.orderId }
  }
}

class PrintfulProvider implements FulfillmentProvider {
  private readonly apiKey = process.env.PRINTFUL_API_KEY!

  async createOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    const body = {
      external_id: order.orderId,
      shipping: 'STANDARD',
      recipient: {
        name: order.shipping.name,
        phone: order.shipping.phone,
        address1: order.shipping.street,
        city: order.shipping.city,
        state_code: order.shipping.state.slice(0, 2).toUpperCase(),
        zip: order.shipping.zip,
        country_code: order.shipping.country,
      },
      items: order.items.map(item => ({
        variant_id: Number(item.printfulVariantId),
        quantity: item.quantity,
        files: [{ type: 'front', url: item.designUrl }],
      })),
    }

    const res = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return { success: false, error: await res.text() }
    const data = await res.json() as { result: { id: number } }
    return { success: true, externalRef: String(data.result.id) }
  }
}

export function getFulfillmentProvider(): FulfillmentProvider {
  return process.env.FULFILLMENT_PROVIDER === 'printful'
    ? new PrintfulProvider()
    : new ManualProvider()
}
```

- [ ] **Step 2: Eliminar lib/fulfillment/ (los 4 archivos)**

```bash
rm lib/fulfillment/types.ts lib/fulfillment/manual.ts lib/fulfillment/printful.ts lib/fulfillment/index.ts
rmdir lib/fulfillment
```

En PowerShell:
```powershell
Remove-Item lib/fulfillment/types.ts, lib/fulfillment/manual.ts, lib/fulfillment/printful.ts, lib/fulfillment/index.ts
Remove-Item lib/fulfillment
```

- [ ] **Step 3: Actualizar imports en app/api/webhook/mercadopago/route.ts**

Localiza la línea que importa de `@/lib/fulfillment` y actualízala si hace falta (el path cambia de `@/lib/fulfillment` a `@/lib/fulfillment` — no cambia, solo se asegura que el import sea del archivo, no del folder):

```typescript
// Antes (puede ser uno de estos):
import { getFulfillmentProvider } from '@/lib/fulfillment'
import { getFulfillmentProvider } from '@/lib/fulfillment/index'

// Después (solo si era /index):
import { getFulfillmentProvider } from '@/lib/fulfillment'
```

- [ ] **Step 4: Actualizar imports en lib/admin/actions.ts si importa de lib/fulfillment**

```bash
grep -r "lib/fulfillment" --include="*.ts" --include="*.tsx" .
```

Cada archivo que tenga `from '@/lib/fulfillment/index'` o `from '@/lib/fulfillment/types'` debe actualizarse a `from '@/lib/fulfillment'`.

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

Resultado esperado: sin nuevos errores relacionados con fulfillment.

- [ ] **Step 6: Commit**

```bash
git add lib/fulfillment.ts
git rm lib/fulfillment/types.ts lib/fulfillment/manual.ts lib/fulfillment/printful.ts lib/fulfillment/index.ts
git commit -m "refactor(fulfillment): consolidate 4 files into lib/fulfillment.ts"
```

---

### Task 5: Eliminar lib/payment/, lib/designs/, y stubs de API

**Files:**
- Delete: `lib/payment/types.ts`, `lib/payment/mercadopago.ts`, `lib/payment/index.ts`
- Delete: `lib/designs/actions.ts`
- Delete: `app/api/checkout/route.ts`, `app/api/print-file/route.ts`

- [ ] **Step 1: Verificar que nadie más importa lib/payment**

```bash
grep -r "lib/payment" --include="*.ts" --include="*.tsx" .
```

Resultado esperado: solo `lib/orders/actions.ts` importa de `lib/payment`. Lo actualizaremos en Task 6. Si hay otros archivos, actualiza esos imports antes de continuar.

- [ ] **Step 2: Verificar que nadie más importa lib/designs**

```bash
grep -r "lib/designs\|saveDesign" --include="*.ts" --include="*.tsx" .
```

Resultado esperado: `components/customizer/UploadZone.tsx` y/o `CustomizerClient.tsx`. Lo actualizaremos en Task 7.

- [ ] **Step 3: Eliminar archivos**

PowerShell:
```powershell
Remove-Item lib/payment/types.ts, lib/payment/mercadopago.ts, lib/payment/index.ts
Remove-Item lib/payment
Remove-Item lib/designs/actions.ts
Remove-Item lib/designs
Remove-Item app/api/checkout/route.ts
Remove-Item app/api/print-file/route.ts
```

- [ ] **Step 4: Commit**

```bash
git rm lib/payment/types.ts lib/payment/mercadopago.ts lib/payment/index.ts
git rm lib/designs/actions.ts
git rm app/api/checkout/route.ts app/api/print-file/route.ts
git commit -m "chore: remove lib/payment, lib/designs, and 501 API stubs"
```

---

### Task 6: Actualizar lib/store/cart.ts

**Files:**
- Modify: `lib/store/cart.ts`

- [ ] **Step 1: Reescribir lib/store/cart.ts**

El cambio clave: dedup key usa `designUrl` en vez de `designId`. Se eliminan referencias a `designId`.

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Placement } from '@/types/domain'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string, designUrl?: string) => void
  updateQuantity: (variantId: string, designUrl: string | undefined, quantity: number) => void
  clear: () => void
  totalItems: () => number
  totalPrice: () => number
}

function itemKey(variantId: string, designUrl?: string) {
  return `${variantId}-${designUrl ?? 'no-design'}`
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const key = itemKey(item.variantId, item.designUrl)
        set(state => {
          const existing = state.items.find(
            i => itemKey(i.variantId, i.designUrl) === key
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                itemKey(i.variantId, i.designUrl) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (variantId, designUrl) => {
        const key = itemKey(variantId, designUrl)
        set(state => ({
          items: state.items.filter(
            i => itemKey(i.variantId, i.designUrl) !== key
          ),
        }))
      },

      updateQuantity: (variantId, designUrl, quantity) => {
        const key = itemKey(variantId, designUrl)
        if (quantity <= 0) {
          get().removeItem(variantId, designUrl)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            itemKey(i.variantId, i.designUrl) === key ? { ...i, quantity } : i
          ),
        }))
      },

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.unitPriceMxn * i.quantity, 0),
    }),
    { name: 'stampia-cart' }
  )
)
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add lib/store/cart.ts
git commit -m "refactor(cart): replace designId with designUrl as dedup key, add designWidth/Height to CartItem"
```

---

### Task 7: Actualizar lib/orders/actions.ts

**Files:**
- Modify: `lib/orders/actions.ts`

- [ ] **Step 1: Reescribir lib/orders/actions.ts**

```typescript
'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import MercadoPagoConfig, { Preference } from 'mercadopago'
import type { CartItem } from '@/types/domain'
import type { Json } from '@/types/database'

interface ShippingInput {
  name: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country?: string
}

export async function createOrder(
  items: CartItem[],
  shipping: ShippingInput
): Promise<{ error?: string; init_point?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (!items.length) return { error: 'Carrito vacío' }

  // Validate variants + prices from DB (never trust client prices)
  const variantIds = [...new Set(items.map(i => i.variantId))]
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, extra_price_mxn, product:products(base_price_mxn)')
    .in('id', variantIds)

  if (!variants || variants.length !== variantIds.length) {
    return { error: 'Variantes inválidas' }
  }

  const SHIPPING_MXN = 99
  const variantPriceMap = new Map(
    variants.map(v => [
      v.id,
      Number((v.product as { base_price_mxn: number }).base_price_mxn) +
        Number(v.extra_price_mxn),
    ])
  )

  let subtotal = 0
  for (const item of items) {
    const price = variantPriceMap.get(item.variantId)
    if (!price) return { error: 'Precio no encontrado' }
    subtotal += price * item.quantity
  }
  const total = subtotal + SHIPPING_MXN

  const admin = createAdminClient()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      total_mxn: total,
      shipping_mxn: SHIPPING_MXN,
      shipping_name: shipping.name,
      shipping_phone: shipping.phone,
      shipping_street: shipping.street,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_zip: shipping.zip,
      shipping_country: shipping.country ?? 'MX',
    })
    .select('id')
    .single()

  if (orderError || !order) return { error: orderError?.message ?? 'Error al crear orden' }

  const orderItems = items.map(item => ({
    order_id: order.id,
    variant_id: item.variantId,
    design_url: item.designUrl ?? null,
    design_width: item.designWidth ?? null,
    design_height: item.designHeight ?? null,
    placement: (item.placement ?? null) as Json | null,
    quantity: item.quantity,
    unit_price_mxn: variantPriceMap.get(item.variantId)!,
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  // Direct MercadoPago call (no abstraction)
  const mp = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
  })
  const preference = new Preference(mp)

  try {
    const result = await preference.create({
      body: {
        items: [
          {
            id: order.id,
            title: `Stampia Order #${order.id.slice(0, 8)}`,
            quantity: 1,
            unit_price: total,
            currency_id: 'MXN',
          },
        ],
        external_reference: order.id,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
        },
        auto_return: 'approved',
      },
    })
    if (!result.init_point) return { error: 'Error al crear preferencia de pago' }
    return { init_point: result.init_point }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Resultado esperado: errores de tipo reducidos significativamente. Los errores restantes deben ser de archivos que aún referencian `ShippingAddress` o `designId` (checkout, webhook, admin orders).

- [ ] **Step 3: Commit**

```bash
git add lib/orders/actions.ts
git commit -m "refactor(orders): direct MercadoPago call, flat shipping columns, no design ownership check"
```

---

### Task 8: Actualizar UploadZone.tsx — eliminar saveDesign

**Files:**
- Modify: `components/customizer/UploadZone.tsx`

- [ ] **Step 1: Localizar la llamada a saveDesign en UploadZone.tsx**

Abre `components/customizer/UploadZone.tsx`. Busca la importación de `saveDesign` y el bloque que la llama tras subir el archivo.

- [ ] **Step 2: Actualizar la firma del callback y eliminar saveDesign**

El callback `onUploadComplete` actualmente recibe `(designId: string, url: string)`. Cámbialo a `(url: string, width: number, height: number)`.

Localiza el bloque donde se hace el upload, se obtienen las dimensiones con `new Image()` y se llama `saveDesign`. Reemplázalo:

```typescript
// Eliminar esta importación:
// import { saveDesign } from '@/lib/designs/actions'

// El callback prop ahora es:
// onUploadComplete: (url: string, width: number, height: number) => void

// Donde antes llamabas saveDesign, reemplaza por:
const img = new Image()
img.onload = () => {
  onUploadComplete(publicUrl, img.naturalWidth, img.naturalHeight)
}
img.src = publicUrl
```

El resto del componente (drag-drop, upload a Supabase Storage, validación de tipo/tamaño) no cambia.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add components/customizer/UploadZone.tsx
git commit -m "refactor(UploadZone): remove saveDesign call, pass (url, width, height) to callback"
```

---

### Task 9: Actualizar CustomizerClient.tsx

**Files:**
- Modify: `components/customizer/CustomizerClient.tsx`

- [ ] **Step 1: Actualizar el state y el handler de UploadZone**

Localiza en `CustomizerClient.tsx` el estado que guarda `designId`, `designUrl`. Reemplaza con:

```typescript
// Antes:
const [designId, setDesignId] = useState<string | undefined>()
const [designUrl, setDesignUrl] = useState<string | undefined>()

// Después:
const [designUrl, setDesignUrl] = useState<string | undefined>()
const [designWidth, setDesignWidth] = useState<number | undefined>()
const [designHeight, setDesignHeight] = useState<number | undefined>()
```

- [ ] **Step 2: Actualizar el handler de onUploadComplete**

```typescript
// Antes:
const handleUploadComplete = async (designId: string, url: string) => {
  setDesignId(designId)
  setDesignUrl(url)
  // añade imagen al canvas...
}

// Después:
const handleUploadComplete = (url: string, width: number, height: number) => {
  setDesignUrl(url)
  setDesignWidth(width)
  setDesignHeight(height)
  // añade imagen al canvas (sin cambios aquí)...
}
```

- [ ] **Step 3: Actualizar la llamada a addItem**

Localiza donde se llama a `useCart().addItem(...)`. Reemplaza:

```typescript
// Antes:
addItem({
  variantId: variant.id,
  productId: product.id,
  productName: product.name,
  colorName: variant.color_name,
  colorHex: variant.color_hex,
  size: variant.size,
  designId,
  designUrl,
  placement,
  quantity,
  unitPriceMxn: unitPrice,
  mockupFrontUrl: product.mockup_front_url ?? undefined,
})

// Después:
addItem({
  variantId: variant.id,
  productId: product.id,
  productName: product.name,
  colorName: variant.color_name,
  colorHex: variant.color_hex,
  size: variant.size,
  designUrl,
  designWidth,
  designHeight,
  placement,
  quantity,
  unitPriceMxn: unitPrice,
  mockupFrontUrl: product.mockup_front_url ?? undefined,
})
```

- [ ] **Step 4: Actualizar la validación "botón disabled"**

Si hay una condición como `!designId` para deshabilitar el botón de añadir al carrito, cámbiala a `!designUrl`:

```typescript
// Antes: disabled={!designId || !hasObjects}
// Después:
disabled={!designUrl || !hasObjects}
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add components/customizer/CustomizerClient.tsx
git commit -m "refactor(CustomizerClient): remove designId state, use designUrl/Width/Height from UploadZone"
```

---

### Task 10: Actualizar checkout/page.tsx

**Files:**
- Modify: `app/(shop)/checkout/page.tsx`

- [ ] **Step 1: Eliminar la importación de ShippingAddress**

Localiza en `checkout/page.tsx`:
```typescript
import type { ShippingAddress } from '@/types/domain'
```
Elimina esa línea.

- [ ] **Step 2: Actualizar el tipo del objeto de envío**

Donde se construye el objeto de envío antes de llamar a `createOrder`, reemplaza el tipo `ShippingAddress` por el inline:

```typescript
// Antes:
const shipping: ShippingAddress = {
  name: formData.get('name') as string,
  // ...
}

// Después (sin anotación de tipo explícita, inferencia de TypeScript):
const shipping = {
  name: formData.get('name') as string,
  phone: formData.get('phone') as string,
  street: formData.get('street') as string,
  city: formData.get('city') as string,
  state: formData.get('state') as string,
  zip: formData.get('zip') as string,
  country: 'MX',
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add app/(shop)/checkout/page.tsx
git commit -m "refactor(checkout): remove ShippingAddress import, use inline type"
```

---

### Task 11: Actualizar webhook de MercadoPago

**Files:**
- Modify: `app/api/webhook/mercadopago/route.ts`

- [ ] **Step 1: Reescribir la verificación de firma**

Localiza en `app/api/webhook/mercadopago/route.ts` la llamada a `getPaymentProvider().verifyWebhook()`. Reemplázala con verificación HMAC inline:

```typescript
import crypto from 'crypto'

function verifyMercadoPagoSignature(
  req: Request,
  dataId: string
): boolean {
  const signature = req.headers.get('x-signature')
  const requestId = req.headers.get('x-request-id')
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!signature || !requestId || !secret) return false

  const ts = signature.match(/ts=([^,]+)/)?.[1]
  const v1 = signature.match(/v1=([^,]+)/)?.[1]
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(manifest)
    .digest('hex')

  return hmac === v1
}
```

Elimina el import de `getPaymentProvider` y la llamada anterior.

- [ ] **Step 2: Actualizar la query de la orden (shipping aplanado)**

Localiza el SELECT de la orden en la webhook route y actualiza los campos de envío:

```typescript
const { data: order } = await admin
  .from('orders')
  .select(`
    id, user_id, total_mxn,
    shipping_name, shipping_phone, shipping_street,
    shipping_city, shipping_state, shipping_zip, shipping_country,
    order_items (
      variant_id, design_url, placement, quantity,
      product_variant:product_variants ( printful_variant_id )
    )
  `)
  .eq('id', orderId)
  .eq('status', 'pending')
  .single()
```

- [ ] **Step 3: Actualizar la llamada a getFulfillmentProvider**

```typescript
await getFulfillmentProvider().createOrder({
  orderId: order.id,
  items: (order.order_items ?? []).map(item => ({
    variantId: item.variant_id,
    printfulVariantId:
      (item.product_variant as { printful_variant_id?: string | null })
        ?.printful_variant_id ?? undefined,
    designUrl: item.design_url ?? '',
    quantity: item.quantity,
  })),
  shipping: {
    name: order.shipping_name ?? '',
    phone: order.shipping_phone ?? '',
    street: order.shipping_street ?? '',
    city: order.shipping_city ?? '',
    state: order.shipping_state ?? '',
    zip: order.shipping_zip ?? '',
    country: order.shipping_country,
  },
})
```

- [ ] **Step 4: Actualizar import de fulfillment**

```typescript
import { getFulfillmentProvider } from '@/lib/fulfillment'
```

- [ ] **Step 5: Type-check**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add app/api/webhook/mercadopago/route.ts
git commit -m "refactor(webhook/mp): inline HMAC verification, use flat shipping columns from orders"
```

---

### Task 12: Actualizar páginas de detalle de orden

**Files:**
- Modify: `app/(account)/orders/[orderId]/page.tsx`
- Modify: `app/(admin)/dashboard/orders/[orderId]/page.tsx`

- [ ] **Step 1: Actualizar app/(account)/orders/[orderId]/page.tsx**

Localiza el SELECT de la orden y reemplaza `shipping_address` por las columnas planas:

```typescript
const { data: order } = await supabase
  .from('orders')
  .select(`
    id, status, total_mxn, shipping_mxn, created_at,
    shipping_name, shipping_phone, shipping_street,
    shipping_city, shipping_state, shipping_zip, shipping_country,
    order_items (
      id, design_url, placement, quantity, unit_price_mxn,
      variant:product_variants ( color_name, color_hex, size,
        product:products ( name, mockup_front_url )
      )
    )
  `)
  .eq('id', orderId)
  .eq('user_id', user.id)
  .single()
```

En el JSX, reemplaza `order.shipping_address.name` etc. por:

```tsx
<p>{order.shipping_name}</p>
<p>{order.shipping_street}</p>
<p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
<p>{order.shipping_country}</p>
```

- [ ] **Step 2: Aplicar el mismo cambio en app/(admin)/dashboard/orders/[orderId]/page.tsx**

Mismo patrón: reemplazar `shipping_address` JSONB por columnas planas en el SELECT y en el JSX.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Resultado esperado: 0 errores.

- [ ] **Step 4: Commit**

```bash
git add app/(account)/orders/[orderId]/page.tsx app/(admin)/dashboard/orders/[orderId]/page.tsx
git commit -m "refactor(orders): read flat shipping columns instead of shipping_address JSONB"
```

---

### Task 13: Actualizar lib/admin/actions.ts

**Files:**
- Modify: `lib/admin/actions.ts`

- [ ] **Step 1: Actualizar retriggerFulfillment**

Localiza `retriggerFulfillment` en `lib/admin/actions.ts`. Actualmente lee `shipping_address` JSONB. Actualiza el SELECT:

```typescript
const { data: order } = await admin
  .from('orders')
  .select(`
    id, total_mxn,
    shipping_name, shipping_phone, shipping_street,
    shipping_city, shipping_state, shipping_zip, shipping_country,
    order_items (
      variant_id, design_url, quantity,
      product_variant:product_variants ( printful_variant_id )
    )
  `)
  .eq('id', orderId)
  .single()
```

Y la llamada a `getFulfillmentProvider().createOrder(...)`:

```typescript
await getFulfillmentProvider().createOrder({
  orderId: order.id,
  items: (order.order_items ?? []).map(item => ({
    variantId: item.variant_id,
    printfulVariantId:
      (item.product_variant as { printful_variant_id?: string | null })
        ?.printful_variant_id ?? undefined,
    designUrl: item.design_url ?? '',
    quantity: item.quantity,
  })),
  shipping: {
    name: order.shipping_name ?? '',
    phone: order.shipping_phone ?? '',
    street: order.shipping_street ?? '',
    city: order.shipping_city ?? '',
    state: order.shipping_state ?? '',
    zip: order.shipping_zip ?? '',
    country: order.shipping_country,
  },
})
```

- [ ] **Step 2: Actualizar import de fulfillment**

```typescript
import { getFulfillmentProvider } from '@/lib/fulfillment'
```

- [ ] **Step 3: Type-check final**

```bash
npx tsc --noEmit
```

Resultado esperado: **0 errores**.

- [ ] **Step 4: Build de verificación**

```bash
npm run build
```

Resultado esperado: build exitoso sin errores de compilación. Warnings de ESLint son aceptables si no bloquean el build.

- [ ] **Step 5: Commit**

```bash
git add lib/admin/actions.ts
git commit -m "refactor(admin): update retriggerFulfillment to use flat shipping columns"
```

---

### Task 14: Smoke test manual

**Files:** Ninguno (solo verificación)

- [ ] **Step 1: Iniciar el servidor de desarrollo**

```bash
npm run dev
```

- [ ] **Step 2: Verificar que el customizer funciona**

1. Ve a `/catalog` — los productos deben cargar
2. Haz click en "Personalizar" (requiere estar logueado)
3. Sube una imagen — debe aparecer en el canvas sin errores en consola relacionados con `saveDesign`
4. Añade al carrito — debe funcionar

- [ ] **Step 3: Verificar la página de carrito**

1. Ve a `/cart` — los items deben mostrarse correctamente
2. Verifica que la cantidad de items es correcta en el `CartBadge`

- [ ] **Step 4: Verificar el checkout (hasta el formulario)**

1. Ve a `/checkout`
2. Llena el formulario de envío — los campos deben existir (nombre, teléfono, calle, ciudad, estado, CP)
3. No es necesario completar el pago en esta verificación

- [ ] **Step 5: Commit final del task**

```bash
git commit --allow-empty -m "chore: smoke test passed — Fase 1 arquitectura completa"
```
