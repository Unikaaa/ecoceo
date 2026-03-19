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
    const styleId = searchParams.get('style_id')
    const categoryId = searchParams.get('category_id')
    const productTypeId = searchParams.get('product_type_id')

    if (id) {
      const { data, error } = await supabase
        .from('backgrounds')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        return NextResponse.json(
          { error: 'Sfondo non trovato' },
          { status: 404 }
        )
      }

      return NextResponse.json({ background: data })
    }

    const includeInactive = searchParams.get('include_inactive') === 'true'

    let query = supabase
      .from('backgrounds')
      .select('*')

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (styleId) {
      query = query.eq('style_id', styleId)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (productTypeId) {
      query = query.eq('product_type_id', productTypeId)
    }

    query = query.order('display_order', { ascending: true })
    let { data, error } = await query

    // Backward compatibility: se la colonna non esiste, riprova senza filtro
    if (error && productTypeId && `${error.message || ''}`.includes('product_type_id')) {
      let fallbackQuery: any = supabase
        .from('backgrounds')
        .select('*')
      if (!includeInactive) fallbackQuery = fallbackQuery.eq('is_active', true)
      if (styleId) fallbackQuery = fallbackQuery.eq('style_id', styleId)
      if (categoryId) fallbackQuery = fallbackQuery.eq('category_id', categoryId)
      const fallbackResult = await fallbackQuery.order('display_order', { ascending: true })
      data = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      console.error('Errore query sfondi:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento degli sfondi' },
        { status: 500 }
      )
    }

    return NextResponse.json({ backgrounds: data || [] })
  } catch (error: any) {
    console.error('Errore API sfondi:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento degli sfondi' },
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
    const { name, image_url, style_id, category_id, product_type_id, price_extra, is_active, display_order } = body

    if (!name || !image_url) {
      return NextResponse.json(
        { error: 'Nome e immagine sono obbligatori' },
        { status: 400 }
      )
    }

    const payload: any = {
      name,
      image_url,
      style_id: style_id || null,
      category_id: category_id || null,
      price_extra: parseFloat(price_extra) || 0,
      is_active: is_active !== false,
      display_order: display_order || 0,
    }
    if (product_type_id) payload.product_type_id = product_type_id

    let { data, error } = await supabase
      .from('backgrounds')
      .insert(payload)
      .select()
      .single()

    if (error && product_type_id && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackPayload } = payload
      const retry = await supabase.from('backgrounds').insert(fallbackPayload).select().single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore inserimento sfondo:', error)
      return NextResponse.json(
        { error: 'Errore durante il salvataggio dello sfondo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ background: data })
  } catch (error: any) {
    console.error('Errore API sfondi:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio dello sfondo' },
      { status: 500 }
    )
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
      return NextResponse.json({ error: 'ID sfondo richiesto' }, { status: 400 })
    }

    if (updates.price_extra !== undefined) {
      updates.price_extra = parseFloat(updates.price_extra) || 0
    }
    const hasProductTypeUpdate = Object.prototype.hasOwnProperty.call(updates, 'product_type_id')

    let { data, error } = await supabase
      .from('backgrounds')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error && hasProductTypeUpdate && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackUpdates } = updates
      const retry = await supabase
        .from('backgrounds')
        .update(fallbackUpdates)
        .eq('id', id)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore aggiornamento sfondo:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento dello sfondo' }, { status: 500 })
    }

    return NextResponse.json({ background: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento sfondo:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento dello sfondo' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID sfondo richiesto' }, { status: 400 })
    }

    // Prima elimina le configurazioni che referenziano questo sfondo
    await supabase
      .from('configurations')
      .delete()
      .eq('background_id', id)

    const { error } = await supabase.from('backgrounds').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione sfondo:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione dello sfondo. Potrebbe avere elementi collegati.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione sfondo:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione dello sfondo' }, { status: 500 })
  }
}
