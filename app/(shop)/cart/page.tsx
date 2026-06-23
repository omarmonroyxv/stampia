'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Lock, Truck } from 'lucide-react'
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
    <div className="section-py pt-32">
      <div className="layout-container-narrow">
        <h1 className="mk-display text-4xl mb-12 border-b pb-4" style={{ borderColor: 'var(--line)' }}>
          Tu carrito.
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-medium mb-6" style={{ color: 'var(--smoke)' }}>
              Tu carrito está vacío.
            </p>
            <Link href="/catalog" className="mk-btn mk-btn-primary">Ver catálogo</Link>
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
                    {item.mockupFrontUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.mockupFrontUrl} alt={item.productName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <MockupPlayera color={item.colorHex} style={{ width: 60 }} />
                    )}
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
                    <p className="mk-display text-xl">
                      ${(item.unitPriceMxn * item.quantity).toFixed(0)}
                    </p>
                    <p className="text-xs font-bold" style={{ color: 'var(--smoke)' }}>MXN</p>
                  </div>
                </div>
              ))}
              <div className="mt-8">
                <Link href="/catalog" className="text-sm font-semibold transition-colors" style={{ color: 'var(--cinnabar)' }}>
                  ← Seguir comprando
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="mk-card p-6 sticky top-28">
                <h3 className="font-sans font-bold text-lg mb-6">Resumen de orden</h3>
                <div className="flex justify-between text-sm mb-3">
                  <span style={{ color: 'var(--smoke)' }}>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(0)} MXN</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                  <span style={{ color: 'var(--smoke)' }}>Envío</span>
                  <span className="font-medium">${SHIPPING_MXN} MXN</span>
                </div>
                <div
                  className="flex justify-between items-end pt-4 border-t mb-8"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span className="font-bold text-sm">Total</span>
                  <span className="mk-display text-3xl">${total.toFixed(0)} <span className="text-sm font-sans font-bold" style={{ color: 'var(--smoke)' }}>MXN</span></span>
                </div>
                <button
                  onClick={() => router.push('/checkout')}
                  className="mk-btn mk-btn-primary w-full justify-center text-base"
                >
                  Proceder al pago
                </button>
                <div className="mt-6 pt-6 border-t flex flex-col gap-3" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--smoke)' }}>
                    <Lock size={14} />
                    <span>Pago 100% seguro y encriptado</span>
                  </div>
                  <div className="flex items-center gap-2 text-[0.8125rem]" style={{ color: 'var(--smoke)' }}>
                    <Truck size={14} />
                    <span>Envío rápido a todo México</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
