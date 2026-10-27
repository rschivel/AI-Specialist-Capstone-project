import { z } from 'zod'

export const addressSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.email('Enter a valid e-mail address').max(100),
  addressLine: z.string().trim().min(5, 'Enter your delivery address').max(150),
  city: z.string().trim().min(1, 'City is required').max(60),
  pin: z.string().regex(/^\d{6}$/, 'Enter a 6-digit PIN code'),
  phoneCode: z.string().regex(/^\+\d{1,3}$/, 'Select a country code'),
  phone: z.string().regex(/^\d{10}$/, 'Enter a 10-digit phone number'),
  state: z.string().trim().min(1, 'State is required').max(60),
  country: z.string().trim().min(1, 'Country is required').max(60),
})

export type AddressFormValues = z.infer<typeof addressSchema>
