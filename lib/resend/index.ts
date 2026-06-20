import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Stampia <hola@stampia.shop>'

const C_CINNABAR = '#EC3A12'
const C_INK = '#111111'
const C_SMOKE = '#6B7280'
const C_LINE = '#E5E7EB'
const C_BG = '#FAFAF9'
const C_WHITE = '#FFFFFF'

function layout(content: string): string {
  return (
    '<!DOCTYPE html>' +
    '<html lang="es"><head>' +
    '<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Stampia</title>' +
    '</head>' +
    '<body style="margin:0;padding:0;background:' + C_BG + ';font-family:Helvetica Neue,Helvetica,Arial,sans-serif;">' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="background:' + C_BG + ';padding:32px 0;">' +
    '<tr><td align="center">' +
    '<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;">' +
    '<tr><td style="background:' + C_WHITE + ';border-radius:16px 16px 0 0;padding:28px 40px;border-bottom:1px solid ' + C_LINE + ';">' +
    '<table width="100%"><tr>' +
    '<td><span style="font-size:22px;font-weight:900;letter-spacing:-0.5px;color:' + C_INK + ';">Stampia</span></td>' +
    '<td align="right"><span style="font-size:11px;color:' + C_SMOKE + ';letter-spacing:0.08em;text-transform:uppercase;">Tu marca. Tu ropa.</span></td>' +
    '</tr></table>' +
    '</td></tr>' +
    '<tr><td style="background:' + C_WHITE + ';padding:40px;">' +
    content +
    '</td></tr>' +
    '<tr><td style="background:' + C_WHITE + ';border-radius:0 0 16px 16px;padding:24px 40px;border-top:1px solid ' + C_LINE + ';">' +
    '<p style="margin:0;font-size:12px;color:' + C_SMOKE + ';">Stampia - Impresion DTF en Mexico</p>' +
    '<p style="margin:4px 0 0;font-size:12px;color:' + C_SMOKE + ';">stampia.shop &bull; hola@stampia.shop</p>' +
    '</td></tr>' +
    '</table>' +
    '</td></tr>' +
    '</table>' +
    '</body></html>'
  )
}

function btn(text: string, url: string): string {
  return (
    '<a href="' + url + '" style="display:inline-block;background:' + C_CINNABAR + ';color:' + C_WHITE + ';font-size:14px;font-weight:700;padding:14px 28px;border-radius:10px;text-decoration:none;margin:24px 0 0;">' +
    text + '</a>'
  )
}

function badge(text: string): string {
  return (
    '<div style="display:inline-block;background:rgba(236,58,18,0.08);color:' + C_CINNABAR + ';font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:5px 12px;border-radius:20px;margin-bottom:20px;">' +
    text + '</div><br>'
  )
}

function divider(): string {
  return '<div style="border-top:1px solid ' + C_LINE + ';margin:28px 0;"></div>'
}

export interface OrderConfirmedData {
  orderId: string
  customerName: string
  email: string
  items: Array<{ name: string; size: string; color: string; quantity: number; price: number }>
  subtotal: number
  shipping: number
  total: number
  shippingAddress: string
}

export async function sendOrderConfirmed(data: OrderConfirmedData) {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const orderUrl = 'https://stampia.shop/orders/' + data.orderId

  const itemsHtml = data.items.map(function(item) {
    return (
      '<tr>' +
      '<td style="padding:10px 0;border-bottom:1px solid ' + C_LINE + ';">' +
      '<p style="margin:0;font-size:14px;font-weight:600;color:' + C_INK + ';">' + item.name + ' - ' + item.color + ' ' + item.size + '</p>' +
      '<p style="margin:3px 0 0;font-size:12px;color:' + C_SMOKE + ';">Cantidad: ' + item.quantity + '</p>' +
      '</td>' +
      '<td style="padding:10px 0;border-bottom:1px solid ' + C_LINE + ';text-align:right;font-size:14px;font-weight:700;color:' + C_INK + ';">' +
      '$' + (item.price * item.quantity).toFixed(0) + ' MXN' +
      '</td>' +
      '</tr>'
    )
  }).join('')

  const html = layout(
    badge('Pedido confirmado') +
    '<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:' + C_INK + ';letter-spacing:-0.5px;">Tu pedido esta en produccion</h1>' +
    '<p style="margin:0 0 28px;font-size:15px;color:' + C_SMOKE + ';line-height:1.6;">Hola ' + data.customerName.split(' ')[0] + ', recibimos tu pedido y ya estamos trabajando en el. Te avisaremos cuando salga.</p>' +
    divider() +
    '<p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:' + C_SMOKE + ';">Pedido #' + shortId + '</p>' +
    '<table width="100%" cellpadding="0" cellspacing="0">' +
    itemsHtml +
    '</table>' +
    '<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">' +
    '<tr><td style="font-size:13px;color:' + C_SMOKE + ';padding:4px 0;">Subtotal</td><td style="text-align:right;font-size:13px;color:' + C_SMOKE + ';">$' + data.subtotal.toFixed(0) + ' MXN</td></tr>' +
    '<tr><td style="font-size:13px;color:' + C_SMOKE + ';padding:4px 0;">Envio</td><td style="text-align:right;font-size:13px;color:' + C_SMOKE + ';">$' + data.shipping.toFixed(0) + ' MXN</td></tr>' +
    '<tr><td style="font-size:15px;font-weight:700;color:' + C_INK + ';padding:8px 0 0;">Total</td><td style="text-align:right;font-size:15px;font-weight:700;color:' + C_INK + ';padding:8px 0 0;">$' + data.total.toFixed(0) + ' MXN</td></tr>' +
    '</table>' +
    divider() +
    '<p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:' + C_SMOKE + ';">Enviar a</p>' +
    '<p style="margin:0;font-size:14px;color:' + C_INK + ';">' + data.shippingAddress + '</p>' +
    btn('Ver mi pedido en tiempo real', orderUrl)
  )

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'Pedido #' + shortId + ' confirmado - Tu ropa esta en produccion',
    html,
  })
}

