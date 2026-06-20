import Link from 'next/link'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
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
        <span className="text-neutral-700 font-semibold">Nuevo producto</span>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-neutral-900">Nuevo producto</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Despues de crear el producto podras agregar variantes de color y talla.
        </p>
      </div>

      <ProductForm />
    </div>
  )
}
