import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import AnimateOnScroll from '@/components/ui/AnimateOnScroll'
import GlassmorphismTrustHero from '@/components/ui/glassmorphism-trust-hero'
import RegMarks from '@/components/marketing/RegMarks'
import DisplayCards from '@/components/ui/display-cards'
import { LandingAccordionItem } from '@/components/ui/interactive-image-accordion'
import ProductShowcase from '@/components/marketing/ProductShowcase'
import BeneficiosSection from '@/components/marketing/BeneficiosSection'
import ComparativaSection from '@/components/marketing/ComparativaSection'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import GuaranteeBand from '@/components/marketing/GuaranteeBand'
import FaqSection from '@/components/marketing/FaqSection'
import TestimonialsSection from '@/components/marketing/TestimonialsSection'
import StickyCTA from '@/components/marketing/StickyCTA'
import FinalCTA from '@/components/marketing/FinalCTA'
import BlogPreviewSection from '@/components/marketing/BlogPreviewSection'
import MayoreoSection from '@/components/marketing/MayoreoSection'
import { Shirt, UploadCloud, Truck } from 'lucide-react'
import type { ProductWithVariants } from '@/types/product'

export const revalidate = 60

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/* ── Spec marquee ── */
function SpecMarquee() {
  const items = [
    'SIN PEDIDO MÍNIMO', 'IMPRESIÓN DTG PREMIUM', 'ENVÍO A TODO MÉXICO',
    'PAGA CON OXXO · SPEI · TARJETA', 'EDITOR VISUAL EN LÍNEA', 'DESDE 1 PIEZA',
    'SOPORTE POR WHATSAPP',
  ]
  const row = [...items, ...items]
  return (
    <div style={{ borderBottom: '1.5px solid var(--line)', overflow: 'hidden', padding: '16px 0' }}>
      <div className="mk-marquee">
        {row.map((t, i) => (
          <span key={i} className="mk-mono" style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', fontSize: '0.8125rem', letterSpacing: '0.12em', color: 'var(--smoke)' }}>
            {t}
            <span style={{ margin: '0 26px', display: 'inline-flex' }} aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/nuevofavi.png" alt="" width={11} height={11} style={{ display: 'block', objectFit: 'contain' }} />
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Proceso (animated stacked cards) ── */
function Proceso() {
  const cards = [
    { icon: <Shirt size={15} strokeWidth={2.5} />, title: 'Elige tu prenda', description: 'Modelos, colores y tallas premium, con calidad de taller.', date: 'PASO 01' },
    { icon: <UploadCloud size={15} strokeWidth={2.5} />, title: 'Sube tu diseño', description: 'Colócalo en el editor visual y mira el resultado en tiempo real.', date: 'PASO 02' },
    { icon: <Truck size={15} strokeWidth={2.5} />, title: 'Recíbelo en casa', description: 'Lo imprimimos y enviamos rastreable a todo México en 5–7 días.', date: 'PASO 03' },
  ]
  return (
    <section className="section-py relative" style={{ borderBottom: '1.5px solid var(--line)', overflow: 'visible' }}>
      {/* Background image with edge fade */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/proceso-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          opacity: 0.13,
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 50%, black 30%, transparent 100%)',
          zIndex: 0,
        }}
      />
      <RegMarks inset={22} />
      <div className="layout-container relative" style={{ zIndex: 1 }}>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          <AnimateOnScroll>
            <p className="mk-spec mb-5">Proceso</p>
            <h2 className="mk-display" style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)', color: 'var(--ink)' }}>
              Tres pasos del archivo<br />
              <span style={{ color: 'var(--cinnabar)' }}>a la prenda.</span>
            </h2>
            <p className="mt-5" style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--smoke)', maxWidth: '28rem' }}>
              Del diseño a tu puerta, sin complicaciones. Desde una sola pieza.
            </p>
            <Link href="/como-funciona" className="mk-btn mk-btn-outline" style={{ marginTop: 28 }}>
              Ver el proceso completo
              <ArrowRight />
            </Link>
          </AnimateOnScroll>

          <AnimateOnScroll animation="scale-reveal">
            {/* padding extra para que las cards no se corten al transladar */}
            <div className="flex justify-center lg:justify-end" style={{ minHeight: 340, paddingRight: 80, paddingBottom: 60 }}>
              <DisplayCards cards={cards} />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, base_price_mxn, mockup_front_url, product_variants(id, color_name, color_hex, size)')
    .eq('active', true)
    .limit(6)

  return (
    <>
      <GlassmorphismTrustHero />
      <SpecMarquee />
      <BeforeAfter />
      <Proceso />
      <LandingAccordionItem />
      <ProductShowcase products={(products ?? []) as ProductWithVariants[]} />
      <BeneficiosSection />
      <MayoreoSection />
      <ComparativaSection />
      <GuaranteeBand />
      <TestimonialsSection />
      <FaqSection />
      <BlogPreviewSection />
      <FinalCTA />
      <StickyCTA />
    </>
  )
}