export interface OrderShippedData {
  orderId: string
  customerName: string
  email: string
  trackingNumber?: string
  carrier?: string
  shippingAddress: string
}

export async function sendOrderShipped(data: OrderShippedData) {
  const shortId = data.orderId.slice(0, 8).toUpperCase()
  const orderUrl = 'https://stampia.shop/orders/' + data.orderId

  const trackingHtml = data.trackingNumber
    ? (divider() +
      '<p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:' + C_SMOKE + ';">Datos de rastreo</p>' +
      '<table width="100%" cellpadding="0" cellspacing="0">' +
      '<tr><td style="padding:6px 0;font-size:13px;color:' + C_SMOKE + ';width:120px;">Paqueteria</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:' + C_INK + ';">' + (data.carrier ?? 'Mensajeria') + '</td></tr>' +
      '<tr><td style="padding:6px 0;font-size:13px;color:' + C_SMOKE + ';">Numero de guia</td><td style="padding:6px 0;font-size:13px;font-weight:600;color:' + C_INK + ';">' + data.trackingNumber + '</td></tr>' +
      '</table>')
    : ''

  const html = layout(
    badge('En camino') +
    '<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:' + C_INK + ';letter-spacing:-0.5px;">Tu pedido va en camino!</h1>' +
    '<p style="margin:0 0 28px;font-size:15px;color:' + C_SMOKE + ';line-height:1.6;">Hola ' + data.customerName.split(' ')[0] + ', tu ropa ya salio del taller. Normalmente tarda 2-5 dias habiles en llegar.</p>' +
    '<div style="background:rgba(236,58,18,0.04);border:1.5px solid rgba(236,58,18,0.15);border-radius:12px;padding:20px 24px;">' +
    '<p style="margin:0 0 4px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:' + C_CINNABAR + ';">Pedido #' + shortId + '</p>' +
    '<p style="margin:0;font-size:14px;color:' + C_INK + ';">' + data.shippingAddress + '</p>' +
    '</div>' +
    trackingHtml +
    btn('Rastrear mi pedido', orderUrl)
  )

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'Tu pedido #' + shortId + ' ya va en camino!',
    html,
  })
}

export interface OrderDeliveredData {
  orderId: string
  customerName: string
  email: string
}

export async function sendOrderDelivered(data: OrderDeliveredData) {
  const shortId = data.orderId.slice(0, 8).toUpperCase()

  const html = layout(
    badge('Entregado') +
    '<h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:' + C_INK + ';letter-spacing:-0.5px;">Tu ropa llego!</h1>' +
    '<p style="margin:0 0 28px;font-size:15px;color:' + C_SMOKE + ';line-height:1.6;">Hola ' + data.customerName.split(' ')[0] + ', tu pedido #' + shortId + ' fue entregado. Esperamos que te encante!</p>' +
    '<div style="background:rgba(236,58,18,0.04);border:1.5px solid rgba(236,58,18,0.15);border-radius:16px;padding:28px;text-align:center;">' +
    '<p style="margin:0 0 8px;font-size:36px;">&#x1F389;</p>' +
    '<p style="margin:0 0 4px;font-size:18px;font-weight:700;color:' + C_INK + ';">Luce tu marca!</p>' +
    '<p style="margin:0;font-size:13px;color:' + C_SMOKE + ';">Comparte tu look en redes y etiquetanos como @stampia.mx</p>' +
    '</div>' +
    divider() +
    '<p style="margin:0;font-size:13px;color:' + C_SMOKE + ';">Si tuviste algun problema con tu pedido, escribenos a hola@stampia.shop y lo resolvemos.</p>' +
    btn('Hacer otro pedido', 'https://stampia.shop')
  )

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject: 'Tu ropa Stampia llego! Luce tu marca',
    html,
  })
}
