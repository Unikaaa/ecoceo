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

    // Recupera i tipi prodotto della categoria per eliminare tutte le dipendenze figlie
    const { data: linkedProductTypes, error: linkedProductTypesError } = await supabase
      .from('product_types')
      .select('id')
      .eq('category_id', id)

    if (linkedProductTypesError) {
      console.error('Errore recupero tipi prodotto collegati:', linkedProductTypesError)
      return NextResponse.json(
        { error: 'Errore durante il recupero degli elementi collegati alla categoria' },
        { status: 500 }
      )
    }

    const productTypeIds = (linkedProductTypes || []).map((pt: { id: string }) => pt.id)

    // Elimina dipendenze dirette della categoria
    const directDeleteSteps: Array<{ table: string; column: string; value: string }> = [
      { table: 'configurations', column: 'category_id', value: id },
      { table: 'decorations', column: 'category_id', value: id },
      { table: 'backgrounds', column: 'category_id', value: id },
    ]

    for (const step of directDeleteSteps) {
      const { error: stepError } = await supabase
        .from(step.table)
        .delete()
        .eq(step.column, step.value)

      if (stepError) {
        console.error(`Errore eliminazione dipendenze categoria (${step.table}):`, stepError)
        return NextResponse.json(
          { error: `Errore durante l'eliminazione degli elementi collegati (${step.table})` },
          { status: 500 }
        )
      }
    }

    // Elimina dipendenze dei tipi prodotto collegati (stili, dimensioni, decorazioni, sfondi, configurazioni)
    if (productTypeIds.length > 0) {
      const productTypeDeleteSteps: Array<{ table: string; column: string }> = [
        { table: 'configurations', column: 'product_type_id' },
        { table: 'styles', column: 'product_type_id' },
        { table: 'sizes', column: 'product_type_id' },
        { table: 'decorations', column: 'product_type_id' },
        { table: 'backgrounds', column: 'product_type_id' },
      ]

      for (const step of productTypeDeleteSteps) {
        const { error: stepError } = await supabase
          .from(step.table)
          .delete()
          .in(step.column, productTypeIds)

        if (stepError) {
          console.error(`Errore eliminazione dipendenze tipo prodotto (${step.table}):`, stepError)
          return NextResponse.json(
            { error: `Errore durante l'eliminazione degli elementi collegati (${step.table})` },
            { status: 500 }
          )
        }
      }
    }

    // Elimina i tipi prodotto collegati alla categoria
    const { error: productTypesDeleteError } = await supabase
      .from('product_types')
      .delete()
      .eq('category_id', id)

    if (productTypesDeleteError) {
      console.error('Errore eliminazione tipi prodotto della categoria:', productTypesDeleteError)
      return NextResponse.json(
        { error: 'Errore durante l\'eliminazione dei tipi prodotto collegati' },
        { status: 500 }
      )
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore eliminazione categoria:', error)
      return NextResponse.json(
        { error: 'Errore durante l\'eliminazione della categoria. Potrebbe avere elementi collegati.' },
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
