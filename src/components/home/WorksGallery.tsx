'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

type ArtCreation = {
  id: string
  name: string
  description: string
  short_description?: string
  category: string
  slug: string
  images: string[]
  art_gallery_order?: number
}

type ArtCollection = {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
}

export default function WorksGallery() {
  const [creations, setCreations] = useState<ArtCreation[]>([])
  const [collections, setCollections] = useState<ArtCollection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [warning, setWarning] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, colRes] = await Promise.all([
          fetch('/api/products?artGallery=true&limit=12', { cache: 'no-store' }),
          fetch('/api/collections?artGallery=true', { cache: 'no-store' }),
        ])
        const prodData = await prodRes.json()
        const colData = await colRes.json()

        if (prodRes.ok) setCreations(prodData.products || [])
        if (colRes.ok) setCollections(colData.collections || [])
        setWarning(prodData.warning || colData.warning || null)
      } catch (error) {
        console.error('Errore galleria artistica:', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()

    const refresh = () => load()
    window.addEventListener('productsUpdated', refresh)
    window.addEventListener('collectionsUpdated', refresh)
    return () => {
      window.removeEventListener('productsUpdated', refresh)
      window.removeEventListener('collectionsUpdated', refresh)
    }
  }, [])

  const collectionName = (slug: string) =>
    collections.find((c) => c.slug === slug)?.name || slug

  const hasContent = creations.length > 0 || collections.length > 0

  return (
    <section className="section-shell bg-site">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10">
          <p className="section-eyebrow">Realizzazioni</p>
          <h2 className="section-title mb-3">Materia che diventa arte</h2>
          <p className="section-lead">
            Opere e collezioni selezionate dal laboratorio. Contenuti pubblicati dalla dashboard.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl bg-sand/60 animate-pulse" />
            ))}
          </div>
        ) : !hasContent ? (
          <div className="rounded-2xl border border-sand bg-warm p-6 sm:p-8 max-w-2xl">
            <p className="text-sm text-muted-ink leading-relaxed mb-4">
              {warning
                ? warning
                : 'Nessuna creazione o collezione abilitata per questa sezione. Dalla dashboard → Creazioni puoi selezionare prodotti e collezioni esistenti.'}
            </p>
            <Link href="/progetti">
              <Button variant="outline">Apri i progetti</Button>
            </Link>
          </div>
        ) : (
          <>
            {collections.length > 0 ? (
              <div className="mb-8 md:mb-12">
                <p className="text-[11px] uppercase tracking-[0.16em] text-bronze mb-4">
                  Collezioni in galleria
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  {collections.map((collection, index) => (
                    <Link
                      key={collection.id}
                      href={`/shop?collection=${collection.slug}`}
                      className={`group relative overflow-hidden rounded-2xl min-h-[240px] md:min-h-[300px] bg-[#efe8df] ${
                        index === 0 ? 'sm:col-span-2 md:min-h-[360px]' : ''
                      }`}
                    >
                      {collection.image_url ? (
                        <Image
                          src={collection.image_url}
                          alt={collection.name}
                          fill
                          className="object-cover transition-transform duration-gallery group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 80vw"
                        />
                      ) : null}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#262522]/75 via-[#262522]/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <h3 className="font-serif text-2xl sm:text-3xl text-white mb-1">
                          {collection.name}
                        </h3>
                        {collection.description ? (
                          <p className="text-sm text-white/80 line-clamp-2">
                            {collection.description}
                          </p>
                        ) : null}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {creations.length > 0 ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.16em] text-bronze mb-4">
                  Creazioni
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {creations.map((item, index) => {
                    const image =
                      item.images?.[0] && item.images[0] !== '/placeholder-product.jpg'
                        ? item.images[0]
                        : null
                    return (
                      <Link
                        key={item.id}
                        href={`/shop/${item.slug}`}
                        className={`group relative overflow-hidden rounded-2xl bg-warm border border-sand ${
                          index % 5 === 0 ? 'sm:row-span-1 lg:col-span-1' : ''
                        }`}
                      >
                        <div className="aspect-[4/5] relative overflow-hidden">
                          {image ? (
                            <Image
                              src={image}
                              alt={item.name}
                              fill
                              className="object-cover transition-transform duration-gallery group-hover:scale-[1.03]"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#f7f5f0] to-[#e8e2d8]" />
                          )}
                        </div>
                        <div className="p-4 sm:p-5">
                          <p className="text-[11px] uppercase tracking-[0.14em] text-bronze mb-1">
                            {collectionName(item.category)}
                          </p>
                          <h3 className="font-serif text-xl text-ink mb-1 group-hover:text-[color:var(--brand)] transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-ink line-clamp-2">
                            {item.short_description || item.description}
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            ) : null}

            <div className="mt-8">
              <Link href="/shop">
                <Button variant="outline">Esplora lo shop</Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
