'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ImageUploadField from '@/components/dashboard/ImageUploadField'

interface PopupButton {
  label: string
  href: string
}

interface SitePopup {
  id: string
  title: string
  description: string
  image_url: string
  image_scale?: number
  image_offset_x?: number
  image_offset_y?: number
  image_fit?: 'contain' | 'cover'
  image_area_size?: 'sm' | 'md' | 'lg'
  buttons: PopupButton[]
  starts_at: string
  ends_at?: string | null
  event_type: 'discount' | 'event' | 'announcement'
  event_label?: string | null
  is_active: boolean
  priority: number
}

const PRESET_BUTTONS: PopupButton[] = [
  { label: 'Shop', href: '/shop' },
  { label: 'Chi Siamo', href: '/about' },
  { label: 'News', href: '/news' },
  { label: 'Personalizza', href: '/personalizza' },
  { label: 'Contattaci', href: '/?openContact=true' },
]

const IMAGE_AREA_OPTIONS = [
  { id: 'sm', label: 'Compatta', sizeLabel: '640 x 220' },
  { id: 'md', label: 'Media', sizeLabel: '720 x 280' },
  { id: 'lg', label: 'Ampia', sizeLabel: '800 x 340' },
] as const

const IMAGE_AREA_HEIGHT_CLASS: Record<'sm' | 'md' | 'lg', string> = {
  sm: 'h-44',
  md: 'h-60',
  lg: 'h-72',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  image_url: '',
  image_scale: 1,
  image_offset_x: 0,
  image_offset_y: 0,
  image_fit: 'cover' as 'contain' | 'cover',
  image_area_size: 'md' as 'sm' | 'md' | 'lg',
  starts_at: '',
  ends_at: '',
  event_type: 'announcement',
  event_label: '',
  is_active: true,
  priority: 0,
  buttons: [] as PopupButton[],
}

