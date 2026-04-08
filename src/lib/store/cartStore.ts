'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { Product } from '@/lib/data/mockProducts'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  maxQuantity?: number
  image: string
  slug: string
}

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product, quantity) => {
        const desiredAdd = Math.max(0, Math.floor(quantity || 0))
        if (!desiredAdd) return

        const items = get().items
        const existingItem = items.find((item) => item.id === product.id)
        const maxAllowed =
          typeof product.maxQuantity === 'number' && Number.isFinite(product.maxQuantity)
            ? Math.max(0, Math.floor(product.maxQuantity))
            : undefined

        if (existingItem) {
          const effectiveMax =
            typeof existingItem.maxQuantity === 'number'
              ? existingItem.maxQuantity
              : maxAllowed
          const nextQtyRaw = existingItem.quantity + desiredAdd
          const nextQty =
            typeof effectiveMax === 'number' ? Math.min(nextQtyRaw, effectiveMax) : nextQtyRaw
          if (nextQty === existingItem.quantity) return

          set({
            items: items.map((item) =>
              item.id === product.id
                ? {
                    ...item,
                    quantity: nextQty,
                    maxQuantity: typeof effectiveMax === 'number' ? effectiveMax : item.maxQuantity,
                  }
                : item
            ),
          })
        } else {
          const initialQty =
            typeof maxAllowed === 'number'
              ? Math.min(desiredAdd, maxAllowed)
              : desiredAdd
          if (!initialQty) return

          set({
            items: [
              ...items,
              {
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: initialQty,
                maxQuantity: typeof maxAllowed === 'number' ? maxAllowed : undefined,
                image: product.images[0] || '/placeholder-product.jpg',
                slug: product.slug,
              },
            ],
          })
        }
      },

      removeItem: (id) => {
        set({
          items: get().items.filter((item) => item.id !== id),
        })
      },

      updateQuantity: (id, quantity) => {
        const next = Math.floor(Number(quantity) || 0)
        if (next <= 0) {
          get().removeItem(id)
          return
        }

        const current = get().items.find((i) => i.id === id)
        const effectiveMax =
          current && typeof current.maxQuantity === 'number' ? current.maxQuantity : undefined
        const clamped =
          typeof effectiveMax === 'number' ? Math.min(next, effectiveMax) : next

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: clamped } : item
          ),
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'unika-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
