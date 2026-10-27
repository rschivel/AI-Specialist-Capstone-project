import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CategorySidebar } from '../components/catalogue/CategorySidebar'
import { FilterBar, type FilterValues } from '../components/catalogue/FilterBar'
import { BookCard } from '../components/book/BookCard'
import { EmptyState, ErrorMessage, Spinner } from '../components/ui/Feedback'
import { SECTIONS } from '../constants'
import { useAsync } from '../hooks/useAsync'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { bookService } from '../services'
import type { SortOption } from '../types'

const DEFAULTS: Record<string, string> = {
  category: 'All',
  language: 'All',
  format: 'All',
  priceRange: 'all',
  sort: 'relevance',
}

export default function CataloguePage() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search.trim())

  const get = (key: string) => params.get(key) ?? DEFAULTS[key] ?? ''
  const category = get('category')
  const tag = params.get('tag') ?? ''
  const filters: FilterValues = {
    language: get('language'),
    format: get('format'),
    priceRange: get('priceRange'),
    sort: get('sort'),
  }

  const setParam = (key: string, value: string) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev)
      if (!value || value === DEFAULTS[key]) next.delete(key)
      else next.set(key, value)
      return next
    })

  const {
    data: books,
    loading,
    error,
  } = useAsync(
    () =>
      bookService.list({
        search: debouncedSearch,
        category,
        tag,
        language: filters.language,
        format: filters.format,
        priceRange: filters.priceRange,
        sort: filters.sort as SortOption,
      }),
    [
      debouncedSearch,
      category,
      tag,
      filters.language,
      filters.format,
      filters.priceRange,
      filters.sort,
    ],
  )

  const isFiltered =
    debouncedSearch !== '' ||
    tag !== '' ||
    category !== 'All' ||
    filters.language !== 'All' ||
    filters.format !== 'All' ||
    filters.priceRange !== 'all' ||
    filters.sort !== 'relevance'

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-4 p-4 lg:flex-row">
      <CategorySidebar selected={category} onSelect={(c) => setParam('category', c)} />

      <div className="min-w-0 flex-1 space-y-6">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          values={filters}
          onChange={(key, value) => setParam(key, value)}
        />

        {tag && (
          <p className="text-sm text-muted">
            Showing books tagged <strong className="text-ink">{tag}</strong>{' '}
            <button
              type="button"
              onClick={() => setParam('tag', '')}
              className="text-link underline"
            >
              Clear
            </button>
          </p>
        )}

        {loading && <Spinner label="Loading books" />}
        {error && <ErrorMessage message={error} />}

        {books && !loading && books.length === 0 && (
          <EmptyState title="No books found" hint="Try a different search or clear some filters." />
        )}

        {books && books.length > 0 && !isFiltered && (
          <div className="space-y-8">
            {SECTIONS.map((section) => {
              const items = books.filter((b) => b.section === section.id)
              if (items.length === 0) return null
              return (
                <section key={section.id} aria-labelledby={`section-${section.id}`}>
                  <h2 id={`section-${section.id}`} className="mb-3 text-sm text-muted">
                    {section.title}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {items.map((book) => (
                      <BookCard key={book.id} book={book} />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}

        {books && books.length > 0 && isFiltered && (
          <section aria-labelledby="results-heading">
            <h2 id="results-heading" className="mb-3 text-sm text-muted">
              {books.length} result{books.length === 1 ? '' : 's'}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
