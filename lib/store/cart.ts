import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/domain'

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (variantId: string, designUrl?: string) => void
  updateQuantity: (variantId: string, designUrl: string | undefined, quantity: number) => void
  clear: () => void
  totalItems: () => number
  totalPrice: () => number
}

function itemKey(variantId: string, designUrl?: string) {
  return `${variantId}-${designUrl ?? 'no-design'}`
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const key = itemKey(item.variantId, item.designUrl)
        set(state => {
          const existing = state.items.find(
            i => itemKey(i.variantId, i.designUrl) === key
          )
          if (existing) {
            return {
              items: state.items.map(i =>
                itemKey(i.variantId, i.designUrl) === key
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        })
      },

      removeItem: (variantId, designUrl) => {
        const key = itemKey(variantId, designUrl)
        set(state => ({
          items: state.items.filter(
            i => itemKey(i.variantId, i.designUrl) !== key
          ),
        }))
      },

      updateQuantity: (variantId, designUrl, quantity) => {
        const key = itemKey(variantId, designUrl)
        if (quantity <= 0) {
          get().removeItem(variantId, designUrl)
          return
        }
        set(state => ({
          items: state.items.map(i =>
            itemKey(i.variantId, i.designUrl) === key ? { ...i, quantity } : i
          ),
        }))
      },

      clear: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.unitPriceMxn * i.quantity, 0),
    }),
    { name: 'stampia-cart' }
  )
)
