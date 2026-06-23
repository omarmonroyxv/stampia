import type { ProductPrintAreas } from './domain'

// Shape del producto tal como lo devuelve Supabase (con variantes embebidas)
export interface ProductWithVariants {
  id: string
  slug: string
  name: string
  description: string | null
  base_price_mxn: number
  print_area: ProductPrintAreas
  mockup_front_url: string | null
  active: boolean
  product_variants: Variant[]
}

export interface Variant {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  size: string
  sku: string
  printful_variant_id: string | null
  extra_price_mxn: number
}

// Colores únicos derivados de las variantes
export interface ColorOption {
  name: string
  hex: string
}

export const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL'] as const
export type Size = string
