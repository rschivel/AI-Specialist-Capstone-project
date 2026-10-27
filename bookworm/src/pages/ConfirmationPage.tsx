import { Link, Navigate } from 'react-router-dom'
import { BookCover } from '../components/book/BookCover'
import { TagLinks } from '../components/book/TagLinks'
import { useCheckoutStore } from '../store/checkoutStore'
import { formatDeliveryDate, formatPrice } from '../utils/format'

export default function ConfirmationPage() {
  const order = useCheckoutStore((s) => s.lastOrder)
  if (!order) return <Navigate to="/" replace />

  return (
    <div className="payment-backdrop grid min-h-[calc(100vh-6rem)] place-items-center p-4">
      <section
        aria-labelledby="confirm-heading"
        className="w-full max-w-2xl bg-surface p-6 text-center shadow-xl"
      >
        <div
          aria-hidden="true"
          className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-green-500 text-xl text-black"
        >
          ✓
        </div>
        <h1 id="confirm-heading" className="mb-1 text-base text-ink">
          Your purchase of the following reads is successful
        </h1>
        <p className="mb-5 text-xs text-muted">
          Order {order.id} · Total paid {formatPrice(order.totals.total)}
        </p>

        <ul className="mb-6 flex flex-wrap justify-center gap-6 text-left">
          {order.items.map(({ book, quantity }) => (
            <li key={book.id} className="flex gap-3">
              <BookCover book={book} className="w-24 text-[10px]" />
              <div className="space-y-1 text-xs">
                <p className="text-sm text-ink">{book.title}</p>
                <p className="text-muted">
                  by <span className="text-link underline">{book.author.name}</span>
                </p>
                <p className="text-muted">
                  {book.format}
                  {quantity > 1 && ` × ${quantity}`}
                </p>
                <TagLinks tags={book.tags} />
                <p className="text-base font-semibold text-ink">{formatPrice(book.price)}</p>
                <p className="text-muted">
                  Delivery by{' '}
                  <strong className="text-ink">{formatDeliveryDate(book.deliveryDays)}</strong>
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          to="/"
          className="inline-flex min-h-10 items-center bg-brand px-6 text-sm font-medium text-white hover:bg-brand-hover"
        >
          Continue your Shopping
        </Link>
      </section>
    </div>
  )
}