export default function PopupDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const [popups, setPopups] = useState<SitePopup[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingPopup, setEditingPopup] = useState<SitePopup | null>(null)
  const [previewPopup, setPreviewPopup] = useState<SitePopup | null>(null)
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [isDraggingImage, setIsDraggingImage] = useState(false)
  const [dragOrigin, setDragOrigin] = useState({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  })
  const MIN_IMAGE_SCALE = 0.7
  const MAX_IMAGE_SCALE = 2.2

  useEffect(() => {
    const authStatus = sessionStorage.getItem('dashboard_auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
      fetchPopups()
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isDraggingImage) return

    const onMove = (event: MouseEvent) => {
      const nextX = dragOrigin.offsetX + (event.clientX - dragOrigin.x)
      const nextY = dragOrigin.offsetY + (event.clientY - dragOrigin.y)
      setFormData((prev) => ({
        ...prev,
        image_offset_x: Math.max(-240, Math.min(240, Math.round(nextX))),
        image_offset_y: Math.max(-240, Math.min(240, Math.round(nextY))),
      }))
    }

    const onUp = () => setIsDraggingImage(false)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [isDraggingImage, dragOrigin])

  const fetchPopups = async () => {
    const res = await fetch('/api/popups')
    const data = await res.json()
    if (res.ok) {
      setPopups(data.popups || [])
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (data.success) {
        sessionStorage.setItem('dashboard_auth', 'authenticated')
        setIsAuthenticated(true)
        fetchPopups()
      } else {
        setError(data.error || 'Password non corretta')
      }
    } catch {
      setError('Errore durante l\'autenticazione')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    setIsAuthenticated(false)
    setPassword('')
  }

  const togglePresetButton = (button: PopupButton) => {
    const exists = formData.buttons.some((b) => b.href === button.href)
    if (exists) {
      setFormData({
        ...formData,
        buttons: formData.buttons.filter((b) => b.href !== button.href),
      })
      return
    }
    setFormData({
      ...formData,
      buttons: [...formData.buttons, button],
    })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingPopup(null)
    setShowImageEditor(false)
    setFormData(EMPTY_FORM)
  }

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.starts_at) {
      alert('Titolo e data inizio sono obbligatori')
      return
    }

    const payload = {
      ...formData,
      image_scale: Number(formData.image_scale) || 1,
      image_offset_x: Number(formData.image_offset_x) || 0,
      image_offset_y: Number(formData.image_offset_y) || 0,
      image_fit: formData.image_fit || 'cover',
      image_area_size: formData.image_area_size || 'md',
      starts_at: new Date(formData.starts_at).toISOString(),
      ends_at: formData.ends_at ? new Date(formData.ends_at).toISOString() : null,
    }

    const res = await fetch('/api/popups', {
      method: editingPopup ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingPopup ? { id: editingPopup.id, ...payload } : payload),
    })

    if (!res.ok) {
      alert('Errore salvataggio popup')
      return
    }

    await fetchPopups()
    resetForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Eliminare definitivamente questa popup?')
    if (!confirmed) return

    const res = await fetch('/api/popups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) {
      fetchPopups()
    }
  }

  const startEdit = (popup: SitePopup) => {
    setEditingPopup(popup)
    setShowForm(true)
    setShowImageEditor(false)
    setFormData({
      title: popup.title || '',
      description: popup.description || '',
      image_url: popup.image_url || '',
      image_scale: popup.image_scale || 1,
      image_offset_x: popup.image_offset_x || 0,
      image_offset_y: popup.image_offset_y || 0,
      image_fit: popup.image_fit || 'cover',
      image_area_size: popup.image_area_size || 'md',
      starts_at: popup.starts_at ? new Date(popup.starts_at).toISOString().slice(0, 16) : '',
      ends_at: popup.ends_at ? new Date(popup.ends_at).toISOString().slice(0, 16) : '',
      event_type: popup.event_type || 'announcement',
      event_label: popup.event_label || '',
      is_active: popup.is_active,
      priority: popup.priority || 0,
      buttons: popup.buttons || [],
    })
  }

  const getPopupStatus = (popup: SitePopup) => {
    if (!popup.is_active) {
      return { label: 'Offline', className: 'bg-gray-100 text-gray-700' }
    }

    const now = Date.now()
    const startsAt = new Date(popup.starts_at).getTime()
    const endsAt = popup.ends_at ? new Date(popup.ends_at).getTime() : null

    if (now < startsAt) {
      return { label: 'Programmato', className: 'bg-amber-100 text-amber-700' }
    }
    if (endsAt && now > endsAt) {
      return { label: 'Scaduto', className: 'bg-red-100 text-red-700' }
    }
    return { label: 'Online', className: 'bg-green-100 text-green-700' }
  }

  const getEventBadgeLabel = (popup: SitePopup) => {
    if (popup.event_type === 'discount') return 'Sconto'
    if (popup.event_type === 'event') return 'Evento'
    return 'Novita'
  }

  const zoomImage = (delta: number) => {
    setFormData((prev) => ({
      ...prev,
      image_scale: Math.max(MIN_IMAGE_SCALE, Math.min(MAX_IMAGE_SCALE, Number((prev.image_scale + delta).toFixed(2)))),
    }))
  }

  const handleImageDragStart = (event: any) => {
    if (!formData.image_url) return
    setIsDraggingImage(true)
    setDragOrigin({
      x: event.clientX,
      y: event.clientY,
      offsetX: formData.image_offset_x,
      offsetY: formData.image_offset_y,
    })
  }

  if (isLoading) {
    return <div className="min-h-screen bg-site flex items-center justify-center"><div>Caricamento...</div></div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center px-3 sm:px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2 text-center">Dashboard UNIKA</h1>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">Inserisci la password per accedere</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399]"
              placeholder="Password"
              required
            />
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button className="w-full bg-[#663399] text-white py-2.5 px-4 rounded-lg hover:bg-[#552288] transition-colors font-medium">
              Accedi
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="space-y-5 sm:space-y-8 lg:space-y-10">
        <div className="border-b border-gray-200 pb-4 sm:pb-6 lg:pb-7">
          <h1 className="text-2xl sm:text-4xl font-serif text-gray-900 mb-1.5 sm:mb-2">Pop Up</h1>
          <p className="text-sm sm:text-base text-gray-600">Crea e gestisci popup del sito.</p>
        </div>

        <div className="flex justify-stretch sm:justify-end">
          <button
            onClick={() => {
              setShowForm(true)
              setEditingPopup(null)
              setShowImageEditor(false)
              setFormData(EMPTY_FORM)
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-[#663399] text-white rounded-lg hover:bg-[#552288] transition-colors"
          >
            + Nuova Pop Up
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#663399]">Dashboard</p>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {editingPopup ? 'Modifica Pop Up' : 'Nuova Pop Up'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Compila i campi principali e controlla l’anteprima prima di pubblicare.
                </p>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Chiudi
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-4 sm:gap-6">
              {/* Colonna sinistra: contenuti */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Titolo</label>
                      <input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Es. Sconto di Primavera"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Descrizione breve</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Scrivi un testo chiaro e breve (1–2 righe)."
                        rows={4}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data inizio</label>
                      <input
                        type="datetime-local"
                        value={formData.starts_at}
                        onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Data fine (opzionale)</label>
                      <input
                        type="datetime-local"
                        value={formData.ends_at}
                        onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                      <select
                        value={formData.event_type}
                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value as any })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      >
                        <option value="announcement">Annuncio</option>
                        <option value="discount">Sconto</option>
                        <option value="event">Evento</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Etichetta (opzionale)</label>
                      <input
                        value={formData.event_label}
                        onChange={(e) => setFormData({ ...formData, event_label: e.target.value })}
                        placeholder="Es. Fino al 30/12"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bottoni preimpostati</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BUTTONS.map((btn) => {
                      const selected = formData.buttons.some((b) => b.href === btn.href)
                      return (
                        <button
                          key={btn.href}
                          type="button"
                          onClick={() => togglePresetButton(btn)}
                          className={`px-3 py-2 text-[13px] rounded-xl border transition-colors ${
                            selected
                              ? 'bg-[#663399] text-white border-[#663399]'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {btn.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      />
                      Attiva popup
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Priorità</label>
                      <input
                        type="number"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value || '0', 10) || 0 })}
                        placeholder="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#663399]"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-4">
                    <button
                      onClick={handleSave}
                      className="w-full sm:w-auto px-5 py-2.5 bg-[#663399] text-white rounded-xl hover:bg-[#552288] transition-colors text-sm font-medium"
                    >
                      {editingPopup ? 'Aggiorna' : 'Pubblica'}
                    </button>
                    <button
                      onClick={resetForm}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Annulla
                    </button>
                  </div>
                </div>
              </div>

              {/* Colonna destra: immagine/preview */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="grid grid-cols-1 gap-3">
                    <ImageUploadField
                      value={formData.image_url}
                      onChange={(url) => setFormData({ ...formData, image_url: url as string })}
                      label="Immagine Pop Up"
                    />
                    <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
                      <label className="block text-xs font-semibold text-gray-700 mb-2">Spazio immagine popup</label>
                      <select
                        value={formData.image_area_size || 'md'}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            image_area_size: e.target.value as 'sm' | 'md' | 'lg',
                          }))
                        }
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-xl bg-white text-gray-700"
                        title="Dimensione spazio immagine"
                      >
                        {IMAGE_AREA_OPTIONS.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label} ({option.sizeLabel})
                          </option>
                        ))}
                      </select>
                      <p className="mt-2 text-[11px] text-gray-500">
                        Definisce l’altezza dell’area immagine nella popup.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Anteprima immagine</p>
                      <p className="text-xs text-gray-500">Usa la pennetta per spostare e zoomare.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!formData.image_url) {
                          alert('Carica prima un’immagine')
                          return
                        }
                        setShowImageEditor(true)
                      }}
                      className="h-9 w-9 rounded-full bg-[#663399] text-white hover:bg-[#552288] transition-colors flex items-center justify-center"
                      aria-label="Modifica immagine popup"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l6.768-6.768a2.5 2.5 0 113.536 3.536L12.536 16.536a4 4 0 01-1.79 1.01L7 18l.454-3.746A4 4 0 018.464 12.464z" />
                      </svg>
                    </button>
                  </div>

                  <div className={`${IMAGE_AREA_HEIGHT_CLASS[formData.image_area_size || 'md']} rounded-xl overflow-hidden bg-gray-100 relative border border-dashed border-gray-300`}>
                    {formData.image_url ? (
                      <img
                        src={formData.image_url}
                        alt="Anteprima popup"
                        className="absolute inset-0 w-full h-full select-none pointer-events-none"
                        style={{
                          objectFit: formData.image_fit || 'cover',
                          transform: `translate(${formData.image_offset_x || 0}px, ${formData.image_offset_y || 0}px) scale(${formData.image_scale || 1})`,
                          transformOrigin: 'center',
                        }}
                        draggable={false}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-sm text-gray-500">Nessuna immagine</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {popups.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-gray-500">
              Nessuna popup creata.
            </div>
          ) : (
            popups.map((popup) => (
              <div key={popup.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                      {popup.image_url ? (
                        <img
                          src={popup.image_url}
                          alt={popup.title}
                          className="w-full h-full"
                          style={{
                            objectFit: popup.image_fit || 'cover',
                            transform: `translate(${popup.image_offset_x || 0}px, ${popup.image_offset_y || 0}px) scale(${popup.image_scale || 1})`,
                            transformOrigin: 'center',
                          }}
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-[#663399]/15 to-[#c45824]/20" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{popup.title || 'Popup senza titolo'}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPopupStatus(popup).className}`}>
                          {getPopupStatus(popup).label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{popup.description || 'Nessuna descrizione'}</p>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                          <span className="font-semibold">Tipo:</span> {popup.event_type}
                          {popup.event_label ? ` • ${popup.event_label}` : ''}
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                          <span className="font-semibold">Inizio:</span> {new Date(popup.starts_at).toLocaleString('it-IT')}
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                          <span className="font-semibold">Fine:</span> {popup.ends_at ? new Date(popup.ends_at).toLocaleString('it-IT') : 'Nessuna scadenza'}
                        </div>
                        <div className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-700">
                          <span className="font-semibold">Bottoni:</span> {popup.buttons?.length || 0} • <span className="font-semibold">Priorità:</span> {popup.priority}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:pt-1">
                    <button
                      onClick={() => setPreviewPopup(popup)}
                      className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                    >
                      Anteprima
                    </button>
                    <button onClick={() => startEdit(popup)} className="px-3 py-1 bg-[#663399] text-white rounded text-sm hover:bg-[#552288]">
                      Modifica
                    </button>
                    <button onClick={() => handleDelete(popup.id)} className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700">
                      Elimina
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showImageEditor && (
        <div className="fixed inset-0 z-[70] bg-black/55 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Editor Immagine</h3>
                <p className="text-xs text-gray-500">Sposta, ridimensiona e scegli se mostrare intera o ritagliare.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowImageEditor(false)}
                className="h-8 w-8 rounded-full text-black hover:bg-gray-100"
                aria-label="Chiudi editor immagine"
              >
                x
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image_fit: 'contain' }))}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    formData.image_fit === 'contain'
                      ? 'bg-[#663399] text-white border-[#663399]'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Immagine intera
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, image_fit: 'cover' }))}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${
                    formData.image_fit === 'cover'
                      ? 'bg-[#663399] text-white border-[#663399]'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Ritaglia per riempire
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => zoomImage(-0.1)}
                  className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  -
                </button>
                <input
                  type="range"
                  min={Math.round(MIN_IMAGE_SCALE * 100)}
                  max={Math.round(MAX_IMAGE_SCALE * 100)}
                  value={Math.round((formData.image_scale || 1) * 100)}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      image_scale: Number(e.target.value) / 100,
                    }))
                  }
                  className="flex-1 accent-[#663399]"
                />
                <button
                  type="button"
                  onClick={() => zoomImage(0.1)}
                  className="h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                >
                  +
                </button>
                <span className="text-xs text-gray-600 w-12 text-right">{Math.round((formData.image_scale || 1) * 100)}%</span>
              </div>

              <div
                onMouseDown={handleImageDragStart}
                className={`${IMAGE_AREA_HEIGHT_CLASS[formData.image_area_size || 'md']} rounded-xl overflow-hidden bg-gray-100 relative border border-dashed border-gray-300 ${
                  formData.image_url ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
              >
                {formData.image_url ? (
                  <img
                    src={formData.image_url}
                    alt="Editor immagine popup"
                    className="absolute inset-0 w-full h-full select-none pointer-events-none"
                    style={{
                      objectFit: formData.image_fit || 'cover',
                      transform: `translate(${formData.image_offset_x || 0}px, ${formData.image_offset_y || 0}px) scale(${formData.image_scale || 1})`,
                      transformOrigin: 'center',
                    }}
                    draggable={false}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-sm text-gray-500">Nessuna immagine</div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      image_scale: 1,
                      image_offset_x: 0,
                      image_offset_y: 0,
                      image_fit: 'cover',
                      image_area_size: 'md',
                    }))
                  }
                  className="px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setShowImageEditor(false)}
                  className="px-4 py-1.5 rounded-lg bg-[#663399] text-white hover:bg-[#552288] text-sm"
                >
                  Applica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewPopup && (
        <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/70">
            <button
              onClick={() => setPreviewPopup(null)}
              className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/95 text-black hover:bg-white shadow z-10"
              aria-label="Chiudi anteprima popup"
            >
              x
            </button>

            {previewPopup.image_url ? (
              <div className={`w-full ${IMAGE_AREA_HEIGHT_CLASS[(previewPopup.image_area_size || 'md') as 'sm' | 'md' | 'lg']} overflow-hidden relative bg-gray-100`}>
                <img
                  src={previewPopup.image_url}
                  alt={previewPopup.title}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    objectFit: previewPopup.image_fit || 'cover',
                    transform: `translate(${previewPopup.image_offset_x || 0}px, ${previewPopup.image_offset_y || 0}px) scale(${previewPopup.image_scale || 1})`,
                    transformOrigin: 'center',
                  }}
                />
              </div>
            ) : (
              <div className={`w-full ${IMAGE_AREA_HEIGHT_CLASS[(previewPopup.image_area_size || 'md') as 'sm' | 'md' | 'lg']} bg-gradient-to-br from-[#663399]/20 to-[#c45824]/20`} />
            )}

            <div className="p-6 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#663399] bg-[#663399]/10 px-2.5 py-1 rounded-full border border-[#663399]/20">
                  {getEventBadgeLabel(previewPopup)}
                </span>
                {previewPopup.event_label ? (
                  <span className="text-xs text-gray-600">{previewPopup.event_label}</span>
                ) : null}
              </div>
              <h3 className="text-2xl font-serif text-gray-900 leading-tight">{previewPopup.title}</h3>
              {previewPopup.description ? (
                <p className="text-gray-700 leading-relaxed">{previewPopup.description}</p>
              ) : null}

              {Array.isArray(previewPopup.buttons) && previewPopup.buttons.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-2">
                  {previewPopup.buttons.map((button, index) => (
                    <span
                      key={`${button.href}-${index}`}
                      className="px-4 py-2 rounded-lg bg-[#663399] text-white text-sm shadow-sm"
                    >
                      {button.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
