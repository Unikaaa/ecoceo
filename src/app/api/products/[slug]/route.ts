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
    featured: false,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    // Decodifica lo slug
    const decodedSlug = decodeURIComponent(params.slug)
    
    // Cerca il prodotto per slug
    // Prima recupera tutti i prodotti (anche esauriti per mostrare la pagina)
    const { data: allItems, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Errore recupero prodotti:', error)
      return NextResponse.json(
        { error: 'Errore nel recupero dei prodotti' },
        { status: 500 }
      )
    }

    // Trasforma e cerca per slug (confronto case-insensitive)
    const products = (allItems || []).map(transformInventoryToProduct)
    const product = products.find((p) => 
      p.slug.toLowerCase() === decodedSlug.toLowerCase() || 
      p.slug === decodedSlug
    )

    if (!product) {
      return NextResponse.json(
        { error: 'Prodotto non trovato' },
        { status: 404 }
      )
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (error: any) {
    console.error('Errore API prodotto:', error)
    return NextResponse.json(
      { error: 'Errore nel recupero del prodotto' },
      { status: 500 }
    )
  }
}
