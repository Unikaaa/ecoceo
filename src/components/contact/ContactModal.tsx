'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  // Reset solo quando si chiude dopo successo
  useEffect(() => {
    if (!isOpen && submitStatus === 'success') {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitStatus('idle')
      setError('')
    }
  }, [isOpen, submitStatus])

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setError('')
    
    // Validazione
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error')
      setError('Tutti i campi obbligatori devono essere compilati.')
      setIsSubmitting(false)
      return
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setSubmitStatus('error')
      setError('Indirizzo email non valido.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setSubmitStatus('error')
        setError(data.error || 'Errore nell\'invio del messaggio.')
        return
      }

      setSubmitStatus('success')
      // Chiudi la modal dopo 1.5 secondi
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setSubmitStatus('error')
      setError('Errore nell\'invio del messaggio. Riprova più tardi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleClose = () => {
    // Non resettare il form quando si chiude, mantieni i dati
    onClose()
  }

  useEffect(() => {
    // Lock scroll senza "saltare" (no shift) e senza scroll interno.
    if (typeof window === 'undefined') return
    const body = document.body
    const html = document.documentElement

    if (!isOpen) return

    const scrollY = window.scrollY || 0
    const prevBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    const prevHtmlOverflow = html.style.overflow

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'

    return () => {
      const top = body.style.top
      body.style.position = prevBody.position
      body.style.top = prevBody.top
      body.style.left = prevBody.left
      body.style.right = prevBody.right
      body.style.width = prevBody.width
      body.style.overflow = prevBody.overflow
      html.style.overflow = prevHtmlOverflow

      const y = top ? Math.abs(parseInt(top, 10)) : scrollY
      window.scrollTo(0, y || 0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Modal */}
      <div className="relative h-[100dvh] w-full flex items-center justify-center px-3 py-4">
        <div
          className="relative w-full max-w-[40rem] overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5"
          style={{ animation: 'slideUp 0.3s ease-out' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-3.5 sm:px-5 flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-serif text-gray-900 leading-tight">Contattaci</h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Scrivici e ti rispondiamo al più presto.</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
              aria-label="Chiudi"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-5 overflow-hidden">

            <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nome */}
            <Input
              type="text"
              name="name"
              label="Il tuo nome"
              placeholder="Mario Rossi"
              value={formData.name}
              onChange={handleChange}
              required
            />

            {/* Email */}
            <Input
              type="email"
              name="email"
              label="La tua email"
              placeholder="nome@esempio.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Oggetto */}
            <Input
              type="text"
              name="subject"
              label="Oggetto"
              placeholder="Di cosa vuoi parlarci?"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            {/* Messaggio */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Messaggio <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-3 border border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all text-sm sm:text-base min-h-[160px]"
                placeholder="Scrivi qui il tuo messaggio..."
              />
            </div>

            {/* Error Message */}
            {submitStatus === 'error' && (
              <ErrorMessage message={error || 'Errore nell\'invio del messaggio'} />
            )}

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-artistic animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="font-medium">✓ Messaggio inviato con successo!</p>
                <p className="text-sm mt-1">Ti risponderemo al più presto.</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-1.5 flex gap-2.5">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1 min-w-0 text-sm sm:text-base px-4"
              >
                {isSubmitting ? 'Invio in corso...' : 'Invia'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleClose}
                className="flex-1 min-w-0 text-sm sm:text-base px-4"
              >
                Annulla
              </Button>
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  , document.body)
}
