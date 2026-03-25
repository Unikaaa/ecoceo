import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// In-memory store (replace with database)
const orders: any[] = []

const updateOrderSchema = z.object({
  status: z.enum(['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
  shippingAddress: z.object({
    name: z.string(),
    street: z.string(),
    city: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = orders.find((o) => o.id === params.id)
    
    if (!order) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get order' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = updateOrderSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.issues },
        { status: 400 }
      )
    }

    const orderIndex = orders.findIndex((o) => o.id === params.id)
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Ordine non trovato' }, { status: 404 })
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      ...validation.data,
      updatedAt: new Date(),
    }

    return NextResponse.json(orders[orderIndex])
  } catch (error: any) {
    console.error('Update order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    )
  }
}
