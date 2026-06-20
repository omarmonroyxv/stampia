'use client'

import Link from 'next/link'
import type { Variants } from 'framer-motion'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import MockupPlayera from '@/components/ui/MockupPlayera'
import NumberTicker from '@/components/ui/NumberTicker'
import FloatingParticles from '@/components/ui/FloatingParticles'
import GlowButton from '@/components/ui/GlowButton'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

const lineVariant: Variants = {
  hidden: { y: '108%', opacity: 0 },
  show: (i: number) => ({
    y: '0%',
    opacity: 1,
    transition: { duration: 0.9, ease: EASE, delay: i * 0.14 },
  }),
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay },
  }),
}

/* avatar initials for social proof */
const AVATARS = ['D', 'V', 'C', 'A']

export default function HeroSection() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotX = useSpring(useTransform(mouseY, [-300, 300], [7, -7]),  { stiffness: 130, damping: 20 })
  const rotY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 130, damping: 20 })

  return (
    <section
      className="relative min-h-[95vh] flex items-center overflow-hidden"
      style={{ background: '#080808' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - (r.left + r.width  / 2))
        mouseY.set(e.clientY - (r.top  + r.height / 2))
      }}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      {/* Layers */}
      <div className="hero-grain" />
      <FloatingParticles opacity={0.28} />

      {/* Top-right purple orb */}
      <div className="absolute pointer-events-none" style={{
        top: '-8%', right: '-4%',
        width: 800, height: 800,
        background: 'radial-gradient(circle, rgba(108,71,255,0.18) 0%, transparent 62%)',
      }} />
      {/* Bottom-left soft orb */}
      <div className="absolute pointer-events-none" style={{
        bottom: '-15%', left: '-6%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108,71,255,0.09) 0%, transparent 70%)',
      }} />

      <div className="layout-container relative z-10 py-28 md:py-32">
        <div className="grid md:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-12 xl:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>

            {/* Social proof pill */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-3 mb-8 rounded-full px-4 py-2 border"
              style={{ borderColor: 'rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex -space-x-2">
                {AVATARS.map((a) => (
                  <div
                    key={a}
                    className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: 'var(--color-brand)', borderColor: '#080808' }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.65)' }}>
                +2,400 creadores confían en Stampia
              </span>
            </motion.div>

            {/* Headline — 3 animated lines */}
            <div className="mb-8">
              {[
                { text: 'Diseña.',  style: { color: 'rgba(255,255,255,0.96)', fontStyle: 'italic' } },
                { text: 'Imprime.', style: {}, gradient: true },
                { text: 'Reparte.', style: { color: 'rgba(255,255,255,0.96)', fontStyle: 'italic' } },
              ].map((line, i) => (
                <div key={line.text} style={{ overflow: 'hidden' }}>
                  <motion.span
                    custom={i}
                    variants={lineVariant}
                    initial="hidden"
                    animate="show"
                    className={`block font-serif font-extrabold leading-[0.98] tracking-[-0.045em] ${line.gradient ? 'text-gradient-brand' : ''}`}
                    style={{
                      fontSize: 'clamp(4.5rem, 10vw, 8.5rem)',
                      ...line.style,
                    }}
                  >
                    {line.text}
                  </motion.span>
                </div>
              ))}
            </div>

            <motion.p
              custom={0.55}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="text-lg leading-relaxed mb-10 max-w-[360px]"
              style={{ color: 'rgba(255,255,255,0.46)' }}
            >
              Sube tu diseño, elige tu talla y recíbelo en casa.
              Sin mínimos, sin inventario.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={0.72}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap gap-3 mb-14"
            >
              <GlowButton href="/catalog" size="lg">
                Empezar ahora
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </GlowButton>
              <GlowButton href="/catalog" variant="ghost" size="lg">
                Ver catálogo
              </GlowButton>
            </motion.div>

            {/* Stats row with NumberTicker */}
            <motion.div
              custom={0.9}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-8 pt-8 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div>
                <p className="font-serif font-bold text-3xl text-white">
                  <NumberTicker value={2400} suffix="+" />
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Diseños entregados
                </p>
              </div>
              <div
                className="w-px self-stretch"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <div>
                <p className="font-serif font-bold text-3xl text-white">$299</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Precio de inicio MXN
                </p>
              </div>
              <div
                className="w-px self-stretch"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              />
              <div>
                <p className="font-serif font-bold text-3xl text-white">5–7</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.32)' }}>
                  Días de entrega
                </p>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: 3-D shirt ── */}
          <div className="flex justify-center md:justify-end">
            <motion.div
              style={{
                rotateX: rotX,
                rotateY: rotY,
                transformPerspective: 1100,
                transformStyle: 'preserve-3d',
              }}
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.25 }}
              className="relative select-none"
            >
              {/* Purple glow beneath shirt */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: 280, height: 60,
                  background: 'var(--color-brand)',
                  filter: 'blur(48px)',
                  opacity: 0.55,
                }}
              />

              <MockupPlayera color="#ede8f8" style={{ width: 340 }} />

              {/* Floating badge — price */}
              <motion.div
                initial={{ opacity: 0, x: -28, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, duration: 0.7, ease: EASE }}
                className="absolute -left-12 top-[38%] bg-white rounded-2xl shadow-2xl px-4 py-3"
                style={{ minWidth: 148 }}
              >
                <p className="text-xs font-extrabold text-neutral-900">Desde $299 MXN</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">Sin mínimo de piezas</p>
              </motion.div>

              {/* Floating badge — delivery */}
              <motion.div
                initial={{ opacity: 0, x: 28, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7, ease: EASE }}
                className="absolute -right-8 bottom-[32%] rounded-2xl shadow-2xl px-4 py-3"
                style={{ background: 'var(--color-brand)', minWidth: 148 }}
              >
                <p className="text-xs font-extrabold text-white">Entrega 5–7 días</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  A toda la República
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
          style={{ borderColor: 'rgba(255,255,255,0.16)' }}
        >
          <div className="w-0.5 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}
