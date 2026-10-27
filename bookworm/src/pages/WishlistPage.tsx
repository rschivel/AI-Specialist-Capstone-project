import { Link } from 'react-router-dom'
import { BookCard } from '../components/book/BookCard'
import { Button } from '../components/ui/Button'
import { EmptyState, ErrorMessage, Spinner } from '../components/ui/Feedback'
import { useAsync } from '../hooks/useAsync'
import { bookService } from '../services'
import { useCartStore } from '../store/cartStore'
import { useWishlistStore } from '../store/wishlistStore'

export default function WishlistPage() {
  const { data: books, loading, error } = useAsync(() => bookService.list(), [])
  const { bookIds, toggle } = useWishlistStore()
  const addToCart = useCartStore((s) => s.add)

  if (loading) return <Spinner label="Loading your wishlist" />
  if (error) return <ErrorMessage message={error} />

  const wished = (books ?? []).filter((b) => bookIds.includes(b.id))

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-lg text-ink">My Wishlist</h1>
      {wished.length === 0 && (
        <>
          <EmptyState title="Your wishlist is empty" hint="Save books you want to read later." />
          <p className="text-center">
            <Link to="/" className="text-link underline">
              Browse the catalogue
            </Link>
          </p>
        </>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        {wished.map((book) => (
          <div key={book.id} className="space-y-2 bg-surface p-4">
            <BookCard book={book} />
            <div className="flex gap-2">
              <Button onClick={() => addToCart(book.id)}>Add to Cart</Button>
              <Button
                variant="ghost"
                onClick={() => toggle(book.id)}
                aria-label={`Remove ${book.title} from wishlist`}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
