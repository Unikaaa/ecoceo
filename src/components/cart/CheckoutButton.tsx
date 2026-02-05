'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/cartStore'
import { useLocale } from '@/lib/i18n/hooks'
import Button from '@/components/ui/Button'

export default function CheckoutButton() {
  const router = useRouter()
  const locale = useLocale()
  const items = useCartStore((state) => state.items)
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          locale,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(error.message || 'Errore durante il checkout. Riprova.')
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleCheckout}
      disabled={isLoading || items.length === 0}
      className="w-full"
    >
      {isLoading ? 'Caricamento...' : 'Procedi al Checkout'}
    </Button>
  )
}
