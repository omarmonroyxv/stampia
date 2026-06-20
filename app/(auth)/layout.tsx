import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" aria-label="Stampia — inicio" className="inline-block">
            <Image src="/reallogo.png" alt="Stampia" width={120} height={34} style={{ height: 34, width: 'auto', objectFit: 'contain' }} priority />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
