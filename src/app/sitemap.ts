import { MetadataRoute } from 'next'
import { mockArticles } from '@/lib/data/mockArticles'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
const locales = ['it', 'en', 'es', 'rs', 'cn']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = []

  // Home and main pages
  locales.forEach((locale) => {
    routes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })

    routes.push({
      url: `${baseUrl}/${locale}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    })

    routes.push({
      url: `${baseUrl}/${locale}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
  })

  // Product pages - ora letti da Supabase
  // Nota: Per includere i prodotti nel sitemap, dovresti chiamare l'API /api/products
  // Per ora li omettiamo per evitare chiamate API durante la generazione del sitemap

  // Article pages
  mockArticles.forEach((article) => {
    locales.forEach((locale) => {
      routes.push({
        url: `${baseUrl}/${locale}/news/${article.slug}`,
        lastModified: article.publishedAt,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    })
  })

  return routes
}
