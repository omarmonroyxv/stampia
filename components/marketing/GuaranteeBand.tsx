'use client'

import { ShieldCheck, RefreshCw, Headset, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { stagger, item, VIEWPORT } from './motion-primitives'

const POINTS = [
  { icon: RefreshCw, title: 'Reimpresión gratis', desc: 'Si la calidad no cumple, lo reimprimimos. Sin preguntas.' },
  { icon: ShieldCheck, title: 'Calidad garantizada', desc: 'Revisamos cada pieza antes de enviarla.' },
  { icon: Lock, title: 'Pago 100% seguro', desc: 'Procesado por MercadoPago. Tus datos protegidos.' },
  { icon: Headset, title: 'Soporte real', desc: 'Personas por WhatsApp, no bots.' },
]

export default function GuaranteeBand() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(165deg, #ff5630 0%, var(--cinnabar) 55%, var(--cinnabar-deep) 100%)' }}
    >
      <div className="mk-halftone" style={{ position: 'absolute', inset: 0, opacity: 0.12, pointerEvents: 'none', backgroundImage: 'radial-gradient(#fff 1.5px, transparent 1.6px)', backgroundSize: '11px 11px' }} />
      <div className="layout-container relative" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <motion.h2 variants={item} className="mk-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.4rem)', color: '#fff', maxWidth: '20ch' }}>
            Si no te encanta, lo reimprimimos.
          </motion.h2>
          <motion.p variants={item} style={{ marginTop: 14, fontSize: '1.0625rem', color: 'rgba(255,255,255,0.85)', maxWidth: '34rem' }}>
            Imprimir con Stampia no tiene riesgo. Tú pones el diseño; nosotros ponemos la cara por el resultado.
          </motion.p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {POINTS.map((p) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={p.title}
                  variants={item}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.22)', backdropFilter: 'blur(6px)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}
                >
                  <div className="flex items-center justify-center rounded-xl mb-4" style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                    <Icon size={22} strokeWidth={2} />
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: 5 }}>{p.title}</h3>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.5, color: 'rgba(255,255,255,0.8)' }}>{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
