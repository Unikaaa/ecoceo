'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

export default function Categories() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const [imageIndex, setImageIndex] = useState<Record<string, number>>({})
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch('/api/collections')
        const data = await response.json()
        if (response.ok && data.collections) {
          // Filtra solo collezioni attive e ordina per display_order
          const activeCollections = data.collections
            .filter((c: Collection) => c.is_active !== false) // Mostra tutte se is_active non esiste
            .sort((a: Collection, b: Collection) => a.display_order - b.display_order)
          setCollections(activeCollections)
        }
      } catch (error) {
        console.error('Errore caricamento collezioni:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCollections()

        // Ascolta eventi di aggiornamento collezioni (solo quando necessario)
        const handleCollectionsUpdate = () => {
          fetchCollections()
        }
        window.addEventListener('collectionsUpdated', handleCollectionsUpdate)

        return () => {
          window.removeEventListener('collectionsUpdated', handleCollectionsUpdate)
        }
  }, [])

  useEffect(() => {
    if (collections.length === 0 || hoveredCategory) return

    const interval = window.setInterval(() => {
      setImageIndex((prev) => {
        const next = { ...prev }
        collections.forEach((collection) => {
          if (!collection.hover_image_url) {
            next[collection.id] = 0
            return
          }
          next[collection.id] = next[collection.id] === 1 ? 0 : 1
        })
        return next
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [collections, hoveredCategory])

  const handleMouseEnter = (categoryId: string) => {
    setHoveredCategory(categoryId)
    setImageIndex((prev) => ({
      ...prev,
      [categoryId]: 1,
    }))
  }

  const handleMouseLeave = (categoryId: string) => {
    setHoveredCategory(null)
    setImageIndex((prev) => ({ ...prev, [categoryId]: 0 }))
  }

  const scrollCollections = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return
    const scrollAmount = 360
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  if (isLoading) {
    return (
      <section className="py-12 md:py-20 bg-site">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-center mb-8 md:mb-16 text-gray-900">
            Le Nostre Collezioni
          </h2>
          <div className="relative pt-1 pb-6 md:pb-8">
            <button
              type="button"
              onClick={() => scrollCollections('left')}
              aria-label="Scorri collezioni a sinistra"
              className="hidden md:flex absolute -left-6 lg:-left-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white text-[#663399] shadow-lg border border-gray-200 hover:bg-[#663399] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCollections('right')}
              aria-label="Scorri collezioni a destra"
              className="hidden md:flex absolute -right-6 lg:-right-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white text-[#663399] shadow-lg border border-gray-200 hover:bg-[#663399] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div ref={sliderRef} className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-custom py-2 md:py-4">
              <div className="flex gap-4 md:gap-8 min-w-max px-1 md:px-4">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="aspect-[3/4] w-[82vw] sm:w-[calc(50vw-1.5rem)] lg:w-[calc(25vw-1.5rem)] min-w-[230px] max-w-[350px] rounded-artistic bg-gray-200 animate-pulse"
                />
              ))}
            </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-7 md:py-20 lg:py-24 bg-site">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <h2 className="text-lg sm:text-2xl md:text-4xl font-serif text-center mb-4 md:mb-14 lg:mb-16 text-gray-900">
          Le Nostre Collezioni
        </h2>
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nessuna collezione disponibile</p>
          </div>
        ) : (
          <div className="relative pt-1 pb-5 md:pb-9 lg:pb-10">
            <button
              type="button"
              onClick={() => scrollCollections('left')}
              aria-label="Scorri collezioni a sinistra"
              className="hidden md:flex absolute -left-6 lg:-left-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white text-[#663399] shadow-lg border border-gray-200 hover:bg-[#663399] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCollections('right')}
              aria-label="Scorri collezioni a destra"
              className="hidden md:flex absolute -right-6 lg:-right-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full bg-white text-[#663399] shadow-lg border border-gray-200 hover:bg-[#663399] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div ref={sliderRef} className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-custom py-1.5 md:py-4 lg:py-5">
              <div className="flex gap-2.5 md:gap-7 lg:gap-8 min-w-max px-1 md:px-4 lg:px-5">
              {collections.map((collection) => {
                const isHovered = hoveredCategory === collection.id
                const currentImageIndex = isHovered ? 1 : imageIndex[collection.id] ?? 0

                return (
                  <Link
                    key={collection.id}
                    href={`/shop?collection=${collection.slug}`}
                    className="group relative overflow-hidden rounded-artistic bg-gray-100 aspect-[3/4] w-[62vw] sm:w-[calc(50vw-1.5rem)] lg:w-[calc(25vw-1.5rem)] min-w-[165px] max-w-[350px] transition-transform hover:scale-[1.01] md:hover:scale-105 snap-start flex-shrink-0"
                    onMouseEnter={() => handleMouseEnter(collection.id)}
                    onMouseLeave={() => handleMouseLeave(collection.id)}
                  >
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />
                    
                    {/* Titolo */}
                    <div className="absolute bottom-2.5 md:bottom-6 left-2.5 md:left-6 right-2.5 md:right-6 z-20">
                      <h3 className="text-white text-[15px] sm:text-lg md:text-2xl font-serif leading-tight group-hover:translate-y-[-4px] transition-transform">
                        {collection.name}
                      </h3>
                    </div>

                    {/* Immagine principale - sempre visibile quando non in hover */}
                    {collection.image_url ? (
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          collection.hover_image_url && currentImageIndex === 1 ? 'opacity-0' : 'opacity-100'
                        }`}
                      >
                        <Image
                          src={collection.image_url}
                          alt={collection.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          priority={false}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-ceramic-beige to-ceramic-sand" />
                    )}

                    {/* Immagine hover - appare solo quando c'è hover e hover_image_url esiste */}
                    {collection.hover_image_url && (
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          currentImageIndex === 1 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <Image
                          src={collection.hover_image_url}
                          alt={`${collection.name} hover`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          priority={false}
                        />
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
