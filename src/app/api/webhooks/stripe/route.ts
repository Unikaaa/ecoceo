import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

// ============================================
// CONFIGURAZIONE STRIPE
// ============================================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// ============================================
// CONFIGURAZIONE SUPABASE
// ============================================
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('⚠️ Supabase non configurato. Verifica NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// ============================================
// INTERFACCE TYPESCRIPT
// ============================================
interface OrderItemMetadata {
  inventory_id: string
  product_name: string
  section: string
  is_custom: boolean
  price: number
  weight?: number | null
  quantity: number
}

interface CustomerDetails {
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  address: string
}

// ============================================
// FUNZIONE: Estrai Dati Cliente da Session
// ============================================
function extractCustomerDetails(session: Stripe.Checkout.Session): CustomerDetails {
  const customerDetails = session.customer_details
  
  // Estrai nome e cognome
  let first_name = 'Cliente'
  let last_name = ''
  
  if (customerDetails?.name) {
    const nameParts = customerDetails.name.trim().split(/\s+/)
    first_name = nameParts[0] || 'Cliente'
    last_name = nameParts.slice(1).join(' ') || ''
  }
  
  // Estrai email
  const email = session.customer_email || customerDetails?.email || null
  
  // Estrai telefono
  const phone = customerDetails?.phone || null
  
  // Formatta indirizzo
  let address = 'Indirizzo non fornito'
  if (customerDetails?.address) {
    const addr = customerDetails.address
    const addressParts = [
      addr.line1,
      addr.line2,
      addr.city,
      addr.state,
      addr.postal_code,
      addr.country
    ].filter(Boolean)
    address = addressParts.join(', ') || 'Indirizzo non fornito'
  }
  
  return {
    first_name,
    last_name,
    email,
    phone,
    address,
  }
}

// ============================================
// FUNZIONE: Verifica Idempotenza
// ============================================
async function checkIdempotency(sessionId: string, paymentIntentId: string | null): Promise<string | null> {
  if (!supabase) {
    throw new Error('Supabase non configurato')
  }
  
  // Cerca ordine esistente per session_id
  const { data: existingBySession } = await supabase
    .from('orders')
    .select('id, order_number')
    .eq('stripe_session_id', sessionId)
    .single()
  
  if (existingBySession) {
    console.log(`✅ Ordine già processato per session ${sessionId}: ${existingBySession.order_number}`)
    return existingBySession.id
  }
  
  // Se c'è payment_intent_id, cerca anche per quello
  if (paymentIntentId) {
    const { data: existingByPayment } = await supabase
      .from('orders')
      .select('id, order_number')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single()
    
    if (existingByPayment) {
      console.log(`✅ Ordine già processato per payment_intent ${paymentIntentId}: ${existingByPayment.order_number}`)
      return existingByPayment.id
    }
  }
  
  return null
}

// ============================================
// FUNZIONE: Genera Order Number
// ============================================
async function generateOrderNumber(): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase non configurato')
  }
  
  const { data, error } = await supabase.rpc('generate_order_number')
  
  if (error) {
    console.error('Errore generazione order_number:', error)
    throw new Error(`Errore generazione order_number: ${error.message}`)
  }
  
  return data as string
}

// ============================================
// FUNZIONE: Crea Ordine e Order Items
// ============================================
async function createOrderAndItems(
  customer: CustomerDetails,
  orderItems: OrderItemMetadata[],
  totalPrice: number,
  sessionId: string,
  paymentIntentId: string | null
): Promise<string> {
  if (!supabase) {
    throw new Error('Supabase non configurato')
  }
  
  // Genera order_number
  const orderNumber = await generateOrderNumber()
  
  // Crea ordine
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      total_price: totalPrice,
      order_status: 'open',
      stripe_payment_intent_id: paymentIntentId,
      stripe_session_id: sessionId,
    })
    .select('id')
    .single()
  
  if (orderError) {
    // Se errore di duplicato (idempotenza), cerca l'ordine esistente
    if (orderError.code === '23505') { // Unique violation
      console.log('⚠️ Tentativo di creare ordine duplicato, cerco ordine esistente...')
      const existingOrderId = await checkIdempotency(sessionId, paymentIntentId)
      if (existingOrderId) {
        return existingOrderId
      }
    }
    console.error('Errore creazione ordine:', orderError)
    throw new Error(`Errore creazione ordine: ${orderError.message}`)
  }
  
  const orderId = order.id
  
  // Crea order_items (per ogni item, crea N righe in base a quantity)
  const itemsToInsert: any[] = []
  
  for (const item of orderItems) {
    // Crea una riga per ogni quantità
    for (let i = 0; i < item.quantity; i++) {
      itemsToInsert.push({
        order_id: orderId,
        inventory_id: item.inventory_id,
        product_name: item.product_name,
        section: item.section,
        is_custom: item.is_custom,
        price: item.price,
        weight: item.weight || null,
        availability_status: 'available',
        production_status: 'to_create',
        shipping_status: 'not_shipped',
      })
    }
  }
  
  // Inserisci tutti gli order_items
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(itemsToInsert)
  
  if (itemsError) {
    console.error('Errore creazione order_items:', itemsError)
    // Rollback: elimina l'ordine creato
    await supabase.from('orders').delete().eq('id', orderId)
    throw new Error(`Errore creazione order_items: ${itemsError.message}`)
  }
  
  console.log(`✅ Ordine ${orderNumber} creato con ${itemsToInsert.length} righe ordine`)
  
  return orderId
}

