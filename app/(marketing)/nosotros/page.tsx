import type { Metadata } from 'next'
import Link from 'next/link'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import PageHeader from '@/components/marketing/PageHeader'
import RegMarks from '@/components/marketing/RegMarks'
import { GlowingShadow } from '@/components/ui/glowing-shadow'

export const metadata: Metadata = {
  title: 'Nosotros — Stampia',
  description: 'Somos un taller de impresión bajo demanda para México. Calidad de taller, sin pedido mínimo, hecho aquí.',
}

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VALUES = [
  { title: 'Calidad de taller', desc: 'Cada pieza pasa por prensa DTG de alta definición y una revisión antes de salir. Si no la usaríamos nosotros, no la enviamos.' },
  { title: 'Sin complicaciones', desc: 'Una sola pieza o cien, mismo proceso. Subes, confirmas y recibes. Nada de mínimos ni trámites.' },
  { title: 'Hecho en México', desc: 'Imprimimos y enviamos desde aquí, para todo el país. Pagos locales con OXXO y SPEI incluidos.' },
  { title: 'Soporte real', desc: 'Personas, no bots. Si tu archivo necesita ayuda o algo sale mal, te escribimos por WhatsApp.' },
]

const STATS = [
  { v: '1', k: 'Pieza mínima' },
  { v: '5–7', k: 'Días de entrega' },
  { v: '100%', k: 'Cobertura nacional' },
  { v: '0', k: 'Cuotas de setup' },
]

export default function NosotrosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nosotros"
        title="Un taller para"
        accent="cada idea."
        intro="Stampia nació de una frustración simple: imprimir una buena playera en México era caro, lento y lleno de mínimos. Lo rediseñamos de cero."
      />

      {/* Story */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <RegMarks inset={22} />
        <div className="layout-container-narrow">
          <AnimateOnScroll>
            <div style={{ maxWidth: '46rem' }}>
              <p style={{ fontSize: '1.25rem', lineHeight: 1.6, color: 'var(--ink)', marginBottom: 22 }}>
                Creemos que cualquiera —un artista, una marca naciente, un equipo, una
                familia— debería poder imprimir exactamente lo que imagina, sin pedir
                cientos de piezas ni pelear con un proveedor.
              </p>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--smoke)', marginBottom: 18 }}>
                Por eso construimos Stampia como un taller bajo demanda de verdad: un
                editor donde colocas tu diseño en el área de impresión y ves el
                resultado al instante, precios por pieza desde la primera, y una prensa
                que cuida el color como si fuera nuestro propio diseño.
              </p>
              <p style={{ fontSize: '1.0625rem', lineHeight: 1.7, color: 'var(--smoke)' }}>
                Lo demás —empaque, envío rastreable, pagos locales— lo resolvemos
                nosotros. Tú solo te ocupas del arte.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Values */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <div className="layout-container">
          <AnimateOnScroll className="mb-14">
            <p className="mk-spec mb-5">Cómo trabajamos</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--ink)' }}>
              Cuatro reglas <span style={{ color: 'var(--cinnabar)' }}>que no rompemos.</span>
            </h2>
          </AnimateOnScroll>
          <div className="grid sm:grid-cols-2 gap-6">
            {VALUES.map((v, i) => (
              <AnimateOnScroll key={v.title} delay={i % 2} animation="scale-reveal">
                <div className="mk-card mk-card-hover h-full" style={{ padding: '32px' }}>
                  <span className="mk-regmark" style={{ color: 'var(--cinnabar)', display: 'inline-block', marginBottom: 18 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/nuevofavi.png" alt="" width={22} height={22} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
                  </span>
                  <h3 style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)', marginBottom: 10 }}>{v.title}</h3>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--smoke)' }}>{v.desc}</p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stats (ink) */}
      <section className="mk-ink-section section-py relative overflow-hidden">
        <RegMarks inset={22} />
        <div className="layout-container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <AnimateOnScroll key={s.k} delay={i % 4} className="text-center">
                <p className="mk-display" style={{ fontSize: 'clamp(2.8rem, 7vw, 4.5rem)', color: 'var(--cinnabar)', lineHeight: 1 }}>{s.v}</p>
                <p className="mk-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginTop: 10 }}>{s.k}</p>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py" style={{ textAlign: 'center' }}>
        <div className="layout-container-narrow">
          <AnimateOnScroll>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', color: 'var(--ink)' }}>
              Imprime con <span style={{ color: 'var(--cinnabar)' }}>nosotros.</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <GlowingShadow>
                <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '15px 30px', fontSize: '1rem' }}>Ver catálogo<ArrowRight /></Link>
              </GlowingShadow>
              <Link href="/contacto" className="mk-btn mk-btn-outline" style={{ padding: '15px 30px', fontSize: '1rem' }}>Hablar con nosotros</Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  )
}
