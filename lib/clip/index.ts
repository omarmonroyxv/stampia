/**
 * Clip Payment Gateway — Mexico
 * Docs: https://developer.clip.mx
 *
 * Supported payment methods:
 *   card   — Visa / Mastercard / Amex (crédito y débito)
 *   oxxo   — Pago en efectivo en OXXO (referencia de 16 dígitos)
 *   spei   — Transferencia bancaria SPEI (CLABE)
 */

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

const CLIP_API_BASE = 'https://api-clip.clip.mx'  // producción
// Para sandbox usar: 'https://api-clip.clip.mx' con las credenciales de sandbox

function getHeaders() {
  const apiKey = process.env.CLIP_API_KEY
  const secret = process.env.CLIP_SECRET_KEY
  if (!apiKey || !secret) throw new Error('Clip credentials not configured (CLIP_API_KEY / CLIP_SECRET_KEY)')
  // Clip usa Basic Auth: base64(apiKey:secret)
  const basic = Buffer.from(`${apiKey}:${secret}`).toString('base64')
  return {
    'Authorization': `Basic ${basic}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
}

/**
 * Crear un cargo en Clip.
 * Retorna la URL de pago (card) o los datos de referencia (OXXO/SPEI).
 */
export async function createClipCharge(req: ClipChargeRequest): Promise<ClipChargeResponse> {
  const body: Record<string, unknown> = {
    amount: Number(req.amount.toFixed(2)),
    currency: req.currency ?? 'MXN',
    description: req.description,
    purchase_reference: req.orderId,
    payment_method: req.paymentMethod ?? 'card',
    ...(req.customer && {
      customer_info: {
        name: req.customer.name,
        email: req.customer.email,
        phone_number: req.customer.phone,
      },
    }),
    ...(req.redirects && {
      redirect_url: req.redirects.success,
      error_redirect_url: req.redirects.failure,
    }),
  }

  const res = await fetch(`${CLIP_API_BASE}/v1/charges`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Clip API error ${res.status}: ${err}`)
  }

  const data = await res.json() as Record<string, unknown>
  return parseClipResponse(data)
}

/**
 * Obtener estado de un cargo existente.
 */
export async function getClipCharge(chargeId: string): Promise<ClipChargeResponse> {
  const res = await fetch(`${CLIP_API_BASE}/v1/charges/${chargeId}`, {
    headers: getHeaders(),
  })
  if (!res.ok) throw new Error(`Clip API error ${res.status}`)
  const data = await res.json() as Record<string, unknown>
  return parseClipResponse(data)
}

function parseClipResponse(data: Record<string, unknown>): ClipChargeResponse {
  // Clip devuelve el objeto dentro de "data" o directo según el endpoint
  const charge = (data.data ?? data) as Record<string, unknown>

  const pm = String(charge.payment_method ?? charge.type ?? 'card').toLowerCase() as ClipPaymentMethod

  return {
    id: String(charge.id ?? charge.charge_id ?? ''),
    status: mapStatus(String(charge.status ?? '')),
    amount: Number(charge.amount ?? 0),
    paymentMethod: pm,
    checkoutUrl: (charge.payment_url ?? charge.checkout_url ?? charge.redirect_url) as string | undefined,
    oxxoReference: (charge.oxxo_reference ?? charge.barcode ?? charge.reference) as string | undefined,
    seiClabe: (charge.clabe ?? charge.spei_clabe) as string | undefined,
    expiresAt: charge.expires_at as string | undefined,
    raw: charge,
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
  const expected = require('crypto')
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex')
  return expected === hash
}
