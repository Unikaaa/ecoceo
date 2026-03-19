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
    const includeInactive = searchParams.get('include_inactive') === 'true'
    const productTypeId = searchParams.get('product_type_id')

    let query: any = supabase
      .from('styles')
      .select('*')

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    if (productTypeId) {
      query = query.eq('product_type_id', productTypeId)
    }

    let { data, error } = await query
      .order('display_order', { ascending: true })

    // Backward compatibility: se la colonna non esiste, riprova senza filtro
    if (error && productTypeId && `${error.message || ''}`.includes('product_type_id')) {
      let fallbackQuery: any = supabase
        .from('styles')
        .select('*')
      if (!includeInactive) {
        fallbackQuery = fallbackQuery.eq('is_active', true)
      }
      const fallbackResult = await fallbackQuery.order('display_order', { ascending: true })
      data = fallbackResult.data
      error = fallbackResult.error
    }

    if (error) {
      console.error('Errore query stili:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento degli stili' },
        { status: 500 }
      )
    }

    return NextResponse.json({ styles: data || [] })
  } catch (error: any) {
    console.error('Errore API stili:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento degli stili' },
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
    const { name, slug, description, preview_url, price_extra, is_active, display_order, product_type_id } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nome e slug sono obbligatori' }, { status: 400 })
    }

    const payload: any = {
      name,
      slug,
      description: description || null,
      preview_url: preview_url || null,
      price_extra: parseFloat(price_extra) || 0,
      is_active: is_active !== false,
      display_order: display_order || 0,
    }
    if (product_type_id) payload.product_type_id = product_type_id

    let { data, error } = await supabase
      .from('styles')
      .insert(payload)
      .select()
      .single()

    // Backward compatibility: se la colonna non esiste, riprova senza product_type_id
    if (error && product_type_id && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackPayload } = payload
      const retry = await supabase.from('styles').insert(fallbackPayload).select().single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore creazione stile:', error)
      return NextResponse.json({ error: 'Errore durante la creazione dello stile' }, { status: 500 })
    }

    return NextResponse.json({ style: data })
  } catch (error: any) {
    console.error('Errore API creazione stile:', error)
    return NextResponse.json({ error: 'Errore durante la creazione dello stile' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID stile richiesto' }, { status: 400 })
    }

    if (updates.price_extra !== undefined) {
      updates.price_extra = parseFloat(updates.price_extra) || 0
    }

    const hasProductTypeUpdate = Object.prototype.hasOwnProperty.call(updates, 'product_type_id')

    let { data, error } = await supabase
      .from('styles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    // Backward compatibility: se la colonna non esiste, riprova senza product_type_id
    if (error && hasProductTypeUpdate && `${error.message || ''}`.includes('product_type_id')) {
      const { product_type_id: _removed, ...fallbackUpdates } = updates
      const retry = await supabase
        .from('styles')
        .update(fallbackUpdates)
        .eq('id', id)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      console.error('Errore aggiornamento stile:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento dello stile' }, { status: 500 })
    }

    return NextResponse.json({ style: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento stile:', error)
    return NextResponse.json({ error: 'Errore durante l\'aggiornamento dello stile' }, { status: 500 })
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
      return NextResponse.json({ error: 'ID stile richiesto' }, { status: 400 })
    }

    // Prima elimina le configurazioni che referenziano questo stile
    await supabase
      .from('configurations')
      .delete()
      .eq('style_id', id)

    const { error } = await supabase.from('styles').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione stile:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione dello stile. Potrebbe avere elementi collegati.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione stile:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione dello stile' }, { status: 500 })
  }
}
