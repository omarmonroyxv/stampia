'use client'

import { useState } from 'react'
import { Star, Quote } from 'lucide-react'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

interface Testimonial {
  name: string
  role: string
  avatar: string
  rating: number
  text: string
  product: string
  verified?: boolean
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Diego Ramírez',
    role: 'Organizador de eventos',
    avatar: 'DR',
    rating: 5,
    text: 'Pedí 15 playeras para un evento universitario y llegaron perfectas. La impresión no se cuarteó después de varios lavados. Definitivamente regreso.',
    product: 'Playera premium · Serigrafía DTG',
    verified: true,
  },
  {
    name: 'Fernanda López',
    role: 'Emprendedora — Tienda online',
    avatar: 'FL',
    rating: 5,
    text: 'Como dueña de una pequeña marca, necesitaba calidad desde la primera pieza. Stampia cumplió — los colores son exactos al diseño y el envío llegó en 6 días.',
    product: 'Tote bag · Impresión completa',
    verified: true,
  },
  {
    name: 'Carlos Mendoza',
    role: 'Director creativo',
    avatar: 'CM',
    rating: 5,
    text: 'Llevaba tiempo buscando un proveedor confiable en México. El editor online es intuitivo, el mockup es real — no hubo sorpresas al recibir el pedido.',
    product: 'Sudadera · DTG premium',
    verified: true,
  },
  {
    name: 'Valeria Torres',
    role: 'Diseñadora gráfica',
    avatar: 'VT',
    rating: 5,
    text: 'Subí un archivo con fondo transparente y el resultado fue impecable. El soporte por WhatsApp me resolvió una duda en minutos. 100% recomendado.',
    product: 'Playera oversize · Diseño personalizado',
    verified: true,
  },
  {
    name: 'Luis Herrera',
    role: 'Equipo de fútbol amateur',
    avatar: 'LH',
    rating: 5,
    text: 'Encargamos jerseys para todo el equipo. La calidad de tela y la impresión superaron nuestras expectativas. Vamos a pedir el kit completo la próxima temporada.',
    product: 'Playera deportiva · Lote de 20 piezas',
    verified: true,
  },
  {
    name: 'Sofía Castillo',
    role: 'Mamá creativa',
    avatar: 'SC',
    rating: 5,
    text: 'Hice una playera con el dibujo de mi hija para su cumpleaños. Quedó exactamente como en la pantalla. Fue el regalo más especial de la fiesta.',
    product: 'Playera infantil · Diseño personalizado',
    verified: true,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} fill={i < n ? '#F59E0B' : 'none'} stroke={i < n ? '#F59E0B' : '#D1D5DB'} />
      ))}
    </div>
  )
}

function AvatarCircle({ initials, index }: { initials: string; index: number }) {
  const colors = [
    'rgba(236,58,18,0.15)',
    'rgba(59,130,246,0.15)',
    'rgba(16,185,129,0.15)',
    'rgba(139,92,246,0.15)',
    'rgba(245,158,11,0.15)',
    'rgba(236,58,18,0.12)',
  ]
  const textColors = ['#EC3A12', '#3B82F6', '#10B981', '#8B5CF6', '#D97706', '#EC3A12']
  return (
    <div
      className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
      style={{
        width: 44,
        height: 44,
        background: colors[index % colors.length],
        color: textColors[index % textColors.length],
        fontSize: '0.875rem',
        letterSpacing: '0.04em',
      }}
    >
      {initials}
    </div>
  )
}

function TestimonialCard({ t, index }: { t: Testimonial; index: number }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6 h-full"
      style={{
        background: 'var(--paper)',
        border: '1.5px solid var(--line)',
        boxShadow: '0 4px 24px rgba(20,17,14,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <AvatarCircle initials={t.avatar} index={index} />
          <div>
            <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.2 }}>{t.name}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--smoke)', marginTop: 2 }}>{t.role}</p>
          </div>
        </div>
        <Quote size={18} style={{ color: 'var(--cinnabar)', opacity: 0.4, flexShrink: 0, marginTop: 4 }} />
      </div>

      {/* Stars */}
      <Stars n={t.rating} />

      {/* Text */}
      <p style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: 'var(--smoke)', flex: 1 }}>
        "{t.text}"
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--line)' }}>
        <span className="mk-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
          {t.product}
        </span>
        {t.verified && (
          <span
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span className="mk-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: '#059669' }}>VERIFICADO</span>
          </span>
        )}
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const total = TESTIMONIALS.length

  return (
    <section className="section-py relative overflow-hidden" style={{ borderBottom: '1.5px solid var(--line)', background: 'var(--paper-2)' }}>
      <div className="layout-container">
        <AnimateOnScroll>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <p className="mk-spec mb-4">Lo que dicen nuestros clientes</p>
              <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--ink)', lineHeight: 1.1 }}>
                Más de 2,400 piezas<br />
                <span style={{ color: 'var(--cinnabar)' }}>impresas con amor.</span>
              </h2>
            </div>
            {/* Rating summary */}
            <div className="flex items-center gap-3 rounded-2xl px-5 py-4 flex-shrink-0" style={{ background: 'var(--paper)', border: '1.5px solid var(--line)' }}>
              <div className="text-center">
                <p className="mk-display" style={{ fontSize: '2.25rem', color: 'var(--ink)', lineHeight: 1 }}>4.9</p>
                <Stars n={5} />
                <p className="mk-mono mt-1" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>DE 5.0 · 98% SATISFACCIÓN</p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        {/* Desktop grid (3 cols) */}
        <div className="hidden md:grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <AnimateOnScroll key={i} animation="fade-up" delay={i * 0.08}>
              <TestimonialCard t={t} index={i} />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div className="overflow-hidden rounded-2xl">
            <TestimonialCard t={TESTIMONIALS[active]} index={active} />
          </div>
          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Testimonio ${i + 1}`}
                style={{
                  width: i === active ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === active ? 'var(--cinnabar)' : 'var(--line)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'width 0.3s, background 0.3s',
                }}
              />
            ))}
          </div>
          {/* Arrows */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <button
              type="button"
              onClick={() => setActive((active - 1 + total) % total)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36, background: 'var(--paper)', border: '1.5px solid var(--line)', cursor: 'pointer' }}
              aria-label="Anterior"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
            </button>
            <span className="mk-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--faint)' }}>
              {active + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setActive((active + 1) % total)}
              className="flex items-center justify-center rounded-full"
              style={{ width: 36, height: 36, background: 'var(--paper)', border: '1.5px solid var(--line)', cursor: 'pointer' }}
              aria-label="Siguiente"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
