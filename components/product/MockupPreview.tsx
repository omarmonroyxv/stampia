'use client'

import Image from 'next/image'

interface Props {
  mockupUrl: string
  colorHex: string
  productName: string
}

// Usa `color` de CSS sobre el SVG para cambiar el tono de la playera en vivo.
// Funciona con nuestro SVG que usa fill="currentColor".
export default function MockupPreview({ mockupUrl, colorHex, productName }: Props) {
  const isSvg = mockupUrl.endsWith('.svg')

  if (isSvg) {
    return (
      <div
        className="relative aspect-square w-full max-w-sm mx-auto"
        style={{ color: colorHex }}
      >
        <Image
          src={mockupUrl}
          alt={productName}
          fill
          className="object-contain"
          priority
        />
      </div>
    )
  }

  return (
    <div className="relative aspect-square w-full max-w-sm mx-auto">
      <Image src={mockupUrl} alt={productName} fill className="object-contain" priority />
    </div>
  )
}
