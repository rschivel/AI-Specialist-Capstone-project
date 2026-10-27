import { create } from 'zustand'
import type { AddressFormValues } from '../schemas/address'
import type { CouponResult, Order } from '../types'

/**
 * In-memory checkout session. Deliberately NOT persisted: it holds personal address data and
 * must never include card details.
 */
interface CheckoutState {
  address: AddressFormValues | null
  coupon: CouponResult | null
  useGiftPoints: boolean
  lastOrder: Order | null
  setAddress: (address: AddressFormValues) => void
  setCoupon: (coupon: CouponResult | null) => void
  setUseGiftPoints: (value: boolean) => void
  completeOrder: (order: Order) => void
  reset: () => void
}

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  address: null,
  coupon: null,
  useGiftPoints: false,
  lastOrder: null,
  setAddress: (address) => set({ address }),
  setCoupon: (coupon) => set({ coupon }),
  setUseGiftPoints: (useGiftPoints) => set({ useGiftPoints }),
  completeOrder: (lastOrder) =>
    set({ lastOrder, address: null, coupon: null, useGiftPoints: false }),
  reset: () => set({ address: null, coupon: null, useGiftPoints: false, lastOrder: null }),
}))
