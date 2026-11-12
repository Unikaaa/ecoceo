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
  const short =
    typeof item.short_description === 'string' && item.short_description.trim()
      ? item.short_description.trim()
      : (item.product_name || '').trim()

  return {
    id: item.id,
    inventory_id: item.id,
    name: (item.product_name || '').trim(),
    description: short,
    short_description: short,
    price: typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw)) || 0,
    images,
    category: (item.section || '').trim(),
    inStock: Number(item.quantity) > 0,
    maxQuantity: typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity, 10) || 0,
    slug,
    featured: item.is_featured || false,
    show_in_art_gallery: !!item.show_in_art_gallery,
    art_gallery_order: Number(item.art_gallery_order) || 0,
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin()
    if (!supabase) {
      return jsonNoStore({ error: 'Database non configurato' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const category = (searchParams.get('category') || '').trim()
    const featured = searchParams.get('featured') === 'true'
    const artGallery = searchParams.get('artGallery') === 'true'
    const limitParam = searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam, 10) : null

    let query = supabase.from('inventory').select('*')

    if (artGallery) {
      query = query
        .eq('show_in_art_gallery', true)
        .order('art_gallery_order', { ascending: true })
        .order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    if (category) {
      query = query.eq('section', category)
    }

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (limit && Number.isFinite(limit) && limit > 0) {
      query = query.limit(limit)
    }

    const { data, error } = await query
    if (error) {
      // Colonne galleria non ancora migrate: fallback soft
      if (artGallery && /show_in_art_gallery|art_gallery_order|short_description/i.test(error.message || '')) {
        return jsonNoStore({
          products: [],
          warning:
            'Colonne galleria non presenti. Esegui supabase/add_art_gallery_flags.sql su Supabase.',
        })
      }
      console.error('Errore recupero prodotti:', error)
      return jsonNoStore({ error: 'Errore nel recupero dei prodotti' }, { status: 500 })
    }

    const products = (data || []).map(transformInventoryToProduct)
    return jsonNoStore({ products })
  } catch (error) {
    console.error('Errore API prodotti:', error)
    return jsonNoStore({ error: 'Errore nel recupero dei prodotti' }, { status: 500 })
  }
}
