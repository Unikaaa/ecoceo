'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const displayImages = images.length > 0 ? images : ['/placeholder-product.jpg']

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-br from-ceramic-beige to-ceramic-sand rounded-artistic overflow-hidden relative">
        {displayImages[selectedImage] && displayImages[selectedImage] !== '/placeholder-product.jpg' ? (
          <Image
            src={displayImages[selectedImage]}
            alt={productName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400">Immagine principale</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-artistic overflow-hidden border-2 transition relative ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              {image && image !== '/placeholder-product.jpg' ? (
                <Image
                  src={image}
                  alt={`${productName} - Immagine ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 25vw, 12.5vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-ceramic-beige to-ceramic-sand flex items-center justify-center">
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
