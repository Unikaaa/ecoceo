import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { rateLimit, getClientIP } from '@/lib/rateLimit'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request)
    const limit = await rateLimit(clientIP, { windowMs: 60000, maxRequests: 5 })
    
    if (!limit.success) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova più tardi.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const body = await request.json()
    const { items, locale = 'it' } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      )
    }

    // Validate items structure
    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        return NextResponse.json(
          { error: 'Invalid item structure' },
          { status: 400 }
        )
      }
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Prepare order items with all necessary data for webhook
    // IMPORTANTE: Questi dati vengono passati al webhook tramite metadata
    const orderItemsForMetadata = items.map((item: any) => ({
      inventory_id: item.inventory_id || item.id, // UUID del prodotto in inventory
      product_name: item.name,
      section: item.section || item.category || 'generale',
      is_custom: item.is_custom || false,
      price: item.price,
      weight: item.weight || null,
      quantity: item.quantity,
    }))

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/checkout/cancel`,
      locale: locale === 'it' ? 'it' : locale === 'en' ? 'en' : 'auto',
      // Stripe raccoglie automaticamente i dati cliente (nome, email, indirizzo)
      // Il webhook li recupererà da session.customer_details
      metadata: {
        order_type: 'standard',
        order_items: JSON.stringify(orderItemsForMetadata),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
