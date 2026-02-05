'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Order } from '@/types/order'
import { formatPrice } from '@/lib/utils'

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sessionId) {
      setLoading(false)
      return
    }

    // Fetch order by payment intent (from session)
    const fetchOrder = async () => {
      try {
        // In production, you would fetch order by session_id
        // For now, we'll try to get the latest order
        const response = await fetch('/api/orders')
        if (response.ok) {
          const orders = await response.json()
          // Find order with matching session (simplified - in production use proper lookup)
          if (orders.length > 0) {
            setOrder(orders[orders.length - 1])
          }
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Errore nel recupero dell\'ordine')
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [sessionId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento ordine...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-serif text-gray-900 mb-4">
            Ordine Confermato!
          </h1>
          {error ? (
            <p className="text-red-600 mb-8">{error}</p>
          ) : (
            <p className="text-gray-600 mb-8">
              Grazie per il tuo acquisto. Riceverai una email di conferma a breve.
            </p>
          )}
        </div>

        {order && (
          <div className="bg-white rounded-artistic p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-serif mb-4">Riepilogo Ordine</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Numero Ordine:</span>
                <span className="font-semibold">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Data:</span>
                <span>{new Date(order.createdAt).toLocaleDateString('it-IT')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stato:</span>
                <span className="capitalize">{order.status}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-3">Prodotti:</h3>
              <ul className="space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Totale:</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center space-y-4">
          <Link href="/shop">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Continua lo Shopping
            </Button>
          </Link>
          <Link href="/" className="block text-gray-600 hover:text-primary transition">
            Torna alla Home
          </Link>
        </div>
      </div>
    </div>
  )
}
