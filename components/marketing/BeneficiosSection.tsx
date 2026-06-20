'use client'

import { motion } from 'framer-motion'
import { Layers, Printer, Wand2, Truck, CreditCard, MessageCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import RegMarks from '@/components/marketing/RegMarks'
import NumberTicker from '@/components/ui/NumberTicker'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'
import TiltCard from './TiltCard'

const BENEFITS: { icon: LucideIcon; title: string; desc: string; span: string }[] = [
  { icon: Layers, title: 'Sin pedido mínimo', desc: 'Imprime desde una sola pieza, al mismo precio por unidad. Sin cuotas de setup.', span: 'md:col-span-2' },
  { icon: Printer, title: 'Impresión DTG premium', desc: 'Alta definición; colores que no se agrietan lavada tras lavada.', span: 'md:col-span-1' },
  { icon: Wand2, title: 'Editor visual', desc: 'Posiciona y escala tu arte en tiempo real.', span: 'md:col-span-1' },
  { icon: CreditCard, title: 'Pagos locales', desc: 'Tarjeta, OXXO y SPEI vía MercadoPago.', span: 'md:col-span-1' },
  { icon: Truck, title: 'Envío nacional', desc: 'Rastreable a todo México en 5–7 días.', span: 'md:col-span-1' },
  { icon: MessageCircle, title: 'Soporte real por WhatsApp', desc: 'Personas, no bots. Si algo sale mal, te escribimos y lo resolvemos.', span: 'md:col-span-3' },
]

const STATS = [
  { value: 2400, suffix: '+', label: 'Piezas impresas' },
  { value: 98, suffix: '%', label: 'Satisfacción' },
  { value: 32, suffix: '', label: 'Estados con envío' },
]

export default function BeneficiosSection() {
  return (
    <section className="mk-ink-section section-py relative overflow-hidden">
      <RegMarks inset={22} />
      <div className="mk-halftone-cinnabar mk-drift" style={{ position: 'absolute', top: -60, right: -60, width: 380, height: 380, opacity: 0.1, pointerEvents: 'none' }} />

      <div className="layout-container relative">
        <Reveal className="mb-14 max-w-2xl">
          <p className="mk-spec mb-5">Por qué Stampia</p>
          <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}>
            Hecho para <span style={{ color: 'var(--cinnabar)' }}>creadores.</span>
          </h2>
          <p className="mt-6" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.55)' }}>
            Diseñamos cada paso para que tú solo te ocupes del arte. Del resto —prensa,
            calidad y envío— nos encargamos nosotros.
          </p>
        </Reveal>

        {/* Bento */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {BENEFITS.map((b) => {
            const Icon = b.icon
            return (
              <motion.div key={b.title} variants={item} className={`col-span-1 ${b.span}`}>
                <TiltCard className="mk-bento rounded-2xl p-6 h-full" style={{ borderRadius: 16 }} max={5}>
                  <div className="flex items-center justify-center rounded-xl mb-4" style={{ width: 44, height: 44, background: 'rgba(236,58,18,0.14)', border: '1.5px solid rgba(236,58,18,0.3)', color: 'var(--cinnabar)' }}>
                    <Icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="mb-2" style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>{b.title}</h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.6)' }}>{b.desc}</p>
                </TiltCard>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4" variants={stagger} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          {STATS.map((s) => (
            <motion.div key={s.label} variants={item} className="mk-bento rounded-2xl p-7 text-center">
              <div className="mk-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', lineHeight: 1, color: 'var(--cinnabar)' }}>
                <NumberTicker value={s.value} suffix={s.suffix} />
              </div>
              <p className="mk-mono mt-2" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
