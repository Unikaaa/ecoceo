import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'
import { UNIKA_LINES } from '@/lib/lines'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sitoufficiale.vercel.app'

const staticRoutes = [
  '/',
  '/shop',
  '/personalizza',
  '/about',
  '/chi-siamo',
  '/news',
  '/blog',
  '/progetti',
  '/processo',
  '/professionisti',
  '/contatti',
  '/faq',
  '/shipping',
  '/returns',
  '/cart',
  ...UNIKA_LINES.map((line) => `/${line.slug}`),
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === '/' || path === '/shop' ? 'daily' : 'weekly',
    priority: path === '/' ? 1 : path === '/shop' ? 0.9 : 0.7,
  }))

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey)
      const { data: products } = await supabase
        .from('inventory')
        .select('product_name, product_code, updated_at')
        .gt('quantity', 0)

      for (const product of products || []) {
        const slug = slugify(product.product_name || product.product_code || '')
        if (!slug) continue
        routes.push({
          url: `${baseUrl}/shop/${slug}`,
          lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        })
      }

      const { data: articles } = await supabase
        .from('articles')
        .select('slug, updated_at, published_at')
        .eq('is_published', true)

      for (const article of articles || []) {
        if (!article.slug) continue
        routes.push({
          url: `${baseUrl}/news/${article.slug}`,
          lastModified: article.updated_at || article.published_at
            ? new Date(article.updated_at || article.published_at)
            : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    // Sitemap statica resta disponibile anche senza DB
  }

  return routes
}
