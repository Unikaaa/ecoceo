'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'

interface ProductType {
  id: string
  category_id: string
  name: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  is_active: boolean
}

interface Step2ProductTypeProps {
  state: PersonalizzaState
  updateState: (updates: Partial<PersonalizzaState>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PersonalizzaStep2({
  state,
  updateState,
  onNext,
  onPrev,
}: Step2ProductTypeProps) {
  const [productTypes, setProductTypes] = useState<ProductType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (state.categoryId) {
      fetchProductTypes()
    }
  }, [state.categoryId])

  const fetchProductTypes = async () => {
    try {
      const response = await fetch(
        `/api/personalizza/product-types?category_id=${state.categoryId}`
      )
      const data = await response.json()
      if (response.ok) {
        setProductTypes(data.productTypes || [])
      }
    } catch (error) {
      console.error('Errore caricamento tipi prodotto:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectProductType = (productTypeId: string) => {
    updateState({ productTypeId })
    // Auto-avanza allo step successivo al click
    onNext()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#663399]"></div>
      </div>
    )
  }

  return (
    <div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {productTypes.map((productType) => (
          <button
            key={productType.id}
            onClick={() => handleSelectProductType(productType.id)}
            className={`group relative p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
              state.productTypeId === productType.id
                ? 'border-[#663399] scale-105'
                : 'border-transparent hover:border-[#663399]/30'
            }`}
          >
            {productType.thumbnail_url ? (
              <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={productType.thumbnail_url}
                  alt={productType.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-40 mb-4 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-4xl text-gray-500">
                  {productType.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
              {productType.name}
            </h3>
            {productType.description && (
              <p className="text-gray-600 text-sm">{productType.description}</p>
            )}

            {state.productTypeId === productType.id && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-[#663399] rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
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
            )}
          </button>
        ))}
      </div>

      {/* Navigazione */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-6 py-3"
        >
          ← Indietro
        </Button>
        {!state.productTypeId && (
          <p className="text-gray-500 text-sm">
            Seleziona un tipo per continuare
          </p>
        )}
      </div>
    </div>
  )
}
