'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CartItem as CartItemType } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/lib/store/cartStore'
import { useTranslations } from '@/lib/i18n/hooks'
import Button from '@/components/ui/Button'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const t = useTranslations('cart')
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.id)
    } else {
      updateQuantity(item.id, newQuantity)
    }
  }

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 bg-gradient-to-br from-ceramic-beige to-ceramic-sand rounded-artistic flex items-center justify-center">
          <span className="text-xs text-gray-400">Img</span>
        </div>
      </Link>

      <div className="flex-grow">
        <Link href={`/shop/${item.slug}`}>
          <h3 className="font-medium text-gray-900 hover:text-primary transition mb-2">
            {item.name}
          </h3>
        </Link>
        <p className="text-primary font-semibold mb-4">
          {formatPrice(item.price)}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-artistic">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
            >
              -
            </button>
            <span className="px-4 py-1 min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="px-3 py-1 hover:bg-gray-100 transition"
            >
              +
            </button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeItem(item.id)}
            className="text-red-600 hover:text-red-700"
          >
            {t('remove')}
          </Button>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-gray-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>
    </div>
  )
}
