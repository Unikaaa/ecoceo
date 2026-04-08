'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { CeramicShape } from '@/lib/personalizza/productShape'

const StepLoading = () => (
  <div className="min-h-[320px] flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#663399]" />
  </div>
)

const PersonalizzaStep1 = dynamic(() => import('@/components/personalizza/Step1Category'), { loading: StepLoading })
const PersonalizzaStep2 = dynamic(() => import('@/components/personalizza/Step2ProductType'), { loading: StepLoading })
const PersonalizzaStep3 = dynamic(() => import('@/components/personalizza/Step3Style'), { loading: StepLoading })
const PersonalizzaStep4 = dynamic(() => import('@/components/personalizza/Step4Customization'), { loading: StepLoading })
const PersonalizzaStep5 = dynamic(() => import('@/components/personalizza/Step5Preview'), { loading: StepLoading })
const PersonalizzaStep6 = dynamic(() => import('@/components/personalizza/Step6Checkout'), { loading: StepLoading })

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
  ceramicShape: CeramicShape
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
  ceramicShape: 'oval',
  userImages: [],
  canvasData: null,
  totalPrice: 0,
}

export default function PersonalizzaPage() {
  const [state, setState] = useState<PersonalizzaState>(INITIAL_STATE)
  const [sessionId, setSessionId] = useState<string>('')
  const [currentStep, setCurrentStep] = useState(1)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  const saveConfiguration = useCallback(async (snapshot: PersonalizzaState) => {
    try {
      await fetch('/api/personalizza/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          ...snapshot,
        }),
      })
    } catch (error) {
      console.error('Errore salvataggio configurazione:', error)
    }
  }, [sessionId])

  // Salva stato automaticamente senza ricaricare pagina:
  // debounce per evitare scritture troppo frequenti al database.
  useEffect(() => {
    if (!sessionId || !state.categoryId) return

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveConfiguration(state)
    }, 2400)

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [state, sessionId, saveConfiguration])

  const updateState = (updates: Partial<PersonalizzaState>) => {
    setState((prev) => ({ ...prev, ...updates }))
  }

  // Reset tutto lo stato dagli step successivi in poi
  const resetStepsFrom = (fromStep: number) => {
    setState((prev) => {
      const newState = { ...prev }
      if (fromStep <= 2) newState.productTypeId = null
      if (fromStep <= 3) newState.styleId = null
      if (fromStep <= 4) {
        newState.sizeId = null
        newState.backgroundId = null
        newState.decorations = []
        newState.customText = ''
        newState.customTextFont = 'serif'
        newState.customTextColor = '#000000'
        newState.customTextSize = 24
        newState.ceramicShape = 'oval'
        newState.userImages = []
      }
      if (fromStep <= 5) {
        newState.canvasData = null
        newState.totalPrice = 0
      }
      return newState
    })
  }

  // Calcola lo step massimo raggiungibile
  const getMaxReachableStep = () => {
    if (!state.categoryId) return 1
    if (!state.productTypeId) return 2
    if (!state.styleId) return 3
    if (!state.sizeId) return 4
    // Canvas non ancora implementato - permetti di arrivare al checkout
    return 6
  }

  // Navigazione sidebar - se torni indietro, resetta gli step successivi
  const goToStep = (step: number) => {
    const maxStep = getMaxReachableStep()
    if (step >= 1 && step <= maxStep) {
      if (step < currentStep) {
        // Tornando indietro: resetta tutto dopo lo step di destinazione
        resetStepsFrom(step + 1)
      }
      setCurrentStep(step)
    }
  }

  // Tornare indietro con bottone "Indietro" - resetta gli step successivi
  const goBack = (targetStep: number) => {
    resetStepsFrom(targetStep + 1)
    setCurrentStep(targetStep)
  }

  const stepLabels = [
    'Categoria',
    'Tipo Prodotto',
    'Stile',
    'Dimensione',
    'Personalizzazione Canva',
    'Checkout',
  ]

  const mobileStepperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Mantieni lo step attivo centrato (o quasi) nello stepper mobile
    const container = mobileStepperRef.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>(`button[data-step="${currentStep}"]`)
    if (!active) return
    active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [currentStep])

  return (
    <div className="min-h-screen bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#663399]/8 via-[#663399]/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[#c45824]/8 via-[#c45824]/4 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[900px] h-[900px] bg-gradient-to-tr from-[#663399]/6 via-[#c45824]/6 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
      {/* Header stile Chi Siamo */}
      <section className="relative py-10 sm:py-24 md:py-32 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand overflow-hidden">
        {/* Pattern decorativo cerchi */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-[#663399] rounded-full" />
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-[#c45824] rounded-full" />
          <div className="absolute bottom-32 left-1/3 w-40 h-40 border-2 border-[#663399] rounded-full" />
          <div className="absolute bottom-20 right-20 w-28 h-28 border-2 border-[#c45824] rounded-full" />
        </div>

        <div className="container mx-auto px-3 sm:px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-5xl md:text-7xl font-serif font-bold mb-3 sm:mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#663399] via-[#552288] to-[#663399] bg-clip-text text-transparent">
                Crea la tua ceramica personalizzata
              </span>
            </h1>
            <p className="text-sm sm:text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Personalizza ogni dettaglio della tua ceramica in pochi semplici passaggi
            </p>
          </div>
        </div>
      </section>

      {/* Layout Step-by-Step con sidebar elegante */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-16">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-12">
          {/* Stepper compatto mobile (secondario) */}
          <div className="lg:hidden -mx-3 px-3">
            <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] font-semibold text-gray-700">Passaggi</p>
                <p className="text-[11px] text-gray-500">
                  {currentStep}/6
                </p>
              </div>
              <div ref={mobileStepperRef} className="mt-2 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {[1, 2, 3, 4, 5, 6].map((step) => {
                  const maxStep = getMaxReachableStep()
                  const isReachable = step <= maxStep
                  const isCompleted = step < currentStep
                  const isActive = step === currentStep
                  return (
                    <button
                      key={step}
                      data-step={step}
                      type="button"
                      onClick={() => goToStep(step)}
                      disabled={!isReachable}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        isActive
                          ? 'border-[#663399] bg-[#663399]/10 text-[#663399]'
                          : isCompleted
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : isReachable
                          ? 'border-gray-200 bg-white text-gray-700'
                          : 'border-gray-100 bg-gray-50 text-gray-400'
                      }`}
                    >
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
                          isActive
                            ? 'bg-[#663399] text-white'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {step}
                      </span>
                      <span className="whitespace-nowrap">{stepLabels[step - 1]}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Sidebar elegante con numeri step */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-8 lg:sticky lg:top-8">
              <h2 className="text-base sm:text-xl font-serif font-bold text-gray-900 mb-4 sm:mb-8 pb-2 sm:pb-4 border-b border-gray-200">
                I Tuoi Passaggi
              </h2>
              <nav className="space-y-1">
                {[1, 2, 3, 4, 5, 6].map((step, index) => {
                  const maxStep = getMaxReachableStep()
                  const isReachable = step <= maxStep
                  const isCompleted = step < currentStep
                  const isActive = step === currentStep

                  return (
                    <div key={step} className="relative">
                      {/* Linea di connessione */}
                      {index < 5 && (
                        <div className={`absolute left-4 top-12 w-0.5 h-12 transition-all duration-300 ${
                          isCompleted ? 'bg-green-400' : 'bg-gray-200'
                        } hidden lg:block`} />
                      )}
                      
                      <button
                        onClick={() => goToStep(step)}
                        disabled={!isReachable}
                        className={`w-full flex items-center gap-3 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl transition-all duration-300 text-left relative z-10 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#663399] to-[#552288] text-white shadow-md lg:shadow-lg'
                            : isCompleted
                            ? 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 cursor-pointer'
                            : isReachable
                            ? 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer'
                            : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold text-sm sm:text-base transition-all duration-300 ${
                          isActive
                            ? 'bg-white text-[#663399] shadow-md'
                            : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {isCompleted && !isActive ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            step
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="hidden sm:block text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                            Passo {step}
                          </div>
                          <div className="text-xs sm:text-sm font-semibold">
                            {stepLabels[step - 1]}
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute right-3">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    </div>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Contenuto principale elegante */}
          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-4 sm:p-8 md:p-12">
                {/* Step 1-3: Auto-avanzamento al click della selezione */}
                {currentStep === 1 && (
                  <PersonalizzaStep1
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(2)}
                  />
                )}

                {currentStep === 2 && (
                  <PersonalizzaStep2
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(3)}
                    onPrev={() => goBack(1)}
                  />
                )}

                {currentStep === 3 && (
                  <PersonalizzaStep3
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(4)}
                    onPrev={() => goBack(2)}
                  />
                )}

                {/* Step 4-6: Navigazione manuale con bottoni */}
                {currentStep === 4 && (
                  <PersonalizzaStep4
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(5)}
                    onPrev={() => goBack(3)}
                  />
                )}

                {currentStep === 5 && (
                  <PersonalizzaStep5
                    state={state}
                    updateState={updateState}
                    onNext={() => setCurrentStep(6)}
                    onPrev={() => goBack(4)}
                  />
                )}

                {currentStep === 6 && (
                  <PersonalizzaStep6
                    state={state}
                    sessionId={sessionId}
                    onPrev={() => goBack(5)}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      </div>
    </div>
  )
}
