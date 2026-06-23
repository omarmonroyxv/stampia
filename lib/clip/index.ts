/**
 * Clip Payment Gateway — Mexico
 * Docs: https://developer.clip.mx
 *
 * Supported payment methods:
 *   card   — Visa / Mastercard / Amex (crédito y débito)
 *   oxxo   — Pago en efectivo en OXXO (referencia de 16 dígitos)
 *   spei   — Transferencia bancaria SPEI (CLABE)
 */

import { createHmac } from 'crypto'

export type ClipPaymentMethod = 'card' | 'oxxo' | 'spei'

export interface ClipChargeRequest {
  amount: number          // en MXN, dos decimales p.ej 299.00
  currency?: string       // default 'MXN'
  description: string
  orderId: string         // tu referencia interna (UUID)
  customer?: {
    name?: string
    email?: string
    phone?: string
  }
  paymentMethod?: ClipPaymentMethod
  /** URLs de retorno para flujos redirect (tarjeta hosted) */
  redirects?: {
    success: string
    failure: string
    pending: string
  }
}

export interface ClipChargeResponse {
  id: string
  status: 'pending' | 'paid' | 'failed' | 'expired'
  amount: number
  paymentMethod: ClipPaymentMethod
  /** URL de pago hosted (card) o checkout */
  checkoutUrl?: string
  /** Referencia OXXO (18 chars) */
  oxxoReference?: string
  /** CLABE para SPEI */
  seiClabe?: string
  /** Fecha de expiración (OXXO / SPEI) */
  expiresAt?: string
  raw: Record<string, unknown>
}

// api-sandbox.payclip.com no existe — siempre usar api.payclip.com
// Las mismas llaves funcionan para pruebas y producción en Clip
const CLIP_API_BASE = 'https://api.payclip.com'

function getHeaders() {
  const apiKey = process.env.CLIP_API_KEY
  const secret = process.env.CLIP_SECRET_KEY
  if (!apiKey || !secret) throw new Error('Clip credentials not configured (CLIP_API_KEY / CLIP_SECRET_KEY)')
  // Clip usa Basic Auth con apiKey:secret en base64 para /v2/checkout
  const basic = Buffer.from(`${apiKey}:${secret}`).toString('base64')
  return {
    'Authorization': `Basic ${basic}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

export async function createClipCharge(req: ClipChargeRequest): Promise<ClipChargeResponse> {
  const paymentMethodTypes = []
  if (req.paymentMethod === 'card') paymentMethodTypes.push('card')
  if (req.paymentMethod === 'oxxo') paymentMethodTypes.push('cash')
  if (req.paymentMethod === 'spei') paymentMethodTypes.push('transfer')

  const body: Record<string, unknown> = {
    amount: Number(req.amount.toFixed(2)),
    currency: req.currency ?? 'MXN',
    purchase_description: req.description,
    redirection_url: {
      success: req.redirects?.success ?? 'https://stampia.shop/orders',
      error: req.redirects?.failure ?? 'https://stampia.shop/cart',
      default: req.redirects?.success ?? 'https://stampia.shop/orders'
    },
    metadata: {
      orderId: req.orderId,
    },
    custom_payment_options: {
      payment_method_types: paymentMethodTypes.length > 0 ? paymentMethodTypes : ['card', 'cash', 'transfer']
    }
  }

  const res = await fetch(`${CLIP_API_BASE}/v2/checkout`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Clip API error ${res.status}: ${err}`)
  }

  const data = await res.json() as Record<string, unknown>
  return parseClipResponse(data, req.paymentMethod)
}

/**
 * Obtener estado de un cargo existente (si es necesario).
 */
export async function getClipCharge(chargeId: string): Promise<ClipChargeResponse> {
  const res = await fetch(`${CLIP_API_BASE}/v2/checkout/${chargeId}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`Clip API error ${res.status}`)
  const data = await res.json() as Record<string, unknown>
  return parseClipResponse(data, undefined)
}

function parseClipResponse(data: Record<string, unknown>, requestedPaymentMethod?: ClipPaymentMethod): ClipChargeResponse {
  return {
    id: String(data.payment_request_id ?? ''),
    status: mapStatus(String(data.status ?? '')),
    amount: 0,
    paymentMethod: requestedPaymentMethod ?? 'card',
    checkoutUrl: String(data.payment_request_url ?? ''),
    raw: data,
  }
}

function mapStatus(s: string): ClipChargeResponse['status'] {
  const lower = s.toLowerCase()
  if (lower === 'paid' || lower === 'approved' || lower === 'captured') return 'paid'
  if (lower === 'failed' || lower === 'declined' || lower === 'rejected') return 'failed'
  if (lower === 'expired') return 'expired'
  return 'pending'
}

/**
 * Verificar firma HMAC del webhook de Clip.
 * Clip envía: X-Clip-Signature: sha256=<hex>
 */
export function verifyClipWebhook(rawBody: string, signature: string): boolean {
  const secret = process.env.CLIP_WEBHOOK_SECRET
  if (!secret) return false
  const [algo, hash] = signature.split('=')
  if (algo !== 'sha256' || !hash) return false
  const expected = createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return expected === hash
}
