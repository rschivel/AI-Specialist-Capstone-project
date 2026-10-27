import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { MAX_QUANTITY } from '../constants'
import type { CartItem } from '../types'

interface CartState {
  items: CartItem[]
  add: (bookId: string) => void
  remove: (bookId: string) => void
  setQuantity: (bookId: string, quantity: number) => void
  clear: () => void
}

const clamp = (quantity: number): number =>
  Math.min(Math.max(Math.trunc(quantity), 1), MAX_QUANTITY)

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (bookId) =>
        set((state) => {
          const existing = state.items.find((i) => i.bookId === bookId)
          return existing
            ? {
                items: state.items.map((i) =>
                  i.bookId === bookId ? { ...i, quantity: clamp(i.quantity + 1) } : i,
                ),
              }
            : { items: [...state.items, { bookId, quantity: 1 }] }
        }),
      remove: (bookId) =>
        set((state) => ({ items: state.items.filter((i) => i.bookId !== bookId) })),
      setQuantity: (bookId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.bookId === bookId ? { ...i, quantity: clamp(quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'bookworm.cart' },
  ),
)

export const selectCartCount = (state: CartState): number =>
  state.items.reduce((sum, i) => sum + i.quantity, 0)
