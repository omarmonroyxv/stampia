import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/product/ProductCard'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import type { ProductWithVariants } from '@/types/product'

export const revalidate = 60

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*, product_variants(*)')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .returns<ProductWithVariants[]>()

  if (error) {
    return (
      <div className="section-py">
        <div className="layout-container">
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Error al cargar el catálogo.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="section-py">
      <div className="layout-container">
        <AnimateOnScroll>
          <div className="mb-12">
            <p className="label-sm mb-3">Catálogo</p>
            <h1
              className="font-serif italic text-5xl tracking-tight"
              style={{ color: 'var(--color-text)' }}
            >
              Todos los productos.
            </h1>
            <p className="mt-3 text-sm" style={{ color: 'var(--color-muted)' }}>
              {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
            </p>
          </div>
        </AnimateOnScroll>

        {products.length === 0 ? (
          <p className="text-center py-24" style={{ color: 'var(--color-muted)' }}>
            No hay productos disponibles por ahora.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i % 3}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
