'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { formatPrice } from '@/lib/utils'

interface CeramicExample {
  id: string
  name: string
  size: string
  basePrice: number
  image: string
}

const examples: CeramicExample[] = [
  {
    id: '1',
    name: 'Piatto Decorativo',
    size: 'Ø 30 cm',
    basePrice: 120,
    image: '/placeholder-product.jpg',
  },
  {
    id: '2',
    name: 'Vaso Artistico',
    size: 'H 25 cm',
    basePrice: 150,
    image: '/placeholder-product.jpg',
  },
  {
    id: '3',
    name: 'Ciotola Elegante',
    size: 'Ø 20 cm',
    basePrice: 95,
    image: '/placeholder-product.jpg',
  },
]

const sizeOptions = [
  { value: 'small', label: 'Piccola (+€0)' },
  { value: 'medium', label: 'Media (+€20)' },
  { value: 'large', label: 'Grande (+€40)' },
]

const colorOptions = [
  { value: 'terracotta', label: 'Terracotta' },
  { value: 'beige', label: 'Beige' },
  { value: 'white', label: 'Bianco Porcellana' },
  { value: 'sand', label: 'Sabbia' },
  { value: 'earth', label: 'Terra' },
]

const sizeMultipliers = {
  small: 0,
  medium: 20,
  large: 40,
}

