'use client'

import {
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import type { Canvas as FabricCanvas, FabricObject, Rect as FabricRectType } from 'fabric'
import type { Placement, PrintArea } from '@/types/domain'

const BASE_W = 400
const BASE_H = 460

export interface CustomizerCanvasHandle {
  clearDesign: () => void
  addText: (text: string, opts: { color: string; fontSize: number; fontFamily: string; bold?: boolean }) => void
  exportPrintArea: () => Promise<{ dataUrl: string; widthPx: number; heightPx: number }>
  deleteSelected: () => void
  hasObjects: () => boolean
}

interface Props {
  colorHex:            string
  printArea:           PrintArea
  designUrl:           string | null
  initialPlacement?:   Placement
  onPlacementChange:   (placement: Placement) => void
  onObjectsChange?:    (count: number) => void
}

function getPa(pa: PrintArea) {
  const left   = pa.offset_x_pct * BASE_W
  const top    = pa.offset_y_pct * BASE_H
  const width  = pa.width_pct    * BASE_W
  const height = pa.height_pct   * BASE_H
  return { left, top, width, height, cx: left + width / 2, cy: top + height / 2 }
}

function toPlacement(obj: FabricObject, pa: ReturnType<typeof getPa>): Placement {
  return {
    x_pct:    ((obj.left ?? 0) - pa.cx) / pa.width,
    y_pct:    ((obj.top  ?? 0) - pa.cy) / pa.height,
    scale:    ((obj.width ?? 1) * (obj.scaleX ?? 1)) / pa.width,
    rotation: obj.angle ?? 0,
  }
}

function fromPlacement(pl: Placement, pa: ReturnType<typeof getPa>, naturalW: number) {
  return {
    left:   pa.cx + pl.x_pct * pa.width,
    top:    pa.cy + pl.y_pct * pa.height,
    scaleX: (pl.scale * pa.width) / naturalW,
    scaleY: (pl.scale * pa.width) / naturalW,
    angle:  pl.rotation,
  }
}

function buildMockupBg(colorHex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460" fill="none">
  <defs>
    <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.10)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.07)"/>
    </linearGradient>
    <linearGradient id="sl" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.09)"/>
    </linearGradient>
    <linearGradient id="sr" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.08)"/>
    </linearGradient>
  </defs>
  <ellipse cx="200" cy="452" rx="118" ry="10" fill="rgba(0,0,0,0.08)"/>
  <path d="M118 92 L42 112 L22 178 L78 192 L82 130 Z" fill="${colorHex}" stroke="rgba(0,0,0,0.10)" stroke-width="1.2"/>
  <path d="M118 92 L42 112 L22 178 L78 192 L82 130 Z" fill="url(#sl)"/>
  <path d="M282 92 L358 112 L378 178 L322 192 L318 130 Z" fill="${colorHex}" stroke="rgba(0,0,0,0.10)" stroke-width="1.2"/>
  <path d="M282 92 L358 112 L378 178 L322 192 L318 130 Z" fill="url(#sr)"/>
  <path d="M118 92 C128 136 166 158 200 158 C234 158 272 136 282 92 L318 130 L322 192 L318 420 L82 420 L78 192 L82 130 Z" fill="${colorHex}" stroke="rgba(0,0,0,0.10)" stroke-width="1.2"/>
  <path d="M118 92 C128 136 166 158 200 158 C234 158 272 136 282 92 L318 130 L322 192 L318 420 L82 420 L78 192 L82 130 Z" fill="url(#g1)"/>
  <path d="M190 200 Q196 260 193 320" stroke="rgba(0,0,0,0.04)" stroke-width="1.5"/>
  <path d="M210 200 Q204 265 207 340" stroke="rgba(0,0,0,0.03)" stroke-width="1.2"/>
  <path d="M118 92 C128 136 166 158 200 158 C234 158 272 136 282 92" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M124 94 C133 132 168 152 200 152 C232 152 267 132 276 94" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="1" stroke-dasharray="2 3"/>
  <path d="M82 420 L318 420" stroke="rgba(0,0,0,0.12)" stroke-width="2"/>
  <path d="M82 415 L318 415" stroke="rgba(0,0,0,0.05)" stroke-width="0.8"/>
  <path d="M82 130 L118 92" stroke="rgba(0,0,0,0.08)" stroke-width="1.2" stroke-dasharray="3 4"/>
  <path d="M318 130 L282 92" stroke="rgba(0,0,0,0.08)" stroke-width="1.2" stroke-dasharray="3 4"/>
