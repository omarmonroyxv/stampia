'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClipCharge, type ClipPaymentMethod } from '@/lib/clip'
import type { CartItem } from '@/types/domain'
import type { Json } from '@/types/database'
import { SHIPPING_MXN, APP_URL } from '@/lib/constants'

interface ShippingInput {
  name: string
  phone: string
  street: string
  city: string
  state: string
  zip: string
  country?: string
}

export type CreateOrderResult =
  | { error: string }
  | {
      orderId: string
      paymentMethod: ClipPaymentMethod
      checkoutUrl?: string
      oxxoReference?: string
      speiClabe?: string
      expiresAt?: string
    }

export async function createOrder(
  items: CartItem[],
  shipping: ShippingInput,
  paymentMethod: ClipPaymentMethod = 'card'
): Promise<CreateOrderResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }
  if (!items.length) return { error: 'Carrito vacio' }

  const variantIds = [...new Set(items.map(i => i.variantId))]
  const { data: variants } = await supabase
    .from('product_variants')
    .select('id, extra_price_mxn, product:products(base_price_mxn)')
    .in('id', variantIds)

  if (!variants || variants.length !== variantIds.length) {
    return { error: 'Variantes invalidas' }
  }


  const variantPriceMap = new Map(
    variants.map(v => [
      v.id,
      Number((v.product as { base_price_mxn: number }).base_price_mxn) +
        Number(v.extra_price_mxn),
    ])
  )

  let subtotal = 0
  for (const item of items) {
    const price = variantPriceMap.get(item.variantId)
    if (!price) return { error: 'Precio no encontrado' }
    subtotal += price * item.quantity
  }
  const total = subtotal + SHIPPING_MXN

  const admin = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      total_mxn: total,
      shipping_mxn: SHIPPING_MXN,
      shipping_name: shipping.name,
      shipping_phone: shipping.phone,
      shipping_street: shipping.street,
      shipping_city: shipping.city,
      shipping_state: shipping.state,
      shipping_zip: shipping.zip,
      shipping_country: shipping.country ?? 'MX',
    })
    .select('id')
    .single()

  if (orderError || !order) return { error: orderError?.message ?? 'Error al crear orden' }

  const orderItems = items.map(item => ({
    order_id: order.id,
    variant_id: item.variantId,
    design_url: item.designUrl ?? null,
    design_width: item.designWidth ?? null,
    design_height: item.designHeight ?? null,
    placement: (item.placement ?? null) as Json | null,
    quantity: item.quantity,
    unit_price_mxn: variantPriceMap.get(item.variantId)!,
  }))

  const { error: itemsError } = await admin.from('order_items').insert(orderItems)
  if (itemsError) return { error: itemsError.message }

  const appUrl = APP_URL
  const shortId = order.id.slice(0, 8).toUpperCase()

  try {
    const charge = await createClipCharge({
      amount: total,
      description: 'Stampia - Pedido #' + shortId,
      orderId: order.id,
      paymentMethod,
      customer: {
        name: profile?.full_name ?? shipping.name,
        email: user.email,
        phone: shipping.phone || undefined,
      },
      redirects: {
        success: appUrl + '/checkout/success?order=' + order.id,
        failure: appUrl + '/checkout/failure?order=' + order.id,
        pending: appUrl + '/checkout/success?order=' + order.id,
      },
    })

    await admin
      .from('orders')
      .update({ payment_id: charge.id })
      .eq('id', order.id)

    return {
      orderId: order.id,
      paymentMethod,
      checkoutUrl: charge.checkoutUrl,
      oxxoReference: charge.oxxoReference,
      speiClabe: charge.seiClabe,
      expiresAt: charge.expiresAt,
    }
  } catch (e) {
    await admin.from('orders').delete().eq('id', order.id)
    return { error: (e as Error).message }
  }
}
