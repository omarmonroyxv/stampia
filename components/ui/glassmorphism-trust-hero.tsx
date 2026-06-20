import Link from 'next/link'
import { ArrowRight, Printer, BadgeCheck } from 'lucide-react'
import { siVisa, siMastercard, siMercadopago } from 'simple-icons'
import RegMarks from '@/components/marketing/RegMarks'
import { GlowingShadow } from '@/components/ui/glowing-shadow'
import MagneticButton from '@/components/marketing/MagneticButton'

/* Real payment-method logos, rendered monochrome to match the strip's style.
   Visa / Mastercard / Mercado Pago use official simple-icons paths.
   OXXO & SPEI have no clean logo source, so they show as wordmarks (not faked). */
type Pay = { path?: string; title: string; showName?: boolean }
const PAYMENTS: Pay[] = [
  { path: siVisa.path, title: 'Visa' },
  { path: siMastercard.path, title: 'Mastercard', showName: true },
  { path: siMercadopago.path, title: 'Mercado Pago', showName: true },
  { title: 'OXXO', showName: true },
  { title: 'SPEI', showName: true },
]

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-default">
      <span className="mk-display" style={{ fontSize: '1.4rem', color: '#fff' }}>{value}</span>
      <span className="mk-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{label}</span>
    </div>
  )
}

