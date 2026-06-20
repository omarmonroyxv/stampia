import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import ProductForm from '@/components/admin/ProductForm'
import VariantManager from '@/components/admin/VariantManager'
import type { PrintArea } from '@/types/domain'

interface Props {
  params: Promise<{ id: string }>
}

export const revalidate = 0

export default async function EditProductPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(`
      id, name, slug, description, base_price_mxn, active,
      mockup_front_url, print_area,
      product_variants (
        id, color_name, color_hex, size, sku, extra_price_mxn
      )
    `)
    .eq('id', id)
    .single()

  if (!product) notFound()

  const printAreaFront = (product.print_area as { front?: PrintArea })?.front

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-neutral-400 mb-6">
        <Link href="/dashboard/products" className="hover:text-neutral-700 transition-colors font-medium">
          Productos
        </Link>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6"/>
        </svg>
        <span className="text-neutral-700 font-semibold">{product.name}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">{product.name}</h1>
          <p className="text-sm text-neutral-400 mt-0.5 font-mono">{product.slug}</p>
        </div>
        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500
                     hover:text-brand transition-colors border border-neutral-200 px-3 py-1.5 rounded-lg hover:border-brand/40"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
          </svg>
          Ver en tienda
        </Link>
      </div>

      {/* Product Form */}
      <ProductForm
        productId={product.id}
        initial={{
          name:             product.name,
          slug:             product.slug,
          description:      product.description ?? '',
          base_price_mxn:   Number(product.base_price_mxn),
          active:           product.active,
          mockup_front_url: product.mockup_front_url ?? '',
          print_area:       (product.print_area as unknown) as { front: PrintArea },
        }}
      />

      {/* Variants */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-extrabold text-neutral-900">Variantes</h2>
            <p className="text-sm text-neutral-400 mt-0.5">
              {product.product_variants?.length ?? 0} variante
              {product.product_variants?.length !== 1 ? 's' : ''} configurada
              {product.product_variants?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
          <VariantManager
            productId={product.id}
            variants={(product.product_variants ?? []) as {
              id: string
              color_name: string
              color_hex: string
              size: string
              sku: string
              extra_price_mxn: number
            }[]}
          />
        </div>
      </div>
    </div>
  )
}
