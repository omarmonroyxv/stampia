'use client'

import { useRef, useState } from 'react'

interface Props {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
  spotlightColor?: string
  spotlightSize?: number
}

export default function SpotlightCard({
  children,
  className = '',
  style,
  spotlightColor = 'rgba(108,71,255,0.10)',
  spotlightSize = 340,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [spot, setSpot] = useState({ x: 0, y: 0, visible: false })

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={style}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
      }}
      onMouseLeave={() => setSpot((s) => ({ ...s, visible: false }))}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 z-0"
        style={{
          opacity: spot.visible ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at ${spot.x}px ${spot.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
