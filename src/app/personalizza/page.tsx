'use client'

import { useState, useEffect } from 'react'
import PersonalizzaStep1 from '@/components/personalizza/Step1Category'
import PersonalizzaStep2 from '@/components/personalizza/Step2ProductType'
import PersonalizzaStep3 from '@/components/personalizza/Step3Style'
import PersonalizzaStep4 from '@/components/personalizza/Step4Customization'
import PersonalizzaStep5 from '@/components/personalizza/Step5Preview'
import PersonalizzaStep6 from '@/components/personalizza/Step6Checkout'

export interface PersonalizzaState {
  categoryId: string | null
  productTypeId: string | null
  styleId: string | null
  sizeId: string | null
  backgroundId: string | null
  decorations: string[]
  customText: string
  customTextFont: string
  customTextColor: string
  customTextSize: number
  userImages: Array<{ url: string; id: string }>
  canvasData: any
  totalPrice: number
}

const INITIAL_STATE: PersonalizzaState = {
  categoryId: null,
  productTypeId: null,
  styleId: null,
  sizeId: null,
  backgroundId: null,
  decorations: [],
  customText: '',
  customTextFont: 'serif',
  customTextColor: '#000000',
  customTextSize: 24,
  userImages: [],
  canvasData: null,
  totalPrice: 0,
}

export default function PersonalizzaPage() {
  const [state, setState] = useState<PersonalizzaState>(INITIAL_STATE)
  const [sessionId, setSessionId] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(1)
  const [isManualNavigation, setIsManualNavigation] = useState(false)

  // Genera session ID univoco
  useEffect(() => {
    const storedSessionId = sessionStorage.getItem('personalizza_session_id')
    if (storedSessionId) {
      setSessionId(storedSessionId)
    } else {
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('personalizza_session_id', newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  // Aggiorna step corrente in base alle selezioni (solo se non c'è navigazione manuale)
  useEffect(() => {
    if (isManualNavigation) {
      // Reset flag dopo un breve delay per permettere la navigazione manuale
      const timer = setTimeout(() => setIsManualNavigation(false), 100)
      return () => clearTimeout(timer)
    }

    // Auto-avanzamento solo se l'utente non ha navigato manualmente
    if (!state.categoryId) {
      setCurrentStep(1)
    } else if (!state.productTypeId) {
      setCurrentStep(2)
    } else if (!state.styleId) {
      setCurrentStep(3)
    } else if (!state.sizeId) {
      setCurrentStep(4)
    } else if (!state.canvasData) {
      setCurrentStep(5)
    } else {
      setCurrentStep(6)
    }
  }, [state, isManualNavigation])

  // Salva stato automaticamente
  useEffect(() => {
    if (sessionId && state.categoryId) {
      const timeoutId = setTimeout(() => {
        saveConfiguration()
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [state, sessionId])

  const saveConfiguration = async () => {
    try {
      await fetch('/api/personalizza/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...state,
        }),
      })
    } catch (error) {
      console.error('Errore salvataggio configurazione:', error)
    }
  }

  const updateState = (updates: Partial<PersonalizzaState>) => {
    setState((prev) => {
      const newState = { ...prev, ...updates }
      // Nessun auto-avanzamento - l'utente deve sempre cliccare "Next" manualmente
      return newState
    })
  }

  const goToStep = (step: number) => {
    // Permetti di andare a uno step se:
    // 1. È lo step corrente o precedente (sempre accessibile)
    // 2. È uno step successivo ma i prerequisiti sono soddisfatti
    if (step <= currentStep || 
        (step === 1) || 
        (step === 2 && state.categoryId) ||
        (step === 3 && state.productTypeId) ||
        (step === 4 && state.styleId) ||
        (step === 5 && state.sizeId) ||
        (step === 6 && state.canvasData)) {
      setIsManualNavigation(true)
      setCurrentStep(step)
    }
  }

  const stepLabels = [
    'Categoria',
    'Tipo Prodotto',
    'Stile',
    'Personalizzazione',
    'Anteprima',
    'Checkout',
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header elegante */}
      <div className="relative bg-gradient-to-r from-[#663399] via-[#552288] to-[#663399] text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
        <div className="relative container mx-auto px-4 py-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-center drop-shadow-lg">
            Crea la tua ceramica personalizzata
          </h1>
          <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto text-white/90 font-light">
            Personalizza ogni dettaglio della tua ceramica in pochi semplici passaggi
          </p>
        </div>
      </div>

      {/* Layout Step-by-Step con sidebar elegante */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar elegante con numeri step */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-8">
              <h2 className="text-xl font-serif font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
                I Tuoi Passaggi
              </h2>
              <nav className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map((step, index) => (
                  <div key={step} className="relative">
                    {/* Linea di connessione */}
                    {index < 5 && (
                      <div className={`absolute left-4 top-12 w-0.5 h-12 transition-all duration-300 ${
                        step < currentStep ? 'bg-green-400' : 'bg-gray-200'
                      }`} />
                    )}
                    
                    <button
                      onClick={() => goToStep(step)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 text-left relative z-10 ${
                        step === currentStep
                          ? 'bg-gradient-to-r from-[#663399] to-[#552288] text-white shadow-lg scale-105'
                          : step < currentStep
                          ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-base transition-all duration-300 ${
                        step === currentStep
                          ? 'bg-white text-[#663399] shadow-md'
                          : step < currentStep
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {step < currentStep ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          step
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                          Passo {step}
                        </div>
                        <div className="text-sm font-semibold">
                          {stepLabels[step - 1]}
                        </div>
                      </div>
                      {step === currentStep && (
                        <div className="absolute right-3">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </button>
                  </div>
                ))}
              </nav>
            </div>
          </aside>

          {/* Contenuto principale elegante */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 md:p-12">
                {currentStep === 1 && (
                  <PersonalizzaStep1
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(2)}
                    onPrev={undefined}
                  />
                )}

                {currentStep === 2 && state.categoryId && (
                  <PersonalizzaStep2
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(3)}
                    onPrev={() => setCurrentStep(1)}
                  />
                )}

                {currentStep === 3 && state.productTypeId && (
                  <PersonalizzaStep3
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(4)}
                    onPrev={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 4 && state.styleId && (
                  <PersonalizzaStep4
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(5)}
                    onPrev={() => setCurrentStep(3)}
                  />
                )}

                {currentStep === 5 && state.sizeId && (
                  <PersonalizzaStep5
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(6)}
                    onPrev={() => setCurrentStep(4)}
                  />
                )}

                {currentStep === 6 && state.sizeId && state.styleId && (
                  <PersonalizzaStep6
                    state={state}
                    sessionId={sessionId}
                    onNext={undefined}
                    onPrev={() => setCurrentStep(5)}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
