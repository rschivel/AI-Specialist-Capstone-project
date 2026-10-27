import { describe, expect, it } from 'vitest'
import { books } from '../data/books'
import { filterBooks, rankRelatedBooks } from './bookFilters'
import { formatDeliveryDate, formatPrice } from './format'
import { computeTotals } from './pricing'

describe('formatPrice', () => {
  it('formats INR without decimals', () => {
    expect(formatPrice(399)).toBe('₹399')
    expect(formatPrice(1499)).toBe('₹1,499')
  })
})

describe('formatDeliveryDate', () => {
  it('adds the given number of days', () => {
    const from = new Date(2025, 6, 16) // 16 Jul 2025
    expect(formatDeliveryDate(5, from)).toContain('21')
    expect(formatDeliveryDate(5, from)).toContain('Jul')
  })
})

describe('computeTotals', () => {
  it('adds tax and charges delivery below the free threshold', () => {
    const t = computeTotals(200)
    expect(t.tax).toBe(24)
    expect(t.delivery).toBe(40)
    expect(t.total).toBe(264)
  })

  it('gives free delivery at or above the threshold', () => {
    expect(computeTotals(508).delivery).toBe(0)
  })

  it('applies a coupon without going below zero', () => {
    expect(computeTotals(508, { couponDiscount: 100 }).total).toBe(508 + 61 - 100)
    expect(computeTotals(100, { couponDiscount: 10_000 }).total).toBe(0)
  })

  it('redeems gift points after the coupon', () => {
    const t = computeTotals(508, { couponDiscount: 100, useGiftPoints: true })
    expect(t.giftPoints).toBe(50)
    expect(t.total).toBe(508 + 61 - 100 - 50)
  })

  it('is zero for an empty cart', () => {
    expect(computeTotals(0).total).toBe(0)
  })
})

describe('filterBooks', () => {
  it('returns everything for an empty query', () => {
    expect(filterBooks(books, {})).toHaveLength(books.length)
  })

  it('filters by category and ignores "All"', () => {
    expect(filterBooks(books, { category: 'All' })).toHaveLength(books.length)
    expect(filterBooks(books, { category: 'Romance' }).map((b) => b.id)).toEqual([
      'beneath-the-stars',
    ])
  })

  it('searches title, author and tags case-insensitively', () => {
    expect(filterBooks(books, { search: 'MINIMALISM' }).map((b) => b.id)).toContain(
      'joy-of-minimalism',
    )
    expect(filterBooks(books, { search: 'daniel reed' })).toHaveLength(1)
    expect(filterBooks(books, { search: 'horror' }).length).toBeGreaterThan(1)
  })

  it('filters by format, language and price range', () => {
    expect(filterBooks(books, { format: 'eBook' }).every((b) => b.format === 'eBook')).toBe(true)
    expect(filterBooks(books, { language: 'Hindi' })).toHaveLength(1)
    expect(filterBooks(books, { priceRange: 'under-200' }).every((b) => b.price < 200)).toBe(true)
  })

  it('filters by tag', () => {
    expect(filterBooks(books, { tag: 'self help' }).length).toBeGreaterThanOrEqual(4)
  })

  it('sorts by price', () => {
    const prices = filterBooks(books, { sort: 'price-asc' }).map((b) => b.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('does not mutate the source list', () => {
    const before = books.map((b) => b.id)
    filterBooks(books, { sort: 'price-desc' })
    expect(books.map((b) => b.id)).toEqual(before)
  })
})

describe('rankRelatedBooks', () => {
  const joy = books.find((b) => b.id === 'joy-of-minimalism')!

  it('excludes the book itself and prefers the same category', () => {
    const related = rankRelatedBooks(joy, books)
    expect(related.find((b) => b.id === joy.id)).toBeUndefined()
    expect(related.slice(0, 3).every((b) => b.category === 'Self-help')).toBe(true)
  })

  it('boosts categories from order history', () => {
    const noHistory = rankRelatedBooks(joy, books)
    const withHistory = rankRelatedBooks(joy, books, ['Fantasy'])
    const idx = (list: typeof books) => list.findIndex((b) => b.category === 'Fantasy')
    expect(idx(withHistory)).toBeGreaterThanOrEqual(0)
    expect(idx(withHistory)).toBeLessThanOrEqual(idx(noHistory) === -1 ? Infinity : idx(noHistory))
  })
})
