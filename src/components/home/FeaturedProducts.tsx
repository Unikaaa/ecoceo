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
      }
    }
    fetchFeatured()
  }, [])

  return (
    <section className="py-20 md:py-28 bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Titolo elegante */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
              Selezione Esclusiva
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-gray-900 mb-4 leading-tight">
          {t('featuredProducts')}
        </h2>
          <div className="flex items-center justify-center gap-4 mt-6">
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <span className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </div>
        </div>

        {/* Griglia elegante con 3 prodotti grandi */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-7xl mx-auto">
          {featured.map((product, index) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group bg-white rounded-artistic overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
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
                
                {/* Badge featured */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-sm">
                    Featured
                  </span>
                </div>
              </div>

              {/* Contenuto prodotto */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
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
        <div className="text-center mt-16 md:mt-20">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="text-lg px-10 py-4 shadow-lg hover:shadow-xl transition-shadow">
              {t('viewAll')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
