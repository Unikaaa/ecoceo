'use client'

import { useState, useEffect } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
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
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
        aria-hidden="true"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
      />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-artistic shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-3xl font-serif text-gray-900">Contattaci</h2>
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
        <div className="p-6 md:p-8">
          <p className="text-gray-700 mb-6">
            Compila il form qui sotto e ti risponderemo il prima possibile.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-artistic focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
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
            <div className="pt-4 flex gap-3">
              <Button
                type="submit"
                size="lg"
                variant="primary"
                disabled={isSubmitting}
                className="flex-1 md:flex-none min-w-[180px] text-lg px-8 py-4"
              >
                {isSubmitting ? 'Invio in corso...' : 'Contattaci'}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleClose}
                className="px-6 py-4"
              >
                Annulla
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
