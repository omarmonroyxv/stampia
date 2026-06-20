export interface FulfillmentItem {
  variantId: string
  printfulVariantId?: string
  designUrl: string
  quantity: number
}

export interface FulfillmentOrder {
  orderId: string
  items: FulfillmentItem[]
  shipping: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
}

export interface FulfillmentResult {
  success: boolean
  externalRef?: string
  error?: string
}

export interface FulfillmentProvider {
  createOrder(order: FulfillmentOrder): Promise<FulfillmentResult>
}

class ManualProvider implements FulfillmentProvider {
  async createOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    console.log('[ManualFulfillment] New order:', order.orderId)
    return { success: true, externalRef: order.orderId }
  }
}

class PrintfulProvider implements FulfillmentProvider {
  private readonly apiKey = process.env.PRINTFUL_API_KEY!

  async createOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
    const body = {
      external_id: order.orderId,
      shipping: 'STANDARD',
      recipient: {
        name: order.shipping.name,
        phone: order.shipping.phone,
        address1: order.shipping.street,
        city: order.shipping.city,
        state_code: order.shipping.state.slice(0, 2).toUpperCase(),
        zip: order.shipping.zip,
        country_code: order.shipping.country,
      },
      items: order.items.map(item => ({
        variant_id: Number(item.printfulVariantId),
        quantity: item.quantity,
        files: [{ type: 'front', url: item.designUrl }],
      })),
    }

    const res = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) return { success: false, error: await res.text() }
    const data = await res.json() as { result: { id: number } }
    return { success: true, externalRef: String(data.result.id) }
  }
}

export function getFulfillmentProvider(): FulfillmentProvider {
  return process.env.FULFILLMENT_PROVIDER === 'printful'
    ? new PrintfulProvider()
    : new ManualProvider()
}
