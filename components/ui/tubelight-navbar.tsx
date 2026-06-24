'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

interface NavItem {
  name: string
  url: string
  icon: IconComponent
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  dark?: boolean
}

function matchActive(items: NavItem[], pathname: string): string {
  // Exact match for "/", longest-prefix match for the rest
  const exact = items.find((i) => i.url === pathname)
  if (exact) return exact.name
  const prefix = items
    .filter((i) => i.url !== '/' && pathname.startsWith(i.url))
    .sort((a, b) => b.url.length - a.url.length)[0]
  return prefix?.name ?? items[0].name
}

export function NavBar({ items, className, dark = false }: NavBarProps) {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(() => matchActive(items, pathname))

  useEffect(() => {
    // eslint-disable-next-line
    setActiveTab(matchActive(items, pathname))
  }, [pathname, items])

  return (
    <div
      className={cn(
        // On mobile: fixed at bottom. On desktop (sm:): fixed at top, cancel the bottom-0.
        // CRITICAL: pointer-events-none on outer so the transparent area never blocks page clicks.
        'fixed bottom-0 sm:top-0 sm:bottom-auto left-1/2 -translate-x-1/2 z-50 mb-4 sm:mb-0 sm:pt-4 pointer-events-none',
        className,
      )}
    >
      {/* pointer-events-auto only on the actual pill so links work */}
      <div className="mk-tube-pill flex items-center gap-0.5 sm:gap-1 py-1 px-1 rounded-full pointer-events-auto">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              data-active={isActive}
              aria-label={item.name}
              className="mk-tube-tab relative flex items-center cursor-pointer text-sm font-semibold px-2.5 sm:px-3 py-2 rounded-full"
            >
              <span className="flex items-center justify-center" style={{ width: 20, height: 20, color: dark ? '#fff' : 'var(--ink)', transition: 'color .3s ease' }} aria-hidden="true">
                <Icon size={20} strokeWidth={2} />
              </span>
              <span className="mk-tube-label hidden sm:inline" style={{ color: dark ? '#fff' : 'var(--ink)', transition: 'color .3s ease' }}>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full rounded-full -z-10"
                  style={{ background: 'rgba(236, 58, 18, 0.07)' }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <div
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full"
                    style={{ background: 'var(--cinnabar)' }}
                  >
                    <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2" style={{ background: 'rgba(236,58,18,0.25)' }} />
                    <div className="absolute w-8 h-6 rounded-full blur-md -top-1" style={{ background: 'rgba(236,58,18,0.25)' }} />
                    <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2" style={{ background: 'rgba(236,58,18,0.25)' }} />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
