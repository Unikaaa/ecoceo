'use client'

import { useState, useEffect } from 'react'
import ImageUploadField from './ImageUploadField'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  icon_url: string | null
  image_url: string | null
  is_active: boolean
  display_order: number
}

type WizardStep = 'select-type' | 'name' | 'slug' | 'description' | 'image' | 'order' | 'active' | 'confirm'
type EntityType = 'category' | 'product-type' | 'style' | 'size' | null

export default function PersonalizzaSection() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [wizardStep, setWizardStep] = useState<WizardStep>('select-type')
  const [entityType, setEntityType] = useState<EntityType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [wizardData, setWizardData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    display_order: 0,
    is_active: true,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/personalizza/categories')
      const data = await res.json()
      if (res.ok) {
        setCategories(data.categories?.sort((a: Category, b: Category) => a.display_order - b.display_order) || [])
      }
    } finally {
      setIsLoading(false)
    }
  }

  const startWizard = (type: EntityType) => {
    setEntityType(type)
    setWizardStep('name')
    setIsWizardOpen(true)
    setWizardData({ name: '', slug: '', description: '', image_url: '', display_order: 0, is_active: true })
  }

  const nextStep = () => {
    if (wizardStep === 'select-type') {
      setWizardStep('name')
    } else if (wizardStep === 'name') {
      setWizardData({ ...wizardData, slug: generateSlug(wizardData.name) })
      setWizardStep('description')
    } else if (wizardStep === 'description') {
      setWizardStep('image')
    } else if (wizardStep === 'image') {
      setWizardStep('order')
    } else if (wizardStep === 'order') {
      setWizardStep('active')
    } else if (wizardStep === 'active') {
      setWizardStep('confirm')
    }
  }

  const prevStep = () => {
    if (wizardStep === 'name') {
      setWizardStep('select-type')
    } else if (wizardStep === 'description') {
      setWizardStep('name')
    } else if (wizardStep === 'image') {
      setWizardStep('description')
    } else if (wizardStep === 'order') {
      setWizardStep('image')
    } else if (wizardStep === 'active') {
      setWizardStep('order')
    } else if (wizardStep === 'confirm') {
      setWizardStep('active')
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/personalizza/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData),
      })
      if (res.ok) {
        await fetchCategories()
        resetWizard()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetWizard = () => {
    setIsWizardOpen(false)
    setWizardStep('select-type')
    setEntityType(null)
    setWizardData({ name: '', slug: '', description: '', image_url: '', display_order: 0, is_active: true })
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const getStepTitle = () => {
    switch (wizardStep) {
      case 'select-type':
        return 'Cosa vuoi aggiungere?'
      case 'name':
        return 'Come si chiama?'
      case 'description':
        return 'Descrivilo brevemente'
      case 'image':
        return 'Aggiungi un\'immagine'
      case 'order':
        return 'In che ordine deve apparire?'
      case 'active':
        return 'Vuoi attivarlo subito?'
      case 'confirm':
        return 'Conferma i dati'
      default:
        return ''
    }
  }

  const getProgress = () => {
    const steps = ['name', 'description', 'image', 'order', 'active', 'confirm']
    const currentIndex = steps.indexOf(wizardStep)
    return ((currentIndex + 1) / steps.length) * 100
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">Personalizza</h2>
            <p className="text-gray-600 mt-1">Gestisci le opzioni di personalizzazione</p>
          </div>
          <button
            onClick={() => startWizard('category')}
            className="px-6 py-3 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium shadow-md hover:shadow-lg"
          >
            + Aggiungi Nuovo
          </button>
        </div>
      </div>

      {/* Wizard Modal */}
      {isWizardOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Progress Bar */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{getStepTitle()}</h3>
                <button
                  onClick={resetWizard}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[#663399] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgress()}%` }}
                />
              </div>
            </div>

            {/* Wizard Content */}
            <div className="p-6">
              {wizardStep === 'select-type' && (
                <div className="grid grid-cols-2 gap-4">
                  {['category', 'product-type', 'style', 'size'].map((type) => (
                    <button
                      key={type}
                      onClick={() => startWizard(type as EntityType)}
                      className="p-6 border-2 border-gray-200 rounded-xl hover:border-[#663399] hover:bg-[#663399]/5 transition-all text-left"
                    >
                      <h4 className="font-semibold text-gray-900 capitalize">{type.replace('-', ' ')}</h4>
                    </button>
                  ))}
                </div>
              )}

              {wizardStep === 'name' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Nome *</label>
                  <input
                    type="text"
                    value={wizardData.name}
                    onChange={(e) => {
                      setWizardData({
                        ...wizardData,
                        name: e.target.value,
                        slug: generateSlug(e.target.value),
                      })
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] text-lg"
                    placeholder="Es: Funeraria"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500">Lo slug verrà generato automaticamente: {wizardData.slug || '...'}</p>
                </div>
              )}

              {wizardStep === 'description' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Descrizione</label>
                  <textarea
                    value={wizardData.description}
                    onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    rows={4}
                    placeholder="Descrivi brevemente questa opzione..."
                    autoFocus
                  />
                </div>
              )}

              {wizardStep === 'image' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Immagine</label>
                  <ImageUploadField
                    value={wizardData.image_url}
                    onChange={(url) => setWizardData({ ...wizardData, image_url: (url as string) || '' })}
                  />
                </div>
              )}

              {wizardStep === 'order' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Ordine di visualizzazione</label>
                  <input
                    type="number"
                    value={wizardData.display_order}
                    onChange={(e) => setWizardData({ ...wizardData, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] text-lg"
                    min="0"
                    autoFocus
                  />
                  <p className="text-sm text-gray-500">I numeri più bassi appaiono per primi</p>
                </div>
              )}

              {wizardStep === 'active' && (
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wizardData.is_active}
                      onChange={(e) => setWizardData({ ...wizardData, is_active: e.target.checked })}
                      className="w-5 h-5 text-[#663399] border-gray-300 rounded focus:ring-[#663399]"
                    />
                    <span className="text-lg font-medium text-gray-900">Attiva subito questa opzione</span>
                  </label>
                  <p className="text-sm text-gray-500">Se disattivata, non sarà visibile ai clienti</p>
                </div>
              )}

              {wizardStep === 'confirm' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Nome:</span>
                      <p className="font-semibold text-gray-900">{wizardData.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Slug:</span>
                      <p className="font-semibold text-gray-900">{wizardData.slug}</p>
                    </div>
                    {wizardData.description && (
                      <div>
                        <span className="text-sm text-gray-600">Descrizione:</span>
                        <p className="font-semibold text-gray-900">{wizardData.description}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Stato:</span>
                      <p className="font-semibold text-gray-900">{wizardData.is_active ? 'Attiva' : 'Disattiva'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={wizardStep === 'select-type' || wizardStep === 'name'}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Indietro
                </button>
                {wizardStep === 'confirm' ? (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || !wizardData.name}
                    className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvataggio...' : 'Conferma e Salva'}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={wizardStep === 'name' && !wizardData.name}
                    className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50"
                  >
                    Avanti
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="p-6">
        {isLoading ? (
          <div className="text-center py-8 text-gray-600">Caricamento...</div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Nessuna categoria ancora.</p>
            <button
              onClick={() => startWizard('category')}
              className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors"
            >
              Aggiungi la prima categoria
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Slug</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Ordine</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Stato</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{category.name}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{category.slug}</td>
                    <td className="py-3 px-4">{category.display_order}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.is_active ? 'Attiva' : 'Disattiva'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          Modifica
                        </button>
                        <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200">
                          Elimina
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
