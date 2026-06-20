'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { resetPassword } from '@/lib/auth/actions'
import SubmitButton from '@/components/ui/SubmitButton'

const IS: React.CSSProperties = {
  background: '#FAFAFA',
  border: '1.5px solid #E5E7EB',
  color: '#111111',
  borderRadius: 10,
  fontSize: '0.9375rem',
}
const IC = 'w-full px-4 py-3 outline-none transition-colors focus:border-[#EC3A12]'

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(resetPassword, {})
  const sent = state !== undefined && !('error' in state && state.error) && Object.keys(state).length > 0

  return (
    <div>
      <div className="text-center mb-8">
        <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#111111' }}>
          Stampia
        </span>
      </div>

      <div className="rounded-2xl p-8" style={{ background: '#fff', border: '1.5px solid #E5E7EB', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        {sent ? (
          <div className="text-center py-4">
            <div style={{ fontSize: 48, marginBottom: 16 }}>📬</div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111111', marginBottom: 8 }}>¡Revisa tu correo!</h2>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', lineHeight: 1.6 }}>
              Te enviamos un enlace para restablecer tu contraseña. Puede tardar unos minutos.
            </p>
            <Link href="/login" className="mk-btn mk-btn-primary inline-flex mt-6 justify-center" style={{ padding: '12px 28px' }}>
              Volver al login
            </Link>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#111111', marginBottom: 6, letterSpacing: '-0.02em' }}>
              ¿Olvidaste tu contraseña?
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: 24 }}>
              Escribe tu correo y te mandamos un enlace para restablecerla.
            </p>

            <form action={formAction} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#6B7280' }}>Tu correo</label>
                <input name="email" type="email" required autoComplete="email" placeholder="tu@correo.com" className={IC} style={IS} />
              </div>

              {state?.error && (
                <p className="text-sm px-4 py-3 rounded-xl" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>{state.error}</p>
              )}

              <SubmitButton label="Enviar enlace" loadingLabel="Enviando…" className="mk-btn mk-btn-primary w-full justify-center py-3 mt-1" />
            </form>

            <p className="mt-6 text-center text-sm" style={{ color: '#6B7280' }}>
              <Link href="/login" style={{ color: '#EC3A12', fontWeight: 700 }}>← Volver al login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