// ============================================
// FUNZIONE: Scala Magazzino
// ============================================
async function processInventory(orderId: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase non configurato')
  }
  
  // Chiama la funzione SQL process_paid_order
  const { error } = await supabase.rpc('process_paid_order', {
    p_order_id: orderId,
  })
  
  if (error) {
    console.error('Errore scalamento magazzino:', error)
    throw new Error(`Errore scalamento magazzino: ${error.message}`)
  }
  
  console.log(`✅ Magazzino scalato per ordine ${orderId}`)
}

// ============================================
// FUNZIONE PRINCIPALE: Gestisci Checkout Completed
// ============================================
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    // 1. Verifica che il pagamento sia riuscito
    if (session.payment_status !== 'paid') {
      console.log(`⚠️ Pagamento non completato per session ${session.id}: status = ${session.payment_status}`)
      return
    }
    
    // 2. Verifica idempotenza
    const sessionId = session.id
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : null
    
    const existingOrderId = await checkIdempotency(sessionId, paymentIntentId)
    if (existingOrderId) {
      console.log(`✅ Ordine già processato, skip. Order ID: ${existingOrderId}`)
      return
    }
    
    // 3. Estrai dati cliente
    const customer = extractCustomerDetails(session)
    console.log(`📦 Processando ordine per: ${customer.first_name} ${customer.last_name} (${customer.email})`)
    
    // 4. Estrai dati ordine da metadata
    const metadata = session.metadata || {}
    const orderItemsJson = metadata.order_items
    
    if (!orderItemsJson) {
      throw new Error('Metadata order_items mancante nella session Stripe')
    }
    
    let orderItems: OrderItemMetadata[]
    try {
      orderItems = JSON.parse(orderItemsJson)
    } catch (parseError) {
      throw new Error(`Errore parsing order_items: ${parseError}`)
    }
    
    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      throw new Error('order_items deve essere un array non vuoto')
    }
    
    // 5. Calcola total_price
    const totalPrice = (session.amount_total || 0) / 100
    
    // 6. Crea ordine e order_items (in una transazione implicita)
    const orderId = await createOrderAndItems(
      customer,
      orderItems,
      totalPrice,
      sessionId,
      paymentIntentId
    )
    
    // 7. Scala magazzino (usa la funzione SQL atomica)
    await processInventory(orderId)
    
    // 8. Log successo
    const { data: order } = await supabase!
      .from('orders')
      .select('order_number')
      .eq('id', orderId)
      .single()
    
    console.log(`✅ Ordine ${order?.order_number} processato con successo!`)
    
  } catch (error: any) {
    console.error('❌ Errore processamento checkout:', error)
    // Rilancia errore per permettere retry da Stripe
    throw error
  }
}

// ============================================
// ROUTE HANDLER PRINCIPALE
// ============================================
export async function POST(request: NextRequest) {
  // 1. Leggi body come testo (necessario per verifica signature)
  const body = await request.text()
  
  // 2. Recupera signature header
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')
  
  if (!signature) {
    console.error('❌ Webhook senza signature')
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }
  
  // 3. Verifica signature Stripe
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error('❌ Errore verifica signature webhook:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }
  
  // 4. Gestisci evento
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session)
        break
      
      case 'payment_intent.succeeded':
        console.log('✅ Payment intent succeeded:', event.data.object.id)
        // Questo evento è già gestito da checkout.session.completed
        break
      
      case 'payment_intent.payment_failed':
        console.log('❌ Payment failed:', event.data.object.id)
        // Log per monitoraggio, ma non creiamo ordini
        break
      
      default:
        console.log(`ℹ️ Evento non gestito: ${event.type}`)
    }
    
    // 5. Sempre ritorna 200 a Stripe (anche in caso di errore interno)
    // Stripe ritenterà automaticamente se necessario
    return NextResponse.json({ received: true })
    
  } catch (error: any) {
    console.error('❌ Errore processamento webhook:', error)
    // Ritorna 200 per evitare retry infiniti, ma logga l'errore
    // In produzione, considera di inviare alert
    return NextResponse.json(
      { error: error.message, received: true },
      { status: 200 }
    )
  }
}
