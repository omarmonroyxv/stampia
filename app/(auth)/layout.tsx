import type { ReactNode } from 'react'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="mk min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--paper)' }}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 mk-grain z-0" />
      <div className="absolute inset-0 mk-dotgrid opacity-40 z-0" />
      
      {/* Animated blob */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full mk-drift z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, rgba(236,58,18,0.06), transparent 70%)',
          top: '10%', left: '20%'
        }}
      />

      <div className="w-full max-w-sm relative z-10 animate-fade-up is-visible">
        <div className="text-center mb-8">
          <Link href="/" aria-label="Stampia — inicio" className="inline-block transition-transform hover:scale-105">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/reallogo.png" alt="Stampia" width={140} height={40} style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
          </Link>
        </div>
        {children}
      </div>
    </div>
  )
}
