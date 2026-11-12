import { NextRequest } from 'next/server'
import { getSupabaseAdmin, jsonNoStore } from '@/lib/supabaseServer'
import { requireDashboard } from '@/lib/dashboardAuth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET magazzino — SOLO dashboard (non pubblico)
export async function GET(request: NextRequest) {
  const denied = requireDashboard(request)
  if (denied) return denied

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Errore recupero inventory:', error)
      return jsonNoStore({ error: 'Errore nel recupero del magazzino' }, { status: 500 })
    }

    return jsonNoStore({ inventory: data || [] })
  } catch (error) {
    console.error('Errore API inventory:', error)
    return jsonNoStore({ error: 'Errore nel recupero del magazzino' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const denied = requireDashboard(request)
  if (denied) return denied

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const {
      product_code,
      product_name,
      section,
      quantity,
      price,
      is_customizable,
      is_featured,
      image_url,
      short_description,
      show_in_art_gallery,
      art_gallery_order,
    } = body

    if (!product_code || !product_name || !section || quantity === undefined || price === undefined) {
      return jsonNoStore({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('inventory')
      .insert([
        {
          product_code: String(product_code).trim(),
          product_name: String(product_name).trim(),
          section: String(section).trim(),
          quantity: parseInt(quantity, 10) || 0,
          price: parseFloat(price) || 0,
          is_customizable: !!is_customizable,
          is_featured: !!is_featured,
          image_url: image_url || null,
          short_description: short_description ? String(short_description).trim() : null,
          show_in_art_gallery: !!show_in_art_gallery,
          art_gallery_order: parseInt(art_gallery_order, 10) || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Errore inserimento prodotto:', error)
      return jsonNoStore({ error: "Errore nell'inserimento del prodotto" }, { status: 500 })
    }

    return jsonNoStore({ product: data }, { status: 201 })
  } catch (error) {
    console.error('Errore API inventory POST:', error)
    return jsonNoStore({ error: "Errore nell'inserimento del prodotto" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  const denied = requireDashboard(request)
  if (denied) return denied

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body
    if (!id) {
      return jsonNoStore({ error: 'ID prodotto mancante' }, { status: 400 })
    }

    if (typeof updates.product_name === 'string') updates.product_name = updates.product_name.trim()
    if (typeof updates.product_code === 'string') updates.product_code = updates.product_code.trim()
    if (typeof updates.section === 'string') updates.section = updates.section.trim()
    if (typeof updates.short_description === 'string') {
      updates.short_description = updates.short_description.trim() || null
    }
    if (updates.quantity !== undefined) updates.quantity = parseInt(updates.quantity, 10) || 0
    if (updates.price !== undefined) updates.price = parseFloat(updates.price) || 0
    if (updates.art_gallery_order !== undefined) {
      updates.art_gallery_order = parseInt(updates.art_gallery_order, 10) || 0
    }
    if (updates.show_in_art_gallery !== undefined) {
      updates.show_in_art_gallery = !!updates.show_in_art_gallery
    }
    if (updates.is_featured !== undefined) updates.is_featured = !!updates.is_featured

    const { data, error } = await supabase
      .from('inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento prodotto:', error)
      return jsonNoStore({ error: "Errore nell'aggiornamento del prodotto" }, { status: 500 })
    }

    return jsonNoStore({ product: data })
  } catch (error) {
    console.error('Errore API inventory PATCH:', error)
    return jsonNoStore({ error: "Errore nell'aggiornamento del prodotto" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const denied = requireDashboard(request)
  if (denied) return denied

  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return jsonNoStore({ error: 'ID prodotto mancante' }, { status: 400 })
    }

    const { error } = await supabase.from('inventory').delete().eq('id', id)
    if (error) {
      console.error('Errore eliminazione prodotto:', error)
      return jsonNoStore({ error: "Errore nell'eliminazione del prodotto" }, { status: 500 })
    }

    return jsonNoStore({ success: true })
  } catch (error) {
    console.error('Errore API inventory DELETE:', error)
    return jsonNoStore({ error: "Errore nell'eliminazione del prodotto" }, { status: 500 })
  }
}
