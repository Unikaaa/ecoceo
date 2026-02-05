'use client'

import { useState } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'
import PriceCalculator from './PriceCalculator'

interface Step6CheckoutProps {
  state: PersonalizzaState
  sessionId: string
  onPrev: () => void
  onNext?: () => void
}

export default function PersonalizzaStep6({
  state,
  sessionId,
  onPrev,
}: Step6CheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      // Salva configurazione come "ready_for_checkout"
      const saveResponse = await fetch('/api/personalizza/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...state,
          status: 'ready_for_checkout',
        }),
      })

      if (!saveResponse.ok) {
        throw new Error('Errore salvataggio configurazione')
      }

      // Crea checkout Stripe
      const checkoutResponse = await fetch('/api/stripe/checkout-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configurationId: (await saveResponse.json()).configuration.id,
          totalPrice: state.totalPrice,
        }),
      })

      const checkoutData = await checkoutResponse.json()

      if (checkoutData.url) {
        window.location.href = checkoutData.url
      }
    } catch (error) {
      console.error('Errore checkout:', error)
      alert('Errore durante il checkout. Riprova.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div>

      <div className="bg-white rounded-lg shadow-xl p-8">
        {/* Riepilogo configurazione */}
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Riepilogo configurazione</h3>
          <div className="space-y-2 text-gray-700">
            {/* TODO: Mostrare dettagli configurazione */}
            <p>Configurazione personalizzata</p>
          </div>
        </div>

        {/* Prezzo */}
        <div className="mb-8">
          <PriceCalculator state={state} onPriceUpdate={() => {}} />
        </div>

        {/* Note */}
        <div className="mb-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Dopo il pagamento, riceverai una email di conferma con i dettagli dell'ordine.
            La tua ceramica personalizzata verrà prodotta e spedita entro 7-10 giorni lavorativi.
          </p>
        </div>

        {/* Bottoni Navigazione */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={onPrev}
            variant="outline"
            disabled={isProcessing}
            className="px-6 py-3"
          >
            ← Indietro
          </Button>
          <Button
            variant="primary"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="px-8 py-3"
          >
            {isProcessing ? 'Elaborazione...' : 'Procedi al pagamento'}
          </Button>
        </div>
      </div>
    </div>
  )
}
