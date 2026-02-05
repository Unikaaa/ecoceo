import { NextRequest, NextResponse } from 'next/server'
import { Order, OrderItem } from '@/types/order'
import { generateOrderNumber } from '@/lib/utils/order'
import { z } from 'zod'

const createOrderSchema = z.object({
  email: z.string().email(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    type: z.enum(['standard', 'custom']),
    configuration: z.record(z.any()).optional(),
    imageUrls: z.array(z.string()).optional(),
  })),
  total: z.number().positive(),
  paymentIntentId: z.string(),
  customProductConfig: z.record(z.any()).optional(),
})

// In-memory store for development (replace with database in production)
const orders: Order[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = createOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, items, total, paymentIntentId, customProductConfig } = validation.data

    // Check if order already exists (idempotency)
    const existingOrder = orders.find((o) => o.paymentIntentId === paymentIntentId)
    if (existingOrder) {
      return NextResponse.json(existingOrder, { status: 200 })
    }

    // Create new order
    const order: Order = {
      id: `order_${Date.now()}`,
      orderNumber: generateOrderNumber(),
      email,
      items: items as OrderItem[],
      total,
      status: 'pending',
      paymentIntentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      customProductConfig,
    }

    // Save order (in production, save to database)
    orders.push(order)

    return NextResponse.json(order, { status: 201 })
  } catch (error: any) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const orderNumber = searchParams.get('orderNumber')
    const paymentIntentId = searchParams.get('paymentIntentId')

    if (orderId) {
      const order = orders.find((o) => o.id === orderId)
      if (!order) {
        return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    if (orderNumber) {
      const order = orders.find((o) => o.orderNumber === orderNumber)
      if (!order) {
        return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    if (paymentIntentId) {
      const order = orders.find((o) => o.paymentIntentId === paymentIntentId)
      if (!order) {
        return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
      }
      return NextResponse.json(order)
    }

    // Return all orders (in production, add pagination and filters)
    return NextResponse.json(orders)
  } catch (error: any) {
    console.error('Get orders error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get orders' },
      { status: 500 }
    )
  }
}
