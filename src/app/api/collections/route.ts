import { NextRequest } from 'next/server'
import { getSupabaseAdmin, jsonNoStore } from '@/lib/supabaseServer'
import { requireDashboard } from '@/lib/dashboardAuth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// GET collezioni
// - pubblico: solo attive (vetrina shop)
// - dashboard (?admin=1 + auth): tutte
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const admin = request.nextUrl.searchParams.get('admin') === '1'
    const artGallery = request.nextUrl.searchParams.get('artGallery') === 'true'
    if (admin) {
      const denied = requireDashboard(request)
      if (denied) return denied
    }

    let query = supabase.from('collections').select('*')

    if (artGallery) {
      query = query
        .eq('show_in_art_gallery', true)
        .order('art_gallery_order', { ascending: true })
        .order('name', { ascending: true })
    } else {
      query = query
        .order('display_order', { ascending: true })
        .order('name', { ascending: true })
    }

    if (!admin) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query
    if (error) {
      if (artGallery && /show_in_art_gallery|art_gallery_order/i.test(error.message || '')) {
        return jsonNoStore({
          collections: [],
          warning:
            'Colonne galleria non presenti. Esegui supabase/add_art_gallery_flags.sql su Supabase.',
        })
      }
      console.error('Errore recupero collezioni:', error)
      return jsonNoStore({ error: 'Errore nel recupero delle collezioni' }, { status: 500 })
    }

    return jsonNoStore({ collections: data || [] })
  } catch (error) {
    console.error('Errore API collezioni:', error)
    return jsonNoStore({ error: 'Errore nel recupero delle collezioni' }, { status: 500 })
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
      name,
      slug,
      description,
      image_url,
      hover_image_url,
      display_order,
      is_active,
      show_in_art_gallery,
      art_gallery_order,
    } = body

    if (!name || !slug) {
      return jsonNoStore({ error: 'Nome e slug sono obbligatori' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('collections')
      .insert([
        {
          name: String(name).trim(),
          slug: String(slug).trim(),
          description: description || null,
          image_url: image_url || null,
          hover_image_url: hover_image_url || null,
          display_order: display_order || 0,
          is_active: is_active !== undefined ? is_active : true,
          show_in_art_gallery: !!show_in_art_gallery,
          art_gallery_order: parseInt(art_gallery_order, 10) || 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('Errore inserimento collezione:', error)
      return jsonNoStore({ error: "Errore nell'inserimento della collezione" }, { status: 500 })
    }

    return jsonNoStore({ collection: data }, { status: 201 })
  } catch (error) {
    console.error('Errore API collezioni POST:', error)
    return jsonNoStore({ error: "Errore nell'inserimento della collezione" }, { status: 500 })
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
      return jsonNoStore({ error: 'ID collezione mancante' }, { status: 400 })
    }

    if (updates.art_gallery_order !== undefined) {
      updates.art_gallery_order = parseInt(updates.art_gallery_order, 10) || 0
    }
    if (updates.show_in_art_gallery !== undefined) {
      updates.show_in_art_gallery = !!updates.show_in_art_gallery
    }
    if (updates.display_order !== undefined) {
      updates.display_order = parseInt(updates.display_order, 10) || 0
    }

    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento collezione:', error)
      return jsonNoStore({ error: "Errore nell'aggiornamento della collezione" }, { status: 500 })
    }

    return jsonNoStore({ collection: data })
  } catch (error) {
    console.error('Errore API collezioni PATCH:', error)
    return jsonNoStore({ error: "Errore nell'aggiornamento della collezione" }, { status: 500 })
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

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return jsonNoStore({ error: 'ID collezione mancante' }, { status: 400 })
    }

    const { error } = await supabase.from('collections').delete().eq('id', id)
    if (error) {
      console.error('Errore eliminazione collezione:', error)
      return jsonNoStore({ error: "Errore nell'eliminazione della collezione" }, { status: 500 })
    }

    return jsonNoStore({ success: true })
  } catch (error) {
    console.error('Errore API collezioni DELETE:', error)
    return jsonNoStore({ error: "Errore nell'eliminazione della collezione" }, { status: 500 })
  }
}
