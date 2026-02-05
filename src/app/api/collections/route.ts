import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// GET - Recupera tutte le collezioni
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    // Query base - ordina per display_order
    let query = supabase
      .from('collections')
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })

    const { data, error } = await query

    // Filtra per is_active lato server se presente
    const filteredData = data?.filter((c: any) => {
      // Se is_active non esiste, mostra tutte le collezioni
      if (c.is_active === undefined) return true
      return c.is_active === true
    })

    if (error) {
      console.error('Errore recupero collezioni:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero delle collezioni' },
        { status: 500 }
      )
    }

    return NextResponse.json({ collections: filteredData || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API collezioni:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero delle collezioni' },
      { status: 500 }
    )
  }
}

// POST - Aggiunge una nuova collezione
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      image_url,
      hover_image_url,
      display_order,
      is_active,
    } = body

    // Validazione
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug sono obbligatori' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('collections')
      .insert([
        {
          name,
          slug,
          description: description || null,
          image_url: image_url || null,
          hover_image_url: hover_image_url || null,
          display_order: display_order || 0,
          is_active: is_active !== undefined ? is_active : true,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Errore inserimento collezione:', error)
      return NextResponse.json(
        { error: 'Errore nell\'inserimento della collezione' },
        { status: 500 }
      )
    }

    return NextResponse.json({ collection: data }, { status: 201 })
  } catch (error: any) {
    console.error('Errore API collezioni POST:', error)
    return NextResponse.json(
      { error: 'Errore nell\'inserimento della collezione' },
      { status: 500 }
    )
  }
}

// PATCH - Aggiorna una collezione esistente
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID collezione mancante' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento collezione:', error)
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento della collezione' },
        { status: 500 }
      )
    }

    return NextResponse.json({ collection: data }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API collezioni PATCH:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento della collezione' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina una collezione
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID collezione mancante' },
        { status: 400 }
      )
    }

    // Soft delete: imposta is_active = false invece di eliminare
    const { data, error } = await supabase
      .from('collections')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore eliminazione collezione:', error)
      return NextResponse.json(
        { error: 'Errore nell\'eliminazione della collezione' },
        { status: 500 }
      )
    }

    return NextResponse.json({ collection: data }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API collezioni DELETE:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione della collezione' },
      { status: 500 }
    )
  }
}
