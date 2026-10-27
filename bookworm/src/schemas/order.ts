import { z } from 'zod'
import { MAX_QUANTITY } from '../constants'
import { addressSchema } from './address'

export const orderRequestSchema = z.object({
  items: z
    .array(
      z.object({
        bookId: z.string().min(1),
        quantity: z.number().int().min(1).max(MAX_QUANTITY),
      }),
    )
    .min(1),
  address: addressSchema,
  couponCode: z.string().nullable(),
  useGiftPoints: z.boolean(),
  paymentId: z.string().min(1),
  paymentMethod: z.enum(['credit-card', 'debit-card', 'upi', 'wallet']),
})

export type OrderRequest = z.infer<typeof orderRequestSchema>

export const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Select a rating').max(5),
  text: z
    .string()
    .trim()
    .min(1, 'Write a short review')
    .max(100, 'Reviews are limited to 100 characters'),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
