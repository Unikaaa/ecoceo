'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { categories } from '@/lib/data/mockProducts'
import { Product } from '@/lib/data/mockProducts'
import ProductGrid from '@/components/shop/ProductGrid'

interface PageProps {
  params: {
    locale: string
    category: string
  }
}

export default function CategoryPage({ params }: PageProps) {
  const router = useRouter()
  const category = categories.find((c) => c.slug === params.category)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  if (!category) {
    notFound()
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products?category=${params.category}`)
        const data = await response.json()
        if (response.ok && data.products) {
          setProducts(data.products)
        }
      } catch (error) {
        console.error('Errore caricamento prodotti:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProducts()
  }, [params.category])

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, catSlug: string) => {
    if (catSlug === params.category) {
      e.preventDefault()
      router.push('/shop')
    }
  }

  return (
    <div className="min-h-screen bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section Elegante */}
      <section className="pt-14 pb-2 md:pt-20 md:pb-3 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-6 md:mb-8">
            <div className="inline-block mb-4 md:mb-5">
              <span className="px-6 py-2 text-primary rounded-full text-sm font-semibold border border-primary/20 shadow-sm">
                {category.name}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-4 md:mb-5 leading-[1.05] tracking-tight">
              {category.name}
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4 md:mb-5">
              <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <span className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {category.description}
            </p>
          </div>
        </div>
      </section>

      {/* Barra categorie - Mantenuta come richiesto */}
      <div className="pt-2 pb-5 md:pt-3 md:pb-6 border-b border-gray-200/70 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-6xl mx-auto">
            {categories.map((cat) => {
              const isActive = cat.slug === params.category
              const nameLength = cat.name.length
              let cardWidth = '90px'
              if (nameLength > 20) {
                cardWidth = '150px'
              } else if (nameLength > 15) {
                cardWidth = '130px'
              } else if (nameLength > 12) {
                cardWidth = '110px'
              }
              return (
                <Link
                  key={cat.id}
                  href={`/shop/category/${cat.slug}`}
                  onClick={(e) => handleCategoryClick(e, cat.slug)}
                  className={`group block bg-white rounded-xl overflow-hidden transition-all duration-300 will-change-transform ${
                    isActive
                      ? 'shadow-lg ring-2 ring-primary/60 scale-[1.06]'
                      : 'shadow-sm hover:shadow-md ring-1 ring-black/5 hover:ring-primary/25 hover:-translate-y-0.5 hover:scale-[1.04]'
                  }`}
                  style={{ width: cardWidth, minWidth: cardWidth, height: 'auto' }}
                >
                  <div className="h-[56px] sm:h-[62px] bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="text-gray-400 text-[10px] relative z-10">Img</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-transparent" />
                    )}
                  </div>
                  <div className="px-2.5 py-2.5 text-center">
                    <h3 className={`text-[11px] font-serif whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-primary font-semibold'
                        : 'text-gray-700 group-hover:text-primary'
                    }`}>
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Griglia Prodotti Elegante */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-600">Caricamento prodotti...</p>
            </div>
          ) : products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-xl text-gray-600 font-medium mb-4">Nessun prodotto disponibile in questa categoria</p>
                <Link href="/shop" className="inline-block text-primary hover:text-accent font-semibold transition-colors">
                Torna allo Shop
              </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
