'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, TrendingUp, Users, Building2 } from 'lucide-react'
import { Reveal, stagger, item, VIEWPORT } from './motion-primitives'
import RegMarks from './RegMarks'

const TIERS = [
  {
    range: '1–9 pzas',
    label: 'Individual',
    desc: 'Precio unitario estándar. Sin mínimos.',
    highlight: false,
    badge: null,
  },
  {
    range: '10–49 pzas',
    label: 'Pequeño lote',
    desc: 'Descuento automático aplicado al checkout.',
    highlight: false,
    badge: 'Descuento 10%',
  },
  {
    range: '50–199 pzas',
    label: 'Colección',
    desc: 'Ideal para lanzar tu primera línea de ropa.',
    highlight: true,
    badge: 'Descuento 20%',
  },
  {
    range: '200+ pzas',
    label: 'Mayoreo',
    desc: 'Cotización personalizada. Precio por pieza más bajo.',
    highlight: false,
    badge: 'Precio especial',
  },
]

const USE_CASES = [
  {
    icon: TrendingUp,
    title: 'Lanza tu marca de ropa',
    desc: 'Sin inventario, sin riesgo. Tú diseñas, nosotros producimos. Ganas la diferencia entre tu precio y el nuestro.',
  },
  {
    icon: Users,
    title: 'Uniformes para tu equipo',
    desc: 'Playeras, hoodies o totes con tu logo para toda la empresa. Entrega a domicilio en todo México.',
  },
  {
    icon: Building2,
    title: 'Merch para tu evento',
    desc: 'Conciertos, conferencias, graduaciones. Pedidos desde 10 piezas con tu diseño personalizado.',
  },
]

export default function MayoreoSection() {
  return (
    <section className="section-py relative overflow-hidden" style={{ background: 'var(--bg)', borderBottom: '1.5px solid var(--line)' }}>
      <RegMarks inset={22} />

      <div className="layout-container relative">
        {/* Header */}
        <Reveal className="mb-14 max-w-2xl">
          <p className="mk-spec mb-5">Mayoreo y marcas</p>
          <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)' }}>
            Más piezas,{' '}
            <span style={{ color: 'var(--cinnabar)' }}>mejor precio.</span>
          </h2>
          <p className="mt-5" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '36rem' }}>
            Desde una sola pieza hasta cientos. Stampia escala contigo — ya sea que estés lanzando tu propia marca, vistiendo a tu equipo o imprimiendo merch para tu evento.
          </p>
        </Reveal>

        {/* Use cases */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
        >
          {USE_CASES.map((u) => {
            const Icon = u.icon
            return (
              <motion.div
                key={u.title}
                variants={item}
                className="mk-card rounded-2xl p-7"
                style={{ borderRadius: 16 }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{
                    width: 46,
                    height: 46,
                    background: 'rgba(236,58,18,0.08)',
                    border: '1.5px solid rgba(236,58,18,0.2)',
                    color: 'var(--cinnabar)',
                  }}
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-public)',
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    color: 'var(--ink)',
                    marginBottom: 8,
                  }}
                >
                  {u.title}
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--smoke)' }}>{u.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Volume tiers */}
        <Reveal className="mb-10">
          <p className="mk-spec mb-6" style={{ fontSize: '0.7rem' }}>Descuentos por volumen</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {TIERS.map((t) => (
              <div
                key={t.range}
                className="rounded-2xl p-6 relative"
                style={{
                  border: t.highlight
                    ? '2px solid var(--cinnabar)'
                    : '1.5px solid var(--line)',
                  background: t.highlight ? 'rgba(236,58,18,0.04)' : 'var(--bg)',
                  borderRadius: 16,
                }}
              >
                {t.badge && (
                  <span
                    className="mk-mono"
                    style={{
                      display: 'inline-block',
                      fontSize: '0.65rem',
                      letterSpacing: '0.1em',
                      padding: '3px 10px',
                      borderRadius: 99,
                      background: t.highlight ? 'var(--cinnabar)' : 'var(--line)',
                      color: t.highlight ? '#fff' : 'var(--smoke)',
                      marginBottom: 12,
                    }}
                  >
                    {t.badge}
                  </span>
                )}
                <p
                  className="mk-display"
                  style={{
                    fontSize: '1.5rem',
                    color: t.highlight ? 'var(--cinnabar)' : 'var(--ink)',
                    lineHeight: 1.1,
                    marginBottom: 4,
                  }}
                >
                  {t.range}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-public)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    color: 'var(--ink)',
                    marginBottom: 6,
                  }}
                >
                  {t.label}
                </p>
                <p style={{ fontSize: '0.825rem', lineHeight: 1.55, color: 'var(--smoke)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CTA row */}
        <Reveal>
          <div
            className="mk-card rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ borderRadius: 16, background: 'rgba(236,58,18,0.04)', border: '1.5px solid rgba(236,58,18,0.18)' }}
          >
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-public)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--ink)',
                  marginBottom: 6,
                }}
              >
                ¿Necesitas +200 piezas o una cotización personalizada?
              </p>
              <p style={{ fontSize: '0.9375rem', color: 'var(--smoke)', lineHeight: 1.55 }}>
                Escríbenos y te respondemos en menos de 24 horas con precio y tiempos de entrega a la medida.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Link
                href="/contacto"
                className="mk-btn mk-btn-primary"
                style={{ padding: '12px 22px', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
              >
                Solicitar cotización
                <ArrowRight size={15} strokeWidth={2.5} />
              </Link>
              <Link
                href="/precios"
                className="mk-btn mk-btn-outline"
                style={{ padding: '12px 22px', fontSize: '0.9375rem', whiteSpace: 'nowrap' }}
              >
                Ver precios
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
