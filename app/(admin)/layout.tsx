import type { ReactNode } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <aside className="w-60 bg-white border-r border-neutral-200 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-neutral-100">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center shadow-sm">
            <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
              <rect x="3" y="3" width="7" height="7" rx="1.5" fill="white"/>
              <rect x="14" y="3" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.7"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.4"/>
            </svg>
          </div>
          <span className="font-extrabold text-neutral-900">Stampia</span>
          <span className="text-[10px] font-bold text-brand bg-brand/8 px-1.5 py-0.5 rounded-md ml-auto">ADMIN</span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Ordenes
          </Link>
          <Link href="/dashboard/products" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
            Productos
          </Link>
          <div className="my-2 border-t border-neutral-100" />
          <Link href="/" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:bg-neutral-50 hover:text-neutral-600 transition-colors">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Ver tienda
          </Link>
        </nav>
        <div className="p-3 border-t border-neutral-100">
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-50">
            <div className="w-7 h-7 rounded-full bg-brand/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-brand">{user.email?.[0]?.toUpperCase() ?? 'A'}</span>
            </div>
            <p className="text-xs text-neutral-500 truncate flex-1">{user.email}</p>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-8" style={{ background: 'var(--color-bg)' }}>{children}</main>
    </div>
  )
}
