import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// GET - Recupera tutti i prodotti del magazzino
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Errore recupero inventory:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero del magazzino' },
        { status: 500 }
      )
    }

    return NextResponse.json({ inventory: data || [] }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API inventory:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero del magazzino' },
      { status: 500 }
    )
  }
}

// POST - Aggiunge un nuovo prodotto al magazzino
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
      product_code,
      product_name,
      section,
      quantity,
      price,
      is_customizable,
      image_url,
    } = body

    // Validazione
    if (!product_code || !product_name || !section || quantity === undefined || !price) {
      return NextResponse.json(
        { error: 'Campi obbligatori mancanti' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert([
        {
          product_code,
          product_name,
          section,
          quantity: parseInt(quantity) || 0,
          price: parseFloat(price) || 0,
          is_customizable: is_customizable || false,
          image_url: image_url || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Errore inserimento prodotto:', error)
      return NextResponse.json(
        { error: 'Errore nell\'inserimento del prodotto' },
        { status: 500 }
      )
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error: any) {
    console.error('Errore API inventory POST:', error)
    return NextResponse.json(
      { error: 'Errore nell\'inserimento del prodotto' },
      { status: 500 }
    )
  }
}

// PATCH - Aggiorna un prodotto esistente
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
        { error: 'ID prodotto mancante' },
        { status: 400 }
      )
    }

    // Recupera il prodotto attuale per verificare se era esaurito
    const { data: oldProduct } = await supabase
      .from('inventory')
      .select('quantity')
      .eq('id', id)
      .single()

    // Rimuovi campi che non esistono nella tabella inventory
    delete updates.availability_status
    delete updates.production_status
    delete updates.weight

    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento prodotto:', error)
      return NextResponse.json(
        { error: 'Errore nell\'aggiornamento del prodotto' },
        { status: 500 }
      )
    }

    // Verifica se il prodotto è passato da esaurito a disponibile
    const was_out_of_stock = oldProduct?.quantity === 0
    const is_now_available = data.quantity > 0

    return NextResponse.json(
      { 
        product: data,
        was_out_of_stock,
        is_now_available: was_out_of_stock && is_now_available,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Errore API inventory PATCH:', error)
    return NextResponse.json(
      { error: 'Errore nell\'aggiornamento del prodotto' },
      { status: 500 }
    )
  }
}

// DELETE - Elimina un prodotto
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
        { error: 'ID prodotto mancante' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore eliminazione prodotto:', error)
      return NextResponse.json(
        { error: 'Errore nell\'eliminazione del prodotto' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API inventory DELETE:', error)
    return NextResponse.json(
      { error: 'Errore nell\'eliminazione del prodotto' },
      { status: 500 }
    )
  }
}
