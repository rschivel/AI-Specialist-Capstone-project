import { Link } from 'react-router-dom'
import type { Book } from '../../types'
import { formatDeliveryDate, formatPrice } from '../../utils/format'
import { BookCover } from './BookCover'
import { TagLinks } from './TagLinks'

interface BookCardProps {
  book: Book
  /** Compact variant used for "Related Reads". */
  compact?: boolean
}

export function BookCard({ book, compact = false }: BookCardProps) {
  return (
    <article className="flex gap-3" aria-label={book.title}>
      <Link
        to={`/books/${book.id}`}
        aria-label={`View ${book.title}`}
        className="w-24 shrink-0 text-[11px]"
      >
        <BookCover book={book} />
      </Link>
      <div className="min-w-0 space-y-1 text-xs">
        <h3 className="text-sm text-ink">
          <Link to={`/books/${book.id}`} className="hover:underline">
            {book.title}
          </Link>
        </h3>
        <p className="text-muted">
          by <span className="text-link underline">{book.author.name}</span>
        </p>
        <p className="line-clamp-3 text-subtle">{book.description}</p>
        <p className="pt-1 text-muted">{book.format}</p>
        <TagLinks tags={book.tags} />
        <p className="pt-1 text-base font-semibold text-ink">{formatPrice(book.price)}</p>
        {!compact && (
          <p className="text-muted">
            Delivery by{' '}
            <strong className="text-ink">{formatDeliveryDate(book.deliveryDays)}</strong>
          </p>
        )}
      </div>
    </article>
  )
}
