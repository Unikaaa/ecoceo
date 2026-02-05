'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/hooks'
import Modal from '@/components/ui/Modal'
import ProductNotification from './ProductNotification'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('shop')
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)

  const handleCardClick = (e: React.MouseEvent) => {
    // Se il prodotto è esaurito, apri il modal invece di navigare
    if (!product.inStock) {
      e.preventDefault()
      e.stopPropagation()
      setIsNotificationModalOpen(true)
    }
  }

  return (
    <Link
      href={product.inStock ? `/shop/${product.slug}` : '#'}
      onClick={handleCardClick}
      className={`group bg-white rounded-artistic overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${
        !product.inStock ? 'opacity-95 cursor-pointer' : ''
      }`}
    >
      <div className="aspect-[4/5] bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand relative overflow-hidden">
        {product.images && product.images[0] && product.images[0] !== '/placeholder-product.jpg' ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-base font-medium relative z-10">Immagine</span>
          </div>
        )}
        
        {/* Overlay hover elegante */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge Featured */}
        {product.featured && (
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm text-primary text-xs font-semibold rounded-full shadow-lg">
              Featured
            </span>
          </div>
        )}

        {/* Campanella Notifica - Solo per prodotti esauriti - Design Premium */}
        {!product.inStock && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            {/* Testo con freccia */}
            <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-gray-200/60">
              <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                Avviso disponibilità
              </span>
              <svg 
                className="w-3 h-3 text-[#663399]" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            
            {/* Campanella */}
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setIsNotificationModalOpen(true)
              }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-white via-white to-gray-50/90 backdrop-blur-md shadow-2xl hover:shadow-[#663399]/20 border-2 border-white/80 hover:border-[#663399]/30 transition-all duration-500 hover:scale-110 hover:rotate-6 flex items-center justify-center group"
              aria-label="Avvisami quando disponibile"
            >
              {/* Glow effect elegante */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#663399]/20 via-[#663399]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
              
              <svg 
                className="w-6 h-6 text-[#663399] group-hover:text-[#552288] transition-all duration-500 group-hover:scale-110 relative z-10" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              
              {/* Badge notifica piccolo */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#c45824] to-[#a0451a] rounded-full border-2 border-white shadow-lg animate-pulse" />
            </button>
          </div>
        )}

        {/* Badge ESAURITO - Design Premium Elegante */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-[2px] flex items-center justify-center z-20">
            {/* Pattern texture sottile */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:8px_8px]" />
            
            {/* Badge centrale elegante */}
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 via-red-500/30 to-red-600/40 blur-xl rounded-full" />
              
              <span className="relative px-6 py-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold text-base uppercase tracking-widest rounded-full shadow-2xl border-2 border-white/40 backdrop-blur-sm">
                ESAURITO
              </span>
              
              {/* Decorazione superiore */}
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 text-center leading-tight">
          {product.name}
        </h3>
        </div>
        
        <div className="text-center space-y-3 pt-4 border-t border-gray-100">
          <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
            {formatPrice(product.price)}
          </p>
          <div className="flex items-center justify-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-sm font-medium">Scopri</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
          {product.inStock ? (
            <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t('inStock')}
            </p>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-xs text-red-600 font-bold uppercase tracking-wider">ESAURITO</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Notifica */}
      <Modal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        title="Avvisami quando disponibile"
        size="md"
      >
        <ProductNotification 
          product={product} 
          onSuccess={() => setIsNotificationModalOpen(false)}
        />
      </Modal>
    </Link>
  )
}
