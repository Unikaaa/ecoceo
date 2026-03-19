'use client'

import { useState, useEffect } from 'react'
import ImageUploadField from './ImageUploadField'

interface InventoryItem {
  id: string
  product_code: string
  product_name: string
  section: string
  quantity: number
  price: number
  is_customizable: boolean
  is_featured: boolean
  image_url?: string | null
  images?: string[] | null
  created_at: string
  updated_at: string
}

interface Collection {
  id: string
  name: string
  slug: string
  is_active: boolean
}

export default function InventorySection() {
  const [isOpen, setIsOpen] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    section: 'gioielleria',
    quantity: '0',
    price: '0.00',
    is_customizable: false,
    is_featured: false,
    image_url: '',
  })

  // Carica prodotti e collezioni al mount
  useEffect(() => {
    fetchInventory()
    fetchCollections()
    
    // Ascolta eventi di aggiornamento collezioni (solo quando necessario)
    const handleCollectionsUpdate = () => {
      fetchCollections()
    }
    window.addEventListener('collectionsUpdated', handleCollectionsUpdate)

    return () => {
      window.removeEventListener('collectionsUpdated', handleCollectionsUpdate)
    }
  }, [])

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/inventory')
      const data = await response.json()
      if (response.ok && data.inventory) {
        setInventory(data.inventory)
      }
    } catch (error) {
      console.error('Errore caricamento magazzino:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCollections = async () => {
    try {
      const response = await fetch(`/api/collections?t=${Date.now()}`)
      const data = await response.json()
      if (response.ok && data.collections) {
        // Filtra solo collezioni attive e ordina per display_order
        const activeCollections = data.collections
          .filter((c: Collection) => c.is_active !== false)
          .sort((a: Collection, b: Collection) => a.slug.localeCompare(b.slug))
        setCollections(activeCollections)
        
        // Se non ci sono collezioni, usa un default
        if (activeCollections.length === 0) {
          return
        }
        
        // Se la sezione corrente non esiste più nelle collezioni, aggiorna con la prima disponibile
        setFormData(prev => {
          const currentSectionExists = activeCollections.find((c: Collection) => c.slug === prev.section)
          if (!currentSectionExists && activeCollections.length > 0) {
            return {
              ...prev,
              section: activeCollections[0].slug
            }
          }
          return prev
        })
      }
    } catch (error) {
      console.error('Errore caricamento collezioni:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
      }

      if (editingId) {
        // Aggiorna prodotto esistente
        const response = await fetch('/api/inventory', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...payload }),
        })

        if (response.ok) {
          const responseData = await response.json()
          await fetchInventory()
          resetForm()
          // Notifica altri componenti dell'aggiornamento prodotti
          window.dispatchEvent(new CustomEvent('productsUpdated'))
          
          // Se il prodotto è passato da esaurito a disponibile, invia notifiche
          if (responseData.is_now_available) {
            try {
              await fetch('/api/product-notifications/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ product_id: editingId }),
              })
            } catch (error) {
              console.error('Errore invio notifiche:', error)
            }
          }
        }
      } else {
        // Crea nuovo prodotto
        const response = await fetch('/api/inventory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (response.ok) {
          await fetchInventory()
          resetForm()
          // Notifica altri componenti dell'aggiornamento prodotti
          window.dispatchEvent(new CustomEvent('productsUpdated'))
        }
      }
    } catch (error) {
      console.error('Errore salvataggio prodotto:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id)
    setFormData({
      product_code: item.product_code,
      product_name: item.product_name,
      section: item.section,
      quantity: item.quantity.toString(),
      price: item.price.toString(),
      is_customizable: item.is_customizable,
      is_featured: item.is_featured || false,
      image_url: item.image_url || '',
    })
    setIsOpen(true)
  }

  const handleToggleFeatured = async (item: InventoryItem) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, is_featured: !item.is_featured }),
      })

      if (response.ok) {
        await fetchInventory()
        window.dispatchEvent(new CustomEvent('productsUpdated'))
      }
    } catch (error) {
      console.error('Errore toggle favorito:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      return
    }

    try {
      const response = await fetch(`/api/inventory?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchInventory()
        // Notifica altri componenti dell'aggiornamento prodotti
        window.dispatchEvent(new CustomEvent('productsUpdated'))
      }
    } catch (error) {
      console.error('Errore eliminazione prodotto:', error)
    }
  }

  const resetForm = () => {
    // Usa la prima collezione disponibile come default, o 'gioielleria' se non ci sono collezioni
    const defaultSection = collections.length > 0 ? collections[0].slug : 'gioielleria'
    setFormData({
      product_code: '',
      product_name: '',
      section: defaultSection,
      quantity: '0',
      price: '0.00',
      is_customizable: false,
      is_featured: false,
      image_url: '',
    })
    setEditingId(null)
    setIsOpen(false)
  }

  const getQuantityStatus = (quantity: number) => {
    return quantity > 0 ? 'Disponibile' : 'Esaurito'
  }

  const getQuantityColor = (quantity: number) => {
    return quantity > 0 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  return (
    <section id="inventory" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-900 mb-1">Magazzino</h2>
          <p className="text-sm text-gray-600">Gestisci prodotti e quantità</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors text-sm font-medium"
        >
          {isOpen ? 'Chiudi' : 'Aggiungi Prodotto'}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 pt-6 mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Codice Prodotto
                </label>
                <input
                  type="text"
                  value={formData.product_code}
                  onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="CER-001"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Prodotto
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="Nome prodotto"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sezione (Collezione) *
                </label>
                {collections.length === 0 ? (
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 text-sm">
                    Caricamento collezioni...
                  </div>
                ) : (
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                    required
                  >
                    {collections.map((collection) => (
                      <option key={collection.id} value={collection.slug}>
                        {collection.name}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Seleziona la collezione a cui appartiene questo prodotto
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantità
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prezzo (€)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_customizable}
                  onChange={(e) => setFormData({ ...formData, is_customizable: e.target.checked })}
                  className="w-4 h-4 text-[#663399] border-gray-300 rounded focus:ring-[#663399]"
                />
                <span className="text-sm text-gray-700">Personalizzabile</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <span className="text-sm text-gray-700">⭐ I Nostri Favoriti</span>
              </div>
            </div>

            {/* Upload Immagine */}
            <ImageUploadField
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url as string })}
              multiple={false}
              label="Immagine Prodotto"
            />

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Salvataggio...' : editingId ? 'Aggiorna Prodotto' : 'Salva Prodotto'}
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

      {/* Lista prodotti */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Caricamento prodotti...</p>
          </div>
        ) : inventory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Nessun prodotto nel magazzino</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Immagine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Codice</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nome</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sezione</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Quantità</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prezzo</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Stato</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Favorito</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Azioni</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-xs text-gray-400">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.product_code}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{item.section}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">€{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQuantityColor(item.quantity)}`}>
                        {getQuantityStatus(item.quantity)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          onClick={() => handleToggleFeatured(item)}
                          className={`text-2xl transition-all hover:scale-110 ${item.is_featured ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                          title={item.is_featured ? 'Rimuovi dai favoriti' : 'Aggiungi ai favoriti'}
                        >
                          ⭐
                        </button>
                        {item.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium text-amber-800 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200">
                            <span>Favorito</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="px-3 py-1 bg-[#663399] text-white rounded hover:bg-[#552288] transition-colors text-xs"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
