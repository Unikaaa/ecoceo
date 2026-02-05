import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rateLimit'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.ip || 'anonymous'
    const { success } = await rateLimit(identifier, 'contact', 5, 60) // 5 richieste per minuto

    if (!success) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra qualche minuto.' },
        { status: 429 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    // Validazione
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Tutti i campi obbligatori devono essere compilati.' },
        { status: 400 }
      )
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Indirizzo email non valido.' },
        { status: 400 }
      )
    }

    // Salva nel database
    const { data, error: dbError } = await supabase
      .from('contacts')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'unread',
      })
      .select()
      .single()

    if (dbError) {
      console.error('Errore salvataggio contatto:', dbError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio del messaggio. Riprova più tardi.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Messaggio inviato con successo!', id: data.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Errore invio contatto:', error)
    return NextResponse.json(
      { error: 'Errore nell\'invio del messaggio. Riprova più tardi.' },
      { status: 500 }
    )
  }
}
