import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyClipWebhook, getClipCharge } from '@/lib/clip'
import { getFulfillmentProvider } from '@/lib/fulfillment'
import { sendOrderConfirmed } from '@/lib/resend'
import type { Placement, PrintArea } from '@/types/domain'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const rawBody = await request.text()

  const signature = request.headers.get('x-clip-signature') ?? ''
  if (signature && !verifyClipWebhook(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: Record<string, unknown>
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = String(payload.type ?? payload.event ?? '')
  if (!eventType.startsWith('charge.')) {
    return NextResponse.json({ received: true })
  }

  const chargeData = (payload.data ?? payload) as Record<string, unknown>
  const chargeId = String(
    chargeData.id ?? chargeData.charge_id ?? chargeData.object_id ?? ''
  )
  if (!chargeId) return NextResponse.json({ received: true })

  let paid = false
  let orderId: string | null = null
  try {
    const charge = await getClipCharge(chargeId)
    paid = charge.status === 'paid'
    orderId = String(
      chargeData.purchase_reference ??
      chargeData.external_reference ??
      charge.raw.purchase_reference ??
      ''
    ) || null
  } catch (err) {
    console.error('Clip charge fetch error:', err)
    return NextResponse.json({ received: true })
  }

  if (!orderId || !paid) return NextResponse.json({ received: true })

  const supabase = createAdminClient()

  const { data: orderRaw, error: orderError } = await supabase
    .from('orders')
    .update({ status: 'paid', payment_id: chargeId })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('id, shipping_name, shipping_phone, shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country, user_id, order_items ( id, design_url, placement, quantity, product_variants ( printful_variant_id, products ( print_area ) ) )')
    .single()

  if (orderError || !orderRaw) {
    return NextResponse.json({ received: true })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const order = orderRaw as any

  // Send order confirmation email (fire-and-forget)
  try {
    const { data: fullItems } = await supabase
      .from('order_items')
      .select('quantity, unit_price_mxn, product_variants ( color_name, size, product:products ( name ) )')
      .eq('order_id', orderId)

    const { data: orderTotals } = await supabase
      .from('orders')
      .select('total_mxn, shipping_mxn')
      .eq('id', orderId)
      .single()

    const { data: userRow } = await supabase.auth.admin.getUserById(order.user_id ?? '')
    const email = userRow?.user?.email

    if (email && fullItems && orderTotals) {
      const emailItems = (fullItems as Array<{
        quantity: number
        unit_price_mxn: number
        product_variants: { color_name: string | null; size: string | null; product: { name: string } | null } | null
      }>).map(function(i) {
        const v = i.product_variants
        return {
          name: v?.product?.name ?? 'Playera',
          size: v?.size ?? '',
          color: v?.color_name ?? '',
          quantity: i.quantity,
          price: Number(i.unit_price_mxn),
        }
      })

      const total = Number(orderTotals.total_mxn)
      const shipping = Number(orderTotals.shipping_mxn ?? 99)
      const addr = [order.shipping_street, order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')

      await sendOrderConfirmed({
        orderId,
        customerName: order.shipping_name ?? email,
        email,
        items: emailItems,
        subtotal: total - shipping,
        shipping,
        total,
        shippingAddress: addr,
      })
    }
  } catch (emailErr) {
    console.error('Order confirmation email error:', emailErr)
  }

  const items = (order.order_items ?? []) as Array<{
    id: string
    design_url: string | null
    placement: unknown
    quantity: number
    product_variants: {
      printful_variant_id: string | null
      products: { print_area: unknown } | null
    } | null
  }>

  // Generate print files
  try {
    const { composePrintFile } = await import('@/lib/print-pipeline/compose')
    for (const item of items) {
      try {
        if (!item.design_url) continue
        const printAreaRaw = item.product_variants?.products?.print_area
        if (!printAreaRaw) continue
        const printArea = (printAreaRaw as { front: PrintArea }).front
        const placement = item.placement as unknown as Placement
        const { buffer } = await composePrintFile({ originalFileUrl: item.design_url, printArea, placement })
        const printPath = orderId + '/' + item.id + '.png'
        await supabase.storage
          .from('print-files')
          .upload(printPath, buffer, { contentType: 'image/png', upsert: true })
      } catch (err) {
        console.error('Print file error for item ' + item.id + ':', err)
      }
    }
  } catch {
    // compose module not available
  }

  // Trigger fulfillment
  try {
    const result = await getFulfillmentProvider().createOrder({
      orderId: order.id,
      items: items
        .filter(function(item) { return !!(item.product_variants?.printful_variant_id && item.design_url) })
        .map(function(item) {
          return {
            variantId:         item.product_variants!.printful_variant_id!,
            printfulVariantId: item.product_variants!.printful_variant_id ?? undefined,
            designUrl:         item.design_url!,
            quantity:          item.quantity,
          }
        }),
      shipping: {
        name:    order.shipping_name ?? '',
        phone:   order.shipping_phone ?? '',
        street:  order.shipping_street ?? '',
        city:    order.shipping_city ?? '',
        state:   order.shipping_state ?? '',
        zip:     order.shipping_zip ?? '',
        country: order.shipping_country,
      },
    })

    await supabase
      .from('orders')
      .update({ status: 'processing', fulfillment_ref: result.externalRef ?? null })
      .eq('id', orderId)
  } catch (err) {
    console.error('Fulfillment error:', err)
  }

  return NextResponse.json({ received: true })
}
