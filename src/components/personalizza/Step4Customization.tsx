'use client'

import { useState, useEffect } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'
import PriceCalculator from './PriceCalculator'

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
  }, [])

  const fetchSizes = async () => {
    try {
      const response = await fetch('/api/personalizza/sizes')
      const data = await response.json()
      if (response.ok) {
        setSizes(data.sizes || [])
      }
    } catch (error) {
      console.error('Errore caricamento dimensioni:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const uploadPromises = Array.from(files).map(async (file) => {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', 'user-images')

        const response = await fetch('/api/personalizza/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error('Errore upload')
        }

        const data = await response.json()
        return {
          id: `img_${Date.now()}_${Math.random()}`,
          url: data.url,
        }
      } catch (error) {
        console.error('Errore upload immagine:', error)
        // Fallback: usa URL locale per preview
        return {
          id: `img_${Date.now()}_${Math.random()}`,
          url: URL.createObjectURL(file),
        }
      }
    })

    const newImages = await Promise.all(uploadPromises)
    updateState({
      userImages: [...state.userImages, ...newImages],
    })
  }

  return (
    <div className="space-y-8">

      {/* 1. Forma della Ceramica */}
      <div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Scegli la forma</h3>
        <p className="text-gray-500 text-sm mb-4">Seleziona la forma della tua ceramica</p>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => updateState({ ceramicShape: 'oval' })}
            className={`relative p-6 rounded-2xl border-3 transition-all duration-200 flex flex-col items-center gap-3 ${
              state.ceramicShape === 'oval'
                ? 'border-[#663399] bg-[#663399]/5 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-[#663399]/40 hover:bg-gray-50'
            }`}
          >
            <div className={`w-20 h-16 rounded-[50%] border-3 ${
              state.ceramicShape === 'oval' ? 'border-[#663399]' : 'border-gray-400'
            }`} />
            <span className={`text-base font-semibold ${
              state.ceramicShape === 'oval' ? 'text-[#663399]' : 'text-gray-700'
            }`}>Ovale</span>
            {state.ceramicShape === 'oval' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#663399] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
          <button
            onClick={() => updateState({ ceramicShape: 'square' })}
            className={`relative p-6 rounded-2xl border-3 transition-all duration-200 flex flex-col items-center gap-3 ${
              state.ceramicShape === 'square'
                ? 'border-[#663399] bg-[#663399]/5 shadow-lg scale-[1.02]'
                : 'border-gray-200 hover:border-[#663399]/40 hover:bg-gray-50'
            }`}
          >
            <div className={`w-16 h-16 rounded-lg border-3 ${
              state.ceramicShape === 'square' ? 'border-[#663399]' : 'border-gray-400'
            }`} />
            <span className={`text-base font-semibold ${
              state.ceramicShape === 'square' ? 'text-[#663399]' : 'text-gray-700'
            }`}>Quadrata</span>
            {state.ceramicShape === 'square' && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-[#663399] rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 2. Dimensione */}
      <div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Scegli la dimensione</h3>
        <p className="text-gray-500 text-sm mb-4">Seleziona la grandezza che preferisci</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => updateState({ sizeId: size.id })}
              className={`relative p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
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

      {/* 3. Upload Immagini */}
      <div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Carica le tue foto</h3>
        <p className="text-gray-500 text-sm mb-4">Le immagini che vuoi sulla tua ceramica (facoltativo)</p>
        
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:border-[#663399] hover:bg-[#663399]/5 transition-all">
          <div className="text-center">
            <svg className="w-10 h-10 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-600">Tocca per caricare foto</span>
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {state.userImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
            {state.userImages.map((img) => (
              <div key={img.id} className="relative group">
                <img
                  src={img.url}
                  alt="Foto caricata"
                  className="w-full h-28 object-cover rounded-xl border border-gray-200"
                />
                <button
                  onClick={() =>
                    updateState({
                      userImages: state.userImages.filter((i) => i.id !== img.id),
                    })
                  }
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md hover:bg-red-600 transition-colors text-lg font-bold"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Testo Personalizzato */}
      <div>
        <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Aggiungi un testo</h3>
        <p className="text-gray-500 text-sm mb-4">Scrivi il testo che vuoi sulla ceramica (facoltativo)</p>
        <textarea
          value={state.customText}
          onChange={(e) => updateState({ customText: e.target.value })}
          placeholder="Es: In ricordo di..."
          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-[#663399] focus:ring-2 focus:ring-[#663399]/20 outline-none transition-all text-base"
          rows={3}
        />
        {state.customText && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stile testo</label>
              <select
                value={state.customTextFont}
                onChange={(e) => updateState({ customTextFont: e.target.value })}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#663399] outline-none text-sm"
              >
                <option value="serif">Classico (Serif)</option>
                <option value="sans-serif">Moderno (Sans-serif)</option>
                <option value="script">Elegante (Script)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Colore testo</label>
              <input
                type="color"
                value={state.customTextColor}
                onChange={(e) => updateState({ customTextColor: e.target.value })}
                className="w-full h-12 border-2 border-gray-200 rounded-xl cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grandezza</label>
              <input
                type="range"
                value={state.customTextSize}
                onChange={(e) => updateState({ customTextSize: parseInt(e.target.value) })}
                min="14"
                max="60"
                className="w-full mt-3 accent-[#663399]"
              />
              <div className="text-xs text-gray-500 text-center mt-1">{state.customTextSize}px</div>
            </div>
          </div>
        )}
      </div>

      {/* Riepilogo prezzo */}
      <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
        <PriceCalculator state={state} onPriceUpdate={(price) => updateState({ totalPrice: price })} />
      </div>

      {/* Bottoni Navigazione */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-6 py-3"
        >
          ← Indietro
        </Button>
        <Button
          onClick={onNext}
          disabled={!state.sizeId}
          variant="primary"
          className="px-8 py-3"
        >
          Avanti →
        </Button>
      </div>
    </div>
  )
}
