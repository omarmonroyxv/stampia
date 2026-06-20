export interface Placement {
  x_pct: number
  y_pct: number
  scale: number
  rotation: number
}

export interface PrintArea {
  width_cm: number
  height_cm: number
  offset_x_pct: number
  offset_y_pct: number
  width_pct: number
  height_pct: number
}

export interface ProductPrintAreas {
  front: PrintArea
}

export interface CartItem {
  variantId: string
  productId: string
  productName: string
  colorName: string
  colorHex: string
  size: string
  designUrl?: string
  designWidth?: number
  designHeight?: number
  placement?: Placement
  quantity: number
  unitPriceMxn: number
  mockupFrontUrl?: string
}

export interface DPIValidation {
  level: 'ok' | 'warn' | 'error'
  dpi: number
  message: string
}
