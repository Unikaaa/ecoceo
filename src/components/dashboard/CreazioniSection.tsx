'use client'

import { useEffect, useMemo, useState } from 'react'
import ImageUploadField from './ImageUploadField'

type InventoryItem = {
  id: string
  product_code: string
  product_name: string
  section: string
  quantity: number
  price: number
  image_url?: string | null
  short_description?: string | null
  is_featured?: boolean
  show_in_art_gallery?: boolean
  art_gallery_order?: number
}

type Collection = {
  id: string
  name: string
  slug: string
  is_active?: boolean
}

export default function CreazioniSection() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [editing, setEditing] = useState<InventoryItem | null>(null)
  const [filter, setFilter] = useState<'all' | 'gallery'>('all')

  const load = async () => {
    try {
      setIsLoading(true)
      const [invRes, colRes] = await Promise.all([
        fetch('/api/inventory', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/collections?admin=1', { credentials: 'include', cache: 'no-store' }),
      ])
      const invData = await invRes.json()
      const colData = await colRes.json()
      if (!invRes.ok) throw new Error(invData.error || 'Errore magazzino')
      if (!colRes.ok) throw new Error(colData.error || 'Errore collezioni')
      setItems(invData.inventory || [])
      setCollections((colData.collections || []).filter((c: Collection) => c.is_active !== false))
    } catch (e) {
      setMessage({
        type: 'err',
        text: e instanceof Error ? e.message : 'Errore di caricamento',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const collectionName = (slug: string) =>
    collections.find((c) => c.slug === slug)?.name || slug

  const visible = useMemo(() => {
    const list = filter === 'gallery' ? items.filter((i) => i.show_in_art_gallery) : items
    return [...list].sort((a, b) => {
      const ao = a.art_gallery_order ?? 0
      const bo = b.art_gallery_order ?? 0
      if (a.show_in_art_gallery && b.show_in_art_gallery && ao !== bo) return ao - bo
      return a.product_name.localeCompare(b.product_name)
    })
  }, [items, filter])

  const saveItem = async (payload: Partial<InventoryItem> & { id: string }) => {
    setSavingId(payload.id)
    setMessage(null)
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data.error ||
            'Salvataggio non riuscito. Verifica di aver eseguito add_art_gallery_flags.sql'
        )
      }
      setMessage({ type: 'ok', text: 'Creazione aggiornata' })
      setEditing(null)
      await load()
      window.dispatchEvent(new CustomEvent('productsUpdated'))
    } catch (e) {
      setMessage({
        type: 'err',
        text: e instanceof Error ? e.message : 'Errore salvataggio',
      })
    } finally {
      setSavingId(null)
    }
  }

  const quickToggleGallery = async (item: InventoryItem) => {
    await saveItem({
      id: item.id,
      show_in_art_gallery: !item.show_in_art_gallery,
    })
  }

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif text-gray-900">Creazioni</h2>
          <p className="text-sm text-gray-600 mt-1">
            Seleziona prodotti esistenti del magazzino. Nessuna copia: stessi dati catalogo.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-2 text-sm rounded-lg border ${
              filter === 'all' ? 'bg-[#663399] text-white border-[#663399]' : 'bg-white text-gray-700'
            }`}
          >
            Tutte
          </button>
          <button
            type="button"
            onClick={() => setFilter('gallery')}
            className={`px-3 py-2 text-sm rounded-lg border ${
              filter === 'gallery' ? 'bg-[#663399] text-white border-[#663399]' : 'bg-white text-gray-700'
            }`}
          >
            In galleria
          </button>
        </div>
      </div>

      {message ? (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      ) : null}

      {isLoading ? (
        <p className="text-gray-600 text-sm">Caricamento creazioni...</p>
      ) : visible.length === 0 ? (
        <p className="text-gray-600 text-sm">
          Nessuna creazione. Aggiungi prodotti dal Magazzino, poi abilitali qui per la homepage.
        </p>
      ) : (
        <div className="space-y-3">
          {visible.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 rounded-xl p-3 sm:p-4 flex flex-col lg:flex-row gap-4"
            >
              <div className="w-full lg:w-28 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                {item.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                    No foto
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.product_name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Collezione: {collectionName(item.section)} · Codice: {item.product_code}
                </p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.short_description || 'Nessuna descrizione breve'}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full ${
                      item.show_in_art_gallery
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                    }`}
                  >
                    {item.show_in_art_gallery ? 'In Materia che diventa arte' : 'Non in galleria'}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200">
                    Ordine: {item.art_gallery_order ?? 0}
                  </span>
                </div>
              </div>

              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => quickToggleGallery(item)}
                  disabled={savingId === item.id}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50"
                >
                  {item.show_in_art_gallery ? 'Togli da homepage' : 'Metti in homepage'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(item)}
                  className="px-3 py-2 text-sm rounded-lg bg-[#663399] text-white hover:bg-[#552288]"
                >
                  Modifica
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing ? (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-3">
          <div className="bg-white w-full max-w-lg rounded-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-serif text-gray-900 mb-4">Modifica creazione</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                saveItem({
                  id: editing.id,
                  product_name: editing.product_name,
                  section: editing.section,
                  image_url: editing.image_url,
                  short_description: editing.short_description,
                  show_in_art_gallery: !!editing.show_in_art_gallery,
                  art_gallery_order: editing.art_gallery_order ?? 0,
                })
              }}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editing.product_name}
                  onChange={(e) => setEditing({ ...editing, product_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrizione breve</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                  value={editing.short_description || ''}
                  onChange={(e) => setEditing({ ...editing, short_description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collezione</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={editing.section}
                  onChange={(e) => setEditing({ ...editing, section: e.target.value })}
                  required
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <ImageUploadField
                label="Fotografia principale"
                value={editing.image_url || ''}
                onChange={(url) =>
                  setEditing({
                    ...editing,
                    image_url: typeof url === 'string' ? url : url[0] || '',
                  })
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={!!editing.show_in_art_gallery}
                    onChange={(e) =>
                      setEditing({ ...editing, show_in_art_gallery: e.target.checked })
                    }
                  />
                  Mostra in homepage
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ordine</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={editing.art_gallery_order ?? 0}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        art_gallery_order: parseInt(e.target.value, 10) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={savingId === editing.id}
                  className="flex-1 bg-[#663399] text-white rounded-lg py-2.5 disabled:opacity-50"
                >
                  {savingId === editing.id ? 'Salvataggio…' : 'Salva'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 rounded-lg border border-gray-200"
                >
                  Annulla
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  )
}
