'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface GlowingShadowProps {
  children: ReactNode
  className?: string
}

/* Wraps a button/link with an animated warm halo + a spark that travels the
   border. Adapted from the rainbow "glowing-shadow" card to button scale and
   the Stampia cinnabar palette. Apply to primary CTAs only. */
export function GlowingShadow({ children, className }: GlowingShadowProps) {
  return <span className={cn('mk-glow', className)}>{children}</span>
}
