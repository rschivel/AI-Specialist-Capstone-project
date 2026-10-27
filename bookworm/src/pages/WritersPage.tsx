import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ErrorMessage, Spinner } from '../components/ui/Feedback'
import { useAsync } from '../hooks/useAsync'
import { bookService } from '../services'
import type { Author, Book } from '../types'

export default function WritersPage() {
  const { data: books, loading, error } = useAsync(() => bookService.list(), [])

  const writers = useMemo(() => {
    const map = new Map<string, { author: Author; books: Book[] }>()
    for (const book of books ?? []) {
      const entry = map.get(book.author.id) ?? { author: book.author, books: [] }
      entry.books.push(book)
      map.set(book.author.id, entry)
    }
    return [...map.values()].sort((a, b) => a.author.name.localeCompare(b.author.name))
  }, [books])

  if (loading) return <Spinner label="Loading writers" />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4">
      <h1 className="text-lg text-ink">My Writers</h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {writers.map(({ author, books: written }) => (
          <li key={author.id} className="flex gap-4 bg-surface p-4">
            <div
              aria-hidden="true"
              style={{ background: author.avatarColor }}
              className="grid size-14 shrink-0 place-items-center rounded-full font-bold"
            >
              {author.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <div className="text-xs">
              <h2 className="text-sm text-ink">{author.name}</h2>
              <p className="my-1 line-clamp-2 text-muted">{author.bio}</p>
              <p>
                {written.map((b, i) => (
                  <span key={b.id}>
                    <Link to={`/books/${b.id}`} className="text-link underline">
                      {b.title}
                    </Link>
                    {i < written.length - 1 && ', '}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
