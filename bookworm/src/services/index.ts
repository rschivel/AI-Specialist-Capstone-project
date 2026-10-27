import { isAxiosError } from 'axios'
import type { PaymentRequest } from '../schemas/payment'
import type { OrderRequest } from '../schemas/order'
import type { Book, BookQuery, CouponResult, Order, PaymentResult, Review } from '../types'
import { apiClient } from './apiClient'

/** Turns any thrown value into a message that is safe to show to the user. */
export function getErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (
    isAxiosError<{ message?: string }>(error) &&
    error.response?.status &&
    error.response.status < 500
  ) {
    return error.response.data?.message ?? fallback
  }
  return fallback
}

export const bookService = {
  async list(query: BookQuery = {}): Promise<Book[]> {
    const { data } = await apiClient.get<Book[]>('/books', { params: query })
    return data
  },
  async get(id: string): Promise<Book> {
    const { data } = await apiClient.get<Book>(`/books/${encodeURIComponent(id)}`)
    return data
  },
  async related(id: string): Promise<Book[]> {
    const { data } = await apiClient.get<Book[]>(`/books/${encodeURIComponent(id)}/related`)
    return data
  },
  async reviews(id: string): Promise<Review[]> {
    const { data } = await apiClient.get<Review[]>(`/books/${encodeURIComponent(id)}/reviews`)
    return data
  },
  async addReview(id: string, review: { rating: number; text: string }): Promise<Review> {
    const { data } = await apiClient.post<Review>(
      `/books/${encodeURIComponent(id)}/reviews`,
      review,
    )
    return data
  },
}

export const orderService = {
  async list(): Promise<Order[]> {
    const { data } = await apiClient.get<Order[]>('/orders')
    return data
  },
  async create(request: OrderRequest): Promise<Order> {
    const { data } = await apiClient.post<Order>('/orders', request)
    return data
  },
  async validateCoupon(code: string): Promise<CouponResult> {
    const { data } = await apiClient.post<CouponResult>('/coupons/validate', { code })
    return data
  },
}

export const paymentService = {
  async pay(request: PaymentRequest): Promise<PaymentResult> {
    const { data } = await apiClient.post<PaymentResult>('/payments', request)
    return data
  },
}
