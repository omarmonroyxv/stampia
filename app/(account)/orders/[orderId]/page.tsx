import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import OrderTracker from '@/components/orders/OrderTracker'

interface Props {
  params: Promise<{ orderId: string }>
}

export const revalidate = 0

export default async function CustomerOrderDetailPage({ params }: Props) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/orders')

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, total_mxn, created_at, fulfillment_ref, shipping_name, shipping_street, shipping_city, shipping_state, shipping_zip')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  const { data: items } = await supabase
    .from('order_items')
    .select('id, quantity, unit_price_mxn, product_variants ( color_name, color_hex, size )')
    .eq('order_id', orderId)

  return (
    <div className="section-py">
      <div className="layout-container-narrow">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--smoke)' }}>
          <Link href="/orders" style={{ color: 'var(--smoke)' }} className="hover:underline">Mis pedidos</Link>
          <span>/</span>
          <span style={{ color: 'var(--ink)' }}>{'#' + orderId.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <h1 className="mk-display mb-1" style={{ fontSize: 'clamp(2rem,5vw,3rem)', color: 'var(--ink)' }}>
            Tu pedido.
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--smoke)' }}>
            {new Date(order.created_at).toLocaleString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Tracker — main column */}
          <div className="lg:col-span-3">
            <OrderTracker
              orderId={orderId}
              initialStatus={order.status as 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'}
              initialStage={null}
            />
          </div>

          {/* Side: items + summary */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Items */}
            <div className="mk-card p-5" style={{ borderRadius: 16 }}>
              <p className="mk-spec mb-4">Articulos</p>
              <div className="flex flex-col gap-3">
                {items?.map((item) => {
                  const v = Array.isArray(item.product_variants) ? item.product_variants[0] : item.product_variants
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full shrink-0" style={{ background: v?.color_hex ?? '#ccc', border: '1.5px solid var(--line)' }} />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--ink)' }}>{v?.color_name} {v?.size}</p>
                        <p style={{ fontSize: '0.775rem', color: 'var(--smoke)' }}>x{item.quantity}</p>
                      </div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)', flexShrink: 0 }}>
                        {'$' + (Number(item.unit_price_mxn) * item.quantity).toFixed(0)}
                      </p>
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between font-bold mt-4 pt-4" style={{ borderTop: '1.5px solid var(--line)', color: 'var(--ink)' }}>
                <span>Total</span>
                <span>{'$' + Number(order.total_mxn).toFixed(0) + ' MXN'}</span>
              </div>
            </div>

            {/* Shipping */}
            <div className="mk-card p-5" style={{ borderRadius: 16 }}>
              <p className="mk-spec mb-3">Envio a</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--ink)', lineHeight: 1.6 }}>
                {order.shipping_name}<br />
                {order.shipping_street}<br />
                {order.shipping_city + ', ' + order.shipping_state + ' ' + order.shipping_zip}
              </p>
              {order.fulfillment_ref && (
                <p style={{ fontSize: '0.775rem', color: 'var(--smoke)', marginTop: 10 }}>
                  Guia: {order.fulfillment_ref}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
