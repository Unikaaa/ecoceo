'use client'

import { useState, useEffect } from 'react'
import { notFound } from 'next/navigation'
import { Product } from '@/lib/data/mockProducts'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'

interface PageProps {
  params: {
    locale: string
    category: string
    slug: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.slug}?category=${params.category}`)
        const data = await response.json()
        if (response.ok && data.product) {
          setProduct(data.product)
        } else {
          notFound()
        }
      } catch (error) {
        console.error('Errore caricamento prodotto:', error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }
    fetchProduct()
  }, [params.slug, params.category])

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

  const handleAddToCart = (product: any, quantity: number) => {
    console.log('Add to cart:', product, quantity)
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
