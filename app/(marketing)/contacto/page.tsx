import type { Metadata } from 'next'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import PageHeader from '@/components/marketing/PageHeader'
import ContactForm from '@/components/marketing/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto — Stampia',
  description: 'Hablemos de tu proyecto. Escríbenos por WhatsApp o correo y te respondemos rápido.',
}

const CHANNELS = [
  { k: 'WhatsApp', v: 'La vía más rápida. Te respondemos en horario laboral.', tag: 'Respuesta el mismo día' },
  { k: 'Correo', v: 'hola@stampia.mx — para cotizaciones y dudas a detalle.', tag: 'Respuesta en 24 h' },
  { k: 'Horario', v: 'Lunes a viernes, 9:00 – 18:00 (hora del centro).', tag: 'México' },
]

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title="Hablemos de"
        accent="tu proyecto."
        intro="¿Tienes una idea, una marca o un evento en mente? Cuéntanos y te ayudamos a llevarlo a la prensa."
      />

      <section className="section-py">
        <div className="layout-container">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
            {/* Channels */}
            <AnimateOnScroll>
              <p className="mk-spec mb-7">Canales</p>
              <div className="flex flex-col">
                {CHANNELS.map((c, i) => (
                  <div key={c.k} style={{ padding: '22px 0', borderBottom: i < CHANNELS.length - 1 ? '1.5px solid var(--line)' : 'none' }}>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h2 style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--ink)' }}>{c.k}</h2>
                      <span className="mk-mono" style={{ fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--cinnabar)', border: '1.5px solid rgba(236,58,18,0.3)', borderRadius: 3, padding: '4px 8px', whiteSpace: 'nowrap' }}>{c.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'var(--smoke)' }}>{c.v}</p>
                  </div>
                ))}
              </div>
            </AnimateOnScroll>

            {/* Form */}
            <AnimateOnScroll animation="scale-reveal">
              <ContactForm />
            </AnimateOnScroll>
          </div>
        </div>
      </section>
    </>
  )
}
