'use client'

import { useRef, useState, useCallback } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'
import CanvasEditor, { CanvasEditorRef } from './CanvasEditor'

interface Step5PreviewProps {
  state: PersonalizzaState
  updateState: (updates: Partial<PersonalizzaState>) => void
  onNext: () => void
  onPrev: () => void
}

const BG_PRESETS = [
  { name: 'Bianco', value: '#ffffff' },
  { name: 'Crema', value: '#FFF8E7' },
  { name: 'Avorio', value: '#FFFFF0' },
  { name: 'Rosa', value: '#FFE4E1' },
  { name: 'Azzurro', value: '#E8F4FD' },
  { name: 'Grigio', value: '#F0F0F0' },
]

export default function PersonalizzaStep5({
  state,
  updateState,
  onNext,
  onPrev,
}: Step5PreviewProps) {
  const editorRef = useRef<CanvasEditorRef>(null)
  const [bgColor, setBgColor] = useState('#ffffff')

  const handleCanvasUpdate = useCallback((canvasData: any) => {
    updateState({ canvasData })
  }, [updateState])

  const handleDownload = useCallback(() => {
    const dataUrl = editorRef.current?.exportPNG()
    if (dataUrl) {
      const link = document.createElement('a')
      link.download = 'la-mia-ceramica.png'
      link.href = dataUrl
      link.click()
    }
  }, [])

  const handleNext = useCallback(() => {
    const json = editorRef.current?.getCanvasJSON()
    if (json) {
      updateState({ canvasData: json })
    }
    onNext()
  }, [onNext, updateState])

  return (
    <div>
      {/* Titolo e istruzioni chiare */}
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Anteprima della tua ceramica
        </h3>
        <p className="text-gray-600 text-base">
          Qui vedi come apparirà la tua ceramica. Puoi spostare e ridimensionare gli elementi toccandoli.
        </p>
      </div>

      {/* Istruzioni semplici per tutti */}
      <div className="bg-[#663399]/5 border border-[#663399]/20 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">💡</span>
          <div className="text-sm text-[#663399]">
            <p className="font-semibold mb-1">Come funziona:</p>
            <ul className="space-y-1 text-[#663399]/80">
              <li>• <strong>Tocca</strong> un elemento per selezionarlo</li>
              <li>• <strong>Trascina</strong> per spostarlo dove vuoi</li>
              <li>• <strong>Usa le maniglie</strong> agli angoli per ingrandire o rimpicciolire</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Canvas centrali */}
      <div className="max-w-xl mx-auto">
        <CanvasEditor
          ref={editorRef}
          state={state}
          onUpdate={handleCanvasUpdate}
          canvasShape={state.ceramicShape}
          bgColor={bgColor}
        />
      </div>

      {/* Foto caricate — grandi e cliccabili */}
      {state.userImages.length > 0 && (
        <div className="mt-6 bg-gray-50 rounded-2xl p-5 max-w-xl mx-auto">
          <h4 className="text-base font-semibold text-gray-800 mb-3">
            📷 Le tue foto — tocca per aggiungere
          </h4>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {state.userImages.map((img) => (
              <button
                key={img.id}
                onClick={() => (editorRef.current as any)?.addImage?.(img.url)}
                className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-3 border-gray-200 hover:border-[#663399] transition-all hover:scale-105 hover:shadow-lg active:scale-95"
              >
                <img src={img.url} alt="Foto" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Azioni — bottoni GRANDI e CHIARI */}
      <div className="mt-6 max-w-xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Aggiungi testo */}
          <button
            onClick={() => (editorRef.current as any)?.addText?.('Testo')}
            className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-[#663399] hover:bg-[#663399]/5 transition-all active:scale-95"
          >
            <svg className="w-7 h-7 text-[#663399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Aggiungi testo</span>
          </button>

          {/* Elimina selezionato */}
          <button
            onClick={() => (editorRef.current as any)?.deleteSelected?.()}
            className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-red-400 hover:bg-red-50 transition-all active:scale-95"
          >
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Elimina</span>
          </button>

          {/* Annulla */}
          <button
            onClick={() => (editorRef.current as any)?.undo?.()}
            className="flex flex-col items-center gap-2 p-4 bg-white border-2 border-gray-200 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-all active:scale-95"
          >
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Annulla</span>
          </button>

          {/* Scarica bozza */}
          <button
            onClick={handleDownload}
            className="flex flex-col items-center gap-2 p-4 bg-[#663399]/10 border-2 border-[#663399]/30 rounded-2xl hover:border-[#663399] hover:bg-[#663399]/20 transition-all active:scale-95"
          >
            <svg className="w-7 h-7 text-[#663399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm font-medium text-[#663399]">Scarica bozza</span>
          </button>
        </div>

        {/* Colore sfondo — semplice riga di pallini */}
        <div className="mt-5 flex items-center gap-3 justify-center">
          <span className="text-sm text-gray-500 font-medium">Sfondo:</span>
          <div className="flex gap-2">
            {BG_PRESETS.map((c) => (
              <button
                key={c.value}
                onClick={() => setBgColor(c.value)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  bgColor === c.value 
                    ? 'border-[#663399] scale-110 shadow-md' 
                    : 'border-gray-300 hover:border-gray-500'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottoni Navigazione */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={onPrev}
          variant="outline"
          className="px-6 py-3"
        >
          ← Indietro
        </Button>
        <Button
          onClick={handleNext}
          variant="primary"
          className="px-8 py-3"
        >
          Avanti →
        </Button>
      </div>
    </div>
  )
}
