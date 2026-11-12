'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/mockProducts'
import ProductGrid from '@/components/shop/ProductGrid'
import { useTranslations } from '@/lib/i18n/hooks'

interface Collection {
  id: string
  name: string
  slug: string
  image_url?: string | null
  is_active: boolean
  display_order: number
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-600">Caricamento shop...</p>
          </div>
        </div>
      }
    >
      <ShopPageInner />
    </Suspense>
  )
}

function ShopPageInner() {
  const t = useTranslations('shop')
  const router = useRouter()
  const searchParams = useSearchParams()
  const collectionSlug = searchParams?.get('collection')
  const [products, setProducts] = useState<Product[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingCollections, setIsLoadingCollections] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        // Se c'è un filtro per collezione, usa category (che corrisponde a section del prodotto)
        // section del prodotto deve corrispondere allo slug della collezione
        const url = collectionSlug 
          ? `/api/products?category=${encodeURIComponent(collectionSlug)}`
          : '/api/products'
        const response = await fetch(url)
        const data = await response.json()
        if (response.ok && data.products) {
          setProducts(data.products)
        } else {
          console.error('Errore risposta API:', data)
        }
      } catch (error) {
        console.error('Errore caricamento prodotti:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchCollections = async () => {
      try {
        setIsLoadingCollections(true)
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

    // Ascolta eventi di aggiornamento (solo quando necessario, es. dalla dashboard)
    const handleCollectionsUpdate = () => {
      fetchCollections()
    }
    const handleProductsUpdate = () => {
      fetchProducts()
    }
    
    window.addEventListener('collectionsUpdated', handleCollectionsUpdate)
    window.addEventListener('productsUpdated', handleProductsUpdate)

    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdate)
      window.removeEventListener('productsUpdated', handleProductsUpdate)
    }
  }, [collectionSlug])

  const handleCollectionClick = (slug: string) => {
    if (slug === collectionSlug) {
      // Se clicchi sulla collezione già attiva, rimuovi il filtro (mostra tutti)
      router.push('/shop')
    } else {
      router.push(`/shop?collection=${slug}`)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Caricamento prodotti...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-5 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-4 sm:mb-7 text-center">
        {t('title')}
      </h1>

      {/* Barra Collezioni - Design Pills Minimal Luxury */}
      {!isLoadingCollections && collections.length > 0 && (
        <div className="mb-5 sm:mb-10">
          {/* Container con scroll orizzontale su mobile */}
          <div className="overflow-x-auto scrollbar-hide -mx-3 px-3 sm:-mx-4 sm:px-4">
            <div className="flex items-center justify-start md:justify-center gap-2 min-w-max md:min-w-0">
              {/* Pills Collezioni */}
              <button
                onClick={() => router.push('/shop')}
                className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ease-out whitespace-nowrap ${
                  !collectionSlug
                    ? 'bg-[#6D4C97]/8 border border-[#6D4C97] text-[#6D4C97] shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {/* Icona Grid */}
                <svg className="w-3 h-3 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="text-xs sm:text-sm font-medium">Tutte</span>
              </button>

              {/* Collezioni - Pills con Icone Diverse */}
              {collections.map((collection) => {
                const isActive = collectionSlug === collection.slug
                
                // Icone diverse e uniche per ogni tipo di collezione - Design Minimal Luxury
                const getCollectionIcon = (slug: string, name: string) => {
                  const iconMap: Record<string, JSX.Element> = {
                    'gioielleria': (
                      // Icona gioiello/ciondolo elegante
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2L8 4v6l4 2 4-2V4l-4-2zM8 14l4 2 4-2M8 14v6l4 2 4-2v-6" />
                      </svg>
                    ),
                    'set-e-kit': (
                      // Icona scatola/kit elegante
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    ),
                    'collezionismo': (
                      // Icona museo/trophy/collezione
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    ),
                    'piatti': (
                      // Icona piatto/cerchio elegante
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12a3 3 0 106 0 3 3 0 00-6 0z" />
                      </svg>
                    ),
                    'eventi-e-regali': (
                      // Icona regalo/fiocco elegante
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    ),
                  }
                  
                  // Cerca per slug prima, poi per nome (case insensitive)
                  const lowerSlug = slug.toLowerCase()
                  const lowerName = name.toLowerCase()
                  
                  if (iconMap[lowerSlug]) {
                    return iconMap[lowerSlug]
                  }
                  
                  // Fallback: cerca per parole chiave nel nome
                  if (lowerName.includes('gioiell') || lowerName.includes('gioiello')) {
                    return iconMap['gioielleria']
                  }
                  if (lowerName.includes('set') || lowerName.includes('kit')) {
                    return iconMap['set-e-kit']
                  }
                  if (lowerName.includes('collezion')) {
                    return iconMap['collezionismo']
                  }
                  if (lowerName.includes('piatto') || lowerName.includes('oggetto')) {
                    return iconMap['piatti']
                  }
                  if (lowerName.includes('event') || lowerName.includes('regal')) {
                    return iconMap['eventi-e-regali']
                  }
                  
                  // Icona generica elegante come fallback
                  return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  )
                }
                
                return (
                  <button
                    key={collection.id}
                    onClick={() => handleCollectionClick(collection.slug)}
                    className={`group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ease-out whitespace-nowrap ${
                      isActive
                        ? 'bg-[#6D4C97]/8 border border-[#6D4C97] text-[#6D4C97] shadow-sm'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {/* Icona Collezione */}
                    <span className={`transition-all duration-500 ${
                      isActive ? 'text-[#6D4C97]' : 'text-gray-500 group-hover:text-[#6D4C97]'
                    }`}>
                      {getCollectionIcon(collection.slug, collection.name)}
                    </span>
                    
                    {/* Nome Collezione */}
                    <span className={`text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-[#6D4C97]' 
                        : 'text-gray-700 group-hover:text-[#6D4C97]'
                    }`}>
                      {collection.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Griglia Prodotti */}
      {!isLoading && products.length === 0 ? (
        <div className="mx-auto max-w-xl text-center py-10 sm:py-14">
          <p className="font-serif text-xl text-[#2a2420] mb-2">
            {collectionSlug ? 'Nessun prodotto in questa collezione' : 'Nessun prodotto disponibile'}
          </p>
          <p className="text-sm text-[#6b635c] leading-relaxed mb-5">
            {collectionSlug
              ? 'La collezione è attiva, ma in magazzino non ci sono ancora prodotti con questa sezione. In dashboard, assegna ai prodotti lo stesso slug della collezione.'
              : 'I prodotti pubblicati dallo shop arrivano dal magazzino. Aggiungili dalla dashboard.'}
          </p>
          {collectionSlug ? (
            <button
              onClick={() => router.push('/shop')}
              className="text-sm text-[#663399] hover:underline"
            >
              Vedi tutti i prodotti
            </button>
          ) : null}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  )
}
