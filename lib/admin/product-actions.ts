'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ProductPrintAreas } from '@/types/domain'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('No autorizado')
  return user
}

export interface ProductFormData {
  name:             string
  slug:             string
  description:      string
  base_price_mxn:   number
  print_area:       ProductPrintAreas
  mockup_front_url: string
  active:           boolean
}

// Supabase types expect Json for print_area; use explicit row type to bypass
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>

export async function createProduct(data: ProductFormData): Promise<{ id?: string; error?: string }> {
  try { await assertAdmin() } catch (e) { return { error: (e as Error).message } }
  const supabase = createAdminClient()
  const row: AnyRecord = { ...data, print_area: data.print_area }
  const { data: product, error } = await supabase
    .from('products')
    .insert(row as AnyRecord)
    .select('id')
    .single()
  if (error) return { error: error.message }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { id: (product as any).id }
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<{ error?: string }> {
  try { await assertAdmin() } catch (e) { return { error: (e as Error).message } }
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('products')
    .update(data as never)
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/products')
  revalidatePath('/dashboard/products/' + id)
  return {}
}

export async function toggleProductActive(id: string, active: boolean): Promise<{ error?: string }> {
  return updateProduct(id, { active })
}

export interface VariantFormData {
  product_id:           string
  color_name:           string
  color_hex:            string
  size:                 string
  sku:                  string
  extra_price_mxn:      number
  printful_variant_id?: string
}

export async function createVariant(data: VariantFormData): Promise<{ id?: string; error?: string }> {
  try { await assertAdmin() } catch (e) { return { error: (e as Error).message } }
  const supabase = createAdminClient()
  const { data: variant, error } = await supabase
    .from('product_variants')
    .insert(data as AnyRecord)
    .select('id')
    .single()
  if (error) return { error: error.message }
  revalidatePath('/dashboard/products/' + data.product_id)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { id: (variant as any).id }
}

export async function updateVariant(id: string, productId: string, data: Partial<Omit<VariantFormData, 'product_id'>>): Promise<{ error?: string }> {
  try { await assertAdmin() } catch (e) { return { error: (e as Error).message } }
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('product_variants')
    .update(data as never)
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/products/' + productId)
  return {}
}

export async function deleteVariant(id: string, productId: string): Promise<{ error?: string }> {
  try { await assertAdmin() } catch (e) { return { error: (e as Error).message } }
  const supabase = createAdminClient()
  const { error } = await supabase.from('product_variants').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/products/' + productId)
  return {}
}
