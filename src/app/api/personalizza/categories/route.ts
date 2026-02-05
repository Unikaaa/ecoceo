import { NextRequest, NextResponse } from 'next/server'
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
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Errore query categorie:', error)
      return NextResponse.json(
        { error: 'Errore durante il caricamento delle categorie' },
        { status: 500 }
      )
    }

    return NextResponse.json({ categories: data || [] })
  } catch (error: any) {
    console.error('Errore API categorie:', error)
    return NextResponse.json(
      { error: 'Errore durante il caricamento delle categorie' },
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
    const { name, slug, description, icon_url, image_url, is_active, display_order } = body

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug sono obbligatori' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        icon_url: icon_url || null,
        image_url: image_url || null,
        is_active: is_active !== undefined ? is_active : true,
        display_order: display_order || 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Errore creazione categoria:', error)
      return NextResponse.json(
        { error: 'Errore durante la creazione della categoria' },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: data })
  } catch (error: any) {
    console.error('Errore API creazione categoria:', error)
    return NextResponse.json(
      { error: 'Errore durante la creazione della categoria' },
      { status: 500 }
    )
  }
}

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
        { error: 'ID categoria richiesto' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento categoria:', error)
      return NextResponse.json(
        { error: 'Errore durante l\'aggiornamento della categoria' },
        { status: 500 }
      )
    }

    return NextResponse.json({ category: data })
  } catch (error: any) {
    console.error('Errore API aggiornamento categoria:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'aggiornamento della categoria' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID categoria richiesto' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore eliminazione categoria:', error)
      return NextResponse.json(
        { error: 'Errore durante l\'eliminazione della categoria' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Errore API eliminazione categoria:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione della categoria' },
      { status: 500 }
    )
  }
}
