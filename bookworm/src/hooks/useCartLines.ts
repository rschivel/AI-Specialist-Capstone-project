import { useMemo } from 'react'
import { useAsync } from './useAsync'
import { bookService } from '../services'
import { useCartStore } from '../store/cartStore'
import type { Book } from '../types'

export interface DetailedCartLine {
  book: Book
  quantity: number
}

/** Joins cart lines (ids + quantities) with catalogue data and computes line totals. */
export function useCartLines() {
  const items = useCartStore((s) => s.items)
  const { data: catalogue, loading, error } = useAsync(() => bookService.list(), [])

  const lines = useMemo<DetailedCartLine[]>(() => {
    const byId = new Map((catalogue ?? []).map((b) => [b.id, b]))
    return items.flatMap((i) => {
      const book = byId.get(i.bookId)
      return book ? [{ book, quantity: i.quantity }] : []
    })
  }, [catalogue, items])

  const subtotal = lines.reduce((sum, l) => sum + l.book.price * l.quantity, 0)
  return { lines, subtotal, loading, error }
}
