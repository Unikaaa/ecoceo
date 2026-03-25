'use client'

import { useState } from 'react'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/hooks'
import { useCartStore } from '@/lib/store/cartStore'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ProductNotification from './ProductNotification'

interface ProductInfoProps {
  product: Product
  onAddToCart: (product: Product, quantity: number) => void
}

export default function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const t = useTranslations('product')
  const tShop = useTranslations('shop')
  const addItem = useCartStore((state) => state.addItem)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = () => {
    addItem(product, quantity)
    onAddToCart(product, quantity)
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 mb-3">
          {product.name}
        </h1>
        <p className="text-2xl sm:text-3xl font-semibold text-primary mb-3">
          {formatPrice(product.price)}
        </p>
        {product.inStock ? (
          <p className="text-sm sm:text-base text-green-600 font-medium">{tShop('inStock')}</p>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-red-600 font-bold uppercase tracking-wide text-base sm:text-lg">ESAURITO</p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg sm:text-xl font-serif mb-2">{t('description')}</h2>
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{product.description}</p>
      </div>

      {product.inStock ? (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('quantity')}
            </label>
            <Input
              type="number"
              min="1"
              max="10"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 h-11"
            />
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleAddToCart}
            className="w-full"
          >
            {t('addToCart')}
          </Button>
        </div>
      ) : (
        <div className="pt-4 border-t border-gray-200">
          <ProductNotification product={product} />
        </div>
      )}
    </div>
  )
}
