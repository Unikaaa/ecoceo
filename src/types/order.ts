export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  type: 'standard' | 'custom'
  configuration?: Record<string, any>
  imageUrls?: string[]
}

export interface Address {
  name: string
  street: string
  city: string
  postalCode: string
  country: string
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  email: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  paymentIntentId: string
  createdAt: Date
  updatedAt: Date
  shippingAddress?: Address
  customProductConfig?: Record<string, any>
}

export interface CustomProductConfig {
  basePrice: number
  customizations: Record<string, any>
  configuration: Record<string, any>
  imageUrls: string[]
}
