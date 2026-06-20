import crypto from 'crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getFulfillmentProvider } from '@/lib/fulfillment'
import type { Placement, PrintArea } from '@/types/domain'

export const maxDuration = 60

function verifySignature(req: NextRequest, dataId: string): boolean {
  const signature = req.headers.get('x-signature')
  const requestId = req.headers.get('x-request-id')
  const secret    = process.env.MERCADOPAGO_WEBHOOK_SECRET
  if (!signature || !requestId || !secret) return false

  const ts = signature.match(/ts=([^,]+)/)?.[1]
  const v1 = signature.match(/v1=([^,]+)/)?.[1]
  if (!ts || !v1) return false

  const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`
  const hmac     = crypto.createHmac('sha256', secret).update(manifest).digest('hex')
  return hmac === v1
}

async function fetchPaymentStatus(paymentId: string): Promise<{ paid: boolean; orderId: string | null }> {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  })
  if (!res.ok) throw new Error(`MP API error: ${res.status}`)
  const data = await res.json() as { status: string; external_reference: string | null }
  return { paid: data.status === 'approved', orderId: data.external_reference }
}

export async function POST(request: NextRequest) {
  let payload: { type?: string; data?: { id?: string } }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.type !== 'payment' || !payload.data?.id) {
    return NextResponse.json({ received: true })
  }

  const dataId = String(payload.data.id)

  if (!verifySignature(request, dataId)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let paid: boolean
  let orderId: string | null
  try {
    ;({ paid, orderId } = await fetchPaymentStatus(dataId))
  } catch (err) {
    console.error('MP payment fetch error:', err)
    return NextResponse.json({ received: true })
  }

  if (!orderId) return NextResponse.json({ received: true })

  const supabase = createAdminClient()

  if (!paid) {
    return NextResponse.json({ received: true })
  }

  // Mark as paid (idempotent — only updates if still pending)
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .update({ status: 'paid', payment_id: dataId })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select(`
      id,
      shipping_name, shipping_phone, shipping_street,
      shipping_city, shipping_state, shipping_zip, shipping_country,
      order_items (
        id, design_url, placement, quantity,
        product_variant:product_variants ( printful_variant_id,
          product:products ( print_area )
        )
      )
    `)
    .single()

  if (orderError || !order) {
    return NextResponse.json({ received: true })
  }

  const items = (order.order_items ?? []) as Array<{
    id: string
    design_url: string | null
    placement: unknown
    quantity: number
    product_variant: {
      printful_variant_id: string | null
      product: { print_area: unknown } | null
    } | null
  }>

  // Generate print files if compose pipeline exists
  // (import is conditional — if file missing, skip silently)
  try {
    const { composePrintFile } = await import('@/lib/print-pipeline/compose')
    for (const item of items) {
      try {
        if (!item.design_url) continue
        const variant = item.product_variant
        const printAreaRaw = variant?.product?.print_area
        if (!printAreaRaw) continue

        const printArea = (printAreaRaw as { front: PrintArea }).front
        const placement = item.placement as unknown as Placement

        const { buffer } = await composePrintFile({
          originalFileUrl: item.design_url,
          printArea,
          placement,
        })

        const printPath = `${orderId}/${item.id}.png`
        await supabase.storage
          .from('print-files')
          .upload(printPath, buffer, { contentType: 'image/png', upsert: true })
      } catch (err) {
        console.error(`Print file error for item ${item.id}:`, err)
      }
    }
  } catch {
    // compose module not available — skip print file generation
  }

  // Trigger fulfillment
  try {
    const result = await getFulfillmentProvider().createOrder({
      orderId: order.id,
      items: items
        .filter(item => item.product_variant?.printful_variant_id && item.design_url)
        .map(item => ({
          variantId:         item.product_variant!.printful_variant_id!,
          printfulVariantId: item.product_variant!.printful_variant_id ?? undefined,
          designUrl:         item.design_url!,
          quantity:          item.quantity,
        })),
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
      .update({
        status:          'processing',
        fulfillment_ref: result.externalRef ?? null,
      })
      .eq('id', orderId)
  } catch (err) {
    console.error('fulfillment error:', err)
  }

  return NextResponse.json({ received: true })
}
