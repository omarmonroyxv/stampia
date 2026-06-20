import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-sans font-black text-sm tracking-widest uppercase" style={{ color: 'var(--color-text)' }}>
            Stampia
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
