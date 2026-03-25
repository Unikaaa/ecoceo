'use client'

import { useCartStore } from '@/lib/store/cartStore'
import { useTranslations } from '@/lib/i18n/hooks'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function CartPage() {
  const t = useTranslations('cart')
  const items = useCartStore((state) => state.items)

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl font-serif mb-3">{t('title')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6">{t('empty')}</p>
          <Link href="/shop">
            <Button variant="primary" size="lg">
              {t('continueShopping')}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-serif mb-5 sm:mb-7">{t('title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-7">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-artistic p-4 sm:p-6">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
