'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/hooks'
import Modal from '@/components/ui/Modal'
import ProductNotification from './ProductNotification'
import { useCartStore } from '@/lib/store/cartStore'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('shop')
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleCardClick = (e: React.MouseEvent) => {
    // Se il prodotto è esaurito, apri il modal invece di navigare
    if (!product.inStock) {
      e.preventDefault()
      e.stopPropagation()
      setIsNotificationModalOpen(true)
    }
  }

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.inStock || isAddingToCart) return
    setIsAddingToCart(true)
    addItem(product, 1)
    await new Promise((resolve) => setTimeout(resolve, 250))
    setIsAddingToCart(false)
  }

  return (
    <div className={`group bg-white rounded-artistic overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col ${
      !product.inStock ? 'opacity-95' : ''
    } ${
      product.featured
        ? 'ring-2 ring-amber-200/70 shadow-[0_16px_40px_-22px_rgba(180,83,9,0.45)]'
        : ''
    }`}>
      <Link href={product.inStock ? `/shop/${product.slug}` : '#'} onClick={handleCardClick}>
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

          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {product.featured && (
            <div className="absolute top-4 left-4 z-20">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50/95 to-yellow-50/95 backdrop-blur-sm text-amber-900 rounded-xl shadow-lg border border-amber-200/90">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.922-.755 1.688-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.196-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81H7.03a1 1 0 00.95-.69l1.07-3.292z" />
                  </svg>
                </span>
                <div className="leading-tight">
                  <p className="text-[11px] font-bold uppercase tracking-wider">Favorito</p>
                  <p className="text-[10px] text-amber-700 font-medium">Piu venduto</p>
                </div>
              </div>
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-[2px] flex items-center justify-center z-20">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:8px_8px]" />
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/40 via-red-500/30 to-red-600/40 blur-xl rounded-full" />
                <span className="relative px-6 py-3 bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white font-bold text-base uppercase tracking-widest rounded-full shadow-2xl border-2 border-white/40 backdrop-blur-sm">
                  ESAURITO
                </span>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full" />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 md:p-8">
          <h3 className="text-lg md:text-xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 text-center leading-tight">
            {product.name}
          </h3>
          <div className="text-center space-y-2 pt-3 border-t border-gray-100">
            <p className="text-2xl md:text-3xl font-serif font-semibold text-primary">
              {formatPrice(product.price)}
            </p>
            {product.inStock ? (
              <p className="text-xs text-green-600 font-medium flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('inStock')}
              </p>
            ) : (
              <p className="text-xs text-red-600 font-bold uppercase tracking-wider">ESAURITO</p>
            )}
          </div>
        </div>
      </Link>

      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-1 mt-auto">
        <div className="grid grid-cols-2 gap-2">
          {product.inStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="px-3 py-2 rounded-lg bg-[#c45824] text-white text-xs font-semibold hover:bg-[#663399] transition-colors disabled:opacity-70"
            >
              {isAddingToCart ? 'Aggiungo...' : 'Aggiungi al carrello'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="px-3 py-2 rounded-lg bg-[#663399] text-white text-xs font-semibold hover:bg-[#552288] transition-colors"
            >
              Avvisami
            </button>
          )}
          <Link
            href={`/shop/${product.slug}`}
            className="px-3 py-2 rounded-lg bg-white border border-[#663399] text-[#663399] text-xs font-semibold hover:bg-[#663399] hover:text-white transition-colors text-center"
          >
            Dettagli
          </Link>
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
    </div>
  )
}
