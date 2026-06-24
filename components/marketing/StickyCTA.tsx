'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, X } from 'lucide-react'

export default function StickyCTA() {
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      // Show after the hero, hide near the very bottom (where the real CTA lives)
      setShow(y > window.innerHeight * 0.9 && y < max - 700)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const visible = show && !dismissed

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          // On mobile: sits above the bottom nav (bottom-20 = 80px). Centered with pill shape.
          // On desktop: centered at bottom-8.
          className="fixed z-40 left-0 w-full flex justify-center pointer-events-none"
          style={{ bottom: '80px' }}
        >
          <div
            className="flex items-center gap-2 rounded-full pointer-events-auto shadow-2xl mx-4"
            style={{
              padding: '8px 8px 8px 16px',
              background: 'rgba(20,17,14,0.90)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px -16px rgba(20,17,14,0.5)',
              maxWidth: '400px',
              width: '100%',
            }}
          >
            <span className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/nuevofavi.png" alt="" width={16} height={16} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
            </span>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: 'var(--font-public)', fontWeight: 700, fontSize: '0.85rem', color: '#fff', lineHeight: 1.2 }}>¿Listo para imprimir?</p>
            </div>
            <Link href="/catalog" className="mk-btn mk-btn-primary flex-shrink-0" style={{ padding: '8px 14px', fontSize: '0.8125rem' }}>
              Empieza<ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <button type="button" onClick={() => setDismissed(true)} aria-label="Cerrar" className="flex-shrink-0 cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', padding: '4px 6px' }}>
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
