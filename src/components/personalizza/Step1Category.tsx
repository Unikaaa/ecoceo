'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon_url: string | null
  image_url: string | null
  is_active: boolean
}

interface Step1CategoryProps {
  state: PersonalizzaState
  updateState: (updates: Partial<PersonalizzaState>) => void
  onNext: () => void
  onPrev?: () => void
}

export default function PersonalizzaStep1({
  state,
  updateState,
  onNext,
}: Step1CategoryProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const cacheKey = 'personalizza_categories_cache_v1'
    try {
      const cached = sessionStorage.getItem(cacheKey)
      if (cached) {
        setCategories(JSON.parse(cached))
        setIsLoading(false)
      }

      const response = await fetch('/api/personalizza/categories', { cache: 'force-cache' })
      const data = await response.json()
      if (response.ok) {
        const categoriesData = data.categories || []
        setCategories(categoriesData)
        sessionStorage.setItem(cacheKey, JSON.stringify(categoriesData))
      }
    } catch (error) {
      console.error('Errore caricamento categorie:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectCategory = (categoryId: string) => {
    updateState({ categoryId })
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

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleSelectCategory(category.id)}
            className={`group relative p-3.5 sm:p-8 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border-2 ${
              state.categoryId === category.id
                ? 'border-[#663399] scale-105'
                : 'border-transparent hover:border-[#663399]/30'
            }`}
          >
            {category.image_url ? (
              <div className="relative w-full h-28 sm:h-48 mb-3 sm:mb-4 rounded-xl overflow-hidden">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ) : (
              <div className="w-full h-28 sm:h-48 mb-3 sm:mb-4 rounded-xl bg-gradient-to-br from-[#663399] to-[#552288] flex items-center justify-center">
                <span className="text-3xl sm:text-6xl text-white opacity-50">
                  {category.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <h3 className="text-base sm:text-2xl font-serif font-bold text-gray-900 mb-1.5 sm:mb-2 leading-tight">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{category.description}</p>
            )}

            {state.categoryId === category.id && (
              <div className="absolute top-4 right-4 w-8 h-8 bg-[#663399] rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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

      {/* Indicazione selezione */}
      {!state.categoryId && (
        <p className="text-center text-gray-500 mt-6 pt-5 border-t border-gray-200 text-sm">
          Seleziona una categoria per continuare
        </p>
      )}
    </div>
  )
}
