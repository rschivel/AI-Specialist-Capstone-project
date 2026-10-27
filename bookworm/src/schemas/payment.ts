import { z } from 'zod'
import { WALLETS } from '../constants'

const normaliseCardNumber = (value: string): string => value.replace(/[\s-]/g, '')

/** Luhn checksum used by all major card networks. */
export function isValidLuhn(digits: string): boolean {
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i])
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

export function isFutureExpiry(value: string, now: Date = new Date()): boolean {
  const match = /^(0[1-9]|1[0-2])\/(\d{4})$/.exec(value)
  if (!match) return false
  const year = Number(match[2])
  const month = Number(match[1])
  // A card is valid through the last day of its expiry month.
  return new Date(year, month, 1).getTime() > now.getTime()
}

export const cardSchema = z.object({
  cardNumber: z
    .string()
    .refine(
      (v) => /^\d{13,19}$/.test(normaliseCardNumber(v)) && isValidLuhn(normaliseCardNumber(v)),
      'Enter a valid card number',
    ),
  nameOnCard: z
    .string()
    .trim()
    .min(2, 'Enter the name on the card')
    .max(60)
    .regex(/^[A-Za-z .'-]+$/, 'Name can contain only letters'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Enter a 3 or 4 digit CVV'),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{4}$/, 'Use the format MM/YYYY')
    .refine((v) => isFutureExpiry(v), 'This card has expired'),
})

export const upiSchema = z.object({
  upiId: z.string().regex(/^[a-zA-Z0-9._-]{2,64}@[a-zA-Z]{2,32}$/, 'Enter a valid UPI ID'),
})

export const walletSchema = z.object({
  wallet: z.enum(WALLETS, 'Select a wallet'),
})

export type CardFormValues = z.infer<typeof cardSchema>
export type UpiFormValues = z.infer<typeof upiSchema>
export type WalletFormValues = z.infer<typeof walletSchema>

const amount = z.number().positive()

export const paymentRequestSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('credit-card'), amount, details: cardSchema }),
  z.object({ method: z.literal('debit-card'), amount, details: cardSchema }),
  z.object({ method: z.literal('upi'), amount, details: upiSchema }),
  z.object({ method: z.literal('wallet'), amount, details: walletSchema }),
])

export type PaymentRequest = z.infer<typeof paymentRequestSchema>
