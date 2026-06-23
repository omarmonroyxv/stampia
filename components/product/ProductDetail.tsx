'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Printer, Package, CheckCircle2, Palette, Zap } from 'lucide-react'
import type { ProductWithVariants, ColorOption, Size } from '@/types/product'
import { SIZE_ORDER } from '@/types/product'
import MockupPlayera from '@/components/ui/MockupPlayera'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

function uniqueColors(variants: ProductWithVariants['product_variants']): ColorOption[] {
  const seen = new Set<string>()
  return variants.reduce<ColorOption[]>((acc, v) => {
    if (!seen.has(v.color_hex)) {
      seen.add(v.color_hex)
      acc.push({ name: v.color_name, hex: v.color_hex })
    }
    return acc
  }, [])
}

const TRUST_BADGES = [
  { Icon: Printer, label: 'Impresión DTF premium' },
  { Icon: Package, label: 'Envío a todo México' },
  { Icon: CheckCircle2, label: 'Sin mínimo de piezas' },
  { Icon: Palette, label: 'Tu diseño en minutos' },
]

const SIZE_GUIDE = [
  { size: 'S',   chest: '88–93', length: '70' },
  { size: 'M',   chest: '94–99', length: '72' },
  { size: 'L',   chest: '100–105', length: '74' },
  { size: 'XL',  chest: '106–111', length: '76' },
  { size: 'XXL', chest: '112–117', length: '78' },
]

