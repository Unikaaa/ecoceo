import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const { data, error } = await supabase
        .from('sizes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Dimensione non trovata' },
          { status: 404 }
        )
      }

      return NextResponse.json({ size: data })
    }

    const includeInactive = searchParams.get('include_inactive') === 'true'

    let sizesQuery = supabase
      .from('sizes')
      .select('*')

    if (!includeInactive) {
      sizesQuery = sizesQuery.eq('is_active', true)
    }

    const { data, error } = await sizesQuery
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Errore query dimensioni:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento delle dimensioni' },
        { status: 500 }
      )
    }

    return NextResponse.json({ sizes: data || [] })
  } catch (error: any) {
    console.error('Errore API dimensioni:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento delle dimensioni' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { name, width_cm, height_cm, base_price, is_active, display_order } = body

    if (!name || !width_cm || !height_cm) {
      return NextResponse.json({ error: 'Nome, larghezza e altezza sono obbligatori' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('sizes')
      .insert({
        name,
        width_cm: parseFloat(width_cm) || 0,
        height_cm: parseFloat(height_cm) || 0,
        base_price: parseFloat(base_price) || 0,
        is_active: is_active !== false,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Errore creazione dimensione:', error)
      return NextResponse.json({ error: 'Errore durante la creazione della dimensione' }, { status: 500 })
    }

    return NextResponse.json({ size: data })
  } catch (error: any) {
    console.error('Errore API creazione dimensione:', error)
    return NextResponse.json({ error: 'Errore durante la creazione della dimensione' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID dimensione richiesto' }, { status: 400 })
    }

    if (updates.width_cm !== undefined) updates.width_cm = parseFloat(updates.width_cm) || 0
    if (updates.height_cm !== undefined) updates.height_cm = parseFloat(updates.height_cm) || 0
    if (updates.base_price !== undefined) updates.base_price = parseFloat(updates.base_price) || 0

    const { data, error } = await supabase
      .from('sizes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento dimensione:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento della dimensione' }, { status: 500 })
    }

    return NextResponse.json({ size: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento dimensione:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento della dimensione' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID dimensione richiesto' }, { status: 400 })
    }

    // Prima elimina le configurazioni che referenziano questa dimensione
    await supabase
      .from('configurations')
      .delete()
      .eq('size_id', id)

    const { error } = await supabase.from('sizes').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione dimensione:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione della dimensione. Potrebbe avere elementi collegati.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione dimensione:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione della dimensione' }, { status: 500 })
  }
}
