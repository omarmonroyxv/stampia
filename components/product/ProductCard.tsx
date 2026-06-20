import Link from 'next/link'
import MockupPlayera from '@/components/ui/MockupPlayera'
import type { ProductWithVariants } from '@/types/product'

export default function ProductCard({ product }: { product: ProductWithVariants }) {
  const uniqueColors = [...new Map(
    product.product_variants.map(v => [v.color_hex, v])
  ).values()]

  const firstColor = uniqueColors[0]

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block card overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Mockup */}
      <div
        className="relative flex items-center justify-center p-8"
        style={{ background: 'var(--color-bg)', minHeight: '260px' }}
      >
        <div className="transition-transform duration-500 group-hover:scale-105 will-change-transform">
          <MockupPlayera
            color={firstColor?.color_hex ?? '#f0ece8'}
            style={{ width: 200 }}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-sans font-bold text-base">{product.name}</h3>
          <p
            className="font-serif italic text-lg font-bold flex-shrink-0 ml-2"
            style={{ color: 'var(--color-brand)' }}
          >
            ${Number(product.base_price_mxn).toFixed(0)}
          </p>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          {uniqueColors.slice(0, 5).map(v => (
            <div
              key={v.color_hex}
              className="w-4 h-4 rounded-full border-2 transition-transform hover:scale-110"
              style={{
                background: v.color_hex,
                borderColor: 'var(--color-border)',
              }}
              title={v.color_name}
            />
          ))}
          {uniqueColors.length > 5 && (
            <span className="text-xs" style={{ color: 'var(--color-faint)' }}>
              +{uniqueColors.length - 5}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
