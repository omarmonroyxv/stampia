import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/admin/StatusBadge'

export const revalidate = 0

export default async function CustomerOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/orders')

  const { data: orders } = await supabase
    .from('orders')
    .select('id, status, total_mxn, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="section-py">
      <div className="layout-container-narrow">
        <h1 className="mk-display mb-10" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--ink)' }}>
          Mis pedidos.
        </h1>

        {!orders?.length ? (
          <div className="text-center py-24 flex flex-col items-center gap-6">
            <div style={{ fontSize: 48 }}>📦</div>
            <p style={{ fontSize: '1.0625rem', color: 'var(--smoke)' }}>Aún no tienes pedidos.</p>
            <Link href="/catalog" className="mk-btn mk-btn-primary" style={{ padding: '12px 28px' }}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-2xl p-5 transition-all hover:shadow-md"
                style={{ border: '1.5px solid var(--line)', background: 'var(--paper)' }}
              >
                <div>
                  <p className="mk-mono mb-1" style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--faint)' }}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: 'var(--smoke)' }}>
                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <StatusBadge status={order.status} />
                  <p style={{ fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    ${Number(order.total_mxn).toFixed(0)} MXN
                  </p>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color: 'var(--faint)', flexShrink: 0 }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
