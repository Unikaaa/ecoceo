'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

interface PopupButton {
  label: string
  href: string
}

interface SitePopupData {
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
  event_type: 'discount' | 'event' | 'announcement'
  event_label?: string | null
}

export default function SitePopup() {
  const [popup, setPopup] = useState<SitePopupData | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadPopup = async () => {
      try {
        const res = await fetch('/api/popups?active=true')
        const data = await res.json()
        if (!mounted || !res.ok) return

        const firstPopup = (data.popups || [])[0]
        if (!firstPopup?.id) return

        const storageKey = `site_popup_hidden_until_${firstPopup.id}`
        const hiddenUntil = Number(localStorage.getItem(storageKey) || '0')
        if (hiddenUntil > Date.now()) return

        setPopup(firstPopup)
        setIsVisible(true)
      } catch (error) {
        console.error('Errore caricamento popup sito:', error)
      }
    }

    loadPopup()

    return () => {
      mounted = false
    }
  }, [])

  const eventBadgeLabel = useMemo(() => {
    if (!popup) return ''
    if (popup.event_type === 'discount') return 'Sconto'
    if (popup.event_type === 'event') return 'Evento'
    return 'Novità'
  }, [popup])

  const closePopupFor24Hours = () => {
    if (!popup) return
    const key = `site_popup_hidden_until_${popup.id}`
    localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000))
    setIsVisible(false)
  }

  if (!popup || !isVisible) return null

  const imageAreaHeightClass =
    popup.image_area_size === 'sm'
      ? 'h-44'
      : popup.image_area_size === 'lg'
        ? 'h-72'
        : 'h-60'

  return (
    <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="relative max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/70">
        <button
          onClick={closePopupFor24Hours}
          className="absolute right-3 top-3 h-9 w-9 rounded-full bg-white/95 text-black hover:bg-white shadow z-10"
          aria-label="Chiudi popup"
        >
          x
        </button>

        {popup.image_url ? (
          <div className={`w-full ${imageAreaHeightClass} overflow-hidden relative bg-gray-100`}>
            <img
              src={popup.image_url}
              alt={popup.title}
              className="absolute inset-0 w-full h-full"
              style={{
                objectFit: popup.image_fit || 'cover',
                transform: `translate(${popup.image_offset_x || 0}px, ${popup.image_offset_y || 0}px) scale(${popup.image_scale || 1})`,
                transformOrigin: 'center',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-52 bg-gradient-to-br from-[#663399]/20 to-[#c45824]/20" />
        )}

        <div className="p-6 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#663399] bg-[#663399]/10 px-2.5 py-1 rounded-full border border-[#663399]/20">
              {eventBadgeLabel}
            </span>
            {popup.event_label ? (
              <span className="text-xs text-gray-600">{popup.event_label}</span>
            ) : null}
          </div>
          <h3 className="text-2xl font-serif text-gray-900 leading-tight">{popup.title}</h3>
          {popup.description ? (
            <p className="text-gray-700 leading-relaxed">{popup.description}</p>
          ) : null}

          {Array.isArray(popup.buttons) && popup.buttons.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {popup.buttons.map((button, index) => (
                <Link
                  key={`${button.href}-${index}`}
                  href={button.href}
                  onClick={closePopupFor24Hours}
                  className="px-4 py-2 rounded-lg bg-[#663399] text-white text-sm hover:bg-[#552288] transition-colors shadow-sm"
                >
                  {button.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
