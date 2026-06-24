'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MockupPlayera from '@/components/ui/MockupPlayera'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'
import type { ProductWithVariants } from '@/types/product'

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
                  {/* Simple Link card — no TiltCard wrapper to avoid 3D transform click issues */}
                  <Link
                    href={`/product/${p.slug}`}
                    className="mk-prodcard group block overflow-hidden rounded-xl"
                    style={{ borderRadius: 12, transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), box-shadow 0.3s ease' }}
                  >
                    {/* Square image box */}
                    <div
                      className="relative overflow-hidden"
                      style={{ aspectRatio: '1 / 1', background: 'var(--paper-2)' }}
                    >
                      <div className="mk-halftone-cinnabar absolute inset-0 opacity-0 group-hover:opacity-[0.13] transition-opacity duration-500 pointer-events-none" />
                      {/* Image fills the full box */}
                      <div className="absolute inset-0 flex items-center justify-center p-6 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" style={{ willChange: 'transform' }}>
                        {p.mockup_front_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.mockup_front_url}
                            alt={p.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.10))',
                            }}
                          />
                        ) : (
                          <MockupPlayera
                            color={colors[0]?.color_hex ?? '#f0ece8'}
                            style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.10))' }}
                          />
                        )}
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
