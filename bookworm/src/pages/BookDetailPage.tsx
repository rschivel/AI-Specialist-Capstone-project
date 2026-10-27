import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BookCard } from '../components/book/BookCard'
import { BookCover } from '../components/book/BookCover'
import { ReviewForm } from '../components/book/ReviewForm'
import { TagLinks } from '../components/book/TagLinks'
import { Button } from '../components/ui/Button'
import { ErrorMessage, Spinner } from '../components/ui/Feedback'
import { StarRating } from '../components/ui/StarRating'
import { useAsync } from '../hooks/useAsync'
import { bookService } from '../services'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'
import type { Review } from '../types'
import { formatDeliveryDate, formatPrice } from '../utils/format'

export default function BookDetailPage() {
  const { bookId = '' } = useParams()
  const { data: book, loading, error } = useAsync(() => bookService.get(bookId), [bookId])
  const { data: related } = useAsync(() => bookService.related(bookId), [bookId])
  const { data: loadedReviews } = useAsync(() => bookService.reviews(bookId), [bookId])
  const [newReviews, setNewReviews] = useState<Review[]>([])

  const addToCart = useCartStore((s) => s.add)
  const inWishlist = useWishlistStore((s) => s.bookIds.includes(bookId))
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const [added, setAdded] = useState(false)

  if (loading) return <Spinner label="Loading book" />
  if (error || !book) return <ErrorMessage message={error ?? 'Book not found'} />

  const reviews = [...newReviews, ...(loadedReviews ?? [])]

  return (
    <div className="mx-auto grid max-w-7xl gap-6 p-4 lg:grid-cols-[1fr_16rem]">
      <div className="space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap gap-1">
            <li>
              <Link to="/" className="text-link underline">
                Home
              </Link>{' '}
              /
            </li>
            <li>
              <Link
                to={`/?category=${encodeURIComponent(book.category)}`}
                className="text-link underline"
              >
                {book.tags[0]}
              </Link>{' '}
              /
            </li>
            <li aria-current="page">{book.tags[1] ?? book.category}</li>
          </ol>
        </nav>

        <section aria-labelledby="book-title" className="grid gap-6 md:grid-cols-[auto_1fr]">
          <div className="flex gap-3">
            <BookCover book={book} className="w-40 text-[13px] sm:w-48" />
            <div
              aria-hidden="true"
              className="hidden w-40 flex-col justify-between bg-yellow-400 p-3 text-[10px] text-black sm:flex sm:w-48"
            >
              <p className="italic">“A refreshing path to clarity in a cluttered world.”</p>
              <p>{book.description}</p>
              <p className="font-semibold">About the Author: {book.author.name}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <h1 id="book-title" className="text-xl text-ink">
              {book.title}
            </h1>
            <p className="text-muted">
              by <span className="text-link underline">{book.author.name}</span>
            </p>
            <p className="text-subtle">{book.description}</p>
            <p className="text-xs text-muted">Published by: {book.publisher}</p>
            <p className="text-xs text-muted">{book.format}</p>
            <TagLinks tags={book.tags} />
            <p className="pt-2 text-2xl font-semibold">{formatPrice(book.price)}</p>
            <p className="text-xs text-muted">
              Delivery by{' '}
              <strong className="text-ink">{formatDeliveryDate(book.deliveryDays)}</strong>
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  addToCart(book.id)
                  setAdded(true)
                }}
              >
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                aria-pressed={inWishlist}
                onClick={() => toggleWishlist(book.id)}
              >
                {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>
            {added && (
              <p role="status" className="text-xs text-success">
                Added to your cart.{' '}
                <Link to="/checkout" className="text-link underline">
                  Go to cart
                </Link>
              </p>
            )}
            <dl className="flex flex-wrap gap-6 pt-4 text-xs text-muted">
              <div>
                <dt>Language</dt>
                <dd className="text-link underline">{book.language}</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>
                  <StarRating value={book.rating} />
                </dd>
              </div>
              <div>
                <dt>Sells</dt>
                <dd className="font-semibold text-ink">{book.copiesSold} copies sold</dd>
              </div>
            </dl>
          </div>
        </section>

        <section aria-labelledby="writer-heading">
          <h2 id="writer-heading" className="mb-3 text-sm text-muted">
            About the writer
          </h2>
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              style={{ background: book.author.avatarColor }}
              className="grid size-16 shrink-0 place-items-center rounded-full text-lg font-bold"
            >
              {book.author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="text-xs text-muted">
              <p className="mb-1 text-sm text-ink">{book.author.name}</p>
              <p>{book.author.bio}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="reviews-heading" className="grid gap-6 md:grid-cols-2">
          <h2 id="reviews-heading" className="text-sm text-muted md:col-span-2">
            Reviews
          </h2>
          <ReviewForm bookId={book.id} onSubmitted={(r) => setNewReviews((prev) => [r, ...prev])} />
          <ul className="space-y-4">
            {reviews.length === 0 && <li className="text-xs text-muted">No reviews yet.</li>}
            {reviews.map((r) => (
              <li key={r.id} className="space-y-1 text-xs">
                <p className="text-sm text-ink">{r.author}</p>
                <p className="text-muted">{r.text}</p>
                <StarRating value={r.rating} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside
        aria-labelledby="related-heading"
        className="space-y-4 border-line lg:border-l lg:pl-4"
      >
        <h2 id="related-heading" className="text-sm text-muted">
          Related Reads
        </h2>
        {related?.map((b) => (
          <BookCard key={b.id} book={b} compact />
        ))}
      </aside>
    </div>
  )
}
