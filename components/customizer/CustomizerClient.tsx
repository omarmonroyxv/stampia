'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import type { Placement, PrintArea } from '@/types/domain'
import type { CartItem } from '@/types/domain'
import type { Variant } from '@/types/product'
import { validateDpi } from '@/lib/print-pipeline/validate-dpi'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/store/cart'
import UploadZone from './UploadZone'
import DPIWarning from './DPIWarning'
import type { CustomizerCanvasHandle } from './CustomizerCanvas'

const CustomizerCanvas = dynamic(
  () => import('./CustomizerCanvas'),
  { ssr: false },
)

interface Props {
  userId: string
  variant: Variant & {
    products: { name: string; mockup_front_url: string | null; print_area: { front: PrintArea } }
  }
}

interface DesignState {
  storagePath: string
  signedUrl:   string
  widthPx:     number
  heightPx:    number
}

const TEXT_COLORS = [
  { hex: '#000000', name: 'Negro' },
  { hex: '#FFFFFF', name: 'Blanco' },
  { hex: '#6c47ff', name: 'Morado' },
  { hex: '#e53e3e', name: 'Rojo' },
  { hex: '#2b9348', name: 'Verde' },
  { hex: '#f4a261', name: 'Naranja' },
  { hex: '#1a1a2e', name: 'Azul oscuro' },
  { hex: '#f5f5f5', name: 'Blanco hueso' },
]

const TEXT_SIZES: { label: string; value: number }[] = [
  { label: 'XS', value: 20 },
  { label: 'S',  value: 30 },
  { label: 'M',  value: 44 },
  { label: 'L',  value: 60 },
  { label: 'XL', value: 80 },
]

const FONT_FAMILIES = [
  { label: 'Sans',   value: 'Plus Jakarta Sans, sans-serif' },
  { label: 'Serif',  value: 'Georgia, serif' },
  { label: 'Mono',   value: 'Courier New, monospace' },
  { label: 'Bold',   value: 'Impact, sans-serif' },
]

