import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <div className="section-py flex flex-col items-center justify-center text-center px-4">
      <div className="layout-container-narrow flex flex-col items-center gap-8">

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <div>
          <p className="mk-spec mb-4" style={{ justifyContent: 'center' }}>Pedido confirmado</p>
          <h1 className="mk-display" style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', color: 'var(--ink)', lineHeight: 1.1 }}>
            ¡Listo! Tu pedido<br />
            <span style={{ color: 'var(--cinnabar)' }}>está en camino.</span>
          </h1>
        </div>

        <p style={{ fontSize: '1.0625rem', color: 'var(--smoke)', maxWidth: '32rem', lineHeight: 1.6 }}>
          Recibirás un correo de confirmación y te avisaremos cuando tu pedido salga del taller. Tiempo estimado: 5–7 días hábiles.
        </p>

        {/* Steps */}
        <div className="w-full rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ border: '1.5px solid var(--line)', background: 'var(--paper)' }}>
          {[
            { label: 'Pedido recibido', done: true },
            { label: 'En producción', done: false },
            { label: 'En camino', done: false },
            { label: 'Entregado', done: false },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex sm:flex-col items-center gap-3 sm:gap-2 flex-1">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: step.done ? 'rgba(16,185,129,0.12)' : 'var(--bg)', border: step.done ? '2px solid #10B981' : '1.5px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {step.done
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><path d="M5 13l4 4L19 7"/></svg>
                  : <span className="mk-mono" style={{ fontSize: '0.6rem', color: 'var(--faint)' }}>{i + 1}</span>
                }
              </div>
              <span className="mk-mono" style={{ fontSize: '0.65rem', letterSpacing: '0.08em', color: step.done ? '#10B981' : 'var(--faint)' }}>
                {step.label.toUpperCase()}
              </span>
              {i < arr.length - 1 && (
                <div className="hidden sm:block flex-1 h-px" style={{ background: 'var(--line)', minWidth: 16 }} />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/orders" className="mk-btn mk-btn-primary" style={{ padding: '13px 28px' }}>
            Ver mis pedidos
          </Link>
          <Link href="/catalog" className="mk-btn mk-btn-outline" style={{ padding: '13px 28px' }}>
            Seguir comprando
          </Link>
        </div>

      </div>
    </div>
  )
}
