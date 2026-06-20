import type { Metadata } from 'next'
import Link from 'next/link'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import PageHeader from '@/components/marketing/PageHeader'
import RegMarks from '@/components/marketing/RegMarks'
import { GlowingShadow } from '@/components/ui/glowing-shadow'

export const metadata: Metadata = {
  title: 'Cómo funciona — Stampia',
  description: 'Del archivo a la prenda en cuatro pasos. Especificaciones de impresión, formatos aceptados y tiempos de entrega.',
}

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const STEPS = [
  { n: '01', title: 'Elige tu prenda', desc: 'Escoge el modelo, el color y la talla desde el catálogo. Todas nuestras prendas son de algodón premium, seleccionadas para que la tinta luzca y dure.' },
  { n: '02', title: 'Sube tu diseño', desc: 'Arrastra tu archivo al editor visual. Lo colocas dentro del área de impresión, lo escalas y lo mueves hasta que quede exacto. Lo que ves es lo que imprimimos.' },
  { n: '03', title: 'Confirma y paga', desc: 'Revisa el preview final, elige tu método de pago —tarjeta, OXXO o SPEI— y confirma. Recibirás la confirmación al instante.' },
  { n: '04', title: 'Imprimimos y enviamos', desc: 'Procesamos tu orden con impresión DTG, la empacamos con cuidado y la enviamos rastreable a tu domicilio en cualquier parte de México.' },
]

const SPECS = [
  { k: 'Formatos', v: 'PNG o JPG' },
  { k: 'Resolución mínima', v: '150 DPI al tamaño de impresión' },
  { k: 'Resolución ideal', v: '300 DPI' },
  { k: 'Fondo', v: 'Transparente (PNG) recomendado' },
  { k: 'Área de impresión', v: 'Hasta 30 × 40 cm al frente' },
  { k: 'Color', v: 'RGB — convertimos a CMYK por ti' },
]

const FAQ = [
  { q: '¿Hay pedido mínimo?', a: 'No. Puedes imprimir desde una sola pieza, al mismo precio por unidad. Es la base de cómo trabajamos.' },
  { q: '¿Cuánto tarda en llegar?', a: 'Entre 5 y 7 días hábiles a la mayoría de los destinos en México. Te enviamos guía de rastreo en cuanto sale del taller.' },
  { q: '¿Qué pasa si mi archivo es de baja calidad?', a: 'El editor te avisa si la resolución es insuficiente para el tamaño elegido. Si algo no cuadra, te escribimos por WhatsApp antes de imprimir.' },
  { q: '¿La tinta se agrieta o se despinta?', a: 'Usamos impresión DTG de alta definición que penetra la fibra. Con el cuidado de lavado adecuado, el diseño se mantiene vivo lavada tras lavada.' },
]

export default function ComoFuncionaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cómo funciona"
        title="Del archivo"
        accent="a la prenda."
        intro="Cuatro pasos, cero fricción. Tú pones el diseño; nosotros ponemos la prensa, la calidad y el envío."
      />

      {/* Steps */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <RegMarks inset={22} />
        <div className="layout-container">
          <div className="flex flex-col">
            {STEPS.map((s, i) => (
              <AnimateOnScroll key={s.n} delay={i % 2}>
                <div
                  className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start"
                  style={{ padding: '36px 0', borderBottom: i < STEPS.length - 1 ? '1.5px solid var(--line)' : 'none' }}
                >
                  <span className="mk-display" style={{ fontSize: 'clamp(3rem, 7vw, 5rem)', color: 'var(--cinnabar)', lineHeight: 0.9 }}>{s.n}</span>
                  <div style={{ maxWidth: '44rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ink)', marginBottom: 10 }}>{s.title}</h2>
                    <p style={{ fontSize: '1.0625rem', lineHeight: 1.6, color: 'var(--smoke)' }}>{s.desc}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Print specs — the order ticket */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <div className="layout-container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            <AnimateOnScroll>
              <p className="mk-spec mb-5">Especificaciones</p>
              <h2 className="mk-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--ink)' }}>
                Tu archivo,<br /><span style={{ color: 'var(--cinnabar)' }}>listo para prensa.</span>
              </h2>
              <p className="mt-6" style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '28rem' }}>
                Sigue estas guías y tu diseño se imprimirá tal como lo ves en pantalla.
                ¿Dudas con tu archivo? Te ayudamos por WhatsApp.
              </p>
            </AnimateOnScroll>

            <AnimateOnScroll animation="scale-reveal">
              <div className="mk-card overflow-hidden">
                {SPECS.map((row, i) => (
                  <div
                    key={row.k}
                    className="flex items-center justify-between gap-4"
                    style={{ padding: '16px 22px', borderBottom: i < SPECS.length - 1 ? '1.5px solid var(--line)' : 'none' }}
                  >
                    <span className="mk-mono" style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--smoke)' }}>{row.k}</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--ink)', textAlign: 'right' }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)' }}>
        <div className="layout-container-narrow">
          <AnimateOnScroll className="mb-12">
            <p className="mk-spec mb-5">Preguntas frecuentes</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', color: 'var(--ink)' }}>Lo que más nos preguntan.</h2>
          </AnimateOnScroll>
          <div className="flex flex-col">
            {FAQ.map((item, i) => (
              <AnimateOnScroll key={i} delay={i % 2}>
                <div style={{ padding: '26px 0', borderBottom: '1.5px solid var(--line)' }}>
                  <h3 style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--ink)', marginBottom: 8 }}>{item.q}</h3>
                  <p style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '46rem' }}>{item.a}</p>
                </div>
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
              ¿Listo para <span style={{ color: 'var(--cinnabar)' }}>imprimir?</span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <GlowingShadow>
                <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '15px 30px', fontSize: '1rem' }}>Empieza tu diseño<ArrowRight /></Link>
              </GlowingShadow>
              <Link href="/precios" className="mk-btn mk-btn-outline" style={{ padding: '15px 30px', fontSize: '1rem' }}>Ver precios</Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  )
}
