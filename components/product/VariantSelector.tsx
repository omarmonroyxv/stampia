'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Variant, ColorOption, Size } from '@/types/product'
import { SIZE_ORDER } from '@/types/product'

interface Props {
  variants: Variant[]
  basePrice: number
}

function uniqueColors(variants: Variant[]): ColorOption[] {
  const seen = new Set<string>()
  return variants.reduce<ColorOption[]>((acc, v) => {
    if (!seen.has(v.color_hex)) {
      seen.add(v.color_hex)
      acc.push({ name: v.color_name, hex: v.color_hex })
    }
    return acc
  }, [])
}

export default function VariantSelector({ variants, basePrice }: Props) {
  const router = useRouter()
  const colors = useMemo(() => uniqueColors(variants), [variants])

  const [selectedColor, setSelectedColor] = useState<ColorOption>(colors[0]!)
  const [selectedSize, setSelectedSize] = useState<Size | null>(null)

  const availableSizes = useMemo(
    () =>
      SIZE_ORDER.filter((s) =>
        variants.some((v) => v.color_hex === selectedColor.hex && v.size === s),
      ),
    [variants, selectedColor],
  )

  const selectedVariant = useMemo(
    () =>
      selectedSize
        ? variants.find((v) => v.color_hex === selectedColor.hex && v.size === selectedSize)
        : null,
    [variants, selectedColor, selectedSize],
  )

  const totalPrice = basePrice + (selectedVariant?.extra_price_mxn ?? 0)

  function handleColorChange(color: ColorOption) {
    setSelectedColor(color)
    setSelectedSize(null)
  }

  function handlePersonalizar() {
    if (!selectedVariant) return
    router.push(`/customize/${selectedVariant.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Color */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">
          Color: <span className="text-neutral-900">{selectedColor.name}</span>
        </p>
        <div className="flex gap-2">
          {colors.map((c) => (
            <button
              key={c.hex}
              title={c.name}
              onClick={() => handleColorChange(c)}
              className="w-8 h-8 rounded-full border-2 transition-all"
              style={{
                backgroundColor: c.hex,
                borderColor: selectedColor.hex === c.hex ? '#6c47ff' : '#d1d5db',
                boxShadow: selectedColor.hex === c.hex ? '0 0 0 2px #6c47ff40' : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Talla */}
      <div>
        <p className="text-sm font-medium text-neutral-700 mb-2">Talla</p>
        <div className="flex gap-2 flex-wrap">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`w-12 h-10 rounded-lg border text-sm font-medium transition-colors ${
                selectedSize === size
                  ? 'bg-brand text-white border-brand'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-brand'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Precio */}
      <p className="text-2xl font-bold text-neutral-900">
        ${totalPrice.toFixed(0)}{' '}
        <span className="text-base font-normal text-neutral-400">MXN</span>
      </p>

      {/* CTA */}
      <button
        onClick={handlePersonalizar}
        disabled={!selectedVariant}
        className="w-full bg-brand text-white rounded-xl py-3 font-semibold text-base hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {selectedVariant ? 'Personalizar' : 'Elige color y talla'}
      </button>
    </div>
  )
}
