import { createClient } from '@supabase/supabase-js'

export interface DbArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  image_url: string
  tags: string[]
  is_featured: boolean
  is_published: boolean
  published_at: string
}

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!supabaseUrl || !supabaseServiceKey) return null
  return createClient(supabaseUrl, supabaseServiceKey)
}

export async function getPublishedArticlesFromDb(): Promise<DbArticle[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  if (error || !data) {
    return []
  }

  return data as DbArticle[]
}

export async function getArticleBySlugFromDb(slug: string): Promise<DbArticle | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as DbArticle
}
