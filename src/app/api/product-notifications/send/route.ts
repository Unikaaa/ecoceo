import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Funzione per inviare email (da implementare con servizio email come Resend, SendGrid, ecc.)
async function sendEmailNotification(email: string, productName: string, productSlug: string) {
  // TODO: Implementare invio email con servizio esterno
  // Esempio con Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'UNIKA <noreply@unika.it>',
  //   to: email,
  //   subject: `Il prodotto ${productName} è di nuovo disponibile!`,
  //   html: `...`
  // })
  
  // Per ora, loggiamo l'email da inviare
  console.log(`📧 Email da inviare a ${email}: Prodotto ${productName} è di nuovo disponibile`)
  
  // In produzione, implementare qui l'invio email reale
  return true
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { product_id } = body

    if (!product_id) {
      return NextResponse.json(
        { error: 'product_id è obbligatorio' },
        { status: 400 }
      )
    }

    // Recupera il prodotto
    const { data: product, error: productError } = await supabase
      .from('inventory')
      .select('id, product_name, quantity, slug')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: 404 }
      )
    }

    // Verifica che il prodotto sia disponibile
    if (product.quantity <= 0) {
      return NextResponse.json(
        { error: 'Il prodotto non è disponibile' },
        { status: 400 }
      )
    }

    // Recupera tutte le notifiche non ancora inviate per questo prodotto
    const { data: notifications, error: notificationsError } = await supabase
      .from('product_notifications')
      .select('id, email')
      .eq('product_id', product_id)
      .eq('notified', false)

    if (notificationsError) {
      console.error('Errore recupero notifiche:', notificationsError)
      return NextResponse.json(
        { error: 'Errore nel recupero delle notifiche' },
        { status: 500 }
      )
    }

    if (!notifications || notifications.length === 0) {
      return NextResponse.json(
        { message: 'Nessuna notifica da inviare', sent: 0 },
        { status: 200 }
      )
    }

    // Genera lo slug del prodotto
    const productSlug = product.slug || product.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Invia email a tutti i clienti
    let sentCount = 0
    const errors: string[] = []

    for (const notification of notifications) {
      try {
        await sendEmailNotification(
          notification.email,
          product.product_name,
          productSlug
        )
        
        // Marca la notifica come inviata
        await supabase
          .from('product_notifications')
          .update({
            notified: true,
            notified_at: new Date().toISOString(),
          })
          .eq('id', notification.id)

        sentCount++
      } catch (error: any) {
        console.error(`Errore invio email a ${notification.email}:`, error)
        errors.push(notification.email)
      }
    }

    return NextResponse.json(
      {
        message: `Email inviate con successo`,
        sent: sentCount,
        total: notifications.length,
        errors: errors.length > 0 ? errors : undefined,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Errore API invio notifiche:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'invio delle notifiche' },
      { status: 500 }
    )
  }
}
