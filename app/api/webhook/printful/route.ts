import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Printful envía webhooks para eventos de la orden.
 * Docs: https://developers.printful.com/docs/#tag/Webhooks
 *
 * Eventos relevantes:
 *   package_shipped      → actualizar a 'shipped'
 *   order_failed         → notificar (no cancelamos automáticamente)
 *   order_canceled       → actualizar a 'cancelled'
 */
export async function POST(request: NextRequest) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = payload as {
    type: string
    data?: {
      order?: {
        id: number
        external_id: string
        status: string
        shipments?: Array<{ tracking_number: string; tracking_url: string; carrier: string }>
      }
    }
  }

  const order = event.data?.order
  if (!order?.external_id) {
    return NextResponse.json({ received: true })
  }

  const supabase = createAdminClient()
  const orderId  = order.external_id

  switch (event.type) {
    case 'package_shipped': {
      const shipment = order.shipments?.[0]
      await supabase
        .from('orders')
        .update({
          status:          'shipped',
          fulfillment_ref: String(order.id),
        })
        .eq('id', orderId)

      // Guardar tracking en un campo de texto (se puede extender el schema en el futuro)
      if (shipment?.tracking_url) {
        console.info(`Order ${orderId} shipped. Tracking: ${shipment.tracking_url}`)
      }
      break
    }

    case 'order_canceled': {
      await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId)
      break
    }

    default:
      // Ignorar otros eventos por ahora
      break
  }

  return NextResponse.json({ received: true })
}
