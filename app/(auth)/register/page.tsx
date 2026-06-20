'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { register, loginWithGoogle } from '@/lib/auth/actions'
import SubmitButton from '@/components/ui/SubmitButton'

const IS: React.CSSProperties = {
  background: '#FAFAFA',
  border: '1.5px solid #E5E7EB',
  color: '#111111',
  borderRadius: 10,
  fontSize: '0.9375rem',
}
const IC = 'w-full px-4 py-3 outline-none transition-colors focus:border-[#EC3A12]'

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, {})
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    await loginWithGoogle()
  }

  return (
    <div>
      <div className="text-center mb-8">
        <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#111111' }}>
          Stampia
        </span>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: 4 }}>Tu diseño, impreso.</p>
      </div>

      <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1.5px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111111', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Crea tu cuenta
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 24 }}>
          Empieza a personalizar tu ropa desde una sola pieza.
        </p>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-md"
          style={{ border: '1.5px solid #E5E7EB', background: '#fff', color: '#111111', marginBottom: 20, opacity: googleLoading ? 0.7 : 1 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'Conectando...' : 'Registrarse con Google'}
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
          <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 500 }}>o con email</span>
          <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        </div>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#6B7280' }}>Nombre completo</label>
            <input name="full_name" type="text" required autoComplete="name" placeholder="Juan Pérez García" className={IC} style={IS} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#6B7280' }}>Correo</label>
            <input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={IC} style={IS} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#6B7280' }}>Contraseña</label>
            <input name="password" type="password" required minLength={8} autoComplete="new-password" placeholder="Mínimo 8 caracteres" className={IC} style={IS} />
          </div>

          {state?.error && (
            <p className="text-sm px-4 py-3 rounded-xl" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>{state.error}</p>
          )}

          <SubmitButton label="Crear cuenta gratis" loadingLabel="Creando cuenta…" className="mk-btn mk-btn-primary w-full justify-center py-3 mt-1" />

          <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
            Al registrarte aceptas nuestros{' '}
            <Link href="/terminos" style={{ color: '#6B7280', textDecoration: 'underline' }}>Términos de servicio</Link>
          </p>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: '#6B7280' }}>
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" style={{ color: '#EC3A12', fontWeight: 700 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
