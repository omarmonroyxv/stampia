'use client'

import Link from 'next/link'
import { logout } from '@/lib/auth/actions'
import type { User } from '@supabase/supabase-js'

export default function NavUserMenu({ user }: { user: User | null }) {
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="bg-brand text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-brand-dark transition-colors"
        >
          Registrarse
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/orders" className="text-neutral-600 hover:text-neutral-900 transition-colors">
        Mis órdenes
      </Link>
      <form action={logout}>
        <button
          type="submit"
          className="text-neutral-500 hover:text-neutral-900 transition-colors text-sm"
        >
          Salir
        </button>
      </form>
    </div>
  )
}
