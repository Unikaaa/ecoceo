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
    const ids = searchParams.get('ids')
    const styleId = searchParams.get('style_id')
    const categoryId = searchParams.get('category_id')
    const productTypeId = searchParams.get('product_type_id')

    const includeInactive = searchParams.get('include_inactive') === 'true'

    let query = supabase
      .from('decorations')
      .select('*')

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (ids) {
      const idArray = ids.split(',')
      query = query.in('id', idArray)
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
        .from('decorations')
        .select('*')
      if (!includeInactive) fallbackQuery = fallbackQuery.eq('is_active', true)
      if (ids) fallbackQuery = fallbackQuery.in('id', ids.split(','))
      if (styleId) fallbackQuery = fallbackQuery.eq('style_id', styleId)
      if (categoryId) fallbackQuery = fallbackQuery.eq('category_id', categoryId)
      const fallbackResult = await fallbackQuery.order('display_order', { ascending: true })
      data = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      console.error('Errore query decorazioni:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento delle decorazioni' },
        { status: 500 }
      )
    }

    return NextResponse.json({ decorations: data || [] })
  } catch (error: any) {
    console.error('Errore API decorazioni:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento delle decorazioni' },
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
      .from('decorations')
      .insert(payload)
      .select()
      .single()

    if (error && product_type_id && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackPayload } = payload
      const retry = await supabase.from('decorations').insert(fallbackPayload).select().single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore inserimento decorazione:', error)
      return NextResponse.json(
        { error: 'Errore durante il salvataggio della decorazione' },
        { status: 500 }
      )
    }

    return NextResponse.json({ decoration: data })
  } catch (error: any) {
    console.error('Errore API decorazioni:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio della decorazione' },
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
      return NextResponse.json({ error: 'ID decorazione richiesto' }, { status: 400 })
    }

    if (updates.price_extra !== undefined) {
      updates.price_extra = parseFloat(updates.price_extra) || 0
    }
    const hasProductTypeUpdate = Object.prototype.hasOwnProperty.call(updates, 'product_type_id')

    let { data, error } = await supabase
      .from('decorations')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error && hasProductTypeUpdate && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackUpdates } = updates
      const retry = await supabase
        .from('decorations')
        .update(fallbackUpdates)
        .eq('id', id)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore aggiornamento decorazione:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento della decorazione' }, { status: 500 })
    }

    return NextResponse.json({ decoration: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento decorazione:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento della decorazione' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID decorazione richiesto' }, { status: 400 })
    }

    // Decorazioni non hanno FK diretta in configurations, ma puliamo per sicurezza
    const { error } = await supabase.from('decorations').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione decorazione:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione della decorazione. Potrebbe avere elementi collegati.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione decorazione:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione della decorazione' }, { status: 500 })
  }
}
