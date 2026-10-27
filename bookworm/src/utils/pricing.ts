import { DELIVERY_FEE, FREE_DELIVERY_THRESHOLD, GIFT_POINTS_BALANCE, TAX_RATE } from '../constants'
import type { Totals } from '../types'

interface TotalsOptions {
  couponDiscount?: number
  useGiftPoints?: boolean
}

/** Pure price calculation shared by the UI and the (mock) backend. */
export function computeTotals(
  subtotal: number,
  { couponDiscount = 0, useGiftPoints = false }: TotalsOptions = {},
): Totals {
  const tax = Math.round(subtotal * TAX_RATE)
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
  const gross = subtotal + tax + delivery
  const discount = Math.min(Math.max(couponDiscount, 0), gross)
  const giftPoints = useGiftPoints ? Math.min(GIFT_POINTS_BALANCE, gross - discount) : 0
  return { subtotal, tax, delivery, discount, giftPoints, total: gross - discount - giftPoints }
}
