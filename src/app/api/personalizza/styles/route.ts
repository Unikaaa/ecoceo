import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('styles')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

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
    const { name, slug, description, preview_url, price_extra, is_active, display_order } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nome e slug sono obbligatori' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('styles')
      .insert({
        name,
        slug,
        description: description || null,
        preview_url: preview_url || null,
        price_extra: parseFloat(price_extra) || 0,
        is_active: is_active !== false,
        display_order: display_order || 0,
      })
      .select()
      .single()

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

    const { data, error } = await supabase
      .from('styles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

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

    const { error } = await supabase.from('styles').delete().eq('id', id)

    if (error) {
      console.error('Errore eliminazione stile:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione dello stile' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione stile:', error)
    return NextResponse.json({ error: 'Errore durante l\'eliminazione dello stile' }, { status: 500 })
  }
}
