import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MarketingNav from '@/components/marketing/MarketingNav'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mk min-h-screen flex flex-col" style={{ background: 'var(--paper)' }}>
      {/* Nav */}
      <MarketingNav user={user} />

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mk-ink-section relative overflow-hidden" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div className="layout-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
            <div>
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/reallogo.png" alt="Stampia" width={110} height={31} style={{ height: 31, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '20rem' }}>
                Taller de impresión bajo demanda. Tu diseño, impreso y enviado a cualquier rincón de México.
              </p>
            </div>
            <div>
              <p className="mk-spec mb-4">Tienda</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/catalog" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Catálogo</Link>
                <Link href="/cart" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Carrito</Link>
                <Link href="/precios" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Precios</Link>
              </div>
            </div>
            <div>
              <p className="mk-spec mb-4">Cuenta</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/orders" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Mis órdenes</Link>
                <Link href="/login" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Iniciar sesión</Link>
              </div>
            </div>
            <div>
              <p className="mk-spec mb-4">Legal</p>
              <div className="flex flex-col gap-2.5">
                <Link href="/terminos" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Términos y Condiciones</Link>
                <Link href="/privacidad" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Aviso de Privacidad</Link>
                <Link href="/envios" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Políticas de Envío</Link>
                <Link href="/reembolsos" style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}>Devoluciones</Link>
              </div>
            </div>
          </div>

          <hr className="mk-rule" style={{ margin: '48px 0 24px' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="mk-mono" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} STAMPIA — HECHO EN MÉXICO
            </p>
            <div className="flex items-center gap-2" title="Tira de calibración CMYK">
              <div className="flex overflow-hidden" style={{ borderRadius: 3 }}>
                {['#00AEEF', '#EC008C', '#FFD200', '#14110E', '#EC3A12'].map((c) => (
                  <span key={c} style={{ width: 18, height: 10, background: c, display: 'block' }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
