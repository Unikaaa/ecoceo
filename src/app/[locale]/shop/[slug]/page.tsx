'use client'

import { notFound } from 'next/navigation'
import { mockProducts } from '@/lib/data/mockProducts'
import ProductGallery from '@/components/shop/ProductGallery'
import ProductInfo from '@/components/shop/ProductInfo'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const product = mockProducts.find((p) => p.slug === params.slug)

  if (!product) {
    notFound()
  }

  const handleAddToCart = (product: any, quantity: number) => {
    // Will be connected to cart store in next prompt
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
