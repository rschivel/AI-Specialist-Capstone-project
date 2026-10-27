import { describe, expect, it } from 'vitest'
import { addressSchema } from './address'
import { orderRequestSchema, reviewSchema } from './order'
import {
  cardSchema,
  isFutureExpiry,
  isValidLuhn,
  paymentRequestSchema,
  upiSchema,
  walletSchema,
} from './payment'

const validAddress = {
  firstName: 'Asha',
  lastName: 'Rao',
  email: 'asha@example.com',
  addressLine: '12 MG Road',
  city: 'Bengaluru',
  pin: '560001',
  phoneCode: '+91',
  phone: '9876543210',
  state: 'Karnataka',
  country: 'India',
}

describe('addressSchema', () => {
  it('accepts a valid address', () => {
    expect(addressSchema.safeParse(validAddress).success).toBe(true)
  })

  it.each([
    ['firstName', ''],
    ['email', 'not-an-email'],
    ['pin', '12345'],
    ['pin', 'abcdef'],
    ['phone', '123'],
    ['city', '   '],
  ])('rejects invalid %s (%s)', (field, value) => {
    expect(addressSchema.safeParse({ ...validAddress, [field]: value }).success).toBe(false)
  })
})

describe('card validation helpers', () => {
  it('validates card numbers with the Luhn checksum', () => {
    expect(isValidLuhn('4242424242424242')).toBe(true)
    expect(isValidLuhn('4242424242424241')).toBe(false)
  })

  it('treats the expiry month as still valid until it ends', () => {
    const now = new Date(2025, 6, 15)
    expect(isFutureExpiry('07/2025', now)).toBe(true)
    expect(isFutureExpiry('06/2025', now)).toBe(false)
    expect(isFutureExpiry('13/2030', now)).toBe(false)
    expect(isFutureExpiry('7/2030', now)).toBe(false)
  })
})

describe('cardSchema', () => {
  const valid = {
    cardNumber: '4242 4242 4242 4242',
    nameOnCard: 'Asha Rao',
    cvv: '123',
    expiry: '12/2099',
  }

  it('accepts valid details, including spaced card numbers', () => {
    expect(cardSchema.safeParse(valid).success).toBe(true)
  })

  it.each([
    ['cardNumber', '1234 5678 9012 3456'],
    ['cardNumber', 'abcd'],
    ['nameOnCard', 'A1'],
    ['cvv', '12'],
    ['cvv', 'abc'],
    ['expiry', '01/2020'],
    ['expiry', '2030-01'],
  ])('rejects invalid %s (%s)', (field, value) => {
    expect(cardSchema.safeParse({ ...valid, [field]: value }).success).toBe(false)
  })
})

describe('upiSchema and walletSchema', () => {
  it('validates UPI ids', () => {
    expect(upiSchema.safeParse({ upiId: 'asha.rao@okbank' }).success).toBe(true)
    expect(upiSchema.safeParse({ upiId: 'asha' }).success).toBe(false)
    expect(upiSchema.safeParse({ upiId: 'a b@bank' }).success).toBe(false)
  })

  it('only accepts known wallets', () => {
    expect(walletSchema.safeParse({ wallet: 'Paytm' }).success).toBe(true)
    expect(walletSchema.safeParse({ wallet: '' }).success).toBe(false)
    expect(walletSchema.safeParse({ wallet: 'Unknown' }).success).toBe(false)
  })
})

describe('paymentRequestSchema', () => {
  it('requires details matching the chosen method', () => {
    expect(
      paymentRequestSchema.safeParse({ method: 'upi', amount: 100, details: { upiId: 'a1@bank' } })
        .success,
    ).toBe(true)
    expect(
      paymentRequestSchema.safeParse({ method: 'upi', amount: 100, details: { wallet: 'Paytm' } })
        .success,
    ).toBe(false)
  })

  it('rejects non-positive amounts', () => {
    expect(
      paymentRequestSchema.safeParse({ method: 'wallet', amount: 0, details: { wallet: 'Paytm' } })
        .success,
    ).toBe(false)
  })
})

describe('orderRequestSchema', () => {
  const base = {
    items: [{ bookId: 'joy-of-minimalism', quantity: 1 }],
    address: validAddress,
    couponCode: null,
    useGiftPoints: false,
    paymentId: 'pay_1',
    paymentMethod: 'upi',
  }

  it('accepts a valid order and rejects empty or oversized carts', () => {
    expect(orderRequestSchema.safeParse(base).success).toBe(true)
    expect(orderRequestSchema.safeParse({ ...base, items: [] }).success).toBe(false)
    expect(
      orderRequestSchema.safeParse({ ...base, items: [{ bookId: 'x', quantity: 99 }] }).success,
    ).toBe(false)
  })
})

describe('reviewSchema', () => {
  it('requires a rating and 1-100 characters of text', () => {
    expect(reviewSchema.safeParse({ rating: 5, text: 'Great' }).success).toBe(true)
    expect(reviewSchema.safeParse({ rating: 0, text: 'Great' }).success).toBe(false)
    expect(reviewSchema.safeParse({ rating: 5, text: '   ' }).success).toBe(false)
    expect(reviewSchema.safeParse({ rating: 5, text: 'x'.repeat(101) }).success).toBe(false)
  })
})
