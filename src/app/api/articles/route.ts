import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET - Recupera articoli
export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const published = searchParams.get('published') !== 'false'
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null
    const slug = searchParams.get('slug')

    // Se richiesto un singolo articolo per slug
    if (slug) {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Articolo non trovato' }, { status: 404 })
      }

      return NextResponse.json({ article: data }, { status: 200 })
    }

    // Lista articoli
    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })

    if (published) {
      query = query.eq('is_published', true)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore recupero articoli:', error)
      return NextResponse.json({ error: 'Errore nel recupero degli articoli' }, { status: 500 })
    }

    return NextResponse.json({ articles: data || [] }, { status: 200 })
  } catch (error) {
    console.error('Errore API articles:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// POST - Crea nuovo articolo
export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { title, excerpt, content, author, category, image_url, tags, is_featured, is_published } = body

    if (!title) {
      return NextResponse.json({ error: 'Titolo richiesto' }, { status: 400 })
    }

    const slug = generateSlug(title)

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        content: content || '',
        author: author || 'UNIKA Team',
        category: category || 'News',
        image_url: image_url || '',
        tags: tags || [],
        is_featured: is_featured || false,
        is_published: is_published !== false,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('Errore creazione articolo:', error)
      return NextResponse.json({ error: 'Errore durante la creazione' }, { status: 500 })
    }

    return NextResponse.json({ article: data }, { status: 201 })
  } catch (error) {
    console.error('Errore API articles:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// PATCH - Aggiorna articolo
export async function PATCH(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
    }

    // Se il titolo è cambiato, aggiorna anche lo slug
    if (updates.title) {
      updates.slug = generateSlug(updates.title)
    }

    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Errore aggiornamento articolo:', error)
      return NextResponse.json({ error: 'Errore durante l\'aggiornamento' }, { status: 500 })
    }

    return NextResponse.json({ article: data }, { status: 200 })
  } catch (error) {
    console.error('Errore API articles:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}

// DELETE - Elimina articolo
export async function DELETE(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID richiesto' }, { status: 400 })
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Errore eliminazione articolo:', error)
      return NextResponse.json({ error: 'Errore durante l\'eliminazione' }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Errore API articles:', error)
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
