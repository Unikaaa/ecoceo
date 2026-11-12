'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/products?featured=true&limit=6', {
          cache: 'no-store',
        })
        const data = await response.json()
        if (response.ok && data.products?.length) {
          setFeatured(data.products.slice(0, 6))
          return
        }

        // Fallback non inventato: ultimi prodotti reali se nessun featured
        const fallback = await fetch('/api/products?limit=6', { cache: 'no-store' })
        const fallbackData = await fallback.json()
        if (fallback.ok && fallbackData.products) {
          setFeatured(fallbackData.products.slice(0, 6))
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
    <section className="section-shell bg-site relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <p className="section-eyebrow">Selezione</p>
          <h2 className="section-title mb-3">Le creazioni più amate</h2>
          <p className="section-lead mx-auto">
            Prodotti reali dal catalogo, con prezzi e disponibilità aggiornati.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 max-w-7xl mx-auto">
          {isLoading &&
            [0, 1, 2, 3].map((idx) => (
              <div key={`skeleton-${idx}`} className="overflow-hidden rounded-2xl border border-sand bg-warm animate-pulse">
                <div className="aspect-[4/5] bg-sand/70" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-sand rounded w-3/4" />
                  <div className="h-4 bg-sand rounded w-1/3" />
                </div>
              </div>
            ))}

          {!isLoading &&
            featured.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group overflow-hidden rounded-2xl border border-sand bg-warm transition-all duration-soft hover:-translate-y-0.5 hover:border-[color:var(--bronze)]/50"
              >
                <div className="aspect-[1/1] sm:aspect-[4/5] relative overflow-hidden bg-[#efe8df]">
                  {product.images?.[0] && product.images[0] !== '/placeholder-product.jpg' ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-gallery group-hover:scale-[1.03]"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-ink">
                      Immagine
                    </div>
                  )}
                </div>
                <div className="p-3.5 sm:p-5">
                  <h3 className="font-serif text-base sm:text-xl text-ink mb-1.5 group-hover:text-[color:var(--brand)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-serif text-lg sm:text-xl text-[color:var(--bronze)]">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
        </div>

        {!isLoading && featured.length === 0 ? (
          <p className="text-center text-sm text-muted-ink mt-8">
            Nessun prodotto disponibile al momento.
          </p>
        ) : null}

        <div className="text-center mt-10 md:mt-14">
          <Link href="/shop">
            <Button variant="primary" size="lg">
              Vedi tutto lo shop
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
