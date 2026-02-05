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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-serif mb-4">{t('title')}</h1>
          <p className="text-gray-600 mb-8">{t('empty')}</p>
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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif mb-8">{t('title')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-artistic p-6">
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
