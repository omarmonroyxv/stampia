'use client'

import { useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Reveal } from './motion-primitives'
import MagneticButton from './MagneticButton'
import { GlowingShadow } from '@/components/ui/glowing-shadow'

/* The printed design — identical coords in both layers so the wipe reads as
   the same artwork transforming from file → garment. */
function Design() {
  return (
    <g>
      <circle cx="200" cy="208" r="44" fill="url(#baHt)" />
      <circle cx="200" cy="208" r="44" fill="#ec3a12" opacity="0.12" />
      <g stroke="#14110e" strokeWidth="7" strokeLinecap="round">
        <line x1="200" y1="178" x2="200" y2="238" />
        <line x1="174" y1="193" x2="226" y2="223" />
        <line x1="174" y1="223" x2="226" y2="193" />
      </g>
    </g>
  )
}

export default function BeforeAfter() {
  const [pos, setPos] = useState(52)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = useCallback((clientX: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const p = ((clientX - r.left) / r.width) * 100
    setPos(Math.max(4, Math.min(96, p)))
  }, [])

  return (
    <section className="section-py relative overflow-hidden" style={{ borderBottom: '1.5px solid var(--line)' }}>
      <div className="mk-wash" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      <div className="layout-container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Copy */}
          <Reveal>
            <p className="mk-spec mb-5">La transformación</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--ink)' }}>
              Del archivo<br /><span style={{ color: 'var(--cinnabar)' }}>a la prenda.</span>
            </h2>
            <p className="mt-6" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '30rem' }}>
              Arrastra el control y mira cómo tu diseño cobra vida sobre la prenda.
              Lo que subes es exactamente lo que imprimimos — con calidad de taller.
            </p>
            <div className="mt-8">
              <MagneticButton>
                <GlowingShadow>
                  <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '14px 28px', fontSize: '0.95rem' }}>
                    Pruébalo con tu diseño<ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </GlowingShadow>
              </MagneticButton>
            </div>
          </Reveal>

          {/* Interactive stage */}
          <Reveal delay={0.1}>
            <div
              ref={ref}
              className="relative select-none touch-none mx-auto"
              style={{ width: '100%', maxWidth: 480, aspectRatio: '1 / 1', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 30px 70px -30px rgba(20,17,14,0.35)', cursor: 'ew-resize', background: 'var(--paper-2)' }}
              onPointerDown={(e) => { dragging.current = true; ;(e.target as Element).setPointerCapture?.(e.pointerId); update(e.clientX) }}
              onPointerMove={(e) => { if (dragging.current) update(e.clientX) }}
              onPointerUp={() => { dragging.current = false }}
              onPointerLeave={() => { dragging.current = false }}
              role="slider"
              aria-label="Comparar diseño y prenda impresa"
              aria-valuenow={Math.round(pos)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {/* AFTER — printed garment (full) */}
              <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" aria-hidden="true">
                <defs>
                  <pattern id="baHt" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="4.5" cy="4.5" r="2" fill="#ec3a12" /></pattern>
                </defs>
                <path d="M150,96 C168,113 232,113 250,96 L300,128 L280,166 L266,151 L266,340 L134,340 L134,151 L120,166 L100,128 Z" fill="#ffffff" stroke="#14110e" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M160,102 C176,116 224,116 240,102" fill="none" stroke="#14110e" strokeWidth="1.6" opacity="0.45" />
                <Design />
                <text x="200" y="372" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fill="#9a9389" letterSpacing="2">IMPRESO · DTG</text>
              </svg>

              {/* BEFORE — the flat file (clipped) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: 'var(--paper)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/design.jpeg"
                  alt="Diseño del archivo"
                  style={{ width: '72%', height: '80%', objectFit: 'contain' }}
                  draggable={false}
                />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--faint)', position: 'absolute', bottom: 16, left: 16 }}>
                  MI DISEÑO
                </span>
              </div>

              {/* Divider + handle */}
              <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, width: 2, background: 'var(--cinnabar)', transform: 'translateX(-1px)', boxShadow: '0 0 16px rgba(236,58,18,0.5)' }}>
                <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%)', width: 42, height: 42, borderRadius: '50%', background: 'var(--cinnabar)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(236,58,18,0.5), inset 0 1px 0 rgba(255,255,255,0.4)', color: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 6l-4 6 4 6M15 6l4 6-4 6" />
                  </svg>
                </div>
              </div>

              {/* Labels */}
              <span className="mk-mono absolute top-4 right-4" style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'var(--faint)', background: 'rgba(251,250,246,0.7)', padding: '4px 8px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>PRENDA</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
