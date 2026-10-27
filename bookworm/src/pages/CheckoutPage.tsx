import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { BookCover } from '../components/book/BookCover'
import { TagLinks } from '../components/book/TagLinks'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorMessage, Spinner } from '../components/ui/Feedback'
import { SelectField, TextField } from '../components/ui/Field'
import { COUNTRIES, GIFT_POINTS_BALANCE, MAX_QUANTITY, PHONE_CODES } from '../constants'
import { useCheckoutSummary } from '../hooks/useCheckoutSummary'
import { addressSchema, type AddressFormValues } from '../schemas/address'
import { getErrorMessage, orderService } from '../services'
import { useCartStore } from '../store/cartStore'
import { useCheckoutStore } from '../store/checkoutStore'
import { formatDeliveryDate, formatPrice } from '../utils/format'

const toOptions = (items: readonly string[]) => items.map((i) => ({ value: i, label: i }))

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { lines, totals, loading, error } = useCheckoutSummary()
  const { setQuantity, remove } = useCartStore()
  const { address, useGiftPoints, setAddress, setCoupon, setUseGiftPoints } = useCheckoutStore()

  const [couponCode, setCouponCode] = useState('')
  const [couponMessage, setCouponMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [savedMessage, setSavedMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: address ?? { phoneCode: '+91', country: 'India' },
  })

  const applyCoupon = async () => {
    if (!couponCode.trim()) return
    try {
      const result = await orderService.validateCoupon(couponCode)
      setCoupon(result)
      setCouponMessage({ ok: true, text: `Coupon ${result.code} applied.` })
    } catch (e) {
      setCoupon(null)
      setCouponMessage({ ok: false, text: getErrorMessage(e, 'Could not apply coupon.') })
    }
  }

  const loadSavedAddress = async (checked: boolean) => {
    setSavedMessage(null)
    if (!checked) return
    try {
      const [latest] = await orderService.list()
      if (latest) reset(latest.address)
      else setSavedMessage('You have no saved address yet.')
    } catch (e) {
      setSavedMessage(getErrorMessage(e))
    }
  }

  const onSubmit = handleSubmit((values) => {
    setAddress(values)
    navigate('/payment')
  })

  if (loading) return <Spinner label="Loading your cart" />
  if (error) return <ErrorMessage message={error} />
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-4">
        <EmptyState title="Your shopping cart is empty" hint="Pick a few books to get started." />
        <p className="text-center">
          <Link to="/" className="text-link underline">
            Browse the catalogue
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl space-y-4 p-4">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <Link to="/" className="text-link underline">
          Home
        </Link>{' '}
        / Checkout
      </nav>
      <h1 className="text-base text-ink">Shopping Cart</h1>

      <section aria-label="Items in your cart" className="flex flex-wrap gap-8 bg-surface p-4">
        {lines.map(({ book, quantity }) => (
          <article key={book.id} aria-label={book.title} className="flex gap-4">
            <BookCover book={book} className="w-28 text-[11px]" />
            <div className="space-y-1 text-xs">
              <h2 className="text-sm text-ink">{book.title}</h2>
              <p className="text-muted">
                by <span className="text-link underline">{book.author.name}</span>
              </p>
              <p className="max-w-48 text-subtle">{book.description}</p>
              <p className="text-muted">{book.format}</p>
              <TagLinks tags={book.tags} />
              <p className="text-base font-semibold text-ink">{formatPrice(book.price)}</p>
              <p className="text-muted">
                Delivery by{' '}
                <strong className="text-ink">{formatDeliveryDate(book.deliveryDays)}</strong>
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="secondary"
                  className="min-h-8 px-3"
                  aria-label={`Decrease quantity of ${book.title}`}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(book.id, quantity - 1)}
                >
                  −
                </Button>
                <span aria-label={`Quantity of ${book.title}`} className="w-6 text-center">
                  {quantity}
                </span>
                <Button
                  variant="secondary"
                  className="min-h-8 px-3"
                  aria-label={`Increase quantity of ${book.title}`}
                  disabled={quantity >= MAX_QUANTITY}
                  onClick={() => setQuantity(book.id, quantity + 1)}
                >
                  +
                </Button>
                <Button variant="ghost" className="min-h-8" onClick={() => remove(book.id)}>
                  Remove
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <section aria-labelledby="address-heading" className="bg-surface p-4">
          <h2 id="address-heading" className="mb-3 text-sm text-ink">
            Address
          </h2>
          <label className="mb-4 flex items-center gap-2 text-xs text-muted">
            <input type="checkbox" onChange={(e) => void loadSavedAddress(e.target.checked)} />
            Use Saved Address
          </label>
          {savedMessage && (
            <p role="status" className="mb-3 text-xs text-muted">
              {savedMessage}
            </p>
          )}
          <form
            id="address-form"
            onSubmit={onSubmit}
            noValidate
            className="grid gap-3 sm:grid-cols-3"
          >
            <TextField
              label="First Name"
              placeholder="First Name"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <TextField
              label="Last Name"
              placeholder="Last Name"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
            <TextField
              label="Address"
              placeholder="Address Line 2"
              autoComplete="street-address"
              error={errors.addressLine?.message}
              {...register('addressLine')}
            />
            <TextField
              label="e-mail"
              type="email"
              placeholder="e-mail"
              autoComplete="email"
              wrapperClassName="sm:col-span-1"
              error={errors.email?.message}
              {...register('email')}
            />
            <TextField
              label="City"
              placeholder="City"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register('city')}
            />
            <TextField
              label="Pin"
              placeholder="000000"
              inputMode="numeric"
              maxLength={6}
              autoComplete="postal-code"
              error={errors.pin?.message}
              {...register('pin')}
            />
            <div className="grid grid-cols-[6rem_1fr] gap-2">
              <SelectField
                label="Code"
                options={toOptions(PHONE_CODES)}
                error={errors.phoneCode?.message}
                {...register('phoneCode')}
              />
              <TextField
                label="Phone Number"
                placeholder="12345567890"
                inputMode="tel"
                maxLength={10}
                autoComplete="tel-national"
                error={errors.phone?.message}
                {...register('phone')}
              />
            </div>
            <TextField
              label="State"
              placeholder="State"
              autoComplete="address-level1"
              error={errors.state?.message}
              {...register('state')}
            />
            <SelectField
              label="Country"
              options={toOptions(COUNTRIES)}
              error={errors.country?.message}
              {...register('country')}
            />
          </form>
        </section>

        <section aria-labelledby="total-heading" className="space-y-3 bg-surface p-4 text-sm">
          <h2 id="total-heading" className="text-ink">
            Grand Total
          </h2>
          <dl className="space-y-2 text-xs">
            <Row
              label={`Price (${lines.reduce((n, l) => n + l.quantity, 0)} items)`}
              value={formatPrice(totals.subtotal)}
            />
            <Row label="Tax" value={formatPrice(totals.tax)} />
            <Row
              label="Delivery Charges"
              value={totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)}
            />
          </dl>

          <div className="flex gap-2 border-t border-line pt-3">
            <TextField
              label="Apply Coupon"
              hideLabel
              placeholder="Apply Coupon"
              maxLength={30}
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              wrapperClassName="flex-1"
            />
            <Button onClick={() => void applyCoupon()}>Apply</Button>
          </div>
          {couponMessage && (
            <p
              role="status"
              className={`text-xs ${couponMessage.ok ? 'text-success' : 'text-danger'}`}
            >
              {couponMessage.text}
            </p>
          )}

          <label className="flex items-center gap-2 text-xs text-muted">
            <input
              type="checkbox"
              checked={useGiftPoints}
              onChange={(e) => setUseGiftPoints(e.target.checked)}
            />
            Redeem gift points ({GIFT_POINTS_BALANCE} available)
          </label>

          <dl className="space-y-2 border-t border-line pt-3 text-xs">
            <Row label="Discount" value={formatPrice(totals.discount)} />
            {totals.giftPoints > 0 && (
              <Row label="Gift points" value={formatPrice(totals.giftPoints)} />
            )}
            <div className="flex justify-between border-t border-line pt-2 text-sm font-semibold text-ink">
              <dt>Total Amount</dt>
              <dd>{formatPrice(totals.total)}</dd>
            </div>
          </dl>

          <div className="text-right">
            <Button type="submit" form="address-form">
              Pay Now
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <dt>{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}
