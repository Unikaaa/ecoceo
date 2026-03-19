'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cartStore'
import { useLocale } from '@/lib/i18n/hooks'

export default function CartIcon() {
  const locale = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.getItemCount())
  const total = useCartStore((state) => state.getTotal())
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false)

  const previewItems = useMemo(() => items.slice(0, 4), [items])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleCheckout = async () => {
    if (items.length === 0) return
    setIsCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      if (!response.ok) throw new Error(data.error || 'Errore checkout')
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      alert(error?.message || 'Errore durante il checkout')
      setIsCheckoutLoading(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative"
        aria-label="Apri mini carrello"
      >
        <svg
          className="w-6 h-6 text-gray-700 hover:text-primary transition"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {mounted && itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount > 9 ? '9+' : itemCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 rounded-xl border border-gray-200 bg-white shadow-2xl z-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">Il tuo carrello</h4>
            <span className="text-xs text-gray-500">{itemCount} articoli</span>
          </div>

          {items.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Carrello vuoto</p>
          ) : (
            <>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {previewItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 rounded-lg border border-gray-100 p-2">
                    <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover bg-gray-100" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="h-5 w-5 rounded border border-gray-300 text-[10px] text-gray-700 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-[11px] text-gray-600 min-w-[16px] text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-5 w-5 rounded border border-gray-300 text-[10px] text-gray-700 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="h-6 w-6 rounded-full text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
                      aria-label="Rimuovi prodotto"
                    >
                      x
                    </button>
                    <p className="text-xs font-semibold text-gray-800">EUR {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
                {items.length > previewItems.length ? (
                  <p className="text-xs text-gray-500 text-center pt-1">+{items.length - previewItems.length} altri prodotti</p>
                ) : null}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Totale</span>
                  <span className="text-sm font-semibold text-gray-900">EUR {total.toFixed(2)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => clearCart()}
                  className="w-full mb-2 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                >
                  Svuota carrello
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="text-center px-3 py-2 rounded-lg text-white text-xs font-semibold bg-[#c45824] hover:bg-[#663399] transition-colors"
                  >
                    Vai al carrello
                  </Link>
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={isCheckoutLoading}
                    className="px-3 py-2 rounded-lg text-white text-xs font-semibold bg-[#663399] hover:bg-[#4c2377] transition-colors disabled:opacity-60"
                  >
                    {isCheckoutLoading ? 'Carico...' : 'Vai al checkout'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
