import Link from 'next/link'

export default function CheckoutFailurePage() {
  return (
    <div className="section-py flex flex-col items-center justify-center text-center px-4">
      <div className="layout-container-narrow flex flex-col items-center gap-8">

        {/* Icon */}
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </div>

        <div>
          <p className="mk-spec mb-4" style={{ justifyContent: 'center' }}>Pago no completado</p>
          <h1 className="mk-display" style={{ fontSize: 'clamp(2rem,6vw,3.5rem)', color: 'var(--ink)', lineHeight: 1.1 }}>
            No se realizó<br />
            <span style={{ color: 'var(--cinnabar)' }}>ningún cargo.</span>
          </h1>
        </div>

        <p style={{ fontSize: '1.0625rem', color: 'var(--smoke)', maxWidth: '28rem', lineHeight: 1.6 }}>
          Algo salió mal con el pago. Puedes intentarlo de nuevo — tu carrito sigue intacto.
        </p>

        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/cart" className="mk-btn mk-btn-primary" style={{ padding: '13px 28px' }}>
            Volver al carrito
          </Link>
          <Link href="/contacto" className="mk-btn mk-btn-outline" style={{ padding: '13px 28px' }}>
            Contactar soporte
          </Link>
        </div>

      </div>
    </div>
  )
}
