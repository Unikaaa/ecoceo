'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        // Aggiungi timestamp per evitare cache
        const response = await fetch(`/api/collections?t=${Date.now()}`)
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

  const handleMouseEnter = (categoryId: string) => {
    setHoveredCategory(categoryId)
    // Imposta subito l'indice a 1 per mostrare l'immagine hover
    setImageIndex((prev) => ({
      ...prev,
      [categoryId]: 1,
    }))
  }

  const handleMouseLeave = () => {
    setHoveredCategory(null)
    // Ritorna all'immagine originale (indice 0)
    setImageIndex((prev) => {
      const newIndex = { ...prev }
      Object.keys(newIndex).forEach((key) => {
        newIndex[key] = 0
      })
      return newIndex
    })
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-site">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16 text-gray-900">
            Le Nostre Collezioni
          </h2>
          <div className="text-center py-12">
            <p className="text-gray-600">Caricamento collezioni...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-site">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-serif text-center mb-16 text-gray-900">
          Le Nostre Collezioni
        </h2>
        {collections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Nessuna collezione disponibile</p>
          </div>
        ) : (
          <div className="overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-custom py-4">
            <div className="flex gap-8 min-w-max px-4">
              {collections.map((collection) => {
                const isHovered = hoveredCategory === collection.id

                return (
                  <Link
                    key={collection.id}
                    href={`/shop?collection=${collection.slug}`}
                    className="group relative overflow-hidden rounded-artistic bg-gray-100 aspect-[3/4] w-[calc(100vw-2rem)] sm:w-[calc(50vw-1.5rem)] lg:w-[calc(25vw-1.5rem)] min-w-[270px] max-w-[350px] transition-transform hover:scale-105 snap-start flex-shrink-0"
                    onMouseEnter={() => handleMouseEnter(collection.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 transition-opacity group-hover:opacity-90" />
                    
                    {/* Titolo */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <h3 className="text-white text-2xl font-serif group-hover:translate-y-[-4px] transition-transform">
                        {collection.name}
                      </h3>
                    </div>

                    {/* Immagine principale - sempre visibile quando non in hover */}
                    {collection.image_url ? (
                      <div
                        className={`absolute inset-0 transition-opacity duration-500 ${
                          isHovered && collection.hover_image_url ? 'opacity-0' : 'opacity-100'
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
                          isHovered ? 'opacity-100' : 'opacity-0'
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
        )}
      </div>
    </section>
  )
}
