'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { Product } from '@/lib/data/mockProducts'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const decodedSlug = decodeURIComponent(params.slug)
        const response = await fetch(`/api/products/${encodeURIComponent(decodedSlug)}`)
        const data = await response.json()

        if (response.ok && data.product) {
          setProduct(data.product)
        } else {
          console.error('Prodotto non trovato:', decodedSlug, data)
          notFound()
        }
      } catch (error) {
        console.error('Errore caricamento prodotto:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="text-center">
          <p className="text-gray-600">Caricamento prodotto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleAddToCart = (addedProduct: Product, quantity: number) => {
    // ProductInfo gestisce gia l'aggiunta al carrello con lo store globale.
    console.log('Prodotto aggiunto al carrello:', addedProduct.name, 'Quantita:', quantity)
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}
