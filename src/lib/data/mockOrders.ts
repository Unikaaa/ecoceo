import { Order } from '@/types/order'

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-20240115-0001',
    email: 'cliente@example.com',
    items: [
      {
        productId: '1',
        name: 'Vaso Terracotta Classico',
        price: 45.0,
        quantity: 1,
        type: 'standard',
      },
    ],
    total: 55.0, // 45 + 10 shipping
    status: 'paid',
    paymentIntentId: 'pi_test_123',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
]
