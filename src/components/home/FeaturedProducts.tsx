'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from '@/lib/i18n/hooks'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function FeaturedProducts() {
  const t = useTranslations('home')
  const [featured, setFeatured] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=3')
        const data = await response.json()
        if (response.ok && data.products) {
          setFeatured(data.products.slice(0, 3))
        }
      } catch (error) {
        console.error('Errore caricamento prodotti featured:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="py-7 md:py-20 lg:py-24 bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
        {/* Titolo elegante */}
        <div className="text-center mb-5 md:mb-14 lg:mb-16">
          <div className="inline-block mb-2.5 md:mb-4">
            <span className="px-3 py-1.5 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 text-primary rounded-full text-xs sm:text-sm font-semibold border border-primary/20">
              Selezione Esclusiva
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-2 md:mb-4 leading-tight">
          {t('featuredProducts')}
        </h2>
          <div className="flex items-center justify-center gap-3 md:gap-4 mt-4 md:mt-6">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>

        {/* Griglia elegante con 3 prodotti grandi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {isLoading && [0, 1, 2].map((idx) => (
            <div key={`skeleton-${idx}`} className="bg-white rounded-artistic overflow-hidden shadow-md animate-pulse">
              <div className="aspect-[4/5] bg-gray-200" />
              <div className="p-6 md:p-8 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded w-1/3 mt-6" />
              </div>
            </div>
          ))}
          {!isLoading && featured.map((product, index) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className={`group bg-white rounded-artistic overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                product.featured
                  ? 'ring-2 ring-amber-200/70 shadow-[0_20px_45px_-24px_rgba(180,83,9,0.45)]'
                  : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Immagine prodotto */}
              <div className="aspect-[4/5] bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand relative overflow-hidden">
                {product.images && product.images[0] && product.images[0] !== '/placeholder-product.jpg' ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium">Immagine</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                {/* Overlay hover elegante */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Badge favorito (allineato allo Shop) */}
                {product.featured && (
                  <div className="absolute top-4 left-4 z-20">
                    <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50/95 to-yellow-50/95 backdrop-blur-sm text-amber-900 rounded-xl shadow-lg border border-amber-200/90">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                      </span>
                      <div className="leading-tight">
                        <p className="text-[11px] font-bold uppercase tracking-wider">Favorito</p>
                        <p className="text-[10px] text-amber-700 font-medium">Piu venduto</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenuto prodotto */}
              <div className="p-4 md:p-7">
                <h3 className="text-base sm:text-xl md:text-2xl font-serif text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2.5 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-lg sm:text-2xl md:text-3xl font-serif font-semibold text-primary">
                  {formatPrice(product.price)}
                </p>
                  <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium">Scopri</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA centrale */}
        <div className="text-center mt-8 md:mt-16 lg:mt-20">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="w-full sm:w-auto text-sm md:text-lg px-6 md:px-10 shadow-lg hover:shadow-xl transition-shadow">
              {t('viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
