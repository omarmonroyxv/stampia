'use client'

import { useState, useTransition } from 'react'
import { createVariant, deleteVariant } from '@/lib/admin/product-actions'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

interface Variant {
  id:              string
  color_name:      string
  color_hex:       string
  size:            string
  sku:             string
  extra_price_mxn: number
}

interface Props {
  productId: string
  variants:  Variant[]
}

const EMPTY = {
  color_name:      '',
  color_hex:       '#000000',
  size:            'M',
  sku:             '',
  extra_price_mxn: 0,
}

export default function VariantManager({ productId, variants: initial }: Props) {
  const [variants, setVariants] = useState<Variant[]>(initial)
  const [form,     setForm]     = useState({ ...EMPTY })
  const [error,    setError]    = useState<string | null>(null)
  const [pending,  startTransition] = useTransition()
  const [deleting, setDeleting] = useState<string | null>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.color_name.trim() || !form.sku.trim()) {
      setError('Nombre de color y SKU son obligatorios.')
      return
    }

    startTransition(async () => {
      const res = await createVariant({ product_id: productId, ...form })
      if (res.error) { setError(res.error); return }
      setVariants((prev) => [...prev, { id: res.id!, ...form }])
      setForm({ ...EMPTY })
    })
  }

  async function handleDelete(variantId: string) {
    if (!confirm('Eliminar esta variante?')) return
    setDeleting(variantId)
    const res = await deleteVariant(variantId, productId)
    if (res.error) { setError(res.error); setDeleting(null); return }
    setVariants((prev) => prev.filter((v) => v.id !== variantId))
    setDeleting(null)
  }

  /* Group by color for display */
  const byColor = variants.reduce<Record<string, Variant[]>>((acc, v) => {
    const key = `${v.color_name}__${v.color_hex}`
    if (!acc[key]) acc[key] = []
    acc[key].push(v)
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">

      {/* ── Existing variants ── */}
      {Object.keys(byColor).length > 0 && (
        <div className="flex flex-col gap-4">
          {Object.entries(byColor).map(([colorKey, vars]) => {
            const [colorName, colorHex] = colorKey.split('__')
            return (
              <div key={colorKey} className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
                {/* Color header */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-neutral-200 bg-white">
                  <span className="w-5 h-5 rounded-full border border-neutral-200 shrink-0" style={{ backgroundColor: colorHex }} />
                  <span className="text-sm font-bold text-neutral-800">{colorName}</span>
                  <span className="text-xs text-neutral-400 font-mono">{colorHex}</span>
                </div>

                {/* Sizes */}
                <div className="divide-y divide-neutral-100">
                  {vars.sort((a, b) => SIZES.indexOf(a.size) - SIZES.indexOf(b.size)).map((v) => (
                    <div key={v.id} className="flex items-center gap-4 px-4 py-2.5">
                      <span className="w-10 text-center text-xs font-extrabold text-neutral-700 bg-neutral-100 rounded-lg py-1">
                        {v.size}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono flex-1">{v.sku}</span>
                      <span className="text-xs font-semibold text-neutral-700 w-20 text-right">
                        {v.extra_price_mxn > 0 ? `+$${v.extra_price_mxn}` : 'Sin cargo'}
                      </span>
                      <button
                        onClick={() => handleDelete(v.id)}
                        disabled={deleting === v.id}
                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50 disabled:opacity-40"
                        title="Eliminar variante"
                      >
                        {deleting === v.id ? (
                          <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                          </svg>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3-3h8"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {variants.length === 0 && (
        <div className="text-center py-8 text-neutral-400 text-sm bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
          No hay variantes todavia. Agrega la primera abajo.
        </div>
      )}

      {/* ── Add variant form ── */}
      <form onSubmit={handleAdd} className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col gap-4">
        <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
          Agregar variante
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* Color name */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Color *</label>
            <input
              type="text"
              value={form.color_name}
              onChange={(e) => setForm({ ...form, color_name: e.target.value })}
              placeholder="Negro, Blanco, Rojo..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              required
            />
          </div>

          {/* Color hex */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Hex</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={form.color_hex}
                onChange={(e) => setForm({ ...form, color_hex: e.target.value })}
                className="w-10 h-9 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={form.color_hex}
                onChange={(e) => setForm({ ...form, color_hex: e.target.value })}
                placeholder="#000000"
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono
                           focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Talla *</label>
            <select
              value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm bg-white
                         focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
            >
              {SIZES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">SKU *</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="PLAY-NEG-M"
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-mono
                         focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              required
            />
          </div>

          {/* Extra price */}
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
              Precio extra MXN
              <span className="text-neutral-400 font-normal ml-1">(0 si es igual al precio base)</span>
            </label>
            <div className="flex items-center gap-0 rounded-lg border border-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
              <span className="bg-neutral-50 border-r border-neutral-200 px-3 py-2 text-xs text-neutral-400 shrink-0">$ +</span>
              <input
                type="number"
                value={form.extra_price_mxn}
                onChange={(e) => setForm({ ...form, extra_price_mxn: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-neutral-900 text-white py-2.5 rounded-xl text-sm font-bold
                     hover:bg-neutral-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {pending ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Guardando...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14"/>
              </svg>
              Agregar variante
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-neutral-400 text-center">
        Tip: agrega todas las tallas de cada color. El SKU debe ser unico por variante.
      </p>
    </div>
  )
}
