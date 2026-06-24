import { createClient } from '@/lib/supabase/server'
import ProductCard from '@/components/product/ProductCard'
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
    <div className="mk min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-24 mk-wash">
        <div className="absolute inset-0 mk-dotgrid opacity-40 pointer-events-none" />
        <div className="layout-container relative z-10 text-center max-w-3xl mx-auto">
          <div>
            <p className="mk-spec mb-4 justify-center">Catálogo Premium</p>
            <h1 className="mk-display text-5xl md:text-6xl mb-6">
              Todos los productos.
            </h1>
            <p className="text-lg mb-8" style={{ color: 'var(--smoke)' }}>
              Explora nuestra colección. Impresión DTF de alta definición, calidad de taller y sin pedidos mínimos.
            </p>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ borderColor: 'var(--line)', background: 'var(--surface)', color: 'var(--ink)' }}>
                {products.length} producto{products.length !== 1 ? 's' : ''} disponible{products.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Marquee Divider */}
      <div className="border-y overflow-hidden bg-white/50" style={{ borderColor: 'var(--line)' }}>
        <div className="mk-marquee py-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
              <span className="mk-spec text-[0.65rem]">Alta Definición DTF</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--cinnabar)' }} />
              <span className="mk-spec text-[0.65rem]">Calidad de Taller</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--cinnabar)' }} />
              <span className="mk-spec text-[0.65rem]">Sin Mínimo de Compra</span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--cinnabar)' }} />
            </div>
          ))}
        </div>
      </div>

      {/* Grid Section */}
      <section className="section-py" style={{ paddingTop: '80px' }}>
        <div className="layout-container">
          {products.length === 0 ? (
            <p className="text-center py-24" style={{ color: 'var(--faint)' }}>
              No hay productos disponibles por ahora.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="animate-fade-up is-visible"
                  style={{ '--i': String(i % 3) } as React.CSSProperties}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
