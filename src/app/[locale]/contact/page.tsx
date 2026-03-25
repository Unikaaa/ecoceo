'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
    phone: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setError('')

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
        throw new Error(data.error || 'Errore nell\'invio del messaggio')
      }

      setSubmitStatus('success')
      setFormData({ email: '', subject: '', message: '', phone: '' })
    } catch (err) {
      setSubmitStatus('error')
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
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

  return (
    <div className="min-h-screen bg-site py-8 sm:py-14 md:py-20">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-7 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif text-gray-900 mb-3 sm:mb-4">
              Contattaci
            </h1>
            <p className="text-sm sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Siamo qui per aiutarti. Compila il form qui sotto e ti risponderemo il prima possibile.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-artistic shadow-lg border border-gray-100 p-4 sm:p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

              {/* Telefono (opzionale) */}
              <Input
                type="tel"
                name="phone"
                label="Telefono (opzionale)"
                placeholder="+39 123 456 7890"
                value={formData.phone}
                onChange={handleChange}
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-artistic focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none min-h-[132px]"
                  placeholder="Scrivi qui il tuo messaggio..."
                />
              </div>

              {/* Error Message */}
              {submitStatus === 'error' && (
                <ErrorMessage message={error || 'Errore nell\'invio del messaggio'} />
              )}

              {/* Success Message */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-artistic">
                  <p className="font-medium">Messaggio inviato con successo!</p>
                  <p className="text-sm mt-1">Ti risponderemo al più presto.</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2 sm:pt-4">
                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full md:w-auto min-w-[200px] text-sm sm:text-base md:text-lg px-6 sm:px-8"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Invio in corso...
                    </span>
                  ) : (
                    'Contattaci'
                  )}
                </Button>
              </div>
            </form>

            {/* Info aggiuntive */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-sm text-gray-600">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p>info@unika-ceramiche.it</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Telefono</h3>
                  <p>+39 123 456 7890</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
