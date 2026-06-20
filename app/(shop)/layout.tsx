import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CartBadge from '@/components/ui/CartBadge'
import NavUserMenu from '@/components/ui/NavUserMenu'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Nav */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{
          background: 'rgba(251, 250, 246, 0.82)',
          borderColor: 'var(--color-border)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <div className="layout-container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2" aria-label="Stampia — inicio">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--color-brand)" strokeWidth="1.4" aria-hidden="true">
              <circle cx="8" cy="8" r="4" /><line x1="0" y1="8" x2="16" y2="8" /><line x1="8" y1="0" x2="8" y2="16" />
            </svg>
            <span style={{ fontFamily: 'var(--font-archivo)', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.03em', color: 'var(--color-text)' }}>
              Stampia
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="mk-navlink">Catálogo</Link>
            <Link href="/como-funciona" className="mk-navlink">Cómo funciona</Link>
            <Link href="/precios" className="mk-navlink">Precios</Link>
          </nav>

          <div className="flex items-center gap-3">
            <CartBadge />
            {user ? (
              <NavUserMenu user={user} />
            ) : (
              <Link href="/login" className="mk-btn mk-btn-primary" style={{ padding: '9px 18px', fontSize: '0.875rem' }}>
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="mk-ink-section relative overflow-hidden" style={{ paddingTop: 56, paddingBottom: 40 }}>
        <div className="layout-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--cinnabar)" strokeWidth="1.4" aria-hidden="true">
                  <circle cx="8" cy="8" r="4" /><line x1="0" y1="8" x2="16" y2="8" /><line x1="8" y1="0" x2="8" y2="16" />
                </svg>
                <span style={{ fontFamily: 'var(--font-archivo)', fontWeight: 800, fontSize: '1.4rem', color: '#fff' }}>Stampia</span>
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
