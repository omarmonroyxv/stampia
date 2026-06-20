'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode, CSSProperties } from 'react'

export const VIEWPORT = { once: true, margin: '-60px' } as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}

export const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

export function Reveal({
  children,
  className,
  style,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  return (
    <motion.div
      className={className}
      style={style}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{
        hidden: { opacity: 0, y: 26 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay } },
      }}
    >
      {children}
    </motion.div>
  )
}
