import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null

const POPUPS_TABLE = 'site_popups'

function isMissingTableError(error: any) {
  const message = String(error?.message || '').toLowerCase()
  return message.includes('does not exist') || message.includes('relation') && message.includes('site_popups')
}

function isMissingColumnError(error: any, columnName: string) {
  const message = String(error?.message || '').toLowerCase()
  return message.includes(`column site_popups.${columnName}`) && message.includes('does not exist')
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Configurazione database non valida.' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    let query = supabase
      .from(POPUPS_TABLE)
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    if (activeOnly) {
      const now = new Date().toISOString()
      query = query
        .eq('is_active', true)
        .lte('starts_at', now)
        .or(`ends_at.is.null,ends_at.gte.${now}`)
    }

    const { data, error } = await query
    if (error) {
      if (isMissingTableError(error)) {
        return NextResponse.json({ popups: [] }, { status: 200 })
      }
      return NextResponse.json({ error: 'Errore nel recupero popup.' }, { status: 500 })
    }

    return NextResponse.json({ popups: data || [] }, { status: 200 })
  } catch (error) {
    console.error('Errore API popups GET:', error)
    return NextResponse.json({ error: 'Errore nel recupero popup.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Configurazione database non valida.' }, { status: 500 })
    }

    const body = await request.json()
    const {
      title,
      description,
      image_url,
      image_scale,
      image_offset_x,
      image_offset_y,
      image_fit,
      image_area_size,
      buttons,
      starts_at,
      ends_at,
      event_type,
      event_label,
      is_active,
      priority,
    } = body

    if (!title || !starts_at) {
      return NextResponse.json({ error: 'Titolo e data inizio sono obbligatori.' }, { status: 400 })
    }

    const insertPayload: any = {
      title,
      description: description || '',
      image_url: image_url || '',
      image_scale: Number.isFinite(image_scale) ? image_scale : 1,
      image_offset_x: Number.isFinite(image_offset_x) ? image_offset_x : 0,
      image_offset_y: Number.isFinite(image_offset_y) ? image_offset_y : 0,
      image_fit: image_fit === 'contain' ? 'contain' : 'cover',
      image_area_size: image_area_size === 'sm' || image_area_size === 'lg' ? image_area_size : 'md',
      buttons: Array.isArray(buttons) ? buttons : [],
      starts_at,
      ends_at: ends_at || null,
      event_type: event_type || 'announcement',
      event_label: event_label || '',
      is_active: is_active !== false,
      priority: Number.isFinite(priority) ? priority : 0,
    }

    let { data, error } = await supabase
      .from(POPUPS_TABLE)
      .insert(insertPayload)
      .select()
      .single()

    if (error && (isMissingColumnError(error, 'image_fit') || isMissingColumnError(error, 'image_area_size'))) {
      const { image_fit: _ignoreFit, image_area_size: _ignoreArea, ...fallbackPayload } = insertPayload
      const retry = await supabase
        .from(POPUPS_TABLE)
        .insert(fallbackPayload)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ error: 'Errore durante creazione popup.' }, { status: 500 })
    }

    return NextResponse.json({ popup: data }, { status: 201 })
  } catch (error) {
    console.error('Errore API popups POST:', error)
    return NextResponse.json({ error: 'Errore durante creazione popup.' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Configurazione database non valida.' }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ error: 'ID popup richiesto.' }, { status: 400 })
    }

    const payload: any = {
      ...updates,
      updated_at: new Date().toISOString(),
    }
    if (updates.buttons && !Array.isArray(updates.buttons)) {
      payload.buttons = []
    }
    if (updates.image_fit !== undefined) {
      payload.image_fit = updates.image_fit === 'contain' ? 'contain' : 'cover'
    }
    if (updates.image_area_size !== undefined) {
      payload.image_area_size = updates.image_area_size === 'sm' || updates.image_area_size === 'lg' ? updates.image_area_size : 'md'
    }

    let { data, error } = await supabase
      .from(POPUPS_TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error && (isMissingColumnError(error, 'image_fit') || isMissingColumnError(error, 'image_area_size'))) {
      const { image_fit: _ignoreFit, image_area_size: _ignoreArea, ...fallbackPayload } = payload
      const retry = await supabase
        .from(POPUPS_TABLE)
        .update(fallbackPayload)
        .eq('id', id)
        .select()
        .single()
      data = retry.data
      error = retry.error
    }

    if (error) {
      return NextResponse.json({ error: 'Errore durante aggiornamento popup.' }, { status: 500 })
    }

    return NextResponse.json({ popup: data }, { status: 200 })
  } catch (error) {
    console.error('Errore API popups PATCH:', error)
    return NextResponse.json({ error: 'Errore durante aggiornamento popup.' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Configurazione database non valida.' }, { status: 500 })
    }

    const body = await request.json()
    const { id } = body
    if (!id) {
      return NextResponse.json({ error: 'ID popup richiesto.' }, { status: 400 })
    }

    const { error } = await supabase
      .from(POPUPS_TABLE)
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Errore durante eliminazione popup.' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Errore API popups DELETE:', error)
    return NextResponse.json({ error: 'Errore durante eliminazione popup.' }, { status: 500 })
  }
}
