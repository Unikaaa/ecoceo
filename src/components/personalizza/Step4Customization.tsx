'use client'

import { useState, useEffect } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'

interface Size {
  id: string
  name: string
  width_cm: number
  height_cm: number
  base_price: number
}

interface Step4CustomizationProps {
  state: PersonalizzaState
  updateState: (updates: Partial<PersonalizzaState>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PersonalizzaStep4({
  state,
  updateState,
  onNext,
  onPrev,
}: Step4CustomizationProps) {
  const [sizes, setSizes] = useState<Size[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSizes()
  }, [state.productTypeId])

  const fetchSizes = async () => {
    try {
      const cacheKey = `personalizza_sizes_${state.productTypeId || 'none'}`
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setSizes(JSON.parse(cached))
        setIsLoading(false)
      }

      const query = state.productTypeId ? `?product_type_id=${state.productTypeId}` : ''
      const response = await fetch(`/api/personalizza/sizes${query}`, { cache: 'force-cache' })
      const data = await response.json()
      if (response.ok) {
        const sizesData = data.sizes || []
        setSizes(sizesData)
        sessionStorage.setItem(cacheKey, JSON.stringify(sizesData))
      }
    } catch (error) {
      console.error('Errore caricamento dimensioni:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Scegli la dimensione</h3>
        <p className="text-gray-500 text-sm mb-4">
          Questo passaggio e' dedicato solo alla dimensione della ceramica.
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="p-4 sm:p-5 rounded-2xl border-2 border-gray-200 bg-gray-50 animate-pulse h-[118px] sm:h-[132px]"
              />
            ))}
          </div>
        )}

        {!isLoading && sizes.length === 0 && (
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 text-sm">
            Nessuna dimensione disponibile per questo prodotto.
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => updateState({ sizeId: size.id })}
              className={`relative p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                state.sizeId === size.id
                  ? 'border-[#663399] bg-[#663399]/5 shadow-lg'
                  : 'border-gray-200 hover:border-[#663399]/40 hover:bg-gray-50'
              }`}
            >
              <div className="font-semibold text-gray-900 text-base">{size.name}</div>
              <div className="text-sm text-gray-500 mt-1">
                {size.width_cm} × {size.height_cm} cm
              </div>
              <div className="text-base font-bold text-[#663399] mt-2">
                €{size.base_price.toFixed(2)}
              </div>
              {state.sizeId === size.id && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-[#663399] rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottoni Navigazione */}
      <div className="flex justify-between items-center pt-5 border-t border-gray-200">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-4 sm:px-6"
        >
          ← Indietro
        </Button>
        <Button
          onClick={onNext}
          disabled={!state.sizeId}
          variant="primary"
          className="px-6 sm:px-8"
        >
          Avanti →
        </Button>
      </div>
    </div>
  )
}
