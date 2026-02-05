import { z } from 'zod'

export const customCheckoutSchema = z.object({
  basePrice: z.number().positive('Prezzo base deve essere positivo'),
  customizations: z.record(z.any()).optional(),
  configuration: z.record(z.any()).optional(),
  imageUrls: z.array(z.string().url()).optional(),
  locale: z.string().optional(),
})

export type CustomCheckoutInput = z.infer<typeof customCheckoutSchema>