</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const CustomizerCanvas = forwardRef<CustomizerCanvasHandle, Props>(function CustomizerCanvas(
  { colorHex, printArea, designUrl, initialPlacement, onPlacementChange, onObjectsChange },
  ref,
) {
  const containerRef    = useRef<HTMLDivElement>(null)
  const canvasElRef     = useRef<HTMLCanvasElement>(null)
  const fabricRef       = useRef<FabricCanvas | null>(null)
  const designObjRef    = useRef<FabricObject | null>(null)
  const paRectRef       = useRef<FabricRectType | null>(null)
  const onPlacementRef  = useRef(onPlacementChange)
  const onObjectsRef    = useRef(onObjectsChange)
  const printAreaRef    = useRef(printArea)
  const fabricClassesRef = useRef<{ Textbox: new (...args: unknown[]) => FabricObject } | null>(null)

  onPlacementRef.current = onPlacementChange
  onObjectsRef.current   = onObjectsChange
  printAreaRef.current   = printArea

  const bgImage = useMemo(() => buildMockupBg(colorHex), [colorHex])

  function countUserObjects(): number {
    const canvas = fabricRef.current
    if (!canvas) return 0
    return canvas.getObjects().filter(o => o !== paRectRef.current).length
  }

  useImperativeHandle(ref, () => ({

    clearDesign() {
      const canvas = fabricRef.current
      const obj    = designObjRef.current
      if (canvas && obj) {
        canvas.remove(obj)
        canvas.renderAll()
        designObjRef.current = null
        onObjectsRef.current?.(countUserObjects())
      }
    },

    addText(text, { color, fontSize, fontFamily, bold }) {
      const canvas  = fabricRef.current
      const classes = fabricClassesRef.current
      if (!canvas || !classes) return
      const pa      = getPa(printAreaRef.current)

      const obj = new classes.Textbox(text, {
        left:       pa.cx,
        top:        pa.cy,
        originX:    'center',
        originY:    'center',
        width:      pa.width * 0.82,
        fontSize,
        fill:       color,
        fontFamily,
        fontWeight: bold ? 'bold' : 'normal',
        textAlign:  'center',
        editable:   true,
      } as Parameters<InstanceType<typeof classes.Textbox>['set']>[0])

      canvas.add(obj as FabricObject)
      canvas.setActiveObject(obj as FabricObject)
      canvas.renderAll()
      onObjectsRef.current?.(countUserObjects())
    },

    async exportPrintArea() {
      const canvas = fabricRef.current
      if (!canvas) throw new Error('Canvas not initialised')

      const pa = getPa(printAreaRef.current)
      const multiplier = Math.max(4, Math.ceil(3200 / pa.width))

      const paRect = paRectRef.current
      if (paRect) { paRect.set({ visible: false }); canvas.renderAll() }

      const dataUrl = canvas.toDataURL({
        format:     'png',
        quality:    1,
        left:       pa.left,
        top:        pa.top,
        width:      pa.width,
        height:     pa.height,
        multiplier,
      } as Parameters<FabricCanvas['toDataURL']>[0])

      if (paRect) { paRect.set({ visible: true }); canvas.renderAll() }

      return {
        dataUrl,
        widthPx:  Math.round(pa.width  * multiplier),
        heightPx: Math.round(pa.height * multiplier),
      }
    },

    deleteSelected() {
      const canvas = fabricRef.current
      if (!canvas) return
      const active = canvas.getActiveObject()
      if (active && active !== paRectRef.current) {
        if (active === designObjRef.current) designObjRef.current = null
        canvas.remove(active)
        canvas.renderAll()
        onObjectsRef.current?.(countUserObjects())
      }
    },

    hasObjects() {
      return countUserObjects() > 0
    },

  }), [])

  useEffect(() => {
    if (!canvasElRef.current || fabricRef.current) return
    let cancelled = false

    async function init() {
      const { Canvas, Rect, Textbox } = await import('fabric')
      if (cancelled || fabricRef.current) return

      fabricClassesRef.current = { Textbox: Textbox as new (...args: unknown[]) => FabricObject }

      const canvas = new Canvas(canvasElRef.current!, {
        width:  BASE_W,
        height: BASE_H,
        backgroundColor: 'transparent',
        preserveObjectStacking: true,
      })
      fabricRef.current = canvas

      const pa   = getPa(printAreaRef.current)
      const rect = new Rect({
        left:           pa.left,
        top:            pa.top,
        width:          pa.width,
        height:         pa.height,
        fill:           'transparent',
        stroke:         '#6c47ff',
        strokeWidth:    1.5,
        strokeDashArray: [6, 4],
        selectable:     false,
        evented:        false,
        hoverCursor:    'default',
      })
      canvas.add(rect)
      paRectRef.current = rect as unknown as FabricRectType

      const emit = () => {
        if (designObjRef.current)
          onPlacementRef.current(toPlacement(designObjRef.current, getPa(printAreaRef.current)))
      }
      canvas.on('object:moving',   emit)
      canvas.on('object:scaling',  emit)
      canvas.on('object:rotating', emit)
      canvas.on('object:modified', emit)

      function applyZoom() {
        const container = containerRef.current
        if (!container) return
        const cw = container.clientWidth
        if (!cw) return
        const zoom = cw / BASE_W
        const ch   = Math.round(BASE_H * zoom)
        canvas.setDimensions({ width: cw, height: ch })
        canvas.setViewportTransform([zoom, 0, 0, zoom, 0, 0])
        const lowerEl = canvasElRef.current
        if (lowerEl) {
          lowerEl.style.position = 'absolute'
          lowerEl.style.top  = '0'
          lowerEl.style.left = '0'
        }
        const upperEl = lowerEl?.nextElementSibling as HTMLElement | null
        if (upperEl?.tagName === 'CANVAS') {
          upperEl.style.position = 'absolute'
          upperEl.style.top  = '0'
          upperEl.style.left = '0'
        }
      }
      applyZoom()
      requestAnimationFrame(() => { applyZoom(); requestAnimationFrame(applyZoom) })

      const ro = new ResizeObserver(applyZoom)
      ro.observe(containerRef.current!)
      ;(canvas as unknown as { _ro: ResizeObserver })._ro = ro
    }

    init()
    return () => {
      cancelled = true
      const c = fabricRef.current
      if (c) {
        ;(c as unknown as { _ro?: ResizeObserver })._ro?.disconnect()
        c.dispose()
        fabricRef.current    = null
        designObjRef.current = null
        paRectRef.current    = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!fabricRef.current) return

    if (!designUrl) {
      const canvas = fabricRef.current
      const obj    = designObjRef.current
      if (canvas && obj) {
        canvas.remove(obj)
        canvas.renderAll()
        designObjRef.current = null
        onObjectsRef.current?.(countUserObjects())
      }
      return
    }

    const canvas = fabricRef.current

    async function loadDesign() {
      const { FabricImage } = await import('fabric')
      if (!fabricRef.current) return
      const pa  = getPa(printAreaRef.current)
      const img = await FabricImage.fromURL(designUrl!, { crossOrigin: 'anonymous' })
      if (!fabricRef.current) return
      if (designObjRef.current) canvas.remove(designObjRef.current)
      img.set({
        originX: 'center', originY: 'center',
        ...(initialPlacement
          ? fromPlacement(initialPlacement, pa, img.width ?? 1)
          : { left: pa.cx, top: pa.cy, scaleX: pa.width / (img.width ?? 1), scaleY: pa.width / (img.width ?? 1) }),
      })
      canvas.add(img)
      canvas.setActiveObject(img)
      canvas.renderAll()
      designObjRef.current = img
      onPlacementRef.current(toPlacement(img, pa))
      onObjectsRef.current?.(countUserObjects())
    }

    loadDesign()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [designUrl, printArea])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      if (e.key === 'Delete' || e.key === 'Backspace') {
        const canvas = fabricRef.current
        if (!canvas) return
        const active = canvas.getActiveObject()
        if (!active || active === paRectRef.current) return
        if (active === designObjRef.current) designObjRef.current = null
        canvas.remove(active)
        canvas.renderAll()
        onObjectsRef.current?.(countUserObjects())
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position:            'relative',
        width:               '100%',
        aspectRatio:         `${BASE_W} / ${BASE_H}`,
        backgroundImage:     bgImage,
        backgroundSize:      '100% 100%',
        backgroundRepeat:    'no-repeat',
        backgroundColor:     '#f8f8fb',
      }}
    >
      <canvas ref={canvasElRef} style={{ touchAction: 'none', display: 'block' }} />
    </div>
  )
})

export default CustomizerCanvas
