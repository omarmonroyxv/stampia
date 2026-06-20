'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getFulfillmentProvider } from '@/lib/fulfillment'
import { sendOrderShipped, sendOrderDelivered } from '@/lib/resend'

type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
type ProductionStage = 'dtf_printing' | 'dtf_pressing' | 'packing' | 'shipped_out' | null

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('No autorizado')
  return user
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  productionStage?: ProductionStage,
): Promise<{ error?: string }> {
  try {
    await assertAdmin()
  } catch (e) {
    return { error: (e as Error).message }
  }

  const supabase = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = { status: newStatus }
  if (productionStage !== undefined) {
    updateData.production_stage = productionStage
  }

  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)

  if (error) return { error: 'Error al actualizar el estado' }
  revalidatePath('/dashboard/orders/' + orderId)
  revalidatePath('/dashboard')

  if (newStatus === 'shipped' || newStatus === 'delivered') {
    try {
      const { data: order } = await supabase
        .from('orders')
        .select('shipping_name, shipping_street, shipping_city, shipping_state, shipping_zip, fulfillment_ref, user_id')
        .eq('id', orderId)
        .single()

      if (order?.user_id) {
        const { data: userRow } = await supabase.auth.admin.getUserById(order.user_id)
        const email = userRow?.user?.email
        const name = order.shipping_name ?? email ?? ''
        const addr = [order.shipping_street, order.shipping_city, order.shipping_state, order.shipping_zip].filter(Boolean).join(', ')

        if (email) {
          if (newStatus === 'shipped') {
            await sendOrderShipped({
              orderId,
              customerName: name,
              email,
              trackingNumber: order.fulfillment_ref ?? undefined,
              shippingAddress: addr,
            })
          } else {
            await sendOrderDelivered({ orderId, customerName: name, email })
          }
        }
      }
    } catch (emailErr) {
      console.error('Status email error:', emailErr)
    }
  }

  return {}
}

export async function updateProductionStage(
  orderId: string,
  stage: ProductionStage,
): Promise<{ error?: string }> {
  try {
    await assertAdmin()
  } catch (e) {
    return { error: (e as Error).message }
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('orders')
    .update({ production_stage: stage, status: 'processing' })
    .eq('id', orderId)

  if (error) return { error: 'Error al actualizar etapa' }
  revalidatePath('/dashboard/orders/' + orderId)
  return {}
}

export async function getPrintFileSignedUrl(printFilePath: string): Promise<string | null> {
  try {
    await assertAdmin()
  } catch {
    return null
  }

  const supabase = createAdminClient()
  const { data } = await supabase.storage
    .from('print-files')
    .createSignedUrl(printFilePath, 1800)

  return data?.signedUrl ?? null
}

export async function retriggerFulfillment(orderId: string): Promise<{ error?: string }> {
  try {
    await assertAdmin()
  } catch (e) {
    return { error: (e as Error).message }
  }

  const supabase = createAdminClient()

  const { data: order } = await supabase
    .from('orders')
    .select('id, shipping_name, shipping_phone, shipping_street, shipping_city, shipping_state, shipping_zip, shipping_country')
    .eq('id', orderId)
    .single()

  if (!order) return { error: 'Orden no encontrada' }

  const { data: items } = await supabase
    .from('order_items')
    .select('variant_id, design_url, quantity, product_variants(printful_variant_id)')
    .eq('order_id', orderId)

  if (!items?.length) return { error: 'La orden no tiene items' }

  const fulfillmentItems = items
    .filter(function(i) { return !!i.design_url })
    .map(function(i) {
      const variant = Array.isArray(i.product_variants) ? i.product_variants[0] : i.product_variants
      return {
        variantId:         variant?.printful_variant_id ?? i.variant_id,
        printfulVariantId: variant?.printful_variant_id ?? undefined,
        designUrl:         i.design_url!,
        quantity:          i.quantity,
      }
    })

  if (!fulfillmentItems.length) return { error: 'No hay disenos o variant IDs configurados' }

  try {
    const result = await getFulfillmentProvider().createOrder({
      orderId,
      items: fulfillmentItems,
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
      .update({ fulfillment_ref: result.externalRef ?? null, status: 'processing' })
      .eq('id', orderId)

    revalidatePath('/dashboard/orders/' + orderId)
    return {}
  } catch (err) {
    console.error('retriggerFulfillment error:', err)
    return { error: 'Error al disparar el fulfillment' }
  }
}
