export type BookFormat = 'Paperback' | 'Hardcover' | 'eBook'
export type BookSection = 'recommended' | 'bestseller' | 'new' | 'explore'
export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'title'
export type PaymentMethod = 'credit-card' | 'debit-card' | 'upi' | 'wallet'

export interface CoverStyle {
  background: string
  color: string
  accent: string
}

export interface Author {
  id: string
  name: string
  bio: string
  avatarColor: string
}

export interface Book {
  id: string
  title: string
  author: Author
  description: string
  publisher: string
  format: BookFormat
  /** Display tags, e.g. ["Non-fiction", "Self Help"]. The first two drive the breadcrumb. */
  tags: string[]
  /** Sidebar category, e.g. "Self-help". */
  category: string
  language: string
  /** Price in INR. */
  price: number
  rating: number
  copiesSold: number
  section: BookSection
  cover: CoverStyle
  deliveryDays: number
}

export interface BookQuery {
  search?: string
  category?: string
  tag?: string
  language?: string
  format?: string
  priceRange?: string
  sort?: SortOption
}

export interface CartItem {
  bookId: string
  quantity: number
}

export interface Address {
  firstName: string
  lastName: string
  email: string
  addressLine: string
  city: string
  pin: string
  phoneCode: string
  phone: string
  state: string
  country: string
}

export interface Totals {
  subtotal: number
  tax: number
  delivery: number
  discount: number
  giftPoints: number
  total: number
}

export interface OrderItem {
  book: Book
  quantity: number
}

export interface Order {
  id: string
  createdAt: string
  items: OrderItem[]
  address: Address
  totals: Totals
  paymentMethod: PaymentMethod
}

export interface Review {
  id: string
  bookId: string
  author: string
  rating: number
  text: string
  createdAt: string
}

export interface CouponResult {
  code: string
  discount: number
}

export interface PaymentResult {
  paymentId: string
  status: 'success'
}
