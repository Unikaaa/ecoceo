import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'unread', 'read', 'in_elaboration', 'completed', o null per tutti

    let query = supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && ['unread', 'read', 'in_elaboration', 'completed'].includes(status)) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore recupero contatti:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero dei contatti.' },
        { status: 500 }
      )
    }

    // Conta per ogni stato
    const { data: counts } = await supabase
      .from('contacts')
      .select('status')

    const stats = {
      unread: counts?.filter(c => c.status === 'unread' || c.status === 'read').length || 0,
      in_elaboration: counts?.filter(c => c.status === 'in_elaboration').length || 0,
      completed: counts?.filter(c => c.status === 'completed').length || 0,
    }

    return NextResponse.json(
      { contacts: data || [], stats },
      { status: 200 }
    )
  } catch (error) {
    console.error('Errore API contatti:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei contatti.' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, status, assigned_to, reply_message } = body

    if (!id || !status || !['unread', 'read', 'in_elaboration', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: 'ID e status validi sono richiesti.' },
        { status: 400 }
      )
    }

    const updateData: any = { status }
    if (assigned_to !== undefined) updateData.assigned_to = assigned_to
    if (reply_message !== undefined) updateData.reply_message = reply_message
    if (status === 'completed' && reply_message) {
      updateData.replied_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('contacts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento contatto:', error)
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento del contatto.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { contact: data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Errore API contatti:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del contatto.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Configurazione database non valida.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID contatto richiesto.' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore eliminazione contatto:', error)
      return NextResponse.json(
        { error: 'Errore durante eliminazione contatto.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Errore API contatti DELETE:', error)
    return NextResponse.json(
      { error: 'Errore durante eliminazione contatto.' },
      { status: 500 }
    )
  }
}
