import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProductDetail from '@/components/product/ProductDetail'
import type { ProductWithVariants } from '@/types/product'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .eq('active', true)
    .single<{ name: string; description: string | null }>()

  if (!data) return {}
  return {
    title: `${data.name} — Stampia`,
    description: data.description ?? undefined,
  }
}

export const revalidate = 60

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('slug', slug)
    .eq('active', true)
    .single<ProductWithVariants>()

  if (!product) notFound()

  // Ordenar variantes por talla
  const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL']
  product.product_variants = [...product.product_variants].sort(
    (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
  )

  return (
    <>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="layout-container py-3">
          <nav className="flex gap-2 text-sm" style={{ color: 'var(--color-faint)' }}>
            <a href="/catalog" style={{ color: 'var(--color-muted)' }} className="hover:underline">Catálogo</a>
            <span>/</span>
            <span style={{ color: 'var(--color-text)', fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="section-py">
        <div className="layout-container">
          <ProductDetail product={product} />
        </div>
      </div>
    </>
  )
}
