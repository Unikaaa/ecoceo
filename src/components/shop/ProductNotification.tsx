'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/data/mockProducts'

interface ProductNotificationProps {
  product: Product
  onSuccess?: () => void
}

export default function ProductNotification({ product, onSuccess }: ProductNotificationProps) {
  const productId = product.inventory_id || product.id
  const storageKey = `notification_email_${productId}`
  
  // Carica email salvata da localStorage quando il componente si monta
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  // Verifica immediata se la notifica esiste già
  const checkIfRegistered = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      setIsAlreadyRegistered(false)
      setIsChecking(false)
      return
    }

    setIsChecking(true)
    try {
      const response = await fetch(
        `/api/product-notifications?product_id=${productId}&email=${encodeURIComponent(emailToCheck.trim())}`
      )
      const data = await response.json()
      
      if (response.ok && data.exists) {
        setIsAlreadyRegistered(true)
      } else {
        setIsAlreadyRegistered(false)
      }
    } catch (err) {
      console.error('Errore verifica notifica:', err)
      setIsAlreadyRegistered(false)
    } finally {
      setIsChecking(false)
    }
  }

  // Carica email salvata quando il modal si apre e verifica IMMEDIATAMENTE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem(storageKey)
      if (savedEmail) {
        setEmail(savedEmail)
        checkIfRegistered(savedEmail)
      }
    }
  }, [storageKey, productId])

  // Verifica IMMEDIATA quando l'email cambia
  useEffect(() => {
    if (email && email.includes('@')) {
      checkIfRegistered(email)
    } else {
      setIsAlreadyRegistered(false)
      setIsChecking(false)
    }
  }, [email, productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation() // Previene la navigazione al click sul link
    
    if (!email || !email.includes('@')) {
      setError('Inserisci un\'email valida')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/product-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.inventory_id || product.id,
          email: email.trim(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        
        // Salva email in localStorage per pre-compilazione futura
        if (typeof window !== 'undefined') {
          localStorage.setItem(storageKey, email.trim().toLowerCase())
        }
        
        // NON svuotare l'email, così rimane visibile
        // setEmail('')
        
        // Chiudi modal dopo 2 secondi se c'è callback
        if (onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 2000)
        } else {
          // Reset dopo 3 secondi se non c'è callback
          setTimeout(() => {
            setIsSuccess(false)
          }, 3000)
        }
      } else {
        // Se l'errore è "già esistente", considera comunque un successo
        // perché significa che la notifica è già registrata
        if (data.error && data.error.includes('già') || data.error && data.error.includes('esistente')) {
          setIsSuccess(true)
          if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, email.trim().toLowerCase())
          }
          if (onSuccess) {
            setTimeout(() => {
              onSuccess()
            }, 2000)
          }
        } else {
          setError(data.error || 'Errore durante la registrazione. Riprova.')
        }
      }
    } catch (err) {
      setError('Errore di connessione. Riprova.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Se la notifica è già registrata, mostra messaggio informativo
  if (isAlreadyRegistered && email && email.includes('@')) {
    return (
      <div className="space-y-5">
        <div className="p-5 bg-blue-50 border-2 border-blue-300 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-blue-900 mb-1">
                Notifica già inviata!
              </p>
              <p className="text-sm text-blue-800 leading-relaxed">
                La tua email <span className="font-semibold">{email}</span> è già registrata per questo prodotto. 
                Ti avviseremo automaticamente quando sarà di nuovo disponibile.
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Vuoi usare un'altra email? Modifica l'email qui sopra.
          </p>
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="p-5 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-base font-semibold text-green-800 mb-1">
              Perfetto!
            </p>
            <p className="text-sm text-green-700">
              Ti avviseremo quando il prodotto sarà di nuovo disponibile.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Testo informativo */}
      <div>
        <p className="text-gray-700 leading-relaxed">
          Vuoi essere avvisato quando questo prodotto sarà di nuovo disponibile? 
          Lascia la tua email e ti invieremo una notifica non appena sarà nuovamente in magazzino.
        </p>
      </div>

      {/* Form Email */}
      <form onSubmit={handleSubmit} className="space-y-3" onClick={(e) => e.stopPropagation()}>
        <div>
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
            La tua email
          </label>
          <input
            id="email-input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
              setIsAlreadyRegistered(false) // Reset quando l'email cambia
            }}
            onClick={(e) => e.stopPropagation()}
            placeholder="esempio@email.com"
            className={`w-full px-4 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isAlreadyRegistered && email && email.includes('@')
                ? 'border-blue-300 bg-blue-50 focus:ring-blue-300 focus:border-blue-400'
                : 'border-gray-300 focus:ring-[#663399]/30 focus:border-[#663399]'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting || (isAlreadyRegistered && email && email.includes('@'))}
            required
            autoFocus
          />
          {isChecking && email && email.includes('@') && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifica in corso...
            </p>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-red-600 font-medium flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        )}
        
        <button
          type="submit"
          disabled={isSubmitting || isAlreadyRegistered || isChecking}
          className="w-full px-6 py-3 bg-[#663399] text-white text-base font-semibold rounded-lg hover:bg-[#552288] transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Invio in corso...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Avvisami quando disponibile</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
