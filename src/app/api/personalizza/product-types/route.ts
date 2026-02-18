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
    const categoryId = searchParams.get('category_id')
    const includeInactive = searchParams.get('include_inactive') === 'true'

    let query = supabase
      .from('product_types')
      .select('*')

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    query = query.order('display_order', { ascending: true })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore query tipi prodotto:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento dei tipi prodotto' },
        { status: 500 }
      )
    }

    return NextResponse.json({ productTypes: data || [] })
  } catch (error: any) {
    console.error('Errore API tipi prodotto:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento dei tipi prodotto' },
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
    const { category_id, name, slug, description, thumbnail_url, is_active, display_order } = body

    if (!category_id || !name || !slug) {
      return NextResponse.json({ error: 'Categoria, nome e slug sono obbligatori' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('product_types')
      .insert({
        category_id,
        name,
        slug,
        description: description || null,
        thumbnail_url: thumbnail_url || null,
        is_active: is_active !== false,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Errore creazione tipo prodotto:', error)
      return NextResponse.json({ error: 'Errore durante la creazione del tipo prodotto' }, { status: 500 })
    }

    return NextResponse.json({ productType: data })
  } catch (error: any) {
    console.error('Errore API creazione tipo prodotto:', error)
    return NextResponse.json({ error: 'Errore durante la creazione del tipo prodotto' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID tipo prodotto richiesto' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento tipo prodotto:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento del tipo prodotto' }, { status: 500 })
    }

    return NextResponse.json({ productType: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento tipo prodotto:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento del tipo prodotto' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID tipo prodotto richiesto' }, { status: 400 })
    }

    // Prima elimina le configurazioni che referenziano questo tipo prodotto
    await supabase
      .from('configurations')
      .delete()
      .eq('product_type_id', id)

    const { error } = await supabase.from('product_types').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione tipo prodotto:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione del tipo prodotto. Potrebbe avere elementi collegati.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione tipo prodotto:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione del tipo prodotto' }, { status: 500 })
  }
}
