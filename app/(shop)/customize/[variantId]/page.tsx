import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CustomizerClient from '@/components/customizer/CustomizerClient'
import type { PrintArea } from '@/types/domain'

interface Props {
  params: Promise<{ variantId: string }>
}

interface VariantWithProduct {
  id: string
  product_id: string
  color_name: string
  color_hex: string
  size: string
  sku: string
  printful_variant_id: string | null
  extra_price_mxn: number
  products: {
    name: string
    mockup_front_url: string | null
    print_area: { front: PrintArea }
    active: boolean
  }
}

export default async function CustomizePage({ params }: Props) {
  const { variantId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/customize/${variantId}`)

  const { data: variant } = await supabase
    .from('product_variants')
    .select(`
      id,
      product_id,
      color_name,
      color_hex,
      size,
      sku,
      printful_variant_id,
      extra_price_mxn,
      products (
        name,
        mockup_front_url,
        print_area,
        active
      )
    `)
    .eq('id', variantId)
    .single<VariantWithProduct>()

  if (!variant?.products) notFound()

  const product = Array.isArray(variant.products) ? variant.products[0] : variant.products
  if (!product?.active) notFound()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-neutral-900 mb-6">Personaliza tu diseño</h1>

      <CustomizerClient
        userId={user.id}
        variant={{
          ...variant,
          products: product,
        }}
      />
    </div>
  )
}
