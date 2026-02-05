'use client'

import { useEffect, useState } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import { calculatePrice, PricingResult } from '@/lib/personalizza/pricing'

interface PriceCalculatorProps {
  state: PersonalizzaState
  onPriceUpdate: (price: number) => void
}

export default function PriceCalculator({
  state,
  onPriceUpdate,
}: PriceCalculatorProps) {
  const [pricing, setPricing] = useState<PricingResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (
      state.sizeId &&
      state.styleId &&
      state.productTypeId &&
      state.categoryId
    ) {
      calculateCurrentPrice()
    }
  }, [
    state.sizeId,
    state.styleId,
    state.backgroundId,
    state.decorations,
  ])

  const calculateCurrentPrice = async () => {
    if (!state.sizeId || !state.styleId) return

    setIsCalculating(true)
    try {
      const result = await calculatePrice({
        sizeId: state.sizeId,
        styleId: state.styleId,
        backgroundId: state.backgroundId || null,
        decorationIds: state.decorations || [],
      })
      setPricing(result)
      onPriceUpdate(result.totalPrice)
    } catch (error) {
      console.error('Errore calcolo prezzo:', error)
    } finally {
      setIsCalculating(false)
    }
  }

  if (!pricing) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Calcolo prezzo...</span>
          {isCalculating && (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#663399]"></div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Riepilogo Prezzo
      </h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{pricing.breakdown.size.name}</span>
          <span className="font-medium">€{pricing.basePrice.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Stile: {pricing.breakdown.style.name}</span>
          <span className="font-medium">
            {pricing.stylePrice > 0 ? `+€${pricing.stylePrice.toFixed(2)}` : 'Incluso'}
          </span>
        </div>

        {pricing.breakdown.background && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              Sfondo: {pricing.breakdown.background.name}
            </span>
            <span className="font-medium">
              {pricing.backgroundPrice > 0
                ? `+€${pricing.backgroundPrice.toFixed(2)}`
                : 'Incluso'}
            </span>
          </div>
        )}

        {pricing.breakdown.decorations.length > 0 && (
          <>
            {pricing.breakdown.decorations.map((dec, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">Decorazione: {dec.name}</span>
                <span className="font-medium">
                  {dec.price > 0 ? `+€${dec.price.toFixed(2)}` : 'Incluso'}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">Totale</span>
          <span className="text-2xl font-bold text-[#663399]">
            €{pricing.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
