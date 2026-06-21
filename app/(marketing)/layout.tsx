import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import MarketingNav from '@/components/marketing/MarketingNav'
import RegMarks from '@/components/marketing/RegMarks'

const COLS = [
  {
    title: 'Producto',
    links: [
      { href: '/como-funciona', label: 'Cómo funciona' },
      { href: '/precios', label: 'Precios' },
      { href: '/catalog', label: 'Catálogo' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { href: '/nosotros', label: 'Nosotros' },
      { href: '/contacto', label: 'Contacto' },
    ],
  },
  {
    title: 'Cuenta',
    links: [
      { href: '/login', label: 'Entrar' },
      { href: '/orders', label: 'Mis órdenes' },
    ],
  },
]

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="mk min-h-screen flex flex-col">
      <div className="mk-grain" aria-hidden="true" />
      <MarketingNav user={user} />

      <main className="flex-1">{children}</main>

      <footer className="mk-ink-section relative overflow-hidden">
        <RegMarks inset={22} />
        <div className="layout-container" style={{ paddingTop: 80, paddingBottom: 40 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8">
            <div>
              <div className="mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/reallogo.png" alt="Stampia" width={110} height={31} style={{ height: 31, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
              </div>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)', maxWidth: '20rem' }}>
                Taller de impresión bajo demanda. Tu diseño, impreso y enviado a
                cualquier rincón de México.
              </p>
            </div>

            {COLS.map((col) => (
              <div key={col.title}>
                <p className="mk-spec mb-4">{col.title}</p>
                <div className="flex flex-col gap-2.5">
                  {col.links.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      style={{ fontSize: '0.9375rem', color: 'rgba(255,255,255,0.62)', textDecoration: 'none' }}
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <hr className="mk-rule" style={{ margin: '48px 0 24px' }} />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <p className="mk-mono" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              © {new Date().getFullYear()} STAMPIA — HECHO EN MÉXICO
            </p>
            {/* CMYK calibration strip — print proof easter egg */}
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
