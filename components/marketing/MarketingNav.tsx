'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Printer, Tag, Shirt, Users, Mail, BookOpen } from 'lucide-react'
import { NavBar } from '@/components/ui/tubelight-navbar'

/* Brand registration mark — used as the "Inicio" icon */
function RegMark({ size = 20, className }: { size?: number; strokeWidth?: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/nuevofavi.png" alt="" width={size} height={size} className={className} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
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
    <Link href="/" aria-label="Stampia — inicio">
      <Image
        src="/reallogo.png"
        alt="Stampia"
        width={120}
        height={34}
        style={{ height: 34, width: 'auto', objectFit: 'contain', filter: dark ? 'brightness(0) invert(1)' : 'none', transition: 'filter .3s ease' }}
        priority
      />
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
