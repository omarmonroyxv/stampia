'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createProduct, updateProduct } from '@/lib/admin/product-actions'
import type { ProductFormData } from '@/lib/admin/product-actions'
import type { PrintArea } from '@/types/domain'
import { createClient } from '@/lib/supabase/client'

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const PREVIEW_W = 260
const PREVIEW_H = 300

const DEFAULT_PA: PrintArea = {
  width_cm:     25,
  height_cm:    30,
  offset_x_pct: 0.22,
  offset_y_pct: 0.28,
  width_pct:    0.56,
  height_pct:   0.48,
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/* ─────────────────────────────────────────────
   Props
───────────────────────────────────────────── */
interface Props {
  productId?: string
  initial?: Partial<ProductFormData>
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function ProductForm({ productId, initial }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  /* Fields */
  const [name,        setName]        = useState(initial?.name ?? '')
  const [slug,        setSlug]        = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [price,       setPrice]       = useState(String(initial?.base_price_mxn ?? 299))
  const [active,      setActive]      = useState(initial?.active ?? true)
  const [mockupUrl,   setMockupUrl]   = useState(initial?.mockup_front_url ?? '')
  const [uploading,   setUploading]   = useState(false)

  /* Print area */
  const initPa: PrintArea = (initial?.print_area as { front?: PrintArea })?.front ?? DEFAULT_PA
  const [pa, setPa] = useState<PrintArea>(initPa)

  const [error, setError] = useState<string | null>(null)

  /* ── Drag-to-move print area ── */
  const isDragging   = useRef(false)
  const dragStart    = useRef<{ mx: number; my: number; ox: number; oy: number } | null>(null)

  /* ── Drag-to-resize print area (SE corner) ── */
  const isResizing   = useRef(false)
  const resizeStart  = useRef<{ mx: number; my: number; ow: number; oh: number } | null>(null)

  function onPaMoveStart(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    isDragging.current = true
    dragStart.current  = { mx: e.clientX, my: e.clientY, ox: pa.offset_x_pct, oy: pa.offset_y_pct }
  }
  function onPaMoveMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging.current || !dragStart.current) return
    const dx  = (e.clientX - dragStart.current.mx) / PREVIEW_W
    const dy  = (e.clientY - dragStart.current.my) / PREVIEW_H
    const nx  = Math.max(0, Math.min(1 - pa.width_pct,  dragStart.current.ox + dx))
    const ny  = Math.max(0, Math.min(1 - pa.height_pct, dragStart.current.oy + dy))
    setPa((p) => ({ ...p, offset_x_pct: Math.round(nx * 1000) / 1000, offset_y_pct: Math.round(ny * 1000) / 1000 }))
  }
  function onPaMoveEnd() {
    isDragging.current = false
    dragStart.current  = null
  }

  function onResizeStart(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    isResizing.current = true
    resizeStart.current = { mx: e.clientX, my: e.clientY, ow: pa.width_pct, oh: pa.height_pct }
  }
  function onResizeMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isResizing.current || !resizeStart.current) return
    const dx  = (e.clientX - resizeStart.current.mx) / PREVIEW_W
    const dy  = (e.clientY - resizeStart.current.my) / PREVIEW_H
    const nw  = Math.max(0.08, Math.min(1 - pa.offset_x_pct, resizeStart.current.ow + dx))
    const nh  = Math.max(0.08, Math.min(1 - pa.offset_y_pct, resizeStart.current.oh + dy))
    setPa((p) => ({ ...p, width_pct: Math.round(nw * 1000) / 1000, height_pct: Math.round(nh * 1000) / 1000 }))
  }
  function onResizeEnd() {
    isResizing.current  = false
    resizeStart.current = null
  }

  function centerPa() {
    setPa((p) => ({ ...p, offset_x_pct: Math.round(((1 - p.width_pct) / 2) * 1000) / 1000 }))
  }

  /* ── Handlers ── */
  function handleNameChange(val: string) {
    setName(val)
    if (!productId) setSlug(slugify(val))
  }

  function updatePa(key: keyof PrintArea, raw: string) {
    const n = parseFloat(raw)
    if (isNaN(n)) return
    setPa((prev) => ({ ...prev, [key]: n }))
  }

  async function handleMockupUpload(file: File) {
    if (!file) return
    setUploading(true)
    try {
      const supabase = createClient()
      const path = `products/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const { error: upErr } = await supabase.storage
        .from('mockups')
        .upload(path, file, { cacheControl: '31536000', upsert: true })
      if (upErr) throw upErr

      const { data } = supabase.storage.from('mockups').getPublicUrl(path)
      setMockupUrl(data.publicUrl)
    } catch (e) {
      setError(`Error subiendo imagen: ${(e as Error).message}`)
    } finally {
      setUploading(false)
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const data: ProductFormData = {
      name,
      slug,
      description,
      base_price_mxn: parseFloat(price),
      active,
      mockup_front_url: mockupUrl,
      print_area: { front: pa },
    }

    startTransition(async () => {
      if (productId) {
        const res = await updateProduct(productId, data)
        if (res.error) { setError(res.error); return }
        router.refresh()
      } else {
        const res = await createProduct(data)
        if (res.error) { setError(res.error); return }
        router.push(`/dashboard/products/${res.id}`)
      }
    })
  }

  /* Print area preview coordinates */
  const paLeft   = pa.offset_x_pct * PREVIEW_W
  const paTop    = pa.offset_y_pct * PREVIEW_H
  const paWidth  = pa.width_pct    * PREVIEW_W
  const paHeight = pa.height_pct   * PREVIEW_H

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* ── 2-col layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── LEFT: basic fields ── */}
        <div className="flex flex-col gap-5">

          <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col gap-5">
            <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
              Informacion del producto
            </h2>

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                placeholder="Playera Basica Premium"
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Slug (URL)</label>
              <div className="flex items-center gap-0 rounded-xl border border-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
                <span className="bg-neutral-50 border-r border-neutral-200 px-3 py-2.5 text-xs text-neutral-400 shrink-0">
                  /product/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="playera-basica"
                  className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">Descripcion</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Playera de algodon 100%, corte unisex..."
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm resize-none
                           focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                Precio base <span className="text-red-400">*</span>
              </label>
              <div className="flex items-center gap-0 rounded-xl border border-neutral-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand/20 focus-within:border-brand transition-all">
                <span className="bg-neutral-50 border-r border-neutral-200 px-3 py-2.5 text-xs text-neutral-400 shrink-0">
                  MXN $
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="1"
                  step="0.01"
                  className="flex-1 px-3 py-2.5 text-sm bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-bold text-neutral-700">Producto activo</p>
                <p className="text-xs text-neutral-400 mt-0.5">Visible en la tienda</p>
              </div>
              <button
                type="button"
                onClick={() => setActive(!active)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
                  ${active ? 'bg-brand' : 'bg-neutral-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200
                  ${active ? 'translate-x-5.5 left-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          </section>

          {/* ── Mockup image ── */}
          <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col gap-4">
            <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
              Imagen del producto
            </h2>

            {mockupUrl ? (
              <div className="relative group rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50">
                <img src={mockupUrl} alt="Mockup" className="w-full h-40 object-contain" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity
                                flex items-center justify-center">
                  <label className="cursor-pointer bg-white text-neutral-900 text-xs font-bold px-4 py-2 rounded-lg">
                    Cambiar imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleMockupUpload(f)
                      }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-3 h-32 rounded-xl border-2 border-dashed border-neutral-200
                                bg-neutral-50 cursor-pointer hover:border-brand/40 hover:bg-brand/4 transition-colors">
                {uploading ? (
                  <svg className="animate-spin text-brand" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-neutral-400">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                    </svg>
                    <span className="text-xs text-neutral-500 font-medium">
                      Subir imagen del producto
                    </span>
                    <span className="text-[10px] text-neutral-400">PNG, JPG — max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleMockupUpload(f)
                  }}
                />
              </label>
            )}

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                O pega una URL directamente
              </label>
              <input
                type="url"
                value={mockupUrl}
                onChange={(e) => setMockupUrl(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
              />
            </div>
          </section>
        </div>

        {/* ── RIGHT: Print Area ── */}
        <div className="flex flex-col gap-5">
          <section className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm flex flex-col gap-5">
            <div>
              <h2 className="font-bold text-neutral-900 text-sm uppercase tracking-wide">
                Area de impresion
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Define la zona donde se imprime el diseno del cliente.
                El rectangulo morado indica el area de impresion sobre el mockup.
              </p>
            </div>

            {/* Interactive preview */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden select-none"
                style={{ width: PREVIEW_W, height: PREVIEW_H }}
              >
                {/* Shirt silhouette */}
                <svg viewBox="0 0 260 300" className="absolute inset-0 w-full h-full" style={{ opacity: 0.5 }}>
                  <path
                    d="M77 60 C84 88 108 103 130 103 C152 103 176 88 183 60 L207 85 L210 125 L207 273 L53 273 L50 125 L53 85 Z"
                    fill="#6c47ff" fillOpacity="0.15" stroke="#6c47ff" strokeWidth="1.5" strokeOpacity="0.3"
                  />
                  <path d="M77 60 L27 73 L14 116 L50 125 L53 85 Z" fill="#6c47ff" fillOpacity="0.1" stroke="#6c47ff" strokeWidth="1.5" strokeOpacity="0.3"/>
                  <path d="M183 60 L233 73 L246 116 L210 125 L207 85 Z" fill="#6c47ff" fillOpacity="0.1" stroke="#6c47ff" strokeWidth="1.5" strokeOpacity="0.3"/>
                </svg>

                {/* Draggable print area */}
                <div
                  className="absolute border-2 border-dashed border-brand bg-brand/8 rounded-sm group hover:bg-brand/14 transition-colors"
                  style={{
                    left:        paLeft,
                    top:         paTop,
                    width:       paWidth,
                    height:      paHeight,
                    cursor:      'grab',
                    touchAction: 'none',
                  }}
                  onPointerDown={onPaMoveStart}
                  onPointerMove={onPaMoveMove}
                  onPointerUp={onPaMoveEnd}
                  onPointerCancel={onPaMoveEnd}
                >
                  {/* Label */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[9px] font-bold text-brand opacity-60 select-none">
                      ARRASTRAR
                    </span>
                  </div>

                  {/* SE resize handle */}
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 flex items-center justify-center"
                    style={{ bottom: -6, right: -6, cursor: 'se-resize', touchAction: 'none' }}
                    onPointerDown={onResizeStart}
                    onPointerMove={onResizeMove}
                    onPointerUp={onResizeEnd}
                    onPointerCancel={onResizeEnd}
                  >
                    <div
                      className="w-3 h-3 rounded-full border-2 border-brand bg-white shadow-sm"
                      style={{ background: 'var(--color-brand)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={centerPa}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-brand/30 text-brand hover:bg-brand/6 transition-colors"
                >
                  Centrar horizontal
                </button>
                <button
                  type="button"
                  onClick={() => setPa(DEFAULT_PA)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  Restablecer
                </button>
              </div>
              <p className="text-[10px] text-neutral-400 text-center">
                Arrastra para mover · Esquina inferior-derecha para redimensionar
              </p>
            </div>

            {/* Dimension fields */}
            <div className="grid grid-cols-2 gap-3">
              <PaField label="Ancho (cm)" value={pa.width_cm}    onChange={(v) => updatePa('width_cm', v)} />
              <PaField label="Alto (cm)"  value={pa.height_cm}   onChange={(v) => updatePa('height_cm', v)} />
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide mb-3">
                Posicion sobre el mockup (0–1)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <PaField label="Offset X" value={pa.offset_x_pct} onChange={(v) => updatePa('offset_x_pct', v)} step="0.01" min={0} max={1} />
                <PaField label="Offset Y" value={pa.offset_y_pct} onChange={(v) => updatePa('offset_y_pct', v)} step="0.01" min={0} max={1} />
                <PaField label="Ancho %"  value={pa.width_pct}    onChange={(v) => updatePa('width_pct', v)}    step="0.01" min={0} max={1} />
                <PaField label="Alto %"   value={pa.height_pct}   onChange={(v) => updatePa('height_pct', v)}   step="0.01" min={0} max={1} />
              </div>
              <p className="text-[10px] text-neutral-400 mt-2">
                Ejemplo: offset_x_pct=0.22 significa que el borde izquierdo del area empieza al 22% del ancho del mockup.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* ── Submit ── */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending || uploading}
          className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 rounded-xl font-bold text-sm
                     hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all
                     hover:shadow-lg hover:shadow-brand/20 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {pending ? (
            <>
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Guardando...
            </>
          ) : productId ? 'Guardar cambios' : 'Crear producto'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-3 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

/* ─────────────────────────────────────────────
   Helper: PrintArea field
───────────────────────────────────────────── */
function PaField({
  label, value, onChange, step = '0.1', min, max,
}: {
  label: string
  value: number
  onChange: (v: string) => void
  step?: string
  min?: number
  max?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-neutral-600 mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        step={step}
        min={min}
        max={max}
        className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
      />
    </div>
  )
}
