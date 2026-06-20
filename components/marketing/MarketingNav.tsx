'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Printer, Tag, Shirt, Users, Mail, BookOpen } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

/* Brand registration mark — used as the "Inicio" icon */
function RegMark({ size = 20, strokeWidth = 2, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
    </svg>
  )
}

const NAV_ITEMS = [
  { name: 'Inicio', url: '/', icon: RegMark },
  { name: 'Cómo funciona', url: '/como-funciona', icon: Printer },
  { name: 'Precios', url: '/precios', icon: Tag },
  { name: 'Catálogo', url: '/catalog', icon: Shirt },
  { name: 'Nosotros', url: '/nosotros', icon: Users },
  { name: 'Blog', url: '/blog', icon: BookOpen },
  { name: 'Contacto', url: '/contacto', icon: Mail },
]

function Wordmark({ dark }: { dark: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Stampia — inicio">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="var(--cinnabar)" strokeWidth="1.4" aria-hidden="true">
        <circle cx="8" cy="8" r="4" />
        <line x1="0" y1="8" x2="16" y2="8" />
        <line x1="8" y1="0" x2="8" y2="16" />
      </svg>
      <span className="mk-display" style={{ fontSize: '1.4rem', letterSpacing: '-0.03em', color: dark ? '#fff' : 'var(--ink)', transition: 'color .3s ease' }}>
        Stampia
      </span>
    </Link>
  )
}

export default function MarketingNav() {
  const pathname = usePathname()
  const [dark, setDark] = useState(false)

  // Detect whether the nav currently sits over a dark (ink) section,
  // and flip the text/icon color to its opposite for legibility.
  useEffect(() => {
    const compute = () => {
      const navY = 34
      let onDark = false
      document.querySelectorAll('.mk-ink-section').forEach((el) => {
        const r = (el as HTMLElement).getBoundingClientRect()
        if (r.top <= navY && r.bottom >= navY) onDark = true
      })
      setDark(onDark)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [pathname])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40" style={{ background: 'transparent' }}>
        <div className="layout-container flex items-center justify-between" style={{ height: 68 }}>
          <Wordmark dark={dark} />

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex"
              style={{ fontFamily: 'var(--font-public)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', color: dark ? '#fff' : 'var(--ink)', transition: 'color .3s ease' }}
            >
              Entrar
            </Link>
            <Link
              href="/catalog"
              className="mk-btn mk-btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
            >
              Empieza
            </Link>
          </div>
        </div>
      </header>

      {/* Tubelight floating nav — top-center on desktop, bottom icon-bar on mobile */}
      <NavBar items={NAV_ITEMS} dark={dark} />
    </>
  )
}
