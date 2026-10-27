import { useMemo } from 'react'
import { useCartLines } from './useCartLines'
import { useCheckoutStore } from '../store/checkoutStore'
import { computeTotals } from '../utils/pricing'

/** Cart lines + the totals the shopper will actually pay (coupon and gift points applied). */
export function useCheckoutSummary() {
  const { lines, subtotal, loading, error } = useCartLines()
  const coupon = useCheckoutStore((s) => s.coupon)
  const useGiftPoints = useCheckoutStore((s) => s.useGiftPoints)

  const totals = useMemo(
    () => computeTotals(subtotal, { couponDiscount: coupon?.discount ?? 0, useGiftPoints }),
    [subtotal, coupon, useGiftPoints],
  )

  return { lines, totals, loading, error }
}
