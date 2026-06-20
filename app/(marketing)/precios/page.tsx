import type { Metadata } from 'next'
import Link from 'next/link'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import PageHeader from '@/components/marketing/PageHeader'
import RegMarks from '@/components/marketing/RegMarks'
import { GlowingShadow } from '@/components/ui/glowing-shadow'

export const metadata: Metadata = {
  title: 'Precios — Stampia',
  description: 'Precio por pieza, sin pedido mínimo y sin costos ocultos. Impresión incluida. Paga con tarjeta, OXXO o SPEI.',
}

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 13l4 4L19 7" stroke="var(--cinnabar)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const INCLUDED = [
  'Impresión DTG a todo color incluida',
  'Mismo precio desde la primera pieza',
  'Preview en tiempo real antes de pagar',
  'Sin cuotas de setup ni cargos por diseño',
  'Empaque cuidado y guía de rastreo',
]

const PAYMENTS = [
  { k: 'Tarjeta', v: 'Crédito y débito' },
  { k: 'OXXO', v: 'Pago en efectivo' },
  { k: 'SPEI', v: 'Transferencia' },
]

export default function PreciosPage() {
  return (
    <>
      <PageHeader
        eyebrow="Precios"
        title="Un precio claro."
        accent="Sin letras chiquitas."
        intro="Pagas por pieza, con la impresión incluida. Sin pedido mínimo, sin cuotas de setup, sin sorpresas al final."
      />

      {/* Pricing model */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <RegMarks inset={22} />
        <div className="layout-container">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch">
            {/* Headline card */}
            <AnimateOnScroll animation="scale-reveal" className="h-full">
              <div className="mk-ink-section relative overflow-hidden h-full" style={{ borderRadius: 5, padding: '44px 40px' }}>
                <div className="mk-halftone-cinnabar" style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, opacity: 0.12, pointerEvents: 'none' }} />
                <p className="mk-spec mb-6">Desde</p>
                <div className="flex items-end gap-2">
                  <span className="mk-display" style={{ fontSize: 'clamp(4rem, 12vw, 7rem)', color: '#fff', lineHeight: 0.85 }}>$249</span>
                  <span className="mk-mono mb-3" style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.6)' }}>MXN / pieza</span>
                </div>
                <p className="mt-6" style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: '24rem' }}>
                  Playera premium con tu diseño impreso, lista para enviar. El precio
                  exacto de cada modelo lo ves en el catálogo.
                </p>
                <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ marginTop: 28 }}>
                  Ver precios por modelo<ArrowRight />
                </Link>
              </div>
            </AnimateOnScroll>

            {/* Included */}
            <AnimateOnScroll className="h-full">
              <div className="mk-card h-full" style={{ padding: '40px' }}>
                <p className="mk-spec mb-7">Todo incluido</p>
                <div className="flex flex-col">
                  {INCLUDED.map((t, i) => (
                    <div key={i} className="flex items-start gap-3.5" style={{ padding: '15px 0', borderBottom: i < INCLUDED.length - 1 ? '1.5px solid var(--line)' : 'none' }}>
                      <span style={{ flexShrink: 0, marginTop: 1 }}><Check /></span>
                      <p style={{ fontSize: '1rem', lineHeight: 1.5, color: 'var(--ink)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* Example breakdown */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <div className="layout-container-narrow">
          <AnimateOnScroll className="mb-10">
            <p className="mk-spec mb-5">Desglose</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)' }}>Qué pagas, exactamente.</h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="scale-reveal">
            <div className="mk-card overflow-hidden">
              {[
                { k: 'Playera premium (1 pieza)', v: '$249' },
                { k: 'Impresión DTG a todo color', v: 'Incluida' },
                { k: 'Cuota de setup / diseño', v: '$0' },
              ].map((r) => (
                <div key={r.k} className="flex items-center justify-between" style={{ padding: '18px 24px', borderBottom: '1.5px solid var(--line)' }}>
                  <span style={{ fontSize: '0.9375rem', color: 'var(--ink)' }}>{r.k}</span>
                  <span className="mk-mono" style={{ fontSize: '0.9375rem', color: 'var(--smoke)' }}>{r.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between" style={{ padding: '20px 24px', background: 'rgba(236,58,18,0.05)' }}>
                <span className="mk-display" style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>Total por pieza</span>
                <span className="mk-display" style={{ fontSize: '1.5rem', color: 'var(--cinnabar)' }}>$249 MXN</span>
              </div>
            </div>
          </AnimateOnScroll>
          <p className="mk-mono mt-4" style={{ fontSize: '0.75rem', color: 'var(--faint)', letterSpacing: '0.05em' }}>
            * Precio de referencia. El envío se calcula al finalizar según tu código postal.
          </p>
        </div>
      </section>

      {/* Payments + volume */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <div className="layout-container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <AnimateOnScroll>
              <p className="mk-spec mb-6">Formas de pago</p>
              <div className="grid grid-cols-3 gap-3">
                {PAYMENTS.map((p) => (
                  <div key={p.k} className="mk-card" style={{ padding: '18px 16px', textAlign: 'center' }}>
                    <p className="mk-display" style={{ fontSize: '1.125rem', color: 'var(--ink)', marginBottom: 4 }}>{p.k}</p>
                    <p className="mk-mono" style={{ fontSize: '0.6875rem', color: 'var(--faint)', letterSpacing: '0.05em' }}>{p.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-5" style={{ fontSize: '0.9375rem', color: 'var(--smoke)', lineHeight: 1.6 }}>
                Procesamos pagos de forma segura con MercadoPago.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll>
              <p className="mk-spec mb-6">¿Vas por volumen?</p>
              <h3 className="mk-display" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: 'var(--ink)', marginBottom: 14 }}>
                Más piezas, mejor precio.
              </h3>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '28rem', marginBottom: 22 }}>
                ¿Playeras para tu marca, evento o equipo? Escríbenos y armamos una
                cotización a tu medida con precio por volumen.
              </p>
              <Link href="/contacto" className="mk-btn mk-btn-outline">Pedir cotización<ArrowRight /></Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py" style={{ textAlign: 'center' }}>
        <div className="layout-container-narrow">
          <AnimateOnScroll>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', color: 'var(--ink)' }}>
              Sin mínimos. <span style={{ color: 'var(--cinnabar)' }}>Sin excusas.</span>
            </h2>
            <GlowingShadow className="mt-8">
              <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '15px 30px', fontSize: '1rem' }}>
                Empieza tu diseño<ArrowRight />
              </Link>
            </GlowingShadow>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  )
}
