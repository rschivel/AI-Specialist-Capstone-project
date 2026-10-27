import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios'
import { COUPONS, GIFT_POINTS_BALANCE, MAX_QUANTITY } from '../constants'
import { books, reviewSeed } from '../data/books'
import { orderRequestSchema, reviewSchema } from '../schemas/order'
import { paymentRequestSchema } from '../schemas/payment'
import type { Book, BookQuery, CouponResult, Order, PaymentResult, Review } from '../types'
import { filterBooks, rankRelatedBooks } from '../utils/bookFilters'
import { computeTotals } from '../utils/pricing'

/**
 * In-browser stand-in for the backend. It re-validates every payload with the same Zod schemas
 * a real server would use. Card details are validated and discarded - never stored or logged.
 */

const ORDERS_KEY = 'bookworm.orders'
const REVIEWS_KEY = 'bookworm.reviews'
const LATENCY_MS = 150

class HttpError extends Error {
  readonly status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const write = (key: string, value: unknown): void =>
  localStorage.setItem(key, JSON.stringify(value))

const findBook = (id: string): Book => {
  const book = books.find((b) => b.id === id)
  if (!book) throw new HttpError(404, 'Book not found')
  return book
}

const parseBody = (config: InternalAxiosRequestConfig): unknown => {
  if (typeof config.data !== 'string') return config.data
  try {
    return JSON.parse(config.data)
  } catch {
    throw new HttpError(400, 'Invalid request')
  }
}

function route(config: InternalAxiosRequestConfig): unknown {
  const method = (config.method ?? 'get').toLowerCase()
  const path = (config.url ?? '').split('?')[0]
  let m: RegExpExecArray | null

  if (method === 'get' && path === '/books') {
    return filterBooks(books, (config.params ?? {}) as BookQuery)
  }

  if (method === 'get' && (m = /^\/books\/([\w-]+)$/.exec(path))) {
    return findBook(m[1])
  }

  if (method === 'get' && (m = /^\/books\/([\w-]+)\/related$/.exec(path))) {
    const book = findBook(m[1])
    const orders = read<Order[]>(ORDERS_KEY, [])
    const purchased = orders.flatMap((o) => o.items.map((i) => i.book.category))
    return rankRelatedBooks(book, books, purchased).slice(0, 3)
  }

  if (method === 'get' && (m = /^\/books\/([\w-]+)\/reviews$/.exec(path))) {
    const id = m[1]
    return [...reviewSeed, ...read<Review[]>(REVIEWS_KEY, [])].filter((r) => r.bookId === id)
  }

  if (method === 'post' && (m = /^\/books\/([\w-]+)\/reviews$/.exec(path))) {
    const book = findBook(m[1])
    const parsed = reviewSchema.safeParse(parseBody(config))
    if (!parsed.success) throw new HttpError(422, 'Invalid review')
    const review: Review = {
      id: crypto.randomUUID(),
      bookId: book.id,
      author: 'You',
      rating: parsed.data.rating,
      text: parsed.data.text,
      createdAt: new Date().toISOString(),
    }
    write(REVIEWS_KEY, [...read<Review[]>(REVIEWS_KEY, []), review])
    return review
  }

  if (method === 'get' && path === '/orders') {
    return read<Order[]>(ORDERS_KEY, []).reverse()
  }

  if (method === 'post' && path === '/coupons/validate') {
    const body = parseBody(config) as { code?: unknown }
    const code = typeof body?.code === 'string' ? body.code.trim().toUpperCase() : ''
    const discount = Object.hasOwn(COUPONS, code) ? COUPONS[code] : undefined
    if (discount === undefined) throw new HttpError(404, 'Invalid coupon code')
    return { code, discount } satisfies CouponResult
  }

  if (method === 'post' && path === '/payments') {
    const parsed = paymentRequestSchema.safeParse(parseBody(config))
    if (!parsed.success) throw new HttpError(422, 'Payment details are invalid')
    return { paymentId: `pay_${crypto.randomUUID()}`, status: 'success' } satisfies PaymentResult
  }

  if (method === 'post' && path === '/orders') {
    const parsed = orderRequestSchema.safeParse(parseBody(config))
    if (!parsed.success) throw new HttpError(422, 'Order details are invalid')
    const { items, address, couponCode, useGiftPoints, paymentMethod } = parsed.data

    const lines = items.map((item) => ({
      book: findBook(item.bookId),
      quantity: Math.min(item.quantity, MAX_QUANTITY),
    }))
    const couponKey = couponCode?.toUpperCase() ?? ''
    const couponDiscount = Object.hasOwn(COUPONS, couponKey) ? COUPONS[couponKey] : 0
    const subtotal = lines.reduce((sum, l) => sum + l.book.price * l.quantity, 0)

    const order: Order = {
      id: `BW-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      items: lines,
      address,
      totals: computeTotals(subtotal, { couponDiscount, useGiftPoints }),
      paymentMethod,
    }
    write(ORDERS_KEY, [...read<Order[]>(ORDERS_KEY, []), order])
    return order
  }

  if (method === 'get' && path === '/rewards') {
    return { giftPoints: GIFT_POINTS_BALANCE }
  }

  throw new HttpError(404, 'Not found')
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))

  const respond = (status: number, data: unknown) => ({
    data,
    status,
    statusText: String(status),
    headers: {},
    config,
    request: {},
  })

  try {
    return respond(200, route(config))
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    const message = error instanceof HttpError ? error.message : 'Something went wrong'
    throw new AxiosError(message, String(status), config, {}, respond(status, { message }))
  }
}
