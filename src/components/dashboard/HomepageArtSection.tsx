'use client'

import { useEffect, useState } from 'react'

type Collection = {
  id: string
  name: string
  slug: string
  is_active?: boolean
  show_in_art_gallery?: boolean
  art_gallery_order?: number
  image_url?: string | null
}

type Product = {
  id: string
  name: string
  category: string
  show_in_art_gallery?: boolean
  art_gallery_order?: number
  images?: string[]
}

export default function HomepageArtSection() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [creations, setCreations] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const load = async () => {
    try {
      setIsLoading(true)
      const [colRes, prodRes] = await Promise.all([
        fetch('/api/collections?admin=1', { credentials: 'include', cache: 'no-store' }),
        fetch('/api/inventory', { credentials: 'include', cache: 'no-store' }),
      ])
      const colData = await colRes.json()
      const invData = await prodRes.json()
      if (!colRes.ok) throw new Error(colData.error || 'Errore collezioni')
      if (!prodRes.ok) throw new Error(invData.error || 'Errore prodotti')

      setCollections(colData.collections || [])
      const mapped = (invData.inventory || []).map((item: any) => ({
        id: item.id,
        name: item.product_name,
        category: item.section,
        show_in_art_gallery: !!item.show_in_art_gallery,
        art_gallery_order: item.art_gallery_order || 0,
        images: item.image_url ? [item.image_url] : [],
      }))
      setCreations(mapped)
    } catch (e) {
      setMessage({
        type: 'err',
        text: e instanceof Error ? e.message : 'Errore caricamento homepage',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const patchCollection = async (id: string, updates: Partial<Collection>) => {
    setSaving(id)
    setMessage(null)
    try {
      const response = await fetch('/api/collections', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(
          data.error ||
            'Salvataggio non riuscito. Esegui supabase/add_art_gallery_flags.sql se non l’hai ancora fatto.'
        )
      }
      setMessage({ type: 'ok', text: 'Collezione aggiornata' })
      await load()
      window.dispatchEvent(new CustomEvent('collectionsUpdated'))
    } catch (e) {
      setMessage({
        type: 'err',
        text: e instanceof Error ? e.message : 'Errore salvataggio',
      })
    } finally {
      setSaving(null)
    }
  }

  const patchCreation = async (id: string, updates: Record<string, unknown>) => {
    setSaving(id)
    setMessage(null)
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Salvataggio non riuscito')
      }
      setMessage({ type: 'ok', text: 'Creazione aggiornata' })
      await load()
      window.dispatchEvent(new CustomEvent('productsUpdated'))
    } catch (e) {
      setMessage({
        type: 'err',
        text: e instanceof Error ? e.message : 'Errore salvataggio',
      })
    } finally {
      setSaving(null)
    }
  }

  const galleryCollections = collections
    .filter((c) => c.show_in_art_gallery)
    .sort((a, b) => (a.art_gallery_order || 0) - (b.art_gallery_order || 0))
  const galleryCreations = creations
    .filter((c) => c.show_in_art_gallery)
    .sort((a, b) => (a.art_gallery_order || 0) - (b.art_gallery_order || 0))

  return (
    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mt-6">
      <h2 className="text-xl sm:text-2xl font-serif text-gray-900 mb-1">Gestione Homepage</h2>
      <p className="text-sm text-gray-600 mb-5">
        Controlla cosa compare in “Materia che diventa arte”. I dati restano quelli di Magazzino/Collezioni.
      </p>

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
        <p className="text-sm text-gray-600">Caricamento…</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Collezioni in galleria</h3>
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center gap-3 border border-gray-200 rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{collection.name}</p>
                    <p className="text-xs text-gray-500">{collection.slug}</p>
                  </div>
                  <input
                    type="number"
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    value={collection.art_gallery_order ?? 0}
                    disabled={saving === collection.id}
                    onChange={(e) =>
                      setCollections((prev) =>
                        prev.map((c) =>
                          c.id === collection.id
                            ? { ...c, art_gallery_order: parseInt(e.target.value, 10) || 0 }
                            : c
                        )
                      )
                    }
                    onBlur={() =>
                      patchCollection(collection.id, {
                        art_gallery_order: collection.art_gallery_order ?? 0,
                      })
                    }
                    title="Ordine"
                  />
                  <button
                    type="button"
                    disabled={saving === collection.id}
                    onClick={() =>
                      patchCollection(collection.id, {
                        show_in_art_gallery: !collection.show_in_art_gallery,
                      })
                    }
                    className={`text-xs px-3 py-2 rounded-lg border ${
                      collection.show_in_art_gallery
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-white border-gray-200 text-gray-700'
                    }`}
                  >
                    {collection.show_in_art_gallery ? 'Attiva' : 'Off'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Anteprima galleria</h3>
            <div className="rounded-xl border border-dashed border-gray-300 p-4 bg-gray-50 min-h-[220px]">
              <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">
                Materia che diventa arte
              </p>
              {galleryCollections.length === 0 && galleryCreations.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Nessun elemento abilitato. Attiva collezioni o creazioni.
                </p>
              ) : (
                <div className="space-y-4">
                  {galleryCollections.length > 0 ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Collezioni</p>
                      <div className="flex flex-wrap gap-2">
                        {galleryCollections.map((c) => (
                          <span
                            key={c.id}
                            className="text-xs px-2.5 py-1 rounded-full bg-white border border-gray-200"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {galleryCreations.length > 0 ? (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Creazioni</p>
                      <div className="grid grid-cols-2 gap-2">
                        {galleryCreations.slice(0, 6).map((c) => (
                          <div key={c.id} className="bg-white rounded-lg border border-gray-200 p-2">
                            <p className="text-xs font-medium truncate">{c.name}</p>
                            <p className="text-[11px] text-gray-500">{c.category}</p>
                            <button
                              type="button"
                              className="mt-2 text-[11px] text-red-600"
                              onClick={() =>
                                patchCreation(c.id, { show_in_art_gallery: false })
                              }
                            >
                              Rimuovi da homepage
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
