'use client'

import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPrice } from '@/lib/utils'
import { useTranslations } from '@/lib/i18n/hooks'
import CheckoutButton from './CheckoutButton'

const SHIPPING_COST = 10.0

export default function CartSummary() {
  const t = useTranslations('cart')
  const subtotal = useCartStore((state) => state.getTotal())
  const clearCart = useCartStore((state) => state.clearCart)
  const total = subtotal + SHIPPING_COST

  return (
    <div className="bg-gray-50 rounded-artistic p-6 sticky top-24">
      <h2 className="text-xl font-serif mb-4">{t('title')}</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-700">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-gray-700">
          <span>{t('shipping')}</span>
          <span>{formatPrice(SHIPPING_COST)}</span>
        </div>
        <div className="border-t border-gray-300 pt-3 flex justify-between text-lg font-semibold">
          <span>{t('total')}</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <CheckoutButton />

      <button
        type="button"
        onClick={() => clearCart()}
        className="w-full mt-3 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
      >
        Svuota carrello
      </button>

      <Link href="/shop" className="block mt-4 text-center text-gray-600 hover:text-primary transition">
        {t('continueShopping')}
      </Link>
    </div>
  )
}
