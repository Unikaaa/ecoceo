import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// GET - Recupera contenuti Chi Siamo
export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Errore recupero about:', error)
      return NextResponse.json({ error: 'Errore nel recupero dei contenuti' }, { status: 500 })
    }

    return NextResponse.json({ sections: data || [] }, { status: 200 })
  } catch (error) {
    console.error('Errore API about:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// PATCH - Aggiorna contenuto
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('about_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento about:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento' }, { status: 500 })
    }

    return NextResponse.json({ section: data }, { status: 200 })
  } catch (error) {
    console.error('Errore API about:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
