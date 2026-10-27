import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { CardForm, UpiForm, WalletForm } from '../components/payment/PaymentForms'
import { ErrorMessage, Spinner } from '../components/ui/Feedback'
import { useCheckoutSummary } from '../hooks/useCheckoutSummary'
import type { PaymentRequest } from '../schemas/payment'
import { getErrorMessage, orderService, paymentService } from '../services'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import type { PaymentMethod } from '../types'
import { formatPrice } from '../utils/format'

const TABS: { id: PaymentMethod; label: string }[] = [
  { id: 'credit-card', label: 'Credit Card' },
  { id: 'debit-card', label: 'Debit card' },
  { id: 'upi', label: 'UPI' },
  { id: 'wallet', label: 'Wallet' },
]

type SubmitDetails = Omit<PaymentRequest, 'method' | 'amount'>['details']

export default function PaymentPage() {
  const navigate = useNavigate()
  const { lines, totals, loading, error } = useCheckoutSummary()
  const { address, coupon, useGiftPoints, completeOrder } = useCheckoutStore()
  const clearCart = useCartStore((s) => s.clear)
  const [method, setMethod] = useState<PaymentMethod>('credit-card')
  const [failure, setFailure] = useState<string | null>(null)

  if (loading) return <Spinner label="Preparing payment" />
  if (error) return <ErrorMessage message={error} />
  if (!address || lines.length === 0) return <Navigate to="/checkout" replace />

  const pay = async (details: SubmitDetails) => {
    setFailure(null)
    try {
      const payment = await paymentService.pay({
        method,
        amount: totals.total,
        details,
      } as PaymentRequest)
      const order = await orderService.create({
        items: lines.map((l) => ({ bookId: l.book.id, quantity: l.quantity })),
        address,
        couponCode: coupon?.code ?? null,
        useGiftPoints,
        paymentId: payment.paymentId,
        paymentMethod: method,
      })
      completeOrder(order)
      clearCart()
      navigate('/confirmation', { replace: true })
    } catch (e) {
      setFailure(getErrorMessage(e, 'Payment failed. You have not been charged. Please try again.'))
    }
  }

  const isCard = method === 'credit-card' || method === 'debit-card'

  return (
    <div className="payment-backdrop grid min-h-[calc(100vh-6rem)] place-items-center p-4">
      <section aria-labelledby="payment-heading" className="w-full max-w-2xl bg-surface shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h1 id="payment-heading" className="text-sm text-ink">
            Complete Payment
          </h1>
          <p className="text-sm font-semibold text-ink">
            Payable Amount: {formatPrice(totals.total)}
          </p>
        </div>
        <div className="grid sm:grid-cols-[10rem_1fr]">
          <div
            role="tablist"
            aria-label="Payment method"
            aria-orientation="vertical"
            className="flex sm:flex-col"
          >
            {TABS.map((tab) => {
              const selected = tab.id === method
              return (
                <button
                  key={tab.id}
                  id={`tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="payment-panel"
                  onClick={() => {
                    setMethod(tab.id)
                    setFailure(null)
                  }}
                  className={`flex-1 border-l-2 px-4 py-3 text-left text-xs ${
                    selected
                      ? 'border-brand bg-surface font-semibold text-white'
                      : 'border-transparent bg-surface-2 text-muted hover:bg-[#4c4c4c]'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
          <div id="payment-panel" role="tabpanel" aria-labelledby={`tab-${method}`} className="p-4">
            {failure && (
              <p
                role="alert"
                className="mb-3 border-l-4 border-danger bg-canvas p-3 text-xs text-danger"
              >
                {failure}
              </p>
            )}
            {isCard && <CardForm key={method} onSubmit={pay} />}
            {method === 'upi' && <UpiForm onSubmit={pay} />}
            {method === 'wallet' && <WalletForm onSubmit={pay} />}
          </div>
        </div>
      </section>
    </div>
  )
}
