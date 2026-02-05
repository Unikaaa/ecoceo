import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Helper per generare slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Helper per trasformare item Supabase in Product
function transformInventoryToProduct(item: any) {
  const slug = generateSlug(item.product_name)
  
  // Gestisci immagini: usa image_url se presente, altrimenti placeholder
  const images: string[] = item.image_url 
    ? [item.image_url] 
    : ['/placeholder-product.jpg']
  
  return {
    id: item.id,
    inventory_id: item.id,
    name: item.product_name,
    description: item.product_name,
    price: parseFloat(item.price.toString()),
    images: images,
    category: item.section,
    inStock: item.quantity > 0,
    slug: slug,
    featured: item.is_featured || false,
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null

    // Query base - include anche prodotti esauriti (quantity = 0)
    let query = supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtro per categoria (section)
    if (category) {
      query = query.eq('section', category)
    }

    // Limite risultati
    if (limit) {
      query = query.limit(limit)
    }

    const { data, error } = await query

    if (error) {
      console.error('Errore recupero prodotti:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero dei prodotti' },
        { status: 500 }
      )
    }

    // Trasforma i dati da Supabase al formato Product
    const products = (data || []).map(transformInventoryToProduct)

    // Filtro featured (se richiesto) - ora usa il campo is_featured dal DB
    const filteredProducts = featured 
      ? products.filter(p => p.featured === true)
      : products

    return NextResponse.json({ products: filteredProducts }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API prodotti:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero dei prodotti' },
      { status: 500 }
    )
  }
}
