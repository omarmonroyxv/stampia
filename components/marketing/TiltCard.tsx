'use client'

import { useRef, type ReactNode, type CSSProperties } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

export default function TiltCard({
  children,
  className,
  style,
  max = 7,
  spotlight = 'rgba(236,58,18,0.16)',
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  max?: number
  spotlight?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)

  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 18 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 18 })
  const glow = useMotionTemplate`radial-gradient(200px circle at ${mx}px ${my}px, ${spotlight}, transparent 70%)`

  function handleMove(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }
  function reset() {
    px.set(0.5)
    py.set(0.5)
    mx.set(-1000)
    my.set(-1000)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{ ...style, rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d', transformPerspective: 1000, position: 'relative' }}
    >
      {children}
      <motion.span aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: glow, zIndex: 5 }} />
    </motion.div>
  )
}
