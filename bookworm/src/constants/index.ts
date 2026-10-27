export const CATEGORIES = [
  'All',
  'Romance',
  'Mystery',
  'Science Fiction',
  'Fantasy',
  'Historical',
  'Biography',
  'Self-help',
  'Memoir',
  'Travel',
  'Cooking',
  "Children's",
  'Young Adult',
  'Comics & Graphic Novels',
  'Poetry',
  'Drama',
  'Science',
  'Philosophy',
  'Religion',
  'Language Learning',
] as const

export const LANGUAGES = ['English', 'Hindi'] as const
export const FORMATS = ['Paperback', 'Hardcover', 'eBook'] as const

export const PRICE_RANGES = [
  { value: 'all', label: 'All', min: 0, max: Number.POSITIVE_INFINITY },
  { value: 'under-200', label: 'Under ₹200', min: 0, max: 199 },
  { value: '200-349', label: '₹200 – ₹349', min: 200, max: 349 },
  { value: '350-plus', label: '₹350 & above', min: 350, max: Number.POSITIVE_INFINITY },
] as const

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'title', label: 'Title: A to Z' },
] as const

export const SECTIONS = [
  { id: 'recommended', title: 'Recommended for You' },
  { id: 'bestseller', title: 'Bestsellers this Month' },
  { id: 'new', title: 'New Launches' },
  { id: 'explore', title: 'More to Explore' },
] as const

export const PHONE_CODES = ['+91', '+1', '+44', '+61', '+971'] as const
export const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Australia', 'UAE'] as const
export const WALLETS = ['Paytm', 'PhonePe', 'Amazon Pay'] as const

/** Commerce rules. In production these live on the backend; the mock API reuses them. */
export const TAX_RATE = 0.12
export const DELIVERY_FEE = 40
export const FREE_DELIVERY_THRESHOLD = 300
export const MAX_QUANTITY = 10
export const GIFT_POINTS_BALANCE = 50
export const COUPONS: Readonly<Record<string, number>> = { BOOKWORM100: 100 }
