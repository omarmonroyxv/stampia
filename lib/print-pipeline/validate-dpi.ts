import type { DPIValidation, Placement, PrintArea } from '@/types/domain'

const DPI_EXCELLENT = 300
const DPI_GOOD      = 150
const DPI_WARN      = 96

export function validateDpi(
  imagePx: { width: number; height: number },
  printArea: PrintArea,
  placement: Placement,
): DPIValidation {
  const printedWidthCm     = printArea.width_cm * placement.scale
  const printedWidthInches = printedWidthCm / 2.54
  const effectiveDpi       = Math.round(imagePx.width / printedWidthInches)

  if (effectiveDpi >= DPI_EXCELLENT) {
    return {
      dpi:     effectiveDpi,
      level:   'ok',
      message: `${effectiveDpi} DPI calidad de impresion excelente`,
    }
  }

  if (effectiveDpi >= DPI_GOOD) {
    return {
      dpi:     effectiveDpi,
      level:   'warn',
      message: `${effectiveDpi} DPI calidad aceptable. Para resultados optimos recomendamos ${DPI_EXCELLENT}+ DPI.`,
    }
  }

  if (effectiveDpi >= DPI_WARN) {
    return {
      dpi:     effectiveDpi,
      level:   'warn',
      message: `${effectiveDpi} DPI resolucion moderada. La impresion podria verse un poco difusa.`,
    }
  }

  return {
    dpi:     effectiveDpi,
    level:   'error',
    message: `${effectiveDpi} DPI resolucion muy baja. Recomendamos una imagen de mayor tamano.`,
  }
}
