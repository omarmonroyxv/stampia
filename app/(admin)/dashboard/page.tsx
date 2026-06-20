import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/admin/StatusBadge'

export const revalidate = 0

const STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] as const

interface SearchParams { status?: string }

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  // ── Stats ────────────────────────────────────────────────────────────────
  const { data: allOrders } = await supabase
    .from('orders')
    .select('status')

  const stats = Object.fromEntries(
    STATUSES.map((s) => [s, allOrders?.filter((o) => o.status === s).length ?? 0]),
  )

  // ── Lista de órdenes ─────────────────────────────────────────────────────
  let query = supabase
    .from('orders')
    .select(`
      id, status, total_mxn, created_at,
      profiles ( full_name )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  if (status && STATUSES.includes(status as (typeof STATUSES)[number])) {
    query = query.eq('status', status as (typeof STATUSES)[number])
  }

  const { data: orders } = await query

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <h1 className="text-xl font-bold text-neutral-900">Órdenes</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === status ? '/dashboard' : `/dashboard?status=${s}`}
            className={`rounded-xl border p-4 text-center transition-colors ${
              status === s
                ? 'border-brand bg-purple-50'
                : 'border-neutral-200 bg-white hover:border-neutral-300'
            }`}
          >
            <p className="text-2xl font-bold text-neutral-900">{stats[s]}</p>
            <StatusBadge status={s} />
          </Link>
        ))}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              {['ID', 'Cliente', 'Total', 'Estado', 'Fecha', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 font-medium text-neutral-600 text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders?.map((order) => {
              const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles
              return (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                    {order.id.slice(0, 8)}…
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-neutral-900">{profile?.full_name ?? '—'}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    ${Number(order.total_mxn).toFixed(0)} MXN
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">
                    {new Date(order.created_at).toLocaleDateString('es-MX', {
                      day: '2-digit', month: 'short', year: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/orders/${order.id}`}
                      className="text-brand hover:underline text-xs font-medium"
                    >
                      Ver →
                    </Link>
                  </td>
                </tr>
              )
            })}
            {!orders?.length && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-400 text-sm">
                  Sin órdenes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
