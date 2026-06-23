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
      className="group block mk-prodcard rounded-2xl overflow-hidden relative"
    >
      {/* Dynamic glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(236,58,18,0.08), transparent 70%)' }} />

      {/* Mockup */}
      <div
        className="relative flex items-center justify-center p-8 overflow-hidden"
        style={{ minHeight: '300px' }}
      >
        <div className="absolute inset-0 mk-dotgrid opacity-30 pointer-events-none" />
        <div className="relative z-10 transition-transform duration-500 group-hover:scale-105 will-change-transform flex justify-center w-full">
          {product.mockup_front_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={product.mockup_front_url} 
              alt={product.name}
              style={{ width: 220, height: 220, objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))' }}
            />
          ) : (
            <MockupPlayera
              color={firstColor?.color_hex ?? '#f0ece8'}
              style={{ width: 220, filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))' }}
            />
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-6 border-t relative z-10" style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}>
        <div className="flex items-start justify-between mb-3 gap-4">
          <h3 className="font-sans font-bold text-[1.05rem] leading-snug" style={{ color: 'var(--ink)' }}>{product.name}</h3>
          <p
            className="mk-display text-lg tracking-tight flex-shrink-0"
            style={{ color: 'var(--cinnabar)' }}
          >
            ${Number(product.base_price_mxn).toFixed(0)}
          </p>
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5">
          {uniqueColors.slice(0, 5).map(v => (
            <div
              key={v.color_hex}
              className="w-4 h-4 rounded-full border border-black/10 transition-transform group-hover:scale-110"
              style={{ background: v.color_hex, boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}
              title={v.color_name}
            />
          ))}
          {uniqueColors.length > 5 && (
            <span className="text-xs font-semibold ml-1" style={{ color: 'var(--faint)' }}>
              +{uniqueColors.length - 5}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
