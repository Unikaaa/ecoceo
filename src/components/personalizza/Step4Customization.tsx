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
    <div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonna sinistra - Personalizzazione */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selezione Dimensione */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Dimensione</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => updateState({ sizeId: size.id })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    state.sizeId === size.id
                      ? 'border-[#663399] bg-[#663399]/10'
                      : 'border-gray-200 hover:border-[#663399]/30'
                  }`}
                >
                  <div className="font-semibold">{size.name}</div>
                  <div className="text-sm text-gray-600">
                    {size.width_cm} × {size.height_cm} cm
                  </div>
                  <div className="text-sm font-semibold text-[#663399] mt-1">
                    €{size.base_price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Immagini */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Le tue immagini</h3>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            <div className="grid grid-cols-3 gap-4">
              {state.userImages.map((img) => (
                <div key={img.id} className="relative">
                  <img
                    src={img.url}
                    alt="Upload"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() =>
                      updateState({
                        userImages: state.userImages.filter((i) => i.id !== img.id),
                      })
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Testo Personalizzato */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">Testo personalizzato</h3>
            <textarea
              value={state.customText}
              onChange={(e) => updateState({ customText: e.target.value })}
              placeholder="Inserisci il testo che vuoi sulla ceramica..."
              className="w-full p-4 border border-gray-300 rounded-lg mb-4"
              rows={4}
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Font</label>
                <select
                  value={state.customTextFont}
                  onChange={(e) => updateState({ customTextFont: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="serif">Serif</option>
                  <option value="sans-serif">Sans-serif</option>
                  <option value="script">Script</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Colore</label>
                <input
                  type="color"
                  value={state.customTextColor}
                  onChange={(e) => updateState({ customTextColor: e.target.value })}
                  className="w-full h-10 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Dimensione</label>
                <input
                  type="number"
                  value={state.customTextSize}
                  onChange={(e) =>
                    updateState({ customTextSize: parseInt(e.target.value) })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="12"
                  max="72"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonna destra - Prezzo */}
        <div className="lg:col-span-1">
          <PriceCalculator state={state} onPriceUpdate={(price) => updateState({ totalPrice: price })} />
        </div>
      </div>

      {/* Bottoni Navigazione */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
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
