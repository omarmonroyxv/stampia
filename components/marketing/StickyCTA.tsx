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
          className="fixed z-40 left-0 bottom-20 sm:bottom-10 pointer-events-none flex justify-center w-full"
        >
          <div
            className="flex items-center gap-2 sm:gap-4 rounded-full pointer-events-auto mx-4 sm:mx-0 shadow-2xl"
            style={{ padding: '8px 14px', background: 'rgba(20,17,14,0.86)', backdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 50px -16px rgba(20,17,14,0.5)' }}
          >
            <span className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/nuevofavi.png" alt="" width={18} height={18} aria-hidden="true" style={{ display: 'block', objectFit: 'contain' }} />
            </span>
            <div className="flex-1 min-w-0">
              <p style={{ fontFamily: 'var(--font-public)', fontWeight: 700, color: '#fff', lineHeight: 1.2 }} className="text-sm sm:text-[0.95rem]">¿Listo para imprimir?</p>
              <p className="hidden sm:block mk-mono" style={{ fontSize: '0.6875rem', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>SIN PEDIDO MÍNIMO · DESDE 1 PIEZA</p>
            </div>
            <Link href="/catalog" className="mk-btn mk-btn-primary flex-shrink-0 !py-2 !px-4 text-xs sm:text-sm">
              Empieza<ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <button type="button" onClick={() => setDismissed(true)} aria-label="Cerrar" className="flex-shrink-0 cursor-pointer" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
