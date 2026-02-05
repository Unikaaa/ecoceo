'use client'

import { useState, useEffect } from 'react'
import ImageUploadField from './ImageUploadField'

interface Collection {
  id: string
  name: string
  slug: string
  description?: string | null
  image_url?: string | null
  hover_image_url?: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function CollectionsSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    hover_image_url: '',
    display_order: '0',
    is_active: true,
  })

  // Carica collezioni al mount e quando cambiano
  useEffect(() => {
    fetchCollections()
  }, [])

  // Calcola numeri disponibili per l'ordine
  const getAvailableOrderNumbers = (currentOrder?: number): number[] => {
    const maxOrder = Math.max(...collections.map(c => c.display_order), 0)
    const usedOrders = new Set(collections.map(c => c.display_order))
    if (editingId && currentOrder !== undefined) {
      usedOrders.delete(currentOrder) // Rimuovi l'ordine corrente se stai modificando
    }
    
    const available: number[] = []
    for (let i = 0; i <= maxOrder + 1; i++) {
      if (!usedOrders.has(i)) {
        available.push(i)
      }
    }
    return available.sort((a, b) => a - b)
  }

  const fetchCollections = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/collections')
      const data = await response.json()
      if (response.ok && data.collections) {
        setCollections(data.collections)
      }
    } catch (error) {
      console.error('Errore caricamento collezioni:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Genera slug dal nome
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name), // Auto-genera slug se vuoto
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        display_order: parseInt(formData.display_order) || 0,
      }

      if (editingId) {
        // Aggiorna collezione esistente
        const response = await fetch('/api/collections', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })

        if (response.ok) {
          await fetchCollections()
          resetForm()
          // Notifica altri componenti dell'aggiornamento
          window.dispatchEvent(new CustomEvent('collectionsUpdated'))
        }
      } else {
        // Crea nuova collezione
        const response = await fetch('/api/collections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          await fetchCollections()
          resetForm()
          // Notifica altri componenti dell'aggiornamento
          window.dispatchEvent(new CustomEvent('collectionsUpdated'))
        }
      }
    } catch (error) {
      console.error('Errore salvataggio collezione:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (collection: Collection) => {
    setEditingId(collection.id)
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      image_url: collection.image_url || '',
      hover_image_url: collection.hover_image_url || '',
      display_order: collection.display_order.toString(),
      is_active: collection.is_active,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa collezione?')) {
      return
    }

    try {
      const response = await fetch(`/api/collections?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchCollections()
        // Notifica altri componenti dell'aggiornamento
        window.dispatchEvent(new CustomEvent('collectionsUpdated'))
      }
    } catch (error) {
      console.error('Errore eliminazione collezione:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: '',
      hover_image_url: '',
      display_order: '0',
      is_active: true,
    })
    setEditingId(null)
    setIsOpen(false)
  }

  return (
    <section id="collections" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-1">Collezioni</h2>
          <p className="text-sm text-gray-600">Gestisci le collezioni prodotti</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
        >
          {isOpen ? 'Chiudi' : 'Aggiungi Collezione'}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Collezione *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="Es. Gioielleria"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="es. gioielleria"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Usato nell'URL (es. /shop/gioielleria)</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrizione
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                placeholder="Descrizione della collezione"
                rows={3}
              />
            </div>

            {/* Upload Immagine Principale */}
            <ImageUploadField
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url as string })}
              multiple={false}
              label="Immagine Principale"
            />

            {/* Upload Immagine Hover */}
            <ImageUploadField
              value={formData.hover_image_url}
              onChange={(url) => setFormData({ ...formData, hover_image_url: url as string })}
              multiple={false}
              label="Immagine Hover (quando passi il mouse)"
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ordine Visualizzazione *
                </label>
                <select
                  value={formData.display_order}
                  onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  required
                >
                  {getAvailableOrderNumbers(
                    editingId ? parseInt(formData.display_order) : undefined
                  ).map((order) => (
                    <option key={order} value={order}>
                      {order} {order === 0 ? '(Primo)' : order === Math.max(...collections.map(c => c.display_order), 0) ? '(Ultimo)' : ''}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Seleziona l'ordine di visualizzazione</p>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#663399] border-gray-300 rounded focus:ring-[#663399]"
                />
                <span className="text-sm text-gray-700">Collezione attiva</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Salvataggio...' : editingId ? 'Aggiorna Collezione' : 'Salva Collezione'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista collezioni */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Caricamento collezioni...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nessuna collezione creata</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Immagine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Slug</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ordine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stato</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {collections.map((collection) => (
                  <tr key={collection.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {collection.image_url ? (
                          <img
                            src={collection.image_url}
                            alt={collection.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-xs text-gray-400">No img</span>
                          </div>
                        )}
                        {collection.hover_image_url && (
                          <img
                            src={collection.hover_image_url}
                            alt={`${collection.name} hover`}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{collection.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{collection.slug}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{collection.display_order}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collection.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {collection.is_active ? 'Attiva' : 'Inattiva'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(collection)}
                          className="px-3 py-1 bg-[#663399] text-white rounded hover:bg-[#552288] transition-colors text-xs"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(collection.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                        >
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
    </section>
  )
}
