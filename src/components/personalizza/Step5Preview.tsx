'use client'

import { useRef, useState, useCallback, type ChangeEvent } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import Button from '@/components/ui/Button'
import CanvasEditor, { CanvasEditorRef, CanvasSelectionInfo } from './CanvasEditor'
import PriceCalculator from './PriceCalculator'

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
  const uploadInputRef = useRef<HTMLInputElement>(null)
  const [bgColor, setBgColor] = useState('#ffffff')
  const [selection, setSelection] = useState<CanvasSelectionInfo>({ type: 'none' })

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

  const handleSelectionChange = useCallback((info: CanvasSelectionInfo) => {
    setSelection(info)
  }, [])

  const handleCloseEdits = useCallback(() => {
    const canvas = (editorRef.current as any)?.getCanvas?.()
    if (canvas) {
      canvas.discardActiveObject()
      canvas.renderAll()
      canvas.fire('selection:cleared')
    }
    setSelection({ type: 'none' })
  }, [])

  const handleAddPreviewImages = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return

    const readAsDataURL = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string) || '')
        reader.onerror = () => reject(new Error('Errore lettura file'))
        reader.readAsDataURL(file)
      })

    const results = await Promise.all(
      files.map(async (file, index) => {
        const url = await readAsDataURL(file)
        const id = `preview_${Date.now()}_${index}_${Math.random().toString(36).slice(2, 8)}`
        return { id, url }
      })
    )

    results.forEach((img) => {
      if (img.url) {
        ;(editorRef.current as any)?.addImage?.(img.url)
      }
    })

    updateState({
      userImages: [...state.userImages, ...results.filter((img) => !!img.url)],
    })
    event.target.value = ''
  }, [state.userImages, updateState])

  return (
    <div className="space-y-6">
      {/* Titolo e istruzioni chiare */}
      <div className="mb-6">
        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
          Personalizzazione Canva
        </h3>
        <p className="text-gray-600 text-base">
          In questo passaggio aggiungi e modifichi testo e immagini direttamente sul canvas.
        </p>
      </div>

      {/* Istruzioni semplici per tutti */}
      <div className="bg-gradient-to-r from-[#663399]/5 to-[#c45824]/5 border border-[#663399]/20 rounded-2xl p-4">
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

      {/* Canvas + colonna modifiche a destra */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          <div className="w-full bg-white border border-gray-200 rounded-3xl p-4 md:p-6 shadow-sm">
            <CanvasEditor
              ref={editorRef}
              state={state}
              onUpdate={handleCanvasUpdate}
              canvasShape={state.ceramicShape}
              bgColor={bgColor}
              onSelectionChange={handleSelectionChange}
            />
          </div>

          <div className="w-full lg:w-[340px] lg:min-h-[620px] lg:sticky lg:top-24">
            {selection.type !== 'none' ? (
              <aside className="rounded-3xl border border-[#663399]/15 bg-white shadow-[0_10px_40px_rgba(17,24,39,0.08)] overflow-hidden animate-[fadeIn_.2s_ease-out]">
                <div className="px-5 py-4 bg-gradient-to-r from-[#663399]/10 via-[#7d48b6]/10 to-[#a06cd5]/10 border-b border-[#663399]/15">
                  <p className="text-xs uppercase tracking-wide text-[#663399]/80 font-semibold">Pannello Modifica</p>
                  <h4 className="text-sm font-bold text-gray-900 mt-1">
                    {selection.type === 'text' ? 'Testo selezionato' : selection.type === 'image' ? 'Immagine selezionata' : 'Elemento selezionato'}
                  </h4>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-[#663399]/80 bg-[#663399]/8 border border-[#663399]/15 rounded-xl px-3 py-2">
                    Le modifiche sono immediate: appena cambi colore, font o grandezza, lo vedi subito sul canvas.
                  </p>

                  {selection.type === 'text' && (
                    <>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Font</label>
                        <select
                          value={selection.fontFamily || 'serif'}
                          onChange={(e) => {
                            const fontFamily = e.target.value
                            ;(editorRef.current as any)?.setTextProperty?.('fontFamily', fontFamily)
                            updateState({ customTextFont: fontFamily })
                          }}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:ring-2 focus:ring-[#663399]/30 focus:border-[#663399] outline-none"
                        >
                          <option value="serif">Classico</option>
                          <option value="sans-serif">Moderno</option>
                          <option value="Georgia">Elegante</option>
                          <option value="monospace">Tecnico</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-600 mb-1.5">Colore</label>
                        <input
                          type="color"
                          value={selection.fill || '#000000'}
                          onChange={(e) => {
                            const color = e.target.value
                            ;(editorRef.current as any)?.setTextProperty?.('fill', color)
                            updateState({ customTextColor: color })
                          }}
                          className="w-full h-11 border border-gray-300 rounded-xl cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Grandezza testo</span>
                          <input
                            type="number"
                            min={12}
                            max={120}
                            value={selection.fontSize || 24}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              const fontSize = Math.max(12, Math.min(120, parsed))
                              ;(editorRef.current as any)?.setTextProperty?.('fontSize', fontSize)
                              updateState({ customTextSize: fontSize })
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="12"
                          max="120"
                          value={selection.fontSize || 24}
                          onChange={(e) => {
                            const fontSize = parseInt(e.target.value, 10)
                            ;(editorRef.current as any)?.setTextProperty?.('fontSize', fontSize)
                            updateState({ customTextSize: fontSize })
                          }}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Rotazione</span>
                          <input
                            type="number"
                            min={-180}
                            max={180}
                            value={Math.round(selection.angle ?? 0)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              editorRef.current?.setObjectAngle(Math.max(-180, Math.min(180, parsed)))
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={selection.angle ?? 0}
                          onChange={(e) => editorRef.current?.setObjectAngle(parseInt(e.target.value, 10))}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Opacita'</span>
                          <input
                            type="number"
                            min={10}
                            max={100}
                            value={Math.round((selection.opacity ?? 1) * 100)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              const opacityPct = Math.max(10, Math.min(100, parsed))
                              editorRef.current?.setObjectOpacity(opacityPct / 100)
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={Math.round((selection.opacity ?? 1) * 100)}
                          onChange={(e) => editorRef.current?.setObjectOpacity(parseInt(e.target.value, 10) / 100)}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Curvatura testo</span>
                          <input
                            type="number"
                            min={-100}
                            max={100}
                            value={Math.round(selection.textCurve ?? 0)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              ;(editorRef.current as any)?.setTextCurve?.(Math.max(-100, Math.min(100, parsed)))
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="-100"
                          max="100"
                          value={selection.textCurve ?? 0}
                          onChange={(e) => (editorRef.current as any)?.setTextCurve?.(parseInt(e.target.value, 10))}
                          className="w-full accent-[#663399]"
                        />
                        <div className="mt-1 flex justify-between text-[10px] text-gray-500">
                          <span>Triste</span>
                          <span>Dritto</span>
                          <span>Sorriso</span>
                        </div>
                      </div>
                    </>
                  )}

                  {selection.type === 'image' && (
                    <>
                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Dimensione</span>
                          <input
                            type="number"
                            min={20}
                            max={250}
                            value={Math.round(selection.scale ?? 100)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              editorRef.current?.setObjectScale(Math.max(20, Math.min(250, parsed)))
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="20"
                          max="250"
                          value={selection.scale ?? 100}
                          onChange={(e) => editorRef.current?.setObjectScale(parseInt(e.target.value, 10))}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Rotazione</span>
                          <input
                            type="number"
                            min={-180}
                            max={180}
                            value={Math.round(selection.angle ?? 0)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              editorRef.current?.setObjectAngle(Math.max(-180, Math.min(180, parsed)))
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={selection.angle ?? 0}
                          onChange={(e) => editorRef.current?.setObjectAngle(parseInt(e.target.value, 10))}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Opacita'</span>
                          <input
                            type="number"
                            min={10}
                            max={100}
                            value={Math.round((selection.opacity ?? 1) * 100)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              const opacityPct = Math.max(10, Math.min(100, parsed))
                              editorRef.current?.setObjectOpacity(opacityPct / 100)
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={Math.round((selection.opacity ?? 1) * 100)}
                          onChange={(e) => editorRef.current?.setObjectOpacity(parseInt(e.target.value, 10) / 100)}
                          className="w-full accent-[#663399]"
                        />
                      </div>

                      <div>
                        <label className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Tondezza</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={Math.round(selection.roundness ?? 0)}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10)
                              if (Number.isNaN(parsed)) return
                              editorRef.current?.setImageRoundness(Math.max(0, Math.min(100, parsed)))
                            }}
                            className="w-16 h-6 px-1.5 text-right text-[11px] border border-gray-300 rounded-md text-gray-700"
                          />
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={selection.roundness ?? 0}
                          onChange={(e) => editorRef.current?.setImageRoundness(parseInt(e.target.value, 10))}
                          className="w-full accent-[#663399]"
                        />
                      </div>
                    </>
                  )}

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleCloseEdits}
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-[#663399] to-[#7d48b6] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.99]"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </aside>
            ) : (
              <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-500">
                Seleziona un elemento nel canvas per vedere qui i controlli di modifica.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Foto caricate — grandi e cliccabili */}
      <div className="mt-6 bg-gray-50 rounded-2xl border border-gray-200 p-5 max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h4 className="text-base font-semibold text-gray-800">
              📷 Le tue foto
            </h4>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#663399] border border-[#663399]/30 bg-white hover:bg-[#663399]/5"
            >
              + Aggiungi immagini
            </button>
          </div>
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddPreviewImages}
            className="hidden"
          />
          {state.userImages.length > 0 ? (
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
          ) : (
            <p className="text-sm text-gray-500">
              Nessuna foto caricata. Clicca <strong>+ Aggiungi immagini</strong> per inserirne una nuova direttamente da anteprima.
            </p>
          )}
        </div>

      {/* Azioni — bottoni GRANDI e CHIARI */}
      <div className="mt-6 max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl p-5">
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

      <div className="mt-6 max-w-7xl mx-auto">
        <PriceCalculator state={state} onPriceUpdate={(price) => updateState({ totalPrice: price })} />
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
