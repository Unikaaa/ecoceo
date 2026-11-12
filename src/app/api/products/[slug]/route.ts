import { NextRequest } from 'next/server'
import { getSupabaseAdmin, jsonNoStore } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function generateSlugBase(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function generateProductSlug(item: any): string {
  const base = generateSlugBase(item?.product_name || '')
  if (base) return base
  const idPart =
    typeof item?.id === 'string' && item.id.length >= 8 ? item.id.slice(0, 8) : 'item'
  return `prodotto-${idPart}`
}

function transformInventoryToProduct(item: any) {
  const slug = generateProductSlug(item)
  const images: string[] = item.image_url ? [item.image_url] : ['/placeholder-product.jpg']
  const priceRaw = item.price ?? 0

  return {
    id: item.id,
    inventory_id: item.id,
    name: (item.product_name || '').trim(),
    description: (item.product_name || '').trim(),
    price: typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw)) || 0,
    images,
    category: (item.section || '').trim(),
    inStock: Number(item.quantity) > 0,
    maxQuantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 0,
    slug,
    featured: item.is_featured || false,
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const decodedSlug = decodeURIComponent(params.slug)
    const { data: allItems, error } = await supabase
      .from('inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Errore recupero prodotti:', error)
      return jsonNoStore({ error: 'Errore nel recupero dei prodotti' }, { status: 500 })
    }

    const products = (allItems || []).map(transformInventoryToProduct)
    const product = products.find(
      (p) => p.slug.toLowerCase() === decodedSlug.toLowerCase() || p.slug === decodedSlug
    )

    if (!product) {
      return jsonNoStore({ error: 'Prodotto non trovato' }, { status: 404 })
    }

    return jsonNoStore({ product })
  } catch (error) {
    console.error('Errore API prodotto:', error)
    return jsonNoStore({ error: 'Errore nel recupero del prodotto' }, { status: 500 })
  }
}