export default function ProductDetail({ product }: { product: ProductWithVariants }) {
  const router = useRouter()
  const colors = useMemo(() => uniqueColors(product.product_variants), [product.product_variants])

  const [selectedColor, setSelectedColor] = useState<ColorOption>(colors[0]!)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [qty, setQty] = useState(1)

  const availableSizes = useMemo(
    () => SIZE_ORDER.filter((s) =>
      product.product_variants.some((v) => v.color_hex === selectedColor.hex && v.size === s),
    ),
    [product.product_variants, selectedColor],
  )

  const selectedVariant = useMemo(
    () => selectedSize
      ? product.product_variants.find((v) => v.color_hex === selectedColor.hex && v.size === selectedSize)
      : null,
    [product.product_variants, selectedColor, selectedSize],
  )

  const unitPrice = product.base_price_mxn + (selectedVariant?.extra_price_mxn ?? 0)
  const totalPrice = unitPrice * qty

  function handleColorSelect(c: ColorOption) {
    setSelectedColor(c)
    setSelectedSize(null)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-0 lg:gap-16 items-start">

      {/* ── LEFT: Mockup ── */}
      <div className="lg:sticky lg:top-24 mb-10 lg:mb-0">
        {/* Main mockup card */}
        <div
          className="relative rounded-3xl overflow-hidden flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #F5F4F2 0%, #ECEAE6 100%)',
            aspectRatio: '1 / 1',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Color swatch pill — top left */}
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: 'var(--color-text)' }}
          >
            <span
              className="w-3 h-3 rounded-full inline-block border border-black/10"
              style={{ background: selectedColor.hex }}
            />
            {selectedColor.name}
          </div>

          {/* DTF badge — top right */}
          <div
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide"
            style={{ background: 'var(--color-brand)', color: '#fff' }}
          >
            DTF
          </div>

          <div className="animate-scale-reveal is-visible p-10 w-full flex items-center justify-center">
            {product.mockup_front_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={product.mockup_front_url} 
                alt={product.name}
                style={{ width: '100%', maxWidth: '320px', objectFit: 'contain', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.08))' }}
              />
            ) : (
              <MockupPlayera
                color={selectedColor.hex}
                className="w-full max-w-[320px]"
              />
            )}
          </div>
        </div>

        {/* Color thumbnails strip */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {colors.map(color => (
            <button
              key={color.hex}
              onClick={() => handleColorSelect(color)}
              title={color.name}
              aria-label={color.name}
              aria-pressed={selectedColor.hex === color.hex}
              className="w-10 h-10 rounded-xl transition-all duration-200 hover:scale-105"
              style={{
                background: color.hex,
                outline: selectedColor.hex === color.hex
                  ? '2.5px solid var(--color-brand)'
                  : '2px solid transparent',
                outlineOffset: '2px',
                border: '1.5px solid rgba(0,0,0,0.1)',
                boxShadow: selectedColor.hex === color.hex ? '0 0 0 4px rgba(236,58,18,0.12)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {TRUST_BADGES.map(b => (
            <div
              key={b.label}
              className="flex items-center gap-2 px-3 py-3 rounded-xl text-[0.8125rem] font-semibold"
              style={{ background: 'var(--paper)', border: '1px solid var(--line)', color: 'var(--smoke)' }}
            >
              <b.Icon size={16} style={{ color: 'var(--cinnabar)' }} />
              {b.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Info + selectors ── */}
      <AnimateOnScroll>
        {/* Category label */}
        <p className="mk-spec mb-3">Playera personalizada</p>

        {/* Product name */}
        <h1 className="mk-display text-4xl lg:text-5xl mb-4 text-balance">
          {product.name}
        </h1>

        {/* Description */}
        {product.description && (
          <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--smoke)', maxWidth: '90%' }}>
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-10">
          <span className="mk-display text-5xl">
            ${totalPrice.toFixed(0)}
          </span>
          <span className="text-sm font-bold" style={{ color: 'var(--smoke)' }}>MXN</span>
          {qty > 1 && (
            <span className="text-sm" style={{ color: 'var(--color-faint)' }}>
              (${unitPrice.toFixed(0)} c/u)
            </span>
          )}
        </div>

        <div
          className="rounded-2xl p-6 mb-6"
          style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
        >
          {/* Color selector */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="label-sm">Color</p>
              <p className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>{selectedColor.name}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {colors.map(color => (
                <button
                  key={color.hex}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                  aria-label={color.name}
                  aria-pressed={selectedColor.hex === color.hex}
                  className="w-9 h-9 rounded-full transition-all duration-200 hover:scale-110"
                  style={{
                    background: color.hex,
                    outline: selectedColor.hex === color.hex
                      ? '2px solid var(--color-brand)'
                      : '2px solid transparent',
                    outlineOffset: '2px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    boxShadow: selectedColor.hex === color.hex ? '0 0 0 3px rgba(236,58,18,0.15)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--color-border)', marginBottom: '1.5rem' }} />

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="label-sm">Talla</p>
              <button
                onClick={() => setShowSizeGuide(v => !v)}
                className="text-xs font-medium underline underline-offset-2"
                style={{ color: 'var(--color-brand)' }}
              >
                {showSizeGuide ? 'Ocultar guía' : 'Guía de tallas'}
              </button>
            </div>

            {/* Size guide */}
            {showSizeGuide && (
              <div
                className="mb-4 rounded-xl overflow-hidden text-xs"
                style={{ border: '1px solid var(--color-border)' }}
              >
                <table className="w-full text-center">
                  <thead>
                    <tr style={{ background: 'var(--color-brand)', color: '#fff' }}>
                      <th className="px-3 py-2 font-semibold">Talla</th>
                      <th className="px-3 py-2 font-semibold">Pecho (cm)</th>
                      <th className="px-3 py-2 font-semibold">Largo (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.map((row, i) => (
                      <tr
                        key={row.size}
                        style={{
                          background: i % 2 === 0 ? 'var(--color-surface)' : 'transparent',
                          color: 'var(--color-text)',
                        }}
                      >
                        <td className="px-3 py-2 font-bold">{row.size}</td>
                        <td className="px-3 py-2">{row.chest}</td>
                        <td className="px-3 py-2">{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {availableSizes.map(size => {
                const active = selectedSize === size
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[52px] py-2.5 text-sm font-bold rounded-xl border transition-all duration-150 hover:scale-105"
                    style={{
                      borderColor: active ? 'var(--color-brand)' : 'var(--color-border)',
                      background: active ? 'var(--color-brand)' : 'var(--color-surface)',
                      color: active ? '#fff' : 'var(--color-text)',
                      boxShadow: active ? '0 4px 12px rgba(236,58,18,0.25)' : 'none',
                    }}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {!selectedSize && (
              <p className="text-xs mt-2" style={{ color: 'var(--color-faint)' }}>
                Selecciona una talla para continuar
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: '1px solid var(--color-border)', margin: '1.5rem 0' }} />

          {/* Quantity */}
          <div>
            <p className="label-sm mb-3">Cantidad</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                −
              </button>
              <span className="text-lg font-bold w-8 text-center" style={{ color: 'var(--color-text)' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                className="w-9 h-9 rounded-xl font-bold text-lg flex items-center justify-center transition-colors"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                +
              </button>
              <span className="text-xs ml-2" style={{ color: 'var(--color-faint)' }}>
                Sin mínimo de compra
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => selectedVariant && router.push(`/customize/${selectedVariant.id}`)}
          disabled={!selectedVariant}
          className="mk-btn mk-btn-primary w-full justify-center py-4 text-base"
          style={!selectedVariant ? { filter: 'grayscale(1)', opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
          {selectedVariant
            ? `Personalizar → $${totalPrice.toFixed(0)} MXN`
            : 'Elige color y talla para continuar'}
        </button>

        {/* Shipping note */}
        <div className="mt-4 flex items-center justify-center gap-2 text-[0.8125rem]" style={{ color: 'var(--smoke)' }}>
          <Package size={14} />
          <span>Envío a toda la República · 5–7 días hábiles · Pago seguro</span>
        </div>

        {/* Features list */}
        <div
          className="mt-8 rounded-2xl p-6 space-y-4"
          style={{ background: 'var(--paper-2)', border: '1px solid var(--line)' }}
        >
          <p className="mk-spec mb-2 text-xs">¿Por qué Stampia?</p>
          {[
            { Icon: Printer, text: 'Impresión DTF de alta definición, colores que duran lavado tras lavado' },
            { Icon: Zap, text: 'Producción express — tu pedido listo en 2–3 días hábiles' },
            { Icon: Palette, text: 'Sube tu diseño o créalo desde cero en nuestro editor' },
            { Icon: Package, text: 'Empaque profesional, ideal para regalo o marca personal' },
          ].map(f => (
            <div key={f.text} className="flex gap-4 items-start">
              <div className="mt-0.5" style={{ color: 'var(--cinnabar)' }}>
                <f.Icon size={18} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--smoke)' }}>{f.text}</p>
            </div>
          ))}
        </div>
      </AnimateOnScroll>
    </div>
  )
}
