import type { Placement, PrintArea } from '@/types/domain'

export interface ComposeOptions {
  /** URL o path signed del archivo original (accesible desde el servidor) */
  originalFileUrl: string
  printArea: PrintArea
  placement: Placement
  /** DPI de salida. Default: 300 */
  outputDpi?: number
}

export interface ComposeResult {
  buffer: Buffer
  widthPx: number
  heightPx: number
}

/**
 * Compone el archivo de impresión final a resolución real.
 *
 * Sistema de coordenadas del placement (definido en M3/CustomizerCanvas):
 *   img_center_x = print_file_width/2  + placement.x_pct * print_file_width
 *   img_center_y = print_file_height/2 + placement.y_pct * print_file_height
 *   img_width    = placement.scale * print_file_width
 *   img_height   = img_width * (naturalH / naturalW)
 *
 * Salida: PNG transparente, dimensiones = print area físico a outputDpi.
 */
export async function composePrintFile(options: ComposeOptions): Promise<ComposeResult> {
  const { createCanvas, loadImage } = await import('@napi-rs/canvas')

  const dpi = options.outputDpi ?? 300
  const { width_cm, height_cm } = options.printArea

  const widthPx  = Math.round((width_cm  / 2.54) * dpi)
  const heightPx = Math.round((height_cm / 2.54) * dpi)

  const canvas = createCanvas(widthPx, heightPx)
  const ctx = canvas.getContext('2d')

  const img = await loadImage(options.originalFileUrl)

  const { x_pct, y_pct, scale, rotation } = options.placement

  const drawW = scale * widthPx
  const drawH = drawW * (img.height / img.width)

  const cx = widthPx  / 2 + x_pct * widthPx
  const cy = heightPx / 2 + y_pct * heightPx

  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate((rotation * Math.PI) / 180)
  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH)
  ctx.restore()

  const buffer = canvas.toBuffer('image/png')

  return { buffer: Buffer.from(buffer), widthPx, heightPx }
}
