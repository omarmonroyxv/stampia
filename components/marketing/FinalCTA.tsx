'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { GlowingShadow } from '@/components/ui/glowing-shadow'
import MagneticButton from '@/components/marketing/MagneticButton'
import RegMarks from '@/components/marketing/RegMarks'
import { VIEWPORT } from './motion-primitives'

function FloatingMark({ style, delay = 0 }: { style: React.CSSProperties; delay?: number }) {
  return (
    <motion.span
      className="absolute pointer-events-none"
      style={{ color: 'var(--cinnabar)', opacity: 0.18, ...style }}
      animate={{ y: [0, -16, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/nuevofavi.png" alt="" width={26} height={26} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
    </motion.span>
  )
}

const lineVariant: Variants = {
  hidden: { opacity: 0, y: '0.4em' },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 } }),
}

export default function FinalCTA() {
  return (
    <section className="section-py relative overflow-hidden" style={{ textAlign: 'center' }}>
      <RegMarks inset={28} />
      <div className="mk-halftone mk-drift" style={{ position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)', width: 520, height: 220, opacity: 0.06, pointerEvents: 'none' }} />
      <FloatingMark style={{ top: '22%', left: '12%' }} delay={0} />
      <FloatingMark style={{ top: '30%', right: '14%' }} delay={1.5} />
      <FloatingMark style={{ bottom: '20%', left: '20%' }} delay={2.8} />

      <div className="layout-container-narrow relative">
        <motion.div initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <motion.p custom={0} variants={lineVariant} className="mk-spec mb-6" style={{ justifyContent: 'center' }}>
            Empieza hoy
          </motion.p>

          <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 9vw, 6.5rem)', color: 'var(--ink)', overflow: 'hidden' }}>
            <motion.span custom={1} variants={lineVariant} style={{ display: 'block' }}>Tu diseño,</motion.span>
            <motion.span custom={2} variants={lineVariant} style={{ display: 'block', color: 'var(--cinnabar)' }}>impreso.</motion.span>
          </h2>

          <motion.p custom={3} variants={lineVariant} className="mx-auto mt-7 mb-10" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '34rem' }}>
            Lanza tu marca, viste a tu equipo o vende diseños sin inventario.
            Desde una pieza hasta cientos — Stampia produce, tú te llevas la diferencia.
          </motion.p>

          <motion.div custom={4} variants={lineVariant} className="flex flex-wrap items-center justify-center gap-3">
            <MagneticButton>
              <GlowingShadow>
                <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '15px 30px', fontSize: '1rem' }}>
                  Empieza tu diseño<ArrowRight size={16} strokeWidth={2.5} />
                </Link>
              </GlowingShadow>
            </MagneticButton>
            <Link href="/contacto" className="mk-btn mk-btn-outline" style={{ padding: '15px 30px', fontSize: '1rem' }}>
              Pedir cotización
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
