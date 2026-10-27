import { Link } from 'react-router-dom'
import { BookCover } from '../components/book/BookCover'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorMessage, Spinner } from '../components/ui/Feedback'
import { useAsync } from '../hooks/useAsync'
import { orderService } from '../services'
import { useCartStore } from '../store/cartStore'
import { formatOrderDate, formatPrice } from '../utils/format'

export default function OrdersPage() {
  const { data: orders, loading, error } = useAsync(() => orderService.list(), [])
  const addToCart = useCartStore((s) => s.add)

  if (loading) return <Spinner label="Loading your orders" />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-lg text-ink">My Orders</h1>
      {orders?.length === 0 && (
        <EmptyState
          title="You have not placed any orders yet"
          hint="Your purchases will appear here."
        />
      )}
      {orders?.map((order) => (
        <section key={order.id} aria-label={`Order ${order.id}`} className="bg-surface p-4">
          <header className="mb-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
            <span>
              Order <strong className="text-ink">{order.id}</strong> ·{' '}
              {formatOrderDate(order.createdAt)}
            </span>
            <span>Total {formatPrice(order.totals.total)}</span>
          </header>
          <ul className="space-y-3">
            {order.items.map(({ book, quantity }) => (
              <li key={book.id} className="flex items-center gap-4">
                <BookCover book={book} className="w-16 text-[8px]" />
                <div className="flex-1 text-xs">
                  <Link to={`/books/${book.id}`} className="text-sm text-ink hover:underline">
                    {book.title}
                  </Link>
                  <p className="text-muted">
                    {book.author.name} · Qty {quantity}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => addToCart(book.id)}
                  aria-label={`Buy ${book.title} again`}
                >
                  Buy it again
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {orders && orders.length > 0 && (
        <p className="text-xs text-muted">
          <Link to="/checkout" className="text-link underline">
            Go to cart
          </Link>
        </p>
      )}
    </div>
  )
}