export default function CustomizerPage() {
  const [selectedExample, setSelectedExample] = useState<CeramicExample | null>(examples[0])
  const [size, setSize] = useState('medium')
  const [color, setColor] = useState('terracotta')
  const [customText, setCustomText] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const calculatePrice = () => {
    if (!selectedExample) return 0
    const basePrice = selectedExample.basePrice
    const sizeExtra = sizeMultipliers[size as keyof typeof sizeMultipliers] || 0
    return basePrice + sizeExtra
  }

  const finalPrice = calculatePrice()

  const handleCheckout = () => {
    // TODO: Integrate with Stripe checkout-custom
    console.log('Checkout:', {
      example: selectedExample,
      size,
      color,
      customText,
      uploadedImage,
      price: finalPrice,
    })
  }

  return (
    <div className="min-h-screen bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo (leggeri) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      {/* Hero */}
      <section className="pt-16 pb-10 md:pt-24 md:pb-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-5">
              <span className="px-6 py-2 text-primary rounded-full text-sm font-semibold border border-primary/20 shadow-sm">
                Atelier UNIKA
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-gray-900 mb-5 leading-[1.05] tracking-tight">
            Crea la tua Ceramica
          </h1>
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <span className="h-px w-16 md:w-28 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent via-primary to-transparent" />
            </div>
            <p className="text-base md:text-xl text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
              Personalizza ogni dettaglio della tua ceramica artistica: scegli forma, dimensione e colore,
              poi aggiungi un testo o una foto per renderla davvero unica.
          </p>
          </div>
        </div>
      </section>

      {/* Esempi */}
      <section className="pb-14 md:pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 md:mb-10 text-center">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-2">
                Scegli il tipo di ceramica
          </h2>
              <p className="text-gray-600">
                Inizia dal modello: potrai personalizzare tutto nel passaggio successivo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-8 max-w-6xl mx-auto">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example)}
                className={`group relative overflow-hidden rounded-artistic bg-white transition-all duration-500 will-change-transform ${
                  selectedExample?.id === example.id
                    ? 'shadow-2xl ring-2 ring-primary/60 -translate-y-1'
                    : 'shadow-md hover:shadow-2xl ring-1 ring-black/5 hover:ring-primary/25 hover:-translate-y-1'
                }`}
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand relative overflow-hidden">
                  {/* Sheen */} 
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm font-medium relative z-10">Immagine</span>
                  </div>
                  {selectedExample?.id === example.id && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-primary rounded-full w-9 h-9 flex items-center justify-center shadow-lg">
                      <svg
                        className="w-5 h-5"
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
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-serif text-xl md:text-2xl text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {example.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{example.size}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-lg font-medium text-gray-700">da</p>
                    <p className="text-2xl font-serif font-semibold text-primary">
                    da {formatPrice(example.basePrice)}
                  </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Configurazione e Anteprima */}
      <section className="py-14 md:py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Form Configurazione */}
            <div className="space-y-8">
              <div>
                <div className="mb-6">
                  <h2 className="text-3xl font-serif text-gray-900 mb-2">
                    Personalizza la tua ceramica
                </h2>
                  <p className="text-gray-600">
                    Dettagli curati, come in un laboratorio artigianale.
                  </p>
                </div>
                
                <div className="space-y-7 bg-white rounded-artistic p-7 md:p-9 ring-1 ring-black/5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)]">
                  <div className="space-y-2">
                  <Select
                    label="Dimensione"
                    options={sizeOptions}
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                  />
                  </div>

                  <div className="space-y-2">
                  <Select
                    label="Colore Base"
                    options={colorOptions}
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                  </div>

                  <div className="space-y-2">
                  <Input
                    label="Testo Personalizzato (opzionale)"
                    type="text"
                    placeholder="Es: Iniziali, data, dedica..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    maxLength={50}
                  />
                  </div>

                  {/* Upload Immagine */}
                  <div className="w-full space-y-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Aggiungi Immagine (opzionale)
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setUploadedImage(reader.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="group flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-artistic cursor-pointer hover:border-primary hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 transition-all duration-300 hover:shadow-md"
                      >
                        {uploadedImage ? (
                          <div className="relative w-full h-full">
                            <img
                              src={uploadedImage}
                              alt="Immagine caricata"
                              className="w-full h-full object-cover rounded-artistic"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setUploadedImage(null)
                                const input = document.getElementById('image-upload') as HTMLInputElement
                                if (input) input.value = ''
                              }}
                              className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="mb-3 p-3 rounded-full bg-gray-100 group-hover:bg-primary/10 transition-colors">
                            <svg
                                className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            </div>
                            <span className="text-sm text-gray-700 font-semibold group-hover:text-primary transition-colors">
                              Clicca per caricare un'immagine
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PNG, JPG fino a 10MB
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Sezione Prezzo Premium */}
                  <div className="pt-6 border-t-2 border-gray-100">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Prezzo base:</span>
                        <span className="text-base font-semibold text-gray-900">
                        {selectedExample ? formatPrice(selectedExample.basePrice) : '€0'}
                      </span>
                    </div>
                    {sizeMultipliers[size as keyof typeof sizeMultipliers] > 0 && (
                        <div className="flex items-center justify-between py-2 text-sm">
                          <span className="text-gray-600">Extra dimensione:</span>
                          <span className="font-medium text-gray-700">
                          +{formatPrice(sizeMultipliers[size as keyof typeof sizeMultipliers])}
                        </span>
                      </div>
                    )}
                    </div>
                    <div className="flex items-center justify-between pt-5 mt-5 border-t-2 border-gray-200">
                      <span className="text-xl md:text-2xl font-serif text-gray-900 font-semibold">Totale:</span>
                      <span className="text-2xl md:text-3xl font-bold text-primary">
                        {formatPrice(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Immagine Grande */}
            <div className="lg:sticky lg:top-24 self-stretch">
              <div className="bg-white rounded-artistic p-7 md:p-9 ring-1 ring-black/5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)] h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-1">
                  Anteprima
                </h3>
                  <p className="text-sm text-gray-500">Visualizza la tua creazione</p>
                </div>
                <div className="aspect-square rounded-artistic overflow-hidden mb-6 relative shadow-2xl ring-1 ring-black/5">
                  {/* Sfondo ceramica con colore selezionato */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${
                      color === 'terracotta' ? 'from-[#c45824] to-[#a0451a]' :
                      color === 'beige' ? 'from-ceramic-beige to-ceramic-sand' :
                      color === 'white' ? 'from-white to-gray-100' :
                      color === 'sand' ? 'from-ceramic-sand to-ceramic-beige' :
                      'from-amber-800 to-amber-900'
                    }`}
                  />
                  
                  {/* Immagine caricata sovrapposta alla ceramica */}
                  {uploadedImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-6 md:p-8">
                      <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/30">
                        <img
                          src={uploadedImage}
                          alt="Immagine personalizzata"
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay per effetto realistico sulla ceramica */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
                        {/* Riflesso ceramica */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
                      </div>
                    </div>
                  )}
                  
                  {/* Testo personalizzato sovrapposto */}
                  {customText && (
                    <div className={`absolute inset-0 flex items-center justify-center p-6 md:p-8 z-10 ${uploadedImage ? 'pointer-events-none' : ''}`}>
                      <div className="text-center">
                        <span 
                          className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold drop-shadow-2xl"
                          style={{
                            textShadow: '3px 3px 6px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)',
                            color: color === 'white' ? '#1f2937' : color === 'beige' ? '#374151' : '#f9fafb'
                          }}
                        >
                          {customText}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  {/* Se non c'è né immagine né testo, mostra placeholder */}
                  {!uploadedImage && !customText && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-gray-400 block mb-2 text-lg">Anteprima</span>
                        {selectedExample && (
                          <span className="text-sm text-gray-600 block">
                            {selectedExample.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Bordo decorativo per effetto ceramica */}
                  <div className="absolute inset-0 border-4 border-white/40 rounded-artistic pointer-events-none shadow-inner" />
                  
                  {/* Ombra interna per profondità */}
                  <div className="absolute inset-0 rounded-artistic shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] pointer-events-none" />
                </div>
                {selectedExample && (
                  <div className="pt-5 border-t border-gray-100 mt-auto">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Dimensione</p>
                        <p className="text-gray-900 font-semibold">{selectedExample.size}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 font-medium">Colore</p>
                        <p className="text-gray-900 font-semibold">
                      {colorOptions.find((c) => c.value === color)?.label}
                    </p>
                      </div>
                    {customText && (
                        <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                          <p className="text-xs text-gray-500 mb-1 font-medium">Testo Personalizzato</p>
                          <p className="text-gray-900 font-semibold truncate">{customText}</p>
                        </div>
                    )}
                    {uploadedImage && (
                        <div className="bg-primary/5 rounded-lg p-3 col-span-2 border border-primary/20">
                          <p className="text-xs text-primary mb-1 font-semibold">Immagine</p>
                          <p className="text-primary font-semibold flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Caricata
                      </p>
                        </div>
                    )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Riepilogo e Checkout */}
      <section className="py-14 md:py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-artistic p-8 md:p-10 ring-1 ring-black/5 shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)]">
              <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-6 text-center">
                Riepilogo Configurazione
              </h2>
              
              <div className="space-y-4 mb-8">
                {selectedExample && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Prodotto:</span>
                    <span className="font-semibold text-gray-900">{selectedExample.name}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Dimensione:</span>
                  <span className="font-semibold text-gray-900">
                    {sizeOptions.find((s) => s.value === size)?.label.split(' ')[0]}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-700">Colore:</span>
                  <span className="font-semibold text-gray-900">
                    {colorOptions.find((c) => c.value === color)?.label}
                  </span>
                </div>
                
                {customText && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Testo personalizzato:</span>
                    <span className="font-semibold text-gray-900">{customText}</span>
                  </div>
                )}
                
                {uploadedImage && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700">Immagine personalizzata:</span>
                    <span className="font-semibold text-[#663399]">✓ Caricata</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4">
                  <span className="text-2xl font-serif text-gray-900">Prezzo Finale:</span>
                  <span className="text-3xl font-bold text-primary">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>

              <div className="text-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleCheckout}
                  className="w-full sm:w-auto px-12 py-4 text-lg"
                  disabled={!selectedExample}
                >
                  Procedi al Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
