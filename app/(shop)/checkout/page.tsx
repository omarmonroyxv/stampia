'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, Landmark, Package, CreditCard, Lock, MapPin, Truck, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart'
import { createOrder } from '@/lib/orders/actions'
import MockupPlayera from '@/components/ui/MockupPlayera'
import type { ClipPaymentMethod } from '@/lib/clip'
import { SHIPPING_MXN } from '@/lib/constants'

const MX_STATES = [
  'Aguascalientes','Baja California','Baja California Sur','Campeche','Chiapas','Chihuahua',
  'Ciudad de Mexico','Coahuila','Colima','Durango','Estado de Mexico','Guanajuato','Guerrero',
  'Hidalgo','Jalisco','Michoacan','Morelos','Nayarit','Nuevo Leon','Oaxaca','Puebla','Queretaro',
  'Quintana Roo','San Luis Potosi','Sinaloa','Sonora','Tabasco','Tamaulipas','Tlaxcala',
  'Veracruz','Yucatan','Zacatecas',
]

/* ── Shared input styles (visible borders) ── */
const IS: React.CSSProperties = {
  background: 'var(--bg)',
  border: '1.5px solid #D1D5DB',
  color: 'var(--ink)',
  borderRadius: 10,
  fontSize: '0.9375rem',
}
const IC = 'w-full px-4 py-3 outline-none transition-colors focus:border-[#EC3A12]'

function Field({ label, children, optional }: { label: string; children: React.ReactNode; optional?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#6B7280' }}>
        {label}{optional && <span className="normal-case font-normal ml-1" style={{ color: '#9CA3AF' }}>(opcional)</span>}
      </label>
      {children}
    </div>
  )
}

function PaymentOption({ id, label, description, icon, selected, onSelect }: {
  id: ClipPaymentMethod; label: string; description: string
  icon: React.ReactNode; selected: boolean; onSelect: () => void
}) {
  return (
    <button type="button" onClick={onSelect} className="w-full flex items-center gap-4 text-left transition-all"
      style={{ padding: '14px 18px', borderRadius: 12, border: selected ? '2px solid #EC3A12' : '1.5px solid #D1D5DB', background: selected ? 'rgba(236,58,18,0.04)' : 'var(--bg)' }}>
      <div className="flex items-center justify-center shrink-0" style={{ minWidth: 40, padding: '0 8px', height: 40, borderRadius: 10, background: selected ? 'rgba(236,58,18,0.1)' : '#F3F4F6', color: selected ? '#EC3A12' : '#6B7280', transition: 'all .2s' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--ink)' }}>{label}</p>
        <p style={{ fontSize: '0.8125rem', color: '#6B7280', marginTop: 2 }}>{description}</p>
      </div>
      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, border: selected ? '6px solid #EC3A12' : '2px solid #D1D5DB', transition: 'all .2s' }} />
    </button>
  )
}

