import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { DEFAULT_ARTICLES_SEED } from '@/lib/news/defaultArticles'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST() {
  try {
    if (!supabase) {
      return NextResponse.json({ error: 'Database non configurato' }, { status: 500 })
    }

    const { count, error: countError } = await supabase
      .from('articles')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      return NextResponse.json({ error: 'Errore verifica articoli' }, { status: 500 })
    }

    if ((count || 0) > 0) {
      return NextResponse.json({ seeded: false, message: 'Articoli già presenti' }, { status: 200 })
    }

    const { error: insertError } = await supabase
      .from('articles')
      .insert(DEFAULT_ARTICLES_SEED)

    if (insertError) {
      console.error('Errore seed articoli:', insertError)
      return NextResponse.json({ error: 'Errore seed articoli' }, { status: 500 })
    }

    return NextResponse.json({ seeded: true, inserted: DEFAULT_ARTICLES_SEED.length }, { status: 201 })
  } catch (error) {
    console.error('Errore seed API:', error)
    return NextResponse.json({ error: 'Errore interno seed articoli' }, { status: 500 })
  }
}
