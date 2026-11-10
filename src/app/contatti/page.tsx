'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function ContattiPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Errore nell'invio del messaggio")
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setSubmitStatus('error')
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-[70vh] bg-site">
      <section className="border-b border-[#e4dbd0]">
        <div className="container mx-auto px-4 py-12 sm:py-16">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.16em] text-[#663399]/80 mb-2">Contatti</p>
          <h1 className="font-serif text-3xl sm:text-5xl text-[#2a2420] mb-3">Parliamo del tuo progetto</h1>
          <p className="text-sm sm:text-base text-[#6b635c] max-w-2xl leading-relaxed">
            Richieste prodotto, personalizzazioni, preventivi e collaborazioni professionali.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10 sm:py-14 max-w-2xl">
        {submitStatus === 'success' ? (
          <div className="border border-[#e4dbd0] bg-white/70 p-6 rounded-2xl">
            <h2 className="font-serif text-2xl text-[#2a2420] mb-2">Messaggio inviato</h2>
            <p className="text-sm text-[#6b635c] mb-4">Ti risponderemo il prima possibile.</p>
            <Link href="/shop" className="text-[#663399] text-sm hover:underline">Torna allo Shop</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 border border-[#e4dbd0] bg-white/70 p-5 sm:p-8 rounded-2xl">
            {submitStatus === 'error' && <ErrorMessage message={error} />}
            <Input name="name" label="Nome" value={formData.name} onChange={handleChange} required />
            <Input type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
            <Input type="tel" name="phone" label="Telefono (opzionale)" value={formData.phone} onChange={handleChange} />
            <div>
              <label className="block text-sm font-medium text-[#2a2420] mb-1.5" htmlFor="subject">Oggetto</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#2a2420]"
              >
                <option value="">Seleziona</option>
                <option value="Informazioni prodotto">Informazioni prodotto</option>
                <option value="Personalizzazione">Personalizzazione</option>
                <option value="Preventivo">Preventivo</option>
                <option value="Professionisti / B2B">Professionisti / B2B</option>
                <option value="Altro">Altro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2a2420] mb-1.5" htmlFor="message">Messaggio</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#e4dbd0] bg-white px-3 py-2.5 text-sm text-[#2a2420]"
              />
            </div>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Invio…' : 'Invia richiesta'}
            </Button>
          </form>
        )}
      </section>
    </div>
  )
}