export default function GlassmorphismTrustHero({ imageSrc = '/hero.png' }: { imageSrc?: string }) {
  return (
    <section className="mk-ink-section relative w-full overflow-hidden">
      <RegMarks inset={24} />

      {/* Background image with gradient mask */}
      <div
        className="absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3,
          maskImage: 'linear-gradient(180deg, black 0%, black 62%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, black 0%, black 62%, transparent 100%)',
        }}
      />
      {/* Halftone cinnabar wash */}
      <div className="mk-halftone-cinnabar" style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, opacity: 0.1, pointerEvents: 'none', zIndex: 0 }} />

      <div className="relative z-10 layout-container" style={{ paddingTop: 88, paddingBottom: 72 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-start">

          {/* ── Left column ── */}
          <div className="lg:col-span-7 flex flex-col gap-6 lg:pt-6">
            <div className="mk-fade" style={{ animationDelay: '.1s' }}>
              <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5" style={{ border: '1.5px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/nuevofavi.png" alt="" width={13} height={13} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
                <span className="mk-mono" style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
                  Taller de impresión · México
                </span>
              </span>
            </div>

            <h1 className="mk-display mk-fade" style={{ animationDelay: '.2s', fontSize: 'clamp(2.6rem, 8vw, 6.5rem)', color: '#fff', lineHeight: 1.05 }}>
              Tu diseño,
              <br />
              <span style={{ color: 'var(--cinnabar)' }}>impreso.</span>
            </h1>

            <p className="mk-fade" style={{ animationDelay: '.3s', fontSize: '1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', maxWidth: '34rem' }}>
              Convierte tu diseño en prendas que la gente quiere usar. Imprimimos con
              calidad de taller y enviamos a todo México — sin pedido mínimo, desde una
              sola pieza.
            </p>

            <div className="mk-fade flex flex-col sm:flex-row gap-3" style={{ animationDelay: '.4s' }}>
              <MagneticButton>
                <GlowingShadow>
                  <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '13px 24px', fontSize: '0.925rem' }}>
                    Empieza tu diseño
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </GlowingShadow>
              </MagneticButton>
              <Link href="/como-funciona" className="mk-btn mk-btn-outline" style={{ padding: '13px 24px', fontSize: '0.925rem' }}>
                Cómo funciona
              </Link>
            </div>

            {/* ── Mobile-only trust strip ── */}
            <div className="mk-fade lg:hidden flex items-center justify-between rounded-2xl px-5 py-4 mt-2" style={{ animationDelay: '.5s', border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)' }}>
              <div className="flex flex-col items-center">
                <span className="mk-display" style={{ fontSize: '1.1rem', color: '#fff' }}>2,400+</span>
                <span className="mk-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Piezas</span>
              </div>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex flex-col items-center">
                <span className="mk-display" style={{ fontSize: '1.1rem', color: '#fff' }}>98%</span>
                <span className="mk-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Satisfacción</span>
              </div>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex flex-col items-center">
                <span className="mk-display" style={{ fontSize: '1.1rem', color: '#fff' }}>5–7d</span>
                <span className="mk-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Entrega</span>
              </div>
              <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)' }} />
              <div className="flex flex-col items-center">
                <span className="mk-display" style={{ fontSize: '1.1rem', color: 'var(--cinnabar)' }}>1pza</span>
                <span className="mk-mono" style={{ fontSize: '0.55rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>Mínimo</span>
              </div>
            </div>
          </div>

          {/* ── Right column — hidden on mobile, shown on lg+ ── */}
          <div className="hidden lg:flex lg:col-span-5 flex-col gap-6 lg:mt-6">

            {/* Stats card */}
            <div className="mk-fade relative overflow-hidden rounded-3xl p-8" style={{ animationDelay: '.5s', border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
              <div style={{ position: 'absolute', top: -64, right: -64, width: 256, height: 256, borderRadius: '50%', background: 'rgba(236,58,18,0.14)', filter: 'blur(48px)', pointerEvents: 'none' }} />

              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center justify-center rounded-2xl" style={{ width: 48, height: 48, background: 'rgba(236,58,18,0.14)', border: '1.5px solid rgba(236,58,18,0.3)', color: 'var(--cinnabar)' }}>
                    <Printer size={22} strokeWidth={2} />
                  </div>
                  <div>
                    <div className="mk-display" style={{ fontSize: '1.9rem', color: '#fff', lineHeight: 1 }}>2,400+</div>
                    <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>Piezas impresas</div>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between mb-3" style={{ fontSize: '0.875rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.55)' }}>Satisfacción de clientes</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>98%</span>
                  </div>
                  <div className="overflow-hidden rounded-full" style={{ height: 8, background: 'rgba(255,255,255,0.1)' }}>
                    <div style={{ height: '100%', width: '98%', borderRadius: 999, background: 'linear-gradient(90deg, var(--cinnabar), #ff8a52)' }} />
                  </div>
                </div>

                <div style={{ height: 1, width: '100%', background: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />

                <div className="grid grid-cols-3 gap-2 text-center items-center">
                  <StatItem value="5–7 días" label="Entrega" />
                  <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', margin: '0 auto' }} />
                  <StatItem value="1 pza" label="Mínimo" />
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}>
                    <span className="relative flex" style={{ width: 8, height: 8 }}>
                      <span className="animate-ping absolute inline-flex rounded-full" style={{ width: '100%', height: '100%', background: '#34d399', opacity: 0.75 }} />
                      <span className="relative inline-flex rounded-full" style={{ width: 8, height: 8, background: '#10b981' }} />
                    </span>
                    <span className="mk-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.8)' }}>TALLER ACTIVO</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1" style={{ border: '1.5px solid rgba(236,58,18,0.3)', background: 'rgba(236,58,18,0.08)' }}>
                    <BadgeCheck size={12} style={{ color: 'var(--cinnabar)' }} />
                    <span className="mk-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.08em', color: 'var(--cinnabar)' }}>DTG PREMIUM</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust marquee card */}
            <div className="mk-fade relative overflow-hidden rounded-3xl" style={{ animationDelay: '.55s', border: '1.5px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', paddingTop: 28, paddingBottom: 28 }}>
              <h3 className="mk-mono" style={{ margin: '0 32px 20px', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                Pagos seguros · Envío a todo México
              </h3>
              <div className="relative flex overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 18%, black 82%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 18%, black 82%, transparent)' }}>
                <div className="mk-marquee flex items-center gap-11 whitespace-nowrap px-4">
                  {[...PAYMENTS, ...PAYMENTS, ...PAYMENTS].map((p, i) => (
                    <span key={i} className="flex items-center gap-2" style={{ color: '#fff' }} title={p.title}>
                      {p.path && (
                        <svg role="img" aria-label={p.title} viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
                          <path d={p.path} />
                        </svg>
                      )}
                      {p.showName && <span style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '0.01em' }}>{p.title}</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