export default function CustomizerClient({ userId, variant }: Props) {
  const router  = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  const product   = variant.products
  const printArea = product.print_area.front

  const canvasRef = useRef<CustomizerCanvasHandle | null>(null)

  const [view,        setView]        = useState<'front' | 'back'>('front')
  const [design,      setDesign]      = useState<DesignState | null>(null)
  const [placement,   setPlacement]   = useState<Placement | null>(null)
  const [objectCount, setObjectCount] = useState(0)
  const [saving,      setSaving]      = useState(false)
  const [saveError,   setSaveError]   = useState<string | null>(null)
  const [uploadKey,   setUploadKey]   = useState(0)
  const [quantity,    setQuantity]    = useState(1)

  const [showText,   setShowText]   = useState(false)
  const [textInput,  setTextInput]  = useState('')
  const [textColor,  setTextColor]  = useState('#000000')
  const [textSize,   setTextSize]   = useState(44)
  const [textFont,   setTextFont]   = useState(FONT_FAMILIES[0].value)
  const [textBold,   setTextBold]   = useState(false)

  const dpiValidation = useMemo(() => {
    if (!design || !placement) return null
    return validateDpi({ width: design.widthPx, height: design.heightPx }, printArea, placement)
  }, [design, placement, printArea])

  const canConfirm = objectCount > 0 && !saving

  const handleUpload = useCallback(
    (result: { storagePath: string; signedUrl: string; widthPx: number; heightPx: number }) => {
      setDesign(result)
      setPlacement(null)
      setSaveError(null)
    },
    [],
  )

  function handleRemoveDesign() {
    canvasRef.current?.clearDesign()
    setDesign(null)
    setPlacement(null)
    setSaveError(null)
    setUploadKey((k) => k + 1)
  }

  const handlePlacementChange = useCallback((p: Placement) => setPlacement(p), [])

  function handleAddText() {
    if (!textInput.trim()) return
    canvasRef.current?.addText(textInput.trim(), {
      color:      textColor,
      fontSize:   textSize,
      fontFamily: textFont,
      bold:       textBold,
    })
    setTextInput('')
    setShowText(false)
  }

  function handleDeleteSelected() {
    canvasRef.current?.deleteSelected()
  }

  async function handleConfirm() {
    if (!canConfirm) return
    setSaving(true)
    setSaveError(null)

    try {
      let widthPx:     number
      let heightPx:    number
      let signedUrl:   string
      let finalPlacement: Placement

      const hasCanvasExtras = objectCount > (design ? 1 : 0)

      if (hasCanvasExtras) {
        const exported = await canvasRef.current!.exportPrintArea()

        const res  = await fetch(exported.dataUrl)
        const blob = await res.blob()

        const supabase = createClient()
        const filename = `composite-${crypto.randomUUID()}.png`
        const path     = `${userId}/${filename}`

        const { error: uploadError } = await supabase.storage
          .from('designs')
          .upload(path, blob, { cacheControl: '3600' })
        if (uploadError) throw uploadError

        const { data: signedData, error: signError } = await supabase.storage
          .from('designs')
          .createSignedUrl(path, 3600)
        if (signError || !signedData) throw signError ?? new Error('No signed URL')

        widthPx        = exported.widthPx
        heightPx       = exported.heightPx
        signedUrl      = signedData.signedUrl
        finalPlacement = { x_pct: 0, y_pct: 0, scale: 1, rotation: 0 }

      } else if (design && placement) {
        widthPx        = design.widthPx
        heightPx       = design.heightPx
        signedUrl      = design.signedUrl
        finalPlacement = placement

      } else {
        setSaveError('Anade una imagen o texto a tu diseno para continuar.')
        setSaving(false)
        return
      }

      const unitPrice = variant.extra_price_mxn
        ? 299 + variant.extra_price_mxn
        : 299

      const item: CartItem = {
        variantId:      variant.id,
        productId:      variant.product_id,
        productName:    product.name,
        colorName:      variant.color_name,
        colorHex:       variant.color_hex,
        size:           variant.size,
        designUrl:      signedUrl,
        designWidth:    widthPx,
        designHeight:   heightPx,
        placement:      finalPlacement,
        quantity,
        unitPriceMxn:   unitPrice,
        mockupFrontUrl: product.mockup_front_url ?? '',
      }

      addItem(item)
      router.push('/cart')

    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Error al guardar. Intenta de nuevo.')
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">

      {/* LEFT - Canvas */}
      <div className="flex flex-col gap-3">

        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 w-fit">
          {(['front', 'back'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                view === v
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {v === 'front' ? 'Frente' : 'Atras'}
            </button>
          ))}
        </div>

        {view === 'front' ? (
          <div className="w-full rounded-3xl overflow-hidden bg-surface border border-neutral-100 shadow-sm">
            <CustomizerCanvas
              ref={canvasRef}
              colorHex={variant.color_hex}
              mockupUrl={product.mockup_front_url}
              printArea={printArea}
              designUrl={design?.signedUrl ?? null}
              onPlacementChange={handlePlacementChange}
              onObjectsChange={setObjectCount}
            />

            {objectCount > 0 && (
              <div className="border-t border-neutral-100 bg-white px-4 py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-5">
                  {[
                    { icon: 'M', text: 'Mover' },
                    { icon: 'E', text: 'Escalar' },
                    { icon: 'R', text: 'Rotar' },
                  ].map((h) => (
                    <span key={h.text} className="flex items-center gap-1 text-xs text-neutral-400">
                      <span className="text-brand font-bold">{h.icon}</span> {h.text}
                    </span>
                  ))}
                </div>
                <button
                  onClick={handleDeleteSelected}
                  className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 font-medium transition-colors"
                >
                  Eliminar seleccionado
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-3xl bg-surface border border-neutral-100 shadow-sm flex flex-col items-center justify-center py-20 gap-3">
            <p className="font-bold text-neutral-900">Vista trasera</p>
            <p className="text-sm text-neutral-500 text-center max-w-xs">
              La impresion en la parte trasera esta disponible para pedidos especiales.
            </p>
            <button
              onClick={() => setView('front')}
              className="text-sm text-brand font-semibold hover:text-brand-dark transition-colors"
            >
              Volver al frente
            </button>
          </div>
        )}
      </div>

      {/* RIGHT - Controls */}
      <div className="flex flex-col gap-4">

        {/* Variant info */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 flex items-center gap-3 shadow-sm">
          <span
            className="w-10 h-10 rounded-xl border border-neutral-200 shrink-0"
            style={{ backgroundColor: variant.color_hex }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-neutral-900 text-sm truncate">{product.name}</p>
            <p className="text-xs text-neutral-500 mt-0.5">
              {variant.color_name} - Talla {variant.size}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold text-brand leading-none">
              ${(299 + (variant.extra_price_mxn || 0)).toFixed(0)}
            </p>
            <p className="text-[10px] text-neutral-400">MXN / pieza</p>
          </div>
        </div>

        {/* Tool tabs */}
        <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm overflow-hidden">

          <div className="flex border-b border-neutral-100">
            <button
              onClick={() => setShowText(false)}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors
                ${!showText ? 'text-brand border-b-2 border-brand bg-brand/4' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Imagen
            </button>
            <button
              onClick={() => setShowText(true)}
              className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors
                ${showText ? 'text-brand border-b-2 border-brand bg-brand/4' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              Texto
            </button>
          </div>

          {!showText && (
            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-neutral-700">
                  {design ? 'Imagen subida' : 'Sube tu imagen'}
                </p>
                {design && (
                  <button
                    onClick={handleRemoveDesign}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                  >
                    Quitar
                  </button>
                )}
              </div>

              <UploadZone
                key={uploadKey}
                userId={userId}
                onUpload={handleUpload}
                disabled={saving}
              />

              {dpiValidation && <DPIWarning validation={dpiValidation} />}
            </div>
          )}

          {showText && (
            <div className="p-4 flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">Tu texto</label>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddText() }}
                  placeholder="Escribe aqui..."
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand/25 focus:border-brand transition-colors"
                  maxLength={60}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">Fuente</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {FONT_FAMILIES.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setTextFont(f.value)}
                      className={`py-1.5 text-xs rounded-lg border font-medium transition-all
                        ${textFont === f.value
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand/40'}`}
                      style={{ fontFamily: f.value }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">Tamano</label>
                <div className="flex gap-1.5">
                  {TEXT_SIZES.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setTextSize(s.value)}
                      className={`flex-1 py-1.5 text-xs rounded-lg border font-bold transition-all
                        ${textSize === s.value
                          ? 'bg-brand text-white border-brand'
                          : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand/40'}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setTextColor(c.hex)}
                      className="w-7 h-7 rounded-full transition-all hover:scale-110"
                      style={{
                        backgroundColor: c.hex,
                        border: textColor === c.hex ? '2.5px solid #6c47ff' : '1.5px solid rgba(0,0,0,0.15)',
                        outline: textColor === c.hex ? '2px solid #6c47ff30' : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  ))}
                  <button
                    onClick={() => setTextBold(!textBold)}
                    title="Negrita"
                    className={`w-7 h-7 rounded-full border font-extrabold text-xs transition-all
                      ${textBold
                        ? 'bg-brand text-white border-brand'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-brand/40'}`}
                  >
                    B
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddText}
                disabled={!textInput.trim()}
                className="w-full bg-brand/8 text-brand border border-brand/20 rounded-xl py-2.5 text-sm font-bold
                           hover:bg-brand hover:text-white disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all active:scale-[0.98]"
              >
                + Anadir texto al lienzo
              </button>

              {objectCount > 0 && (
                <p className="text-[10px] text-neutral-400 text-center">
                  Haz doble clic en el texto para editarlo directamente
                </p>
              )}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-neutral-800">Cantidad</p>
            <p className="text-xs text-neutral-400 mt-0.5">Todas llevaran el mismo diseno</p>
          </div>
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors font-bold"
            >-</button>
            <span className="w-8 text-center font-extrabold text-neutral-900 text-sm tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(99, q + 1))}
              className="w-9 h-9 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors font-bold"
            >+</button>
          </div>
        </div>

        {saveError && (
          <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {saveError}
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all flex items-center justify-center gap-2
            ${canConfirm
              ? 'bg-brand text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/25 hover:-translate-y-0.5 active:scale-[0.98]'
              : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'}`}
        >
          {saving ? (
            <span>Guardando...</span>
          ) : (
            <>
              Agregar al carrito
              {quantity > 1 && <span className="opacity-75">({quantity})</span>}
            </>
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          {[
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="var(--color-brand)"/>
                </svg>
              ),
              text: 'Impresion DTF premium',
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              ),
              text: 'Diseno 100% privado',
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 8h14M5 8a2 2 0 1 0-4 0v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8m-14 0V6a2 2 0 0 1 4 0v2"/>
                </svg>
              ),
              text: 'Envio en 3-5 dias',
            },
            {
              icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 13l4 4L19 7"/>
                </svg>
              ),
              text: 'Calidad garantizada',
            },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 border border-neutral-100 rounded-xl px-2.5 py-2">
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="font-medium">{item.text}</span>
            </div>
          ))}
        </div>

        {!canConfirm && !saving && (
          <p className="text-xs text-center text-neutral-400">
            {objectCount === 0
              ? 'Sube una imagen o anade texto para continuar'
              : 'Posiciona tu diseno en el lienzo para continuar'}
          </p>
        )}
      </div>
    </div>
  )
}
