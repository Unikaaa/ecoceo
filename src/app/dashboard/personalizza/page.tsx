'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ImageUploadField from '@/components/dashboard/ImageUploadField'

const SHAPE_OPTIONS = [
  { value: 'oval', label: 'Ovale' },
  { value: 'square', label: 'Quadrata' },
  { value: 'triangle', label: 'Triangolare' },
  { value: 'rectangle', label: 'Rettangolare' },
  { value: 'circle', label: 'Rotonda' },
]

const PERSONALIZATION_TEMPLATES = [
  {
    value: 'FIXED_SHAPE',
    label: 'FIXED_SHAPE (tazze/piatti/vasi)',
    description: 'Forma fissa, focus su area di stampa/testo e varianti.',
  },
  {
    value: 'GEOMETRIC_SUPPORT',
    label: 'GEOMETRIC_SUPPORT (funeraria/targhe/mosaici)',
    description: 'Abilita forma dinamica, sfondi e bordure/decori.',
  },
]

export default function PersonalizzaPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  // Data lists
  const [categories, setCategories] = useState<any[]>([])
  const [productTypes, setProductTypes] = useState<any[]>([])
  const [styles, setStyles] = useState<any[]>([])
  const [sizes, setSizes] = useState<any[]>([])
  const [decorations, setDecorations] = useState<any[]>([])
  const [backgrounds, setBackgrounds] = useState<any[]>([])
  const [isLoadingData, setIsLoadingData] = useState(false)

  // View state - 3 livelli: Categoria → Tipo Prodotto → Dettaglio
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null)

  // Add form states
  const [showAddForm, setShowAddForm] = useState<{ type: string; categoryId?: string; productTypeId?: string } | null>(null)
  const [addFormData, setAddFormData] = useState<any>({})

  // Edit state
  const [editingItem, setEditingItem] = useState<{ type: string; id: string; data: any } | null>(null)
  const [editFormData, setEditFormData] = useState<any>({})

  const isEmptyNumberInput = (value: any) =>
    value === undefined || value === null || value === ''

  useEffect(() => {
    const authStatus = sessionStorage.getItem('dashboard_auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
      fetchAll('initial')
    }
    setIsLoading(false)
  }, [])

  const fetchAll = async (mode: 'initial' | 'full' = 'full') => {
    setIsLoadingData(true)
    try {
      if (mode === 'initial') {
        // Primo paint veloce: carica subito solo i livelli principali.
        await Promise.allSettled([fetchCategories(), fetchProductTypes()])
        void Promise.allSettled([
          fetchStyles(),
          fetchSizes(),
          fetchDecorations(),
          fetchBackgrounds(),
        ])
        return
      }

      await Promise.allSettled([
        fetchCategories(),
        fetchProductTypes(),
        fetchStyles(),
        fetchSizes(),
        fetchDecorations(),
        fetchBackgrounds(),
      ])
    } finally {
      setIsLoadingData(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/personalizza/categories')
      const data = await res.json()
      if (res.ok) setCategories(data.categories?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch categorie:', error)
    }
  }

  const fetchProductTypes = async () => {
    try {
      const res = await fetch('/api/personalizza/product-types?include_inactive=true')
      const data = await res.json()
      if (res.ok) setProductTypes(data.productTypes?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch tipi prodotto:', error)
    }
  }

  const fetchStyles = async () => {
    try {
      const res = await fetch('/api/personalizza/styles?include_inactive=true')
      const data = await res.json()
      if (res.ok) setStyles(data.styles?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch stili:', error)
    }
  }

  const fetchSizes = async () => {
    try {
      const res = await fetch('/api/personalizza/sizes?include_inactive=true')
      const data = await res.json()
      if (res.ok) setSizes(data.sizes?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch dimensioni:', error)
    }
  }

  const fetchDecorations = async () => {
    try {
      const res = await fetch('/api/personalizza/decorations?include_inactive=true')
      const data = await res.json()
      if (res.ok) setDecorations(data.decorations?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch decorazioni:', error)
    }
  }

  const fetchBackgrounds = async () => {
    try {
      const res = await fetch('/api/personalizza/backgrounds?include_inactive=true')
      const data = await res.json()
      if (res.ok) setBackgrounds(data.backgrounds?.sort((a: any, b: any) => a.display_order - b.display_order) || [])
    } catch (error) {
      console.error('Errore fetch sfondi:', error)
    }
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleAddCategory = async () => {
    if (!addFormData.name) return

    try {
      const res = await fetch('/api/personalizza/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFormData.name,
          slug: addFormData.slug || generateSlug(addFormData.name),
          description: addFormData.description || '',
          image_url: addFormData.image_url || '',
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleAddProductType = async () => {
    if (!addFormData.name || !selectedCategory) return

    try {
      const res = await fetch('/api/personalizza/product-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: selectedCategory,
          name: addFormData.name,
          slug: addFormData.slug || generateSlug(addFormData.name),
          description: addFormData.description || '',
          thumbnail_url: addFormData.thumbnail_url || '',
          canvas_shape: addFormData.canvas_shape || 'oval',
          personalization_type: addFormData.personalization_type || 'FIXED_SHAPE',
          allowed_shapes: Array.isArray(addFormData.allowed_shapes) ? addFormData.allowed_shapes : null,
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleAddStyle = async () => {
    if (!addFormData.name) return

    try {
      const res = await fetch('/api/personalizza/styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFormData.name,
          slug: addFormData.slug || generateSlug(addFormData.name),
          description: addFormData.description || '',
          preview_url: addFormData.preview_url || '',
          product_type_id: selectedProductType,
          price_extra: parseFloat(addFormData.price_extra) || 0,
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleAddSize = async () => {
    if (!addFormData.name || !addFormData.width_cm || !addFormData.height_cm) return

    try {
      const res = await fetch('/api/personalizza/sizes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFormData.name,
          width_cm: parseFloat(addFormData.width_cm),
          height_cm: parseFloat(addFormData.height_cm),
          product_type_id: selectedProductType,
          base_price: parseFloat(addFormData.base_price) || 0,
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleAddDecoration = async () => {
    if (!addFormData.name) return

    try {
      const res = await fetch('/api/personalizza/decorations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFormData.name,
          image_url: addFormData.image_url || '',
          price_extra: parseFloat(addFormData.price_extra) || 0,
          style_id: null,
          category_id: selectedCategory,
          product_type_id: selectedProductType,
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleAddBackground = async () => {
    if (!addFormData.name) return

    try {
      const res = await fetch('/api/personalizza/backgrounds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: addFormData.name,
          image_url: addFormData.image_url || '',
          price_extra: parseFloat(addFormData.price_extra) || 0,
          style_id: null,
          category_id: selectedCategory,
          product_type_id: selectedProductType,
          is_active: true,
          display_order: 0,
        }),
      })

      if (res.ok) {
        await fetchAll()
        setShowAddForm(null)
        setAddFormData({})
      } else {
        alert('Errore durante la creazione')
      }
    } catch (error) {
      console.error('Errore:', error)
      alert('Errore durante la creazione')
    }
  }

  const handleEdit = (type: string, item: any) => {
    setEditingItem({ type, id: item.id, data: item })
    setEditFormData({ ...item })
  }

  const handleDelete = async (type: string, id: string) => {
    // Controlla dipendenze prima di eliminare
    if (type === 'categories') {
      const linkedPTs = productTypes.filter(pt => pt.category_id === id)
      const linkedDecs = decorations.filter(d => d.category_id === id)
      const linkedBgs = backgrounds.filter(b => b.category_id === id)
      const deps = []
      if (linkedPTs.length > 0) deps.push(`${linkedPTs.length} tipo/i prodotto`)
      if (linkedDecs.length > 0) deps.push(`${linkedDecs.length} decorazione/i`)
      if (linkedBgs.length > 0) deps.push(`${linkedBgs.length} sfondo/i`)

      if (deps.length > 0) {
        const confirmMsg = `Questa categoria ha: ${deps.join(', ')}.\n\nEliminando la categoria verranno eliminati anche tutti gli elementi collegati.\n\nVuoi continuare?`
        if (!confirm(confirmMsg)) return
      } else {
        if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return
      }
    } else {
      const labelMap: Record<string, string> = {
        'product-types': 'tipo prodotto',
        'styles': 'stile',
        'sizes': 'dimensione',
        'decorations': 'decorazione',
        'backgrounds': 'sfondo',
      }
      if (!confirm(`Sei sicuro di voler eliminare questo ${labelMap[type] || 'elemento'}?`)) return
    }

    try {
      const res = await fetch(`/api/personalizza/${type}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })

      if (res.ok) {
        await fetchAll()
        // Se abbiamo eliminato la categoria selezionata, torna alla lista
        if (type === 'categories' && selectedCategory === id) {
          setSelectedCategory(null)
          setSelectedProductType(null)
        }
        if (type === 'product-types' && selectedProductType === id) {
          setSelectedProductType(null)
        }
      } else {
        const data = await res.json().catch(() => ({}))
        const errorMsg = data.error || 'Errore durante l\'eliminazione'
        alert(`${errorMsg}\n\nPotrebbe essere collegato ad altri elementi. Prova a eliminare prima gli elementi collegati.`)
      }
    } catch (error) {
      console.error('Errore eliminazione:', error)
      alert('Errore di connessione durante l\'eliminazione. Riprova.')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingItem) return

    try {
      const payload: any = { id: editingItem.id, ...editFormData }
      if (
        selectedProductType &&
        ['styles', 'sizes', 'decorations', 'backgrounds'].includes(editingItem.type)
      ) {
        payload.product_type_id = selectedProductType
      }
      if (selectedCategory && ['decorations', 'backgrounds'].includes(editingItem.type)) {
        payload.category_id = selectedCategory
      }

      const res = await fetch(`/api/personalizza/${editingItem.type}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await fetchAll()
        setEditingItem(null)
        setEditFormData({})
      } else {
        alert('Errore durante il salvataggio')
      }
    } catch (error) {
      console.error('Errore salvataggio:', error)
      alert('Errore durante il salvataggio')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem('dashboard_auth', 'authenticated')
        setIsAuthenticated(true)
        fetchAll()
      } else {
        setError(data.error || 'Password non corretta')
      }
    } catch (err) {
      setError('Errore durante l\'autenticazione')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    setIsAuthenticated(false)
    setPassword('')
    setSelectedCategory(null)
    setSelectedProductType(null)
  }

  const getCategoryProductTypes = () => {
    if (!selectedCategory) return []
    return productTypes.filter(pt => pt.category_id === selectedCategory)
  }

  const getProductTypeStyles = () => {
    if (!selectedProductType) return styles
    return styles.filter((style) => style.product_type_id === selectedProductType)
  }

  const getProductTypeSizes = () => {
    if (!selectedProductType) return sizes
    return sizes.filter((size) => size.product_type_id === selectedProductType)
  }

  const getProductTypeDecorations = () => {
    if (!selectedCategory) return []
    return decorations.filter((dec) => dec.category_id === selectedCategory && dec.product_type_id === selectedProductType)
  }

  const getProductTypeBackgrounds = () => {
    if (!selectedCategory) return []
    return backgrounds.filter((bg) => bg.category_id === selectedCategory && bg.product_type_id === selectedProductType)
  }

  const renderAddForm = () => {
    if (!showAddForm) return null

    const formType = showAddForm.type

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Aggiungi {formType === 'categories' ? 'Categoria' : formType === 'product-types' ? 'Tipo Prodotto' : formType === 'styles' ? 'Stile' : formType === 'sizes' ? 'Dimensione' : formType === 'decorations' ? 'Decorazione' : 'Sfondo'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(null)
                  setAddFormData({})
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {formType === 'categories' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Funeraria"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={addFormData.slug || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                  <textarea
                    value={addFormData.description || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    rows={3}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddCategory}
                    disabled={!addFormData.name}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}

            {formType === 'product-types' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Ovale"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                  <input
                    type="text"
                    value={addFormData.slug || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrizione</label>
                  <textarea
                    value={addFormData.description || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forma Canvas</label>
                  <select
                    value={addFormData.canvas_shape || 'oval'}
                    onChange={(e) => setAddFormData({ ...addFormData, canvas_shape: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    {SHAPE_OPTIONS.map((shape) => (
                      <option key={shape.value} value={shape.value}>{shape.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Forma predefinita (usata sempre in FIXED_SHAPE, e come default in GEOMETRIC_SUPPORT).
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template di Personalizzazione</label>
                  <select
                    value={addFormData.personalization_type || 'FIXED_SHAPE'}
                    onChange={(e) => {
                      const nextType = e.target.value
                      setAddFormData({
                        ...addFormData,
                        personalization_type: nextType,
                        allowed_shapes:
                          nextType === 'GEOMETRIC_SUPPORT'
                            ? (Array.isArray(addFormData.allowed_shapes) ? addFormData.allowed_shapes : ['oval'])
                            : null,
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    {PERSONALIZATION_TEMPLATES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {PERSONALIZATION_TEMPLATES.find((t) => t.value === (addFormData.personalization_type || 'FIXED_SHAPE'))?.description}
                  </p>
                </div>

                {(addFormData.personalization_type || 'FIXED_SHAPE') === 'GEOMETRIC_SUPPORT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Forme disponibili (GEOMETRIC_SUPPORT)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHAPE_OPTIONS.map((shape) => {
                        const selected: string[] = Array.isArray(addFormData.allowed_shapes) ? addFormData.allowed_shapes : []
                        const checked = selected.includes(shape.value)
                        return (
                          <label key={shape.value} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? Array.from(new Set([...selected, shape.value]))
                                  : selected.filter((v) => v !== shape.value)
                                setAddFormData({ ...addFormData, allowed_shapes: next.length ? next : ['oval'] })
                              }}
                            />
                            <span>{shape.label}</span>
                          </label>
                        )
                      })}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Se nessuna selezionata, usiamo Ovale come fallback.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miniatura (opzionale)</label>
                  <ImageUploadField
                    value={addFormData.thumbnail_url || ''}
                    onChange={(url) => setAddFormData({ ...addFormData, thumbnail_url: url || '' })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddProductType}
                    disabled={!addFormData.name}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}

            {formType === 'styles' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value, slug: generateSlug(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Alla Romana"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addFormData.price_extra || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, price_extra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Anteprima (opzionale)</label>
                  <ImageUploadField
                    value={addFormData.preview_url || ''}
                    onChange={(url) => setAddFormData({ ...addFormData, preview_url: url || '' })}
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddStyle}
                    disabled={!addFormData.name || isEmptyNumberInput(addFormData.price_extra)}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}

            {formType === 'sizes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Piccola"
                    autoFocus
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Larghezza (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={addFormData.width_cm || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, width_cm: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (cm) *</label>
                    <input
                      type="number"
                      step="0.1"
                      value={addFormData.height_cm || ''}
                      onChange={(e) => setAddFormData({ ...addFormData, height_cm: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Base (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addFormData.base_price || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, base_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddSize}
                    disabled={
                      !addFormData.name ||
                      isEmptyNumberInput(addFormData.width_cm) ||
                      isEmptyNumberInput(addFormData.height_cm) ||
                      isEmptyNumberInput(addFormData.base_price)
                    }
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}

            {formType === 'decorations' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Nuvole"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addFormData.price_extra || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, price_extra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddDecoration}
                    disabled={!addFormData.name}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}

            {formType === 'backgrounds' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                  <input
                    type="text"
                    value={addFormData.name || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    placeholder="Es: Sfondo Classico"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={addFormData.price_extra || ''}
                    onChange={(e) => setAddFormData({ ...addFormData, price_extra: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleAddBackground}
                    disabled={!addFormData.name}
                    className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Salva
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(null)
                      setAddFormData({})
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Annulla
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const renderEditForm = () => {
    if (!editingItem) return null

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Modifica</h3>
              <button
                onClick={() => {
                  setEditingItem(null)
                  setEditFormData({})
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            {editingItem.type === 'categories' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            {editingItem.type === 'product-types' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Forma Canvas</label>
                  <select
                    value={editFormData.canvas_shape || 'oval'}
                    onChange={(e) => setEditFormData({ ...editFormData, canvas_shape: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    {SHAPE_OPTIONS.map((shape) => (
                      <option key={shape.value} value={shape.value}>{shape.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template di Personalizzazione</label>
                  <select
                    value={editFormData.personalization_type || 'FIXED_SHAPE'}
                    onChange={(e) => {
                      const nextType = e.target.value
                      setEditFormData({
                        ...editFormData,
                        personalization_type: nextType,
                        allowed_shapes:
                          nextType === 'GEOMETRIC_SUPPORT'
                            ? (Array.isArray(editFormData.allowed_shapes) ? editFormData.allowed_shapes : ['oval'])
                            : null,
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    {PERSONALIZATION_TEMPLATES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    {PERSONALIZATION_TEMPLATES.find((t) => t.value === (editFormData.personalization_type || 'FIXED_SHAPE'))?.description}
                  </p>
                </div>

                {(editFormData.personalization_type || 'FIXED_SHAPE') === 'GEOMETRIC_SUPPORT' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Forme disponibili (GEOMETRIC_SUPPORT)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SHAPE_OPTIONS.map((shape) => {
                        const selected: string[] = Array.isArray(editFormData.allowed_shapes) ? editFormData.allowed_shapes : []
                        const checked = selected.includes(shape.value)
                        return (
                          <label key={shape.value} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                const next = e.target.checked
                                  ? Array.from(new Set([...selected, shape.value]))
                                  : selected.filter((v) => v !== shape.value)
                                setEditFormData({ ...editFormData, allowed_shapes: next.length ? next : ['oval'] })
                              }}
                            />
                            <span>{shape.label}</span>
                          </label>
                        )
                      })}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Se nessuna selezionata, usiamo Ovale come fallback.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            {editingItem.type === 'styles' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price_extra || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, price_extra: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            {editingItem.type === 'sizes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Larghezza (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editFormData.width_cm || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, width_cm: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Altezza (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editFormData.height_cm || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, height_cm: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Base (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.base_price || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, base_price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            {editingItem.type === 'decorations' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price_extra || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, price_extra: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            {editingItem.type === 'backgrounds' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Extra (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price_extra || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, price_extra: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stato</label>
                  <select
                    value={editFormData.is_active ? 'true' : 'false'}
                    onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.value === 'true' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  >
                    <option value="true">Attiva</option>
                    <option value="false">Disattiva</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Salva Modifiche
              </button>
              <button
                onClick={() => {
                  setEditingItem(null)
                  setEditFormData({})
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2 text-center">Dashboard UNIKA</h1>
            <p className="text-gray-600 text-center mb-8">Inserisci la password per accedere</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <button
                type="submit"
                className="w-full bg-[#663399] text-white py-2 px-4 rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Accedi
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)
  const selectedProductTypeData = productTypes.find(pt => pt.id === selectedProductType)

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4 sm:pb-6 lg:pb-7 mb-5 sm:mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-1.5 sm:mb-2">Personalizza</h1>
          <p className="text-sm sm:text-base text-gray-600">Configura le opzioni disponibili per la personalizzazione</p>
          <p className="text-sm text-gray-500 mt-2">Le immagini e il testo vengono inseriti dal cliente nel configuratore</p>
        </div>

        {!selectedCategory ? (
          /* Livello 1: Vista Categorie - Grid di card */
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Categorie</h2>
              <button
                onClick={() => setShowAddForm({ type: 'categories' })}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#663399] text-white rounded-xl hover:bg-[#552288] transition-colors font-medium text-sm"
              >
                + Aggiungi Categoria
              </button>
            </div>

            {categories.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <p className="text-gray-600 mb-4">Nessuna categoria ancora.</p>
                <p className="text-sm text-gray-500">Clicca su "Aggiungi Categoria" per iniziare.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:border-[#663399] p-3.5 sm:p-6 transition-all hover:shadow-md"
                  >
                    <div
                      onClick={() => setSelectedCategory(cat.id)}
                      className="cursor-pointer"
                    >
                      <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1.5">{cat.name}</h3>
                      <p className="text-[12px] sm:text-sm text-gray-600 mb-3">{cat.slug}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          cat.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {cat.is_active ? 'Attiva' : 'Disattiva'}
                        </span>
                        <span className="text-[12px] sm:text-sm text-gray-500">
                          {productTypes.filter(pt => pt.category_id === cat.id).length} tipi prodotto
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEdit('categories', cat)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-[13px] font-medium"
                      >
                        Modifica
                      </button>
                      <button
                        onClick={() => handleDelete('categories', cat.id)}
                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-[13px] font-medium"
                      >
                        Elimina
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : !selectedProductType ? (
          /* Livello 2: Vista Tipi Prodotto della Categoria */
          <div>
            <div className="mb-6">
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[#663399] hover:text-[#552288] font-medium mb-4 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Torna alle Categorie
              </button>
              <h2 className="text-xl sm:text-3xl font-semibold text-gray-900">{selectedCategoryData?.name}</h2>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Tipi Prodotto</h3>
              <button
                onClick={() => setShowAddForm({ type: 'product-types', categoryId: selectedCategory })}
                className="w-full sm:w-auto px-4 py-2.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
              >
                + Aggiungi Tipo Prodotto
              </button>
            </div>

            {getCategoryProductTypes().length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
                <p className="text-gray-600 mb-4">Nessun tipo prodotto ancora.</p>
                <p className="text-sm text-gray-500">Clicca su "Aggiungi Tipo Prodotto" per iniziare.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
                {getCategoryProductTypes().map((pt) => (
                  <div
                    key={pt.id}
                    onClick={() => setSelectedProductType(pt.id)}
                    className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:border-[#663399] p-3.5 sm:p-6 cursor-pointer transition-all hover:shadow-md"
                  >
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5">{pt.name}</h4>
                    <p className="text-[12px] sm:text-sm text-gray-600 mb-3">{pt.slug}</p>
                    <p className="text-xs text-gray-500 mb-4">Forma: {pt.canvas_shape || 'oval'}</p>
                    <p className="text-xs text-gray-500 mb-4">Template: {pt.personalization_type || 'FIXED_SHAPE'}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        pt.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {pt.is_active ? 'Attiva' : 'Disattiva'}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEdit('product-types', pt)
                          }}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[13px] hover:bg-blue-700 transition-colors"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete('product-types', pt.id)
                          }}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-[13px] hover:bg-red-700 transition-colors"
                        >
                          Elimina
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Livello 3: Vista Dettaglio Tipo Prodotto - Stili, Dimensioni, Decorazioni, Sfondi */
          <div>
            <div className="mb-6">
              <button
                onClick={() => setSelectedProductType(null)}
                className="text-[#663399] hover:text-[#552288] font-medium mb-2 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Torna ai Tipi Prodotto
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <span>{selectedCategoryData?.name}</span>
                <span>/</span>
                <span>{selectedProductTypeData?.name}</span>
              </div>
              <h2 className="text-3xl font-semibold text-gray-900">{selectedProductTypeData?.name}</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-6">
              {/* Stili */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Stili</h3>
                  <button
                    onClick={() => setShowAddForm({ type: 'styles' })}
                    className="px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
                  >
                    + Aggiungi
                  </button>
                </div>
                {getProductTypeStyles().length === 0 ? (
                  <p className="text-gray-500 text-sm">Nessuno stile disponibile.</p>
                ) : (
                  <div className="space-y-2">
                    {getProductTypeStyles().map((style) => (
                      <div key={style.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <span className="font-medium text-gray-900">{style.name}</span>
                          <span className="ml-3 text-sm text-gray-600">€{parseFloat(style.price_extra).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit('styles', style)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete('styles', style.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Dimensioni */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Dimensioni</h3>
                  <button
                    onClick={() => setShowAddForm({ type: 'sizes' })}
                    className="px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
                  >
                    + Aggiungi
                  </button>
                </div>
                {getProductTypeSizes().length === 0 ? (
                  <p className="text-gray-500 text-sm">Nessuna dimensione disponibile.</p>
                ) : (
                  <div className="space-y-2">
                    {getProductTypeSizes().map((size) => (
                      <div key={size.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <span className="font-medium text-gray-900">{size.name}</span>
                          <span className="ml-3 text-sm text-gray-600">
                            {size.width_cm}x{size.height_cm}cm - €{parseFloat(size.base_price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit('sizes', size)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete('sizes', size.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Decorazioni */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Decorazioni</h3>
                  <button
                    onClick={() => setShowAddForm({ type: 'decorations', categoryId: selectedCategory })}
                    className="px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
                  >
                    + Aggiungi
                  </button>
                </div>
                {getProductTypeDecorations().length === 0 ? (
                  <p className="text-gray-500 text-sm">Nessuna decorazione disponibile.</p>
                ) : (
                  <div className="space-y-2">
                    {getProductTypeDecorations().map((dec) => (
                      <div key={dec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <span className="font-medium text-gray-900">{dec.name}</span>
                          <span className="ml-3 text-sm text-gray-600">€{parseFloat(dec.price_extra).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit('decorations', dec)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete('decorations', dec.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sfondi */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Sfondi</h3>
                  <button
                    onClick={() => setShowAddForm({ type: 'backgrounds', categoryId: selectedCategory })}
                    className="px-3 py-1.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
                  >
                    + Aggiungi
                  </button>
                </div>
                {getProductTypeBackgrounds().length === 0 ? (
                  <p className="text-gray-500 text-sm">Nessuno sfondo disponibile.</p>
                ) : (
                  <div className="space-y-2">
                    {getProductTypeBackgrounds().map((bg) => (
                      <div key={bg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                        <div>
                          <span className="font-medium text-gray-900">{bg.name}</span>
                          <span className="ml-3 text-sm text-gray-600">€{parseFloat(bg.price_extra).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit('backgrounds', bg)}
                            className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                          >
                            Modifica
                          </button>
                          <button
                            onClick={() => handleDelete('backgrounds', bg.id)}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                          >
                            Elimina
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        {renderAddForm()}
        {renderEditForm()}
      </div>
    </DashboardLayout>
  )
}
