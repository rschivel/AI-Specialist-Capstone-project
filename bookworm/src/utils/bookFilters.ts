import { PRICE_RANGES } from '../constants'
import type { Book, BookQuery } from '../types'

const matchesText = (book: Book, search: string): boolean => {
  const needle = search.trim().toLowerCase()
  if (!needle) return true
  return [book.title, book.author.name, ...book.tags].some((v) => v.toLowerCase().includes(needle))
}

export function filterBooks(books: readonly Book[], query: BookQuery): Book[] {
  const range = PRICE_RANGES.find((r) => r.value === query.priceRange)

  const result = books.filter(
    (book) =>
      matchesText(book, query.search ?? '') &&
      (!query.category || query.category === 'All' || book.category === query.category) &&
      (!query.tag || book.tags.some((t) => t.toLowerCase() === query.tag?.toLowerCase())) &&
      (!query.language || query.language === 'All' || book.language === query.language) &&
      (!query.format || query.format === 'All' || book.format === query.format) &&
      (!range || (book.price >= range.min && book.price <= range.max)),
  )

  switch (query.sort) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price)
    case 'title':
      return result.sort((a, b) => a.title.localeCompare(b.title))
    default:
      return result
  }
}

/** Ranks other books by similarity to `book`, boosting categories the reader has bought before. */
export function rankRelatedBooks(
  book: Book,
  books: readonly Book[],
  purchasedCategories: readonly string[] = [],
): Book[] {
  const score = (other: Book): number =>
    (other.category === book.category ? 3 : 0) +
    other.tags.filter((t) => book.tags.includes(t)).length +
    (purchasedCategories.includes(other.category) ? 2 : 0)

  return books
    .filter((other) => other.id !== book.id)
    .map((other) => ({ other, score: score(other) }))
    .filter(({ score: s }) => s > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ other }) => other)
}
