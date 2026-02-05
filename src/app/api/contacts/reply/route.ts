import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

// POST - Invia risposta email e aggiorna stato
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { contactId, replyMessage, assignedTo } = body

    if (!contactId || !replyMessage || !assignedTo) {
      return NextResponse.json(
        { error: 'ID contatto, messaggio di risposta e nome sono obbligatori.' },
        { status: 400 }
      )
    }

    // Recupera il contatto per ottenere l'email
    const { data: contact, error: contactError } = await supabase
      .from('contacts')
      .select('email, subject, message')
      .eq('id', contactId)
      .single()

    if (contactError || !contact) {
      return NextResponse.json(
        { error: 'Contatto non trovato.' },
        { status: 404 }
      )
    }

    // TODO: Invia email reale (per ora solo aggiorniamo il database)
    // In produzione, usa un servizio email come SendGrid, Resend, o Nodemailer
    
    // Aggiorna il contatto: sposta in 'completed' e salva la risposta
    const { data: updatedContact, error: updateError } = await supabase
      .from('contacts')
      .update({
        status: 'completed',
        assigned_to: assignedTo,
        reply_message: replyMessage,
        replied_at: new Date().toISOString(),
      })
      .eq('id', contactId)
      .select()
      .single()

    if (updateError) {
      console.error('Errore aggiornamento contatto:', updateError)
      return NextResponse.json(
        { error: 'Errore nell\'invio della risposta.' },
        { status: 500 }
      )
    }

    // TODO: Implementa invio email reale qui
    // Esempio con Nodemailer o servizio email:
    // await sendEmail({
    //   to: contact.email,
    //   subject: `Re: ${contact.subject}`,
    //   text: replyMessage,
    // })

    return NextResponse.json(
      { 
        success: true,
        contact: updatedContact,
        message: 'Risposta inviata con successo'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Errore API risposta contatto:', error)
    return NextResponse.json(
      { error: 'Errore nell\'invio della risposta.' },
      { status: 500 }
    )
  }
}

// PATCH - Salva risposta in bozza (in elaborazione)
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { contactId, replyMessage, assignedTo } = body

    if (!contactId || !assignedTo) {
      return NextResponse.json(
        { error: 'ID contatto e nome sono obbligatori.' },
        { status: 400 }
      )
    }

    // Aggiorna il contatto: sposta in 'in_elaboration' e salva la risposta in bozza
    const { data: updatedContact, error: updateError } = await supabase
      .from('contacts')
      .update({
        status: 'in_elaboration',
        assigned_to: assignedTo,
        reply_message: replyMessage || null, // Può essere null se non ha ancora scritto
      })
      .eq('id', contactId)
      .select()
      .single()

    if (updateError) {
      console.error('Errore aggiornamento contatto:', updateError)
      return NextResponse.json(
        { error: 'Errore nel salvataggio della bozza.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        contact: updatedContact,
        message: 'Bozza salvata'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Errore API salvataggio bozza:', error)
    return NextResponse.json(
      { error: 'Errore nel salvataggio della bozza.' },
      { status: 500 }
    )
  }
}
