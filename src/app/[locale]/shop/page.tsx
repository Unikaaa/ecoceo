'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/mockProducts'
import ProductGrid from '@/components/shop/ProductGrid'
import CategoryCard from '@/components/shop/CategoryCard'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  hover_image_url?: string | null
  display_order: number
  is_active: boolean
}

export default function ShopPage() {
  const pathname = usePathname()
  const currentCategory = pathname?.split('/').pop() || null
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
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

    const fetchCollections = async () => {
      try {
        const response = await fetch(`/api/collections?t=${Date.now()}`)
        const data = await response.json()
        if (response.ok && data.collections) {
          const activeCollections = data.collections
            .filter((c: Collection) => c.is_active !== false)
            .sort((a: Collection, b: Collection) => a.display_order - b.display_order)
          setCollections(activeCollections)
        }
      } catch (error) {
        console.error('Errore caricamento collezioni:', error)
      } finally {
        setIsLoadingCollections(false)
      }
    }

    fetchProducts()
    fetchCollections()

    // Ascolta eventi di aggiornamento collezioni
    const handleCollectionsUpdate = () => {
      fetchCollections()
    }
    window.addEventListener('collectionsUpdated', handleCollectionsUpdate)

    // Polling ogni 5 secondi per aggiornare automaticamente
    const interval = setInterval(fetchCollections, 5000)

    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdate)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero Section Elegante */}
      <section className="py-20 md:py-28 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="px-6 py-2 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 text-primary rounded-full text-sm font-semibold border border-primary/20">
                Collezione Completa
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-6 leading-tight">
              Il Nostro Shop
            </h1>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <span className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <span className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Esplora le nostre collezioni e scopri pezzi unici di ceramica artistica
            </p>
          </div>
        </div>
      </section>

      {/* Card Collezioni */}
      <section className="py-16 md:py-20 relative z-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
                Le Nostre Collezioni
              </h2>
              <p className="text-lg text-gray-600">
                Scegli la categoria che preferisci
              </p>
            </div>
            {isLoadingCollections ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Caricamento collezioni...</p>
              </div>
            ) : collections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Nessuna collezione disponibile</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                {collections.map((collection, index) => (
                  <div
                    key={collection.id}
                    className="animate-fade-in-up-delay"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Link
                      href={`/shop?collection=${collection.slug}`}
                      className="group block bg-white rounded-artistic overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                      <div className="aspect-video bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand flex items-center justify-center relative overflow-hidden">
                        {collection.image_url ? (
                          <Image
                            src={collection.image_url}
                            alt={collection.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            style={{ objectFit: 'cover' }}
                            className="transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm font-medium relative z-10">Immagine</span>
                        )}
                        {/* Overlay hover elegante */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      
                      <div className="p-6 md:p-8">
                        <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                          {collection.name}
                        </h3>
                        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                          {collection.description || 'Esplora questa collezione'}
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-sm font-medium">Esplora</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Sezioni per Collezione con Prodotti */}
      <div className="relative z-10">
        {isLoading ? (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-gray-600">Caricamento prodotti...</p>
              </div>
            </div>
          </section>
        ) : collections.length > 0 ? (
          collections.map((collection, collectionIndex) => {
            const collectionProducts = products.filter((p) => p.category === collection.slug)
            
            return (
              <section key={collection.id} className={`py-16 md:py-20 ${collectionIndex % 2 === 0 ? 'bg-site' : 'bg-white'}`}>
                <div className="container mx-auto px-4">
                  <div className="max-w-7xl mx-auto">
                    {/* Header Collezione */}
                    <div className="mb-10 md:mb-12">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 mb-3">
                            {collection.name}
                          </h2>
                          <p className="text-lg text-gray-600 max-w-2xl">
                            {collection.description || 'Esplora questa collezione'}
                          </p>
                        </div>
                        <Link
                          href={`/shop?collection=${collection.slug}`}
                          className="hidden md:flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors group"
                        >
                          <span>Vedi tutti</span>
                          <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                        <span className="text-sm text-gray-500 font-medium">
                          {collectionProducts.length} {collectionProducts.length === 1 ? 'prodotto' : 'prodotti'}
                        </span>
                        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                      </div>
                    </div>

                    {/* Griglia Prodotti */}
                    {collectionProducts.length > 0 ? (
                      <>
                        <ProductGrid products={collectionProducts.slice(0, 6)} />

                        {/* Link Vedi Tutti Mobile */}
                        {collectionProducts.length > 6 && (
                          <div className="text-center mt-10 md:hidden">
                            <Link
                              href={`/shop?collection=${collection.slug}`}
                              className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors"
                            >
                              <span>Vedi tutti i prodotti</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        )}

                        {/* Link Vedi Tutti Desktop (se ci sono più di 6 prodotti) */}
                        {collectionProducts.length > 6 && (
                          <div className="text-center mt-12 hidden md:block">
                            <Link
                              href={`/shop?collection=${collection.slug}`}
                              className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary rounded-artistic font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                            >
                              <span>Vedi tutti i {collectionProducts.length} prodotti</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                              </svg>
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-500 text-lg mb-4">Nessun prodotto disponibile in questa collezione al momento.</p>
                        <Link
                          href={`/shop?collection=${collection.slug}`}
                          className="inline-flex items-center gap-2 text-primary hover:text-accent font-semibold transition-colors"
                        >
                          <span>Esplora la collezione</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )
          })
        ) : (
          <section className="py-20">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <p className="text-gray-500 text-lg">Nessuna collezione disponibile al momento.</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
