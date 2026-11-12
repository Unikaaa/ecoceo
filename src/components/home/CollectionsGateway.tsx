'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PRESENTATION_CATEGORIES } from '@/lib/presentationCategories'

type Collection = {
  id: string
  name: string
  slug: string
  image_url?: string | null
  hover_image_url?: string | null
  is_active?: boolean
}

export default function CollectionsGateway() {
  const [collections, setCollections] = useState<Collection[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch('/api/collections', { cache: 'no-store' })
        const data = await response.json()
        if (response.ok && data.collections) {
          setCollections(
            data.collections.filter((c: Collection) => c.is_active !== false)
          )
        }
      } catch (error) {
        console.error('Errore caricamento collezioni:', error)
      }
    }
    load()
  }, [])

  const resolveImage = (slugs: string[]) => {
    for (const slug of slugs) {
      const match = collections.find((c) => c.slug === slug)
      if (match?.image_url) return match.image_url
      if (match?.hover_image_url) return match.hover_image_url
    }
    return null
  }

  return (
    <section className="section-shell bg-warm border-y border-sand">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mb-10 md:mb-14">
          <p className="section-eyebrow">Collezioni</p>
          <h2 className="section-title mb-3">Trova la tua creazione</h2>
          <p className="section-lead">
            Esplora le nostre collezioni, tra arte, materia e personalizzazione.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {PRESENTATION_CATEGORIES.map((category, index) => {
            const image = resolveImage(category.collectionSlugs)
            const tall = index % 3 === 0

            return (
              <Link
                key={category.id}
                href={category.href}
                className={`group relative overflow-hidden rounded-2xl bg-[#efe8df] min-h-[260px] md:min-h-[320px] ${
                  tall ? 'md:row-span-1' : ''
                }`}
              >
                {image ? (
                  <Image
                    src={image}
                    alt={category.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-gallery group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e8e2d8] via-[#f7f5f0] to-[#d9cfc0]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#262522]/75 via-[#262522]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-sm text-white/80 leading-relaxed max-w-md">
                    {category.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {collections.length > 0 ? (
          <div className="mt-10 md:mt-14">
            <div className="organic-divider mb-8" />
            <p className="section-eyebrow mb-4">Dal catalogo</p>
            <div className="flex flex-wrap gap-2.5">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/shop?collection=${collection.slug}`}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-sand bg-site px-4 text-sm text-ink hover:border-[color:var(--bronze)] hover:text-[color:var(--bronze)] transition-colors"
                >
                  {collection.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