function OxxoResult({ reference, expiresAt, total }: { reference: string; expiresAt?: string; total: number }) {
  const [copied, setCopied] = useState(false)
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(234,179,8,0.12)', border: '2px solid rgba(234,179,8,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CA8A04' }}>
        <Store size={32} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>Pago en OXXO</p>
        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: 'var(--ink)' }}>Tu referencia de pago</h2>
      </div>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg)', border: '2px dashed #D1D5DB', borderRadius: 16, padding: '20px 24px' }}>
        <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Referencia</p>
        <p style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.15em', color: 'var(--ink)', marginBottom: 16, fontFamily: 'monospace' }}>{reference}</p>
        <p style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 8 }}>Total: <strong style={{ color: 'var(--ink)' }}>${total.toFixed(0)} MXN</strong></p>
        {expiresAt && <p style={{ fontSize: '0.8rem', color: '#6B7280' }}>Válida hasta: <strong>{new Date(expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>}
      </div>
      <button type="button" onClick={() => { navigator.clipboard.writeText(reference); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="mk-btn mk-btn-primary" style={{ padding: '12px 28px' }}>
        {copied ? '¡Copiado!' : 'Copiar referencia'}
      </button>
      <p style={{ fontSize: '0.85rem', color: '#6B7280', maxWidth: 320, lineHeight: 1.6 }}>Presenta esta referencia en cualquier tienda OXXO. Tu pedido se activa automáticamente al confirmar el pago.</p>
    </div>
  )
}

function SpeiResult({ clabe, expiresAt, total }: { clabe: string; expiresAt?: string; total: number }) {
  const [copied, setCopied] = useState(false)
  const rows = [
    { label: 'Banco', value: 'STP' }, { label: 'CLABE', value: clabe },
    { label: 'Beneficiario', value: 'Stampia' }, { label: 'Concepto', value: 'Pago de pedido' },
    { label: 'Total', value: '$' + total.toFixed(0) + ' MXN' },
  ]
  return (
    <div className="flex flex-col items-center text-center gap-6 py-8">
      <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '2px solid rgba(99,102,241,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4F46E5' }}>
        <Landmark size={32} />
      </div>
      <div>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>Transferencia SPEI</p>
        <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 900, color: 'var(--ink)' }}>Datos de transferencia</h2>
      </div>
      <div style={{ width: '100%', maxWidth: 380, background: 'var(--bg)', border: '1.5px solid #D1D5DB', borderRadius: 16, padding: '20px 24px', textAlign: 'left' }}>
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-4" style={{ padding: '10px 0', borderBottom: '1px solid #E5E7EB' }}>
            <span style={{ fontSize: '0.8125rem', color: '#6B7280', flexShrink: 0 }}>{label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--ink)', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
          </div>
        ))}
        {expiresAt && <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 12 }}>Válido hasta: {new Date(expiresAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>}
      </div>
      <button type="button" onClick={() => { navigator.clipboard.writeText(clabe); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="mk-btn mk-btn-primary" style={{ padding: '12px 28px' }}>
        {copied ? '¡CLABE copiada!' : 'Copiar CLABE'}
      </button>
      <p style={{ fontSize: '0.85rem', color: '#6B7280', maxWidth: 320, lineHeight: 1.6 }}>Transfiere desde tu banca en línea. Tu pedido se activa en minutos al recibir el pago.</p>
    </div>
  )
}

import { VisaLogo, MastercardLogo, AmexLogo, OxxoLogo, SpeiLogo } from '@/components/ui/PaymentLogos'

type PendingResult = { orderId: string; paymentMethod: ClipPaymentMethod; checkoutUrl?: string; oxxoReference?: string; speiClabe?: string; expiresAt?: string }

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const clear = useCartStore((s) => s.clear)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<ClipPaymentMethod>('card')
  const [pendingResult, setPendingResult] = useState<PendingResult | null>(null)

  const subtotal = items.reduce((s, i) => s + i.unitPriceMxn * i.quantity, 0)
  const total = subtotal + SHIPPING_MXN

  if (items.length === 0 && !pendingResult) { router.replace('/cart'); return null }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const colonia = (fd.get('colonia') as string).trim()
    const street = (fd.get('street') as string) + (colonia ? ', Col. ' + colonia : '')
    const shipping = {
      name: fd.get('name') as string,
      phone: (fd.get('phone') as string) || '',
      street,
      city: fd.get('city') as string,
      state: fd.get('state') as string,
      zip: fd.get('zip') as string,
      country: 'MX',
    }
    const result = await createOrder(items, shipping, paymentMethod)
    if ('error' in result) { setError(result.error); setLoading(false); return }
    clear()
    if (paymentMethod === 'card' && result.checkoutUrl) { window.location.href = result.checkoutUrl; return }
    setPendingResult(result)
    setLoading(false)
  }

  if (pendingResult) {
    return (
      <div className="section-py">
        <div className="layout-container-narrow">
          {pendingResult.paymentMethod === 'oxxo' && pendingResult.oxxoReference
            ? <OxxoResult reference={pendingResult.oxxoReference} expiresAt={pendingResult.expiresAt} total={total} />
            : pendingResult.paymentMethod === 'spei' && pendingResult.speiClabe
            ? <SpeiResult clabe={pendingResult.speiClabe} expiresAt={pendingResult.expiresAt} total={total} />
            : <p style={{ color: '#6B7280', textAlign: 'center', padding: '4rem 0' }}>Procesando tu pago...</p>
          }
          <div className="flex justify-center mt-8">
            <a href="/orders" className="mk-btn mk-btn-outline" style={{ padding: '12px 28px' }}>Ver mis pedidos</a>
          </div>
        </div>
      </div>
    )
  }

  const btnLabel = loading ? 'Procesando...'
    : paymentMethod === 'card' ? `Pagar con tarjeta — $${total.toFixed(0)} MXN`
    : paymentMethod === 'oxxo' ? `Generar referencia OXXO — $${total.toFixed(0)} MXN`
    : `Obtener CLABE SPEI — $${total.toFixed(0)} MXN`

  return (
    <div className="section-py">
      <div className="layout-container-narrow">
        <div className="mb-10">
          <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#EC3A12', marginBottom: 8 }}>Stampia · Checkout</p>
          <h1 style={{ fontSize: 'clamp(2rem,6vw,3.2rem)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>Finalizar pedido</h1>
        </div>

        <div className="grid md:grid-cols-[1fr_360px] gap-10 items-start">

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Envío */}
            <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ border: '1.5px solid #E5E7EB', background: 'var(--bg)' }}>
              <h2 className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)' }}>
                <Package size={18} />
                Dirección de envío
              </h2>
              <Field label="Nombre completo">
                <input name="name" required autoComplete="name" placeholder="Juan Pérez García" className={IC} style={IS} />
              </Field>
              <Field label="Teléfono" optional>
                <input name="phone" type="tel" autoComplete="tel" placeholder="+52 55 1234 5678" className={IC} style={IS} />
              </Field>
              <Field label="Calle y número">
                <input name="street" required autoComplete="street-address" placeholder="Av. Insurgentes Sur 1234 Int. 5" className={IC} style={IS} />
              </Field>
              <Field label="Colonia" optional>
                <input name="colonia" autoComplete="address-level3" placeholder="Del Valle, Roma Norte..." className={IC} style={IS} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ciudad">
                  <input name="city" required autoComplete="address-level2" placeholder="Ciudad de México" className={IC} style={IS} />
                </Field>
                <Field label="C.P.">
                  <input name="zip" required autoComplete="postal-code" placeholder="06600" maxLength={5} className={IC} style={IS} />
                </Field>
              </div>
              <Field label="Estado">
                <select name="state" required className={IC} style={{ ...IS, appearance: 'auto' as 'auto' }}>
                  <option value="">Selecciona tu estado...</option>
                  {MX_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Referencias" optional>
                <input name="references" placeholder="Portón azul, entre Calles Laredo y Nuevo León..." className={IC} style={IS} />
              </Field>
            </div>

            {/* Pago */}
            <div className="rounded-2xl p-6 flex flex-col gap-4" style={{ border: '1.5px solid #E5E7EB', background: 'var(--bg)' }}>
              <h2 className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)' }}>
                <CreditCard size={18} />
                Método de pago
              </h2>
              <PaymentOption id="card" label="Tarjeta de crédito o débito" description="Visa, Mastercard, Amex — pago seguro" icon={<div className="flex gap-1.5"><VisaLogo /><MastercardLogo /><AmexLogo /></div>} selected={paymentMethod === 'card'} onSelect={() => setPaymentMethod('card')} />
              <PaymentOption id="oxxo" label="OXXO" description="Paga en efectivo en cualquier OXXO de México" icon={<OxxoLogo />} selected={paymentMethod === 'oxxo'} onSelect={() => setPaymentMethod('oxxo')} />
              <PaymentOption id="spei" label="SPEI — Transferencia bancaria" description="Transfiere desde tu banca en línea" icon={<SpeiLogo />} selected={paymentMethod === 'spei'} onSelect={() => setPaymentMethod('spei')} />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-1.5" style={{ fontSize: '0.775rem', color: '#6B7280', background: '#F9FAFB', padding: '5px 12px', borderRadius: 99, border: '1px solid #E5E7EB' }}>
                <Lock size={12} /> Pago 100% seguro
              </span>
              <span className="flex items-center gap-1.5" style={{ fontSize: '0.775rem', color: '#6B7280', background: '#F9FAFB', padding: '5px 12px', borderRadius: 99, border: '1px solid #E5E7EB' }}>
                <MapPin size={12} /> Métodos locales MX
              </span>
              <span className="flex items-center gap-1.5" style={{ fontSize: '0.775rem', color: '#6B7280', background: '#F9FAFB', padding: '5px 12px', borderRadius: 99, border: '1px solid #E5E7EB' }}>
                <Truck size={12} /> Envío rastreable
              </span>
            </div>

            {error && <p className="text-sm px-4 py-3 rounded-xl" style={{ color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca' }}>{error}</p>}

            <button type="submit" disabled={loading} className="mk-btn mk-btn-primary w-full justify-center"
              style={{ padding: '16px 24px', fontSize: '1rem', opacity: loading ? 0.7 : 1, borderRadius: 14 }}>
              {btnLabel}
            </button>
          </form>

          {/* Order summary */}
          <div className="sticky top-24">
            <div className="rounded-2xl p-6 flex flex-col gap-5" style={{ border: '1.5px solid #E5E7EB', background: 'var(--bg)' }}>
              <h3 className="flex items-center gap-2" style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--ink)' }}>
                <ShoppingBag size={18} />
                Tu pedido
              </h3>
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.variantId + (item.designUrl ?? '')} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: '#F3F4F6', border: '1px solid #E5E7EB' }}>
                      <MockupPlayera color={item.colorHex} style={{ width: 32 }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--ink)' }}>{item.productName}</p>
                      <p className="text-xs" style={{ color: '#6B7280' }}>{item.colorName} · {item.size} · x{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--ink)' }}>${(item.unitPriceMxn * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: 16 }} className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Subtotal</span>
                  <span style={{ color: 'var(--ink)' }}>${subtotal.toFixed(0)} MXN</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B7280' }}>Envío</span>
                  <span style={{ color: 'var(--ink)' }}>${SHIPPING_MXN} MXN</span>
                </div>
                <div className="flex justify-between font-bold" style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: 12, marginTop: 4 }}>
                  <span style={{ color: 'var(--ink)' }}>Total</span>
                  <span style={{ fontSize: '1.25rem', color: 'var(--ink)' }}>${total.toFixed(0)} MXN</span>
                </div>
              </div>
              <div className="rounded-xl p-4 flex gap-3 items-center" style={{ background: 'rgba(236,58,18,0.04)', border: '1px solid rgba(236,58,18,0.12)' }}>
                <div style={{ color: 'var(--cinnabar)' }}>
                  <Truck size={24} />
                </div>
                <div>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--ink)' }}>Envío a todo México</p>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>5–7 días hábiles · Rastreable</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-center items-center" style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: 16 }}>
                <VisaLogo className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
                <MastercardLogo className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
                <AmexLogo className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
                <OxxoLogo className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
                <SpeiLogo className="grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
