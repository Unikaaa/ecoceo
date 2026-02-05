import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// GET: Verifica se esiste già una notifica per un prodotto e email
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const product_id = searchParams.get('product_id')
    const email = searchParams.get('email')

    if (!product_id || !email) {
      return NextResponse.json(
        { error: 'product_id e email sono obbligatori' },
        { status: 400 }
      )
    }

    // Verifica se esiste già una notifica
    const { data: existingNotification, error } = await supabase
      .from('product_notifications')
      .select('id, email, notified, created_at')
      .eq('product_id', product_id)
      .eq('email', email.trim().toLowerCase())
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Errore verifica notifica:', error)
      return NextResponse.json(
        { error: 'Errore durante la verifica' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        exists: !!existingNotification,
        notification: existingNotification || null
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Errore API verifica notifica:', error)
    return NextResponse.json(
      { error: 'Errore durante la verifica' },
      { status: 500 }
    )
  }
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
    const { product_id, email } = body

    if (!product_id || !email) {
      return NextResponse.json(
        { error: 'product_id e email sono obbligatori' },
        { status: 400 }
      )
    }

    // Valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    // Verifica che il prodotto esista
    const { data: product, error: productError } = await supabase
      .from('inventory')
      .select('id, product_name, quantity')
      .eq('id', product_id)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: 404 }
      )
    }

    // Se il prodotto è già disponibile, non serve registrare la notifica
    if (product.quantity > 0) {
      return NextResponse.json(
        { error: 'Il prodotto è già disponibile' },
        { status: 400 }
      )
    }

    // Verifica se esiste già una notifica per questo prodotto e email
    const { data: existingNotification } = await supabase
      .from('product_notifications')
      .select('id, email, notified')
      .eq('product_id', product_id)
      .eq('email', email.trim().toLowerCase())
      .single()

    // Se esiste già, aggiorna solo se necessario (resetta notified se era già notificato)
    if (existingNotification) {
      if (existingNotification.notified) {
        // Se era già notificato, resetta per permettere nuova notifica
        const { data, error } = await supabase
          .from('product_notifications')
          .update({
            notified: false,
            notified_at: null,
          })
          .eq('id', existingNotification.id)
          .select()
          .single()

        if (error) {
          console.error('Errore aggiornamento notifica:', error)
          return NextResponse.json(
            { error: 'Errore durante l\'aggiornamento della notifica' },
            { status: 500 }
          )
        }

        return NextResponse.json(
          { 
            message: 'Notifica già registrata, aggiornata con successo',
            notification: data,
            alreadyExists: true
          },
          { status: 200 }
        )
      } else {
        // Già registrata e non ancora notificata, ritorna successo
        return NextResponse.json(
          { 
            message: 'Notifica già registrata',
            notification: existingNotification,
            alreadyExists: true
          },
          { status: 200 }
        )
      }
    }

    // Inserisci nuova notifica
    const { data, error } = await supabase
      .from('product_notifications')
      .insert({
        product_id,
        email: email.trim().toLowerCase(),
        notified: false,
        notified_at: null,
      })
      .select()
      .single()

    if (error) {
      // Se l'errore è di violazione UNIQUE, significa che è stata inserita nel frattempo
      if (error.code === '23505') {
        return NextResponse.json(
          { 
            message: 'Notifica già registrata',
            alreadyExists: true
          },
          { status: 200 }
        )
      }
      
      console.error('Errore salvataggio notifica:', error)
      return NextResponse.json(
        { error: 'Errore durante la registrazione della notifica' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Notifica registrata con successo',
        notification: data 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Errore API notifiche prodotto:', error)
    return NextResponse.json(
      { error: 'Errore durante la registrazione della notifica' },
      { status: 500 }
    )
  }
}
