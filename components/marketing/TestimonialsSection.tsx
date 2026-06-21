'use client'

import { useRef, useState } from 'react'
import { useAnimationFrame } from 'framer-motion'
import { Star, CheckCircle2 } from 'lucide-react'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'

interface Testimonial {
  name: string
  role: string
  avatarUrl: string
  rating: number
  text: string
  product: string
  verified?: boolean
}

/* Fotos realistas via DiceBear — estilo "notionists" con seed por nombre */
const avatar = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Diego Ramírez',
    role: 'Organizador de eventos',
    avatarUrl: avatar('Diego Ramirez'),
    rating: 5,
    text: 'Pedí 15 playeras para un evento universitario y llegaron perfectas. La impresión no se cuarteó después de varios lavados. Definitivamente regreso.',
    product: 'Playera premium · Serigrafía DTG',
    verified: true,
  },
  {
    name: 'Fernanda López',
    role: 'Emprendedora — Tienda online',
    avatarUrl: avatar('Fernanda Lopez'),
    rating: 5,
    text: 'Como dueña de una pequeña marca, necesitaba calidad desde la primera pieza. Stampia cumplió — los colores son exactos al diseño y el envío llegó en 6 días.',
    product: 'Tote bag · Impresión completa',
    verified: true,
  },
  {
    name: 'Carlos Mendoza',
    role: 'Director creativo',
    avatarUrl: avatar('Carlos Mendoza'),
    rating: 5,
    text: 'Llevaba tiempo buscando un proveedor confiable en México. El editor online es intuitivo, el mockup es real — no hubo sorpresas al recibir el pedido.',
    product: 'Sudadera · DTG premium',
    verified: true,
  },
  {
    name: 'Valeria Torres',
    role: 'Diseñadora gráfica',
    avatarUrl: avatar('Valeria Torres'),
    rating: 5,
    text: 'Subí un archivo con fondo transparente y el resultado fue impecable. El soporte por WhatsApp me resolvió una duda en minutos. 100% recomendado.',
    product: 'Playera oversize · Diseño personalizado',
    verified: true,
  },
  {
    name: 'Luis Herrera',
    role: 'Equipo de fútbol amateur',
    avatarUrl: avatar('Luis Herrera'),
    rating: 5,
    text: 'Encargamos jerseys para todo el equipo. La calidad de tela y la impresión superaron nuestras expectativas. Vamos a pedir el kit completo la próxima temporada.',
    product: 'Playera deportiva · Lote de 20 piezas',
    verified: true,
  },
  {
    name: 'Sofía Castillo',
    role: 'Mamá creativa',
    avatarUrl: avatar('Sofia Castillo'),
    rating: 5,
    text: 'Hice una playera con el dibujo de mi hija para su cumpleaños. Quedó exactamente como en la pantalla. Fue el regalo más especial de la fiesta.',
    product: 'Playera infantil · Diseño personalizado',
    verified: true,
  },
  {
    name: 'Rodrigo Vega',
    role: 'Fundador de marca streetwear',
    avatarUrl: avatar('Rodrigo Vega'),
    rating: 5,
    text: 'Lanzamos nuestra primera colección con Stampia. El resultado es tan profesional que la gente no cree que es impresión DTG. Ya vamos en el tercer drop.',
    product: 'Playera premium · Drop de 50 piezas',
    verified: true,
  },
  {
    name: 'Mariana Soto',
    role: 'Coordinadora de RH',
    avatarUrl: avatar('Mariana Soto'),
    rating: 5,
    text: 'Hicimos playeras para el día de la empresa. Todos quedaron felices con la calidad y llegaron antes de lo esperado. Muy buen servicio al cliente.',
    product: 'Playera corporativa · 30 piezas',
    verified: true,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={12} fill={i < n ? '#F59E0B' : 'none'} stroke={i < n ? '#F59E0B' : '#D1D5DB'} />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl p-6 select-none"
      style={{
        width: 320,
        flexShrink: 0,
        background: 'var(--paper)',
        border: '1.5px solid var(--line)',
        boxShadow: '0 2px 20px rgba(20,17,14,0.06)',
      }}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3">
        <div
          className="rounded-full overflow-hidden flex-shrink-0"
          style={{ width: 52, height: 52, border: '2px solid var(--line)', background: '#f0ede8' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={t.avatarUrl}
            alt={t.name}
            width={52}
            height={52}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)', lineHeight: 1.2 }}>{t.name}</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--smoke)', marginTop: 2, lineHeight: 1.3 }}>{t.role}</p>
        </div>
        {t.verified && (
          <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
        )}
      </div>

      {/* Stars */}
      <Stars n={t.rating} />

      {/* Text */}
      <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: 'var(--smoke)', flex: 1 }}>
        &quot;{t.text}&quot;
      </p>

      {/* Product tag */}
      <div
        className="mk-mono rounded-lg px-3 py-2 mt-auto"
        style={{
          fontSize: '0.62rem',
          letterSpacing: '0.08em',
          color: 'var(--faint)',
          background: 'var(--paper-2)',
          borderTop: '1px solid var(--line)',
        }}
      >
        {t.product}
      </div>
    </div>
  )
}

/* Infinite auto-scroll strip */
function MarqueeRow({ items, reverse = false }: { items: Testimonial[]; reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const [paused, setPaused] = useState(false)
  const speed = 0.5 // px per frame

  useAnimationFrame(() => {
    const el = trackRef.current
    if (!el || paused) return
    const dir = reverse ? 1 : -1
    posRef.current += speed * dir
    // reset when one full set scrolled
    const half = el.scrollWidth / 2
    if (posRef.current <= -half) posRef.current = 0
    if (posRef.current >= 0 && reverse) posRef.current = -half
    el.style.transform = `translateX(${posRef.current}px)`
  })

  const doubled = [...items, ...items]

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="flex gap-4"
        style={{ width: 'max-content', willChange: 'transform' }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsSection() {
  const row1 = TESTIMONIALS.slice(0, 4)
  const row2 = TESTIMONIALS.slice(4)

  return (
    <section
      className="relative overflow-hidden"
      style={{
        paddingTop: 96,
        paddingBottom: 96,
        borderBottom: '1.5px solid var(--line)',
        background: 'var(--paper-2)',
      }}
    >
      <div className="layout-container">
        <AnimateOnScroll>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
            <div>
              <p className="mk-spec mb-4">Lo que dicen nuestros clientes</p>
              <h2
                className="mk-display"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--ink)', lineHeight: 1.1 }}
              >
                Más de 2,400 piezas<br />
                <span style={{ color: 'var(--cinnabar)' }}>impresas con amor.</span>
              </h2>
            </div>
            {/* Rating pill */}
            <div
              className="flex items-center gap-4 rounded-2xl px-6 py-4 flex-shrink-0"
              style={{ background: 'var(--paper)', border: '1.5px solid var(--line)' }}
            >
              <div className="text-center">
                <p className="mk-display" style={{ fontSize: '2.5rem', color: 'var(--ink)', lineHeight: 1 }}>4.9</p>
                <Stars n={5} />
                <p className="mk-mono mt-1.5" style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: 'var(--faint)' }}>
                  DE 5.0 · 98% SATISFACCIÓN
                </p>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>

      {/* Marquee rows — full bleed */}
      <div className="flex flex-col gap-4">
        <MarqueeRow items={row1} reverse={false} />
        <MarqueeRow items={row2} reverse={true} />
      </div>
    </section>
  )
}
