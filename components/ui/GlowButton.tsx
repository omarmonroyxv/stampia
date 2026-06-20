'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface Props {
  href: string
  children: React.ReactNode
  size?: 'md' | 'lg'
  variant?: 'primary' | 'ghost'
  className?: string
}

export default function GlowButton({
  href,
  children,
  size = 'md',
  variant = 'primary',
  className = '',
}: Props) {
  const pad = size === 'lg' ? 'px-10 py-5 text-base' : 'px-7 py-4 text-sm'

  if (variant === 'ghost') {
    return (
      <Link href={href} className={`btn-hero-ghost ${pad} ${className}`}>
        {children}
      </Link>
    )
  }

  return (
    <motion.div
      className={`relative inline-flex ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Animated glow ring */}
      <span
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: '0 0 32px 8px rgba(108,71,255,0.45)',
          borderRadius: 10,
        }}
      />
      <Link
        href={href}
        className={`group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl font-bold text-white cursor-pointer ${pad}`}
        style={{ background: 'var(--color-brand)' }}
      >
        {/* Shimmer sweep */}
        <span
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
          }}
        />
        <span className="relative z-10 flex items-center gap-2.5">{children}</span>
      </Link>
    </motion.div>
  )
}
