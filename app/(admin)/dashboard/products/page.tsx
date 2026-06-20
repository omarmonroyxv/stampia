import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { toggleProductActive } from '@/lib/admin/product-actions'

export const revalidate = 0

export default async function ProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select(`
      id, name, slug, base_price_mxn, active, created_at,
      product_variants ( id )
    `)
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Productos</h1>
          <p className="text-sm text-neutral-400 mt-0.5">
            {products?.length ?? 0} producto{products?.length !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Link
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl
                     text-sm font-bold hover:bg-brand-dark transition-colors shadow-sm hover:shadow-brand/20 hover:shadow-md"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nuevo producto
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        {products && products.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/80">
                <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Variantes</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Precio base</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-neutral-500 uppercase tracking-wide">Estado</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-neutral-900">{p.name}</p>
                    <p className="text-xs text-neutral-400 font-mono mt-0.5">{p.slug}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold
                                     bg-neutral-100 text-neutral-600">
                      {(p.product_variants as { id: string }[])?.length ?? 0} variantes
                    </span>
                  </td>
                  <td className="px-5 py-4 font-bold text-neutral-900">
                    ${Number(p.base_price_mxn).toFixed(0)}
                    <span className="text-xs font-normal text-neutral-400 ml-1">MXN</span>
                  </td>
                  <td className="px-5 py-4">
                    <form action={async () => {
                      'use server'
                      await toggleProductActive(p.id, !p.active)
                    }}>
                      <button
                        type="submit"
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                                    transition-colors cursor-pointer border
                          ${p.active
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-neutral-100 text-neutral-500 border-neutral-200 hover:bg-neutral-200'
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${p.active ? 'bg-green-500' : 'bg-neutral-400'}`} />
                        {p.active ? 'Activo' : 'Inactivo'}
                      </button>
                    </form>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/dashboard/products/${p.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
                    >
                      Editar
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand/8 flex items-center justify-center mx-auto mb-4 text-brand">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
              </svg>
            </div>
            <p className="font-bold text-neutral-700">No hay productos todavia</p>
            <p className="text-sm text-neutral-400 mt-1">Crea tu primer producto para empezar a vender</p>
            <Link
              href="/dashboard/products/new"
              className="inline-flex items-center gap-2 mt-4 bg-brand text-white px-5 py-2.5 rounded-xl
                         text-sm font-bold hover:bg-brand-dark transition-colors"
            >
              Crear primer producto
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
