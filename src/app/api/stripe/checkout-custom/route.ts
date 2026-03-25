import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { customCheckoutSchema } from '@/lib/validations/checkout'
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
    
    // Validate input
    const validation = customCheckoutSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: validation.error.issues },
        { status: 400 }
      )
    }

    const { basePrice, customizations, configuration, imageUrls, locale = 'it' } = validation.data

    // Calculate total price (base + customizations)
    let totalPrice = basePrice
    if (customizations) {
      // Add customization prices
      Object.values(customizations).forEach((value: any) => {
        if (typeof value === 'object' && value.price) {
          totalPrice += value.price
        }
      })
    }

    // Validate total price
    if (totalPrice <= 0) {
      return NextResponse.json(
        { error: 'Prezzo totale deve essere positivo' },
        { status: 400 }
      )
    }

    // Prepare metadata (Stripe has 500 char limit per key)
    const metadata: Record<string, string> = {
      order_type: 'custom',
      base_price: basePrice.toString(),
      total_price: totalPrice.toString(),
    }

    // Add configuration (truncate if too long)
    if (configuration) {
      const configStr = JSON.stringify(configuration)
      if (configStr.length <= 500) {
        metadata.configuration = configStr
      } else {
        // Store in session metadata or external storage
        metadata.configuration_ref = `config_${Date.now()}`
      }
    }

    // Add customizations
    if (customizations) {
      const customStr = JSON.stringify(customizations)
      if (customStr.length <= 500) {
        metadata.customizations = customStr
      }
    }

    // Add image URLs (comma-separated, truncated if needed)
    if (imageUrls && imageUrls.length > 0) {
      const imageUrlsStr = imageUrls.join(',')
      if (imageUrlsStr.length <= 500) {
        metadata.image_urls = imageUrlsStr
      } else {
        // Store first few URLs
        metadata.image_urls = imageUrls.slice(0, 3).join(',')
      }
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Prodotto Personalizzato',
              description: configuration 
                ? `Configurazione: ${JSON.stringify(configuration).substring(0, 100)}...`
                : 'Prodotto ceramico personalizzato',
              images: imageUrls?.slice(0, 4) || [],
            },
            unit_amount: Math.round(totalPrice * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/checkout/cancel`,
      locale: locale === 'it' ? 'it' : locale === 'en' ? 'en' : 'auto',
      metadata,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe custom checkout error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
