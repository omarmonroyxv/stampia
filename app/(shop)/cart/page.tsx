'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cart'
import MockupPlayera from '@/components/ui/MockupPlayera'

const SHIPPING_MXN = 99

export default function CartPage() {
  const router    = useRouter()
  const items     = useCartStore((s) => s.items)
  const remove    = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQuantity)

  const subtotal = items.reduce((sum, i) => sum + i.unitPriceMxn * i.quantity, 0)
  const total    = subtotal + (items.length > 0 ? SHIPPING_MXN : 0)

  return (
    <div className="section-py">
      <div className="layout-container-narrow">
        <h1
          className="font-serif italic text-4xl tracking-tight mb-12"
          style={{ color: 'var(--color-text)' }}
        >
          Tu carrito.
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif italic text-2xl mb-6" style={{ color: 'var(--color-muted)' }}>
              Tu carrito está vacío.
            </p>
            <Link href="/catalog" className="btn-primary">Ver catálogo</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            {/* Items */}
            <div className="md:col-span-2">
              {items.map((item) => (
                <div
                  key={`${item.variantId}-${item.designUrl ?? ''}`}
                  className="flex gap-4 py-6 border-b"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <div
                    className="w-20 h-20 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    <MockupPlayera color={item.colorHex} style={{ width: 60 }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-sm mb-0.5">{item.productName}</p>
                    <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
                      {item.colorName} · {item.size}
                    </p>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex items-center gap-1 rounded-lg overflow-hidden"
                        style={{ border: '1px solid var(--color-border)' }}
                      >
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? updateQty(item.variantId, item.designUrl, item.quantity - 1)
                              : remove(item.variantId, item.designUrl)
                          }
                          className="w-8 h-8 flex items-center justify-center font-bold text-base transition-colors"
                          style={{ color: 'var(--color-muted)' }}
                          aria-label="Reducir cantidad"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.variantId, item.designUrl, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center font-bold text-base transition-colors"
                          style={{ color: 'var(--color-muted)' }}
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => remove(item.variantId, item.designUrl)}
                        className="text-xs transition-colors"
                        style={{ color: 'var(--color-faint)' }}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-serif italic font-bold">
                      ${(item.unitPriceMxn * item.quantity).toFixed(0)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>MXN</p>
                  </div>
                </div>
              ))}
              <div className="mt-6">
                <Link href="/catalog" className="text-sm font-medium transition-colors" style={{ color: 'var(--color-brand)' }}>
                  ← Seguir comprando
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="card p-6 sticky top-24">
                <h3 className="font-sans font-bold mb-4">Resumen</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: 'var(--color-muted)' }}>Subtotal</span>
                  <span>${subtotal.toFixed(0)} MXN</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span style={{ color: 'var(--color-muted)' }}>Envío</span>
                  <span>${SHIPPING_MXN} MXN</span>
                </div>
                <div
                  className="flex justify-between font-bold text-base pt-4 border-t mb-6"
                  style={{ borderColor: 'var(--color-border)' }}
                >
                  <span>Total</span>
                  <span className="font-serif italic">${total.toFixed(0)} MXN</span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="btn-primary w-full justify-center"
                >
                  Proceder al pago
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
