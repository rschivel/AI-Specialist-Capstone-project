import type { Book } from '../../types'

interface BookCoverProps {
  book: Book
  className?: string
}

/** Generated cover art so the app ships without binary image assets. */
export function BookCover({ book, className = '' }: BookCoverProps) {
  const { background, color, accent } = book.cover
  return (
    <div
      role="img"
      aria-label={`Cover of ${book.title} by ${book.author.name}`}
      style={{ background, color }}
      className={`flex aspect-[2/3] flex-col items-center justify-between overflow-hidden p-[8%] text-center ${className}`}
    >
      <span className="text-[0.55em] uppercase tracking-widest opacity-80">A novel</span>
      <span className="text-[1.15em] font-extrabold uppercase leading-tight">{book.title}</span>
      <span
        aria-hidden="true"
        style={{ background: accent }}
        className="h-[0.4em] w-1/3 rounded-full"
      />
      <span className="text-[0.6em] font-semibold uppercase tracking-wider">
        {book.author.name}
      </span>
    </div>
  )
}
