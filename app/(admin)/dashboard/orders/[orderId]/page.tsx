import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import StatusBadge from '@/components/admin/StatusBadge'
import { StatusForm } from '@/components/admin/OrderActions'

interface Props {
  params: Promise<{ orderId: string }>
}

export const revalidate = 0

export default async function AdminOrderDetailPage({ params }: Props) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, total_mxn, created_at, payment_id, fulfillment_ref, shipping_name, shipping_phone, shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country, profiles ( full_name )')
    .eq('id', orderId)
    .single()

  if (!order) notFound()

  const { data: items } = await supabase
    .from('order_items')
    .select('id, design_url, design_width, design_height, placement, quantity, unit_price_mxn, product_variants ( color_name, color_hex, size, sku )')
    .eq('order_id', orderId)

  const profile = Array.isArray(order.profiles) ? order.profiles[0] : order.profiles

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <Link href="/dashboard" className="hover:text-neutral-900">Ordenes</Link>
        <span>/</span>
        <span className="font-mono text-neutral-700">{orderId.slice(0, 8)}...</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-neutral-900">Orden</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-neutral-500">
            {new Date(order.created_at).toLocaleString('es-MX')} &middot; ${Number(order.total_mxn).toFixed(0)} MXN
          </p>
        </div>
        <StatusForm
          orderId={orderId}
          currentStatus={order.status as 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'}
          currentStage={null}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Cliente */}
        <div className="rounded-xl border border-neutral-200 p-5 bg-white">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Cliente</h2>
          <p className="font-medium text-neutral-900">{profile?.full_name ?? '-'}</p>
        </div>

        {/* Envio */}
        <div className="rounded-xl border border-neutral-200 p-5 bg-white">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Direccion de envio</h2>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {order.shipping_name}<br />
            {order.shipping_street}<br />
            {order.shipping_city}, {order.shipping_state} {order.shipping_zip}<br />
            {order.shipping_phone && <span className="text-neutral-500">{order.shipping_phone}</span>}
          </p>
        </div>

        {/* Pago */}
        <div className="rounded-xl border border-neutral-200 p-5 bg-white">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Pago</h2>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-neutral-500">ID de pago</dt>
              <dd className="font-mono text-xs text-neutral-700">{order.payment_id ?? '-'}</dd>
            </div>
          </dl>
        </div>

        {/* Fulfillment */}
        <div className="rounded-xl border border-neutral-200 p-5 bg-white">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Fulfillment</h2>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between">
              <dt className="text-neutral-500">Referencia</dt>
              <dd className="font-mono text-xs text-neutral-700">{order.fulfillment_ref ?? '-'}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-semibold text-neutral-800">Articulos</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              {['Variante', 'Cantidad', 'Precio', 'Diseno'].map((h) => (
                <th key={h} className="text-left px-5 py-2.5 text-xs font-medium text-neutral-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {items?.map((item) => {
              const variant = Array.isArray(item.product_variants) ? item.product_variants[0] : item.product_variants
              return (
                <tr key={item.id}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-neutral-200 shrink-0" style={{ backgroundColor: variant?.color_hex ?? '#ccc' }} />
                      <div>
                        <p className="font-medium text-neutral-900">{variant?.color_name} {variant?.size}</p>
                        <p className="text-xs text-neutral-400 font-mono">{variant?.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-neutral-700">{item.quantity}</td>
                  <td className="px-5 py-3 text-neutral-700">${Number(item.unit_price_mxn).toFixed(0)} MXN</td>
                  <td className="px-5 py-3 text-xs text-neutral-500">
                    {item.design_url ? (item.design_width ?? '?') + 'x' + (item.design_height ?? '?') + 'px' : '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
