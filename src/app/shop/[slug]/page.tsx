'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Product } from '@/lib/data/mockProducts'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'

interface PageProps {
  params: {
    slug: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Decodifica lo slug per gestire caratteri speciali
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
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Caricamento prodotto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  const handleAddToCart = (product: Product, quantity: number) => {
    // Il componente ProductInfo gestisce già l'aggiunta al carrello tramite useCartStore
    // Questo handler è solo per eventuali callback aggiuntivi
    console.log('Prodotto aggiunto al carrello:', product.name, 'Quantità:', quantity)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductInfo product={product} onAddToCart={handleAddToCart} />
      </div>
    </div>
  )
}
