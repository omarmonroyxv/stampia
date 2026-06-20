'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MockupPlayera from '@/components/ui/MockupPlayera'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'
import TiltCard from './TiltCard'
import type { ProductWithVariants } from '@/types/product'

function CornerMarks() {
  const c = [
    { top: 10, left: 10 }, { top: 10, right: 10 },
    { bottom: 10, left: 10 }, { bottom: 10, right: 10 },
  ]
  return (
    <>
      {c.map((pos, i) => (
        <span key={i} className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ color: 'var(--cinnabar)', ...pos }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
            <circle cx="8" cy="8" r="4" /><line x1="0" y1="8" x2="16" y2="8" /><line x1="8" y1="0" x2="8" y2="16" />
          </svg>
        </span>
      ))}
    </>
  )
}

export default function ProductShowcase({ products }: { products: ProductWithVariants[] }) {
  return (
    <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
      <div className="layout-container">
        <div className="flex items-end justify-between gap-6 mb-14 flex-wrap">
          <Reveal>
            <p className="mk-spec mb-5">Catálogo</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', color: 'var(--ink)' }}>
              Listo para<br /><span style={{ color: 'var(--cinnabar)' }}>imprimir.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="hidden md:block">
            <Link href="/catalog" className="mk-btn mk-btn-outline">Ver todo el catálogo<ArrowRight size={16} strokeWidth={2.5} /></Link>
          </Reveal>
        </div>

        {products.length > 0 ? (
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
          >
            {products.map((p) => {
              const colors = [...new Map(p.product_variants.map((v) => [v.color_hex, v])).values()]
              return (
                <motion.div key={p.id} variants={item}>
                  <TiltCard style={{ borderRadius: 12 }}>
                  <Link href={`/product/${p.slug}`} className="mk-prodcard group block overflow-hidden rounded-xl">
                    <div className="relative flex items-center justify-center overflow-hidden" style={{ background: 'var(--paper-2)', minHeight: 280, padding: 28 }}>
                      <div className="mk-halftone-cinnabar absolute inset-0 opacity-0 group-hover:opacity-[0.13] transition-opacity duration-500" />
                      <div className="mk-print-area mk-march absolute" style={{ inset: 26, opacity: 0.32 }} />
                      <CornerMarks />
                      <div className="transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] group-hover:-rotate-2" style={{ willChange: 'transform' }}>
                        <MockupPlayera color={colors[0]?.color_hex ?? '#f0ece8'} style={{ width: 195 }} />
                      </div>
                    </div>
                    <div className="p-5" style={{ borderTop: '1.5px solid var(--line)' }}>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <h3 className="flex items-center gap-1.5" style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1rem', color: 'var(--ink)' }}>
                          {p.name}
                          <ArrowRight size={15} strokeWidth={2.5} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" style={{ color: 'var(--cinnabar)' }} />
                        </h3>
                        <span className="mk-mono" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--cinnabar)', flexShrink: 0 }}>
                          ${Number(p.base_price_mxn).toFixed(0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {colors.slice(0, 5).map((v) => (
                          <span key={v.color_hex} title={v.color_name} style={{ width: 15, height: 15, borderRadius: '50%', background: v.color_hex, border: '1.5px solid var(--line)' }} />
                        ))}
                        {colors.length > 5 && <span className="mk-mono" style={{ fontSize: '0.6875rem', color: 'var(--faint)' }}>+{colors.length - 5}</span>}
                      </div>
                    </div>
                  </Link>
                  </TiltCard>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <div className="mk-card p-12 text-center">
            <p style={{ color: 'var(--smoke)' }}>Muy pronto: nuestro catálogo completo de prendas.</p>
          </div>
        )}

        <Reveal className="md:hidden mt-10">
          <Link href="/catalog" className="mk-btn mk-btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Ver todo el catálogo<ArrowRight size={16} strokeWidth={2.5} /></Link>
        </Reveal>
      </div>
    </section>
  )
}
