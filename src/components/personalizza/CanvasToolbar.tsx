'use client'

import { useState, useEffect, useRef } from 'react'

interface CanvasToolbarProps {
  editorRef: React.RefObject<any>
  canvasShape: 'oval' | 'square'
  onShapeChange: (shape: 'oval' | 'square') => void
  bgColor: string
  onBgColorChange: (color: string) => void
  onExportPNG: () => void
  onExportJPG: () => void
}

const BG_COLORS = [
  { name: 'Bianco', value: '#ffffff' },
  { name: 'Crema', value: '#FFF8E7' },
  { name: 'Avorio', value: '#FFFFF0' },
  { name: 'Rosa Chiaro', value: '#FFE4E1' },
  { name: 'Azzurro', value: '#E8F4FD' },
  { name: 'Verde Acqua', value: '#E0F5EE' },
  { name: 'Grigio Perla', value: '#F0F0F0' },
  { name: 'Beige', value: '#F5F0EB' },
  { name: 'Lavanda', value: '#F0E6FF' },
  { name: 'Oro Chiaro', value: '#FFF9E6' },
]

const FONT_FAMILIES = [
  { name: 'Serif', value: 'serif' },
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Georgia', value: 'Georgia' },
  { name: 'Times', value: 'Times New Roman' },
  { name: 'Arial', value: 'Arial' },
  { name: 'Verdana', value: 'Verdana' },
  { name: 'Courier', value: 'Courier New' },
  { name: 'Cursive', value: 'cursive' },
]

type ActiveTool = 'select' | 'text' | 'image'

export default function CanvasToolbar({
  editorRef,
  canvasShape,
  onShapeChange,
  bgColor,
  onBgColorChange,
  onExportPNG,
  onExportJPG,
}: CanvasToolbarProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>('select')
  const [showTextPanel, setShowTextPanel] = useState(false)
  const [showColorPanel, setShowColorPanel] = useState(false)
  const [showLayerPanel, setShowLayerPanel] = useState(false)
  const [textColor, setTextColor] = useState('#333333')
  const [textSize, setTextSize] = useState(28)
  const [textFont, setTextFont] = useState('serif')
  const [textBold, setTextBold] = useState(false)
  const [textItalic, setTextItalic] = useState(false)
  const [textAlign, setTextAlign] = useState('center')
  const [textCurve, setTextCurve] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync testo selezionato con toolbar
  useEffect(() => {
    const interval = setInterval(() => {
      if (!editorRef.current) return
      const active = editorRef.current.getActiveObject?.()
      if (active && (active.type === 'textbox' || active.type === 'i-text')) {
        setTextColor(active.fill || '#333333')
        setTextSize(active.fontSize || 28)
        setTextFont(active.fontFamily || 'serif')
        setTextBold(active.fontWeight === 'bold')
        setTextItalic(active.fontStyle === 'italic')
        setTextAlign(active.textAlign || 'center')
        setShowTextPanel(true)
      }
    }, 300)
    return () => clearInterval(interval)
  }, [editorRef])

  const handleAddText = () => {
    editorRef.current?.addText?.('Testo')
    setActiveTool('text')
    setShowTextPanel(true)
  }

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      editorRef.current?.addImageFromFile?.(file)
      setActiveTool('select')
    }
    e.target.value = ''
  }

  const handleAddUserImage = (url: string) => {
    editorRef.current?.addImage?.(url)
    setActiveTool('select')
  }

  const handleTextColorChange = (color: string) => {
    setTextColor(color)
    editorRef.current?.setTextProperty?.('fill', color)
  }

  const handleTextSizeChange = (size: number) => {
    setTextSize(size)
    editorRef.current?.setTextProperty?.('fontSize', size)
  }

  const handleTextFontChange = (font: string) => {
    setTextFont(font)
    editorRef.current?.setTextProperty?.('fontFamily', font)
  }

  const handleTextBoldToggle = () => {
    const newBold = !textBold
    setTextBold(newBold)
    editorRef.current?.setTextProperty?.('fontWeight', newBold ? 'bold' : 'normal')
  }

  const handleTextItalicToggle = () => {
    const newItalic = !textItalic
    setTextItalic(newItalic)
    editorRef.current?.setTextProperty?.('fontStyle', newItalic ? 'italic' : 'normal')
  }

  const handleTextAlignChange = (align: string) => {
    setTextAlign(align)
    editorRef.current?.setTextProperty?.('textAlign', align)
  }

  const handleTextCurveChange = (curve: number) => {
    setTextCurve(curve)
    // Fabric.js text curving via charSpacing + custom path
    if (curve === 0) {
      editorRef.current?.setTextProperty?.('charSpacing', 0)
    } else {
      editorRef.current?.setTextProperty?.('charSpacing', curve * 5)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar Principale */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Strumenti</h4>
        <div className="grid grid-cols-3 gap-2">
          {/* Seleziona */}
          <button
            onClick={() => { setActiveTool('select'); setShowTextPanel(false) }}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'select'
                ? 'bg-[#663399] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            Seleziona
          </button>

          {/* Testo */}
          <button
            onClick={handleAddText}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'text'
                ? 'bg-[#663399] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Testo
          </button>

          {/* Immagine */}
          <button
            onClick={handleAddImage}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg text-xs font-medium transition-all ${
              activeTool === 'image'
                ? 'bg-[#663399] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Immagine
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Azioni rapide */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Azioni</h4>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => editorRef.current?.undo?.()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-all"
            title="Annulla"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" />
            </svg>
            Annulla
          </button>
          <button
            onClick={() => editorRef.current?.redo?.()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-all"
            title="Ripeti"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2m15-7l-4-4m4 4l-4 4" />
            </svg>
            Ripeti
          </button>
          <button
            onClick={() => editorRef.current?.deleteSelected?.()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-all"
            title="Elimina"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Elimina
          </button>
          <button
            onClick={() => editorRef.current?.zoomReset?.()}
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-xs text-gray-600 hover:bg-gray-100 transition-all"
            title="Reset Zoom"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Reset
          </button>
        </div>
        {/* Zoom */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => editorRef.current?.zoomOut?.()}
            className="flex-1 py-2 text-xs font-medium bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          >
            − Zoom
          </button>
          <button
            onClick={() => editorRef.current?.zoomIn?.()}
            className="flex-1 py-2 text-xs font-medium bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
          >
            + Zoom
          </button>
        </div>
      </div>

      {/* Livelli */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Livelli</h4>
          <svg className={`w-4 h-4 text-gray-400 transition-transform ${showLayerPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showLayerPanel && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => editorRef.current?.bringForward?.()}
              className="py-2 text-xs font-medium bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            >
              ↑ Porta Avanti
            </button>
            <button
              onClick={() => editorRef.current?.sendBackward?.()}
              className="py-2 text-xs font-medium bg-gray-50 rounded-lg hover:bg-gray-100 text-gray-700 transition-all"
            >
              ↓ Porta Dietro
            </button>
          </div>
        )}
      </div>

      {/* Pannello Testo */}
      {showTextPanel && (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Proprietà Testo</h4>
          <div className="space-y-3">
            {/* Font Family */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Font</label>
              <select
                value={textFont}
                onChange={(e) => handleTextFontChange(e.target.value)}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg"
              >
                {FONT_FAMILIES.map((f) => (
                  <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimensione */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Dimensione: {textSize}px</label>
              <input
                type="range"
                min="12"
                max="80"
                value={textSize}
                onChange={(e) => handleTextSizeChange(Number(e.target.value))}
                className="w-full accent-[#663399]"
              />
            </div>

            {/* Colore testo */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Colore</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => handleTextColorChange(e.target.value)}
                className="w-full h-8 rounded border border-gray-200 cursor-pointer"
              />
            </div>

            {/* Bold / Italic */}
            <div className="flex gap-2">
              <button
                onClick={handleTextBoldToggle}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                  textBold ? 'bg-[#663399] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                B
              </button>
              <button
                onClick={handleTextItalicToggle}
                className={`flex-1 py-2 text-sm italic rounded-lg transition-all ${
                  textItalic ? 'bg-[#663399] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                I
              </button>
            </div>

            {/* Allineamento */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Allineamento</label>
              <div className="flex gap-1">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    onClick={() => handleTextAlignChange(align)}
                    className={`flex-1 py-2 text-xs rounded-lg transition-all ${
                      textAlign === align
                        ? 'bg-[#663399] text-white'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {align === 'left' ? '◀' : align === 'center' ? '◆' : '▶'}
                  </button>
                ))}
              </div>
            </div>

            {/* Spaziatura / Effetto ondulato */}
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Spaziatura lettere: {textCurve}</label>
              <input
                type="range"
                min="-20"
                max="50"
                value={textCurve}
                onChange={(e) => handleTextCurveChange(Number(e.target.value))}
                className="w-full accent-[#663399]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Forma Ceramica */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Forma Ceramica</h4>
        <div className="flex gap-2">
          <button
            onClick={() => onShapeChange('oval')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              canvasShape === 'oval'
                ? 'bg-[#663399] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="w-6 h-5 border-2 rounded-full inline-block" style={{ borderColor: canvasShape === 'oval' ? 'white' : '#9CA3AF' }}></span>
            Ovale
          </button>
          <button
            onClick={() => onShapeChange('square')}
            className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              canvasShape === 'square'
                ? 'bg-[#663399] text-white shadow-md'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="w-5 h-5 border-2 rounded-sm inline-block" style={{ borderColor: canvasShape === 'square' ? 'white' : '#9CA3AF' }}></span>
            Quadrata
          </button>
        </div>
      </div>

      {/* Colore Sfondo */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <button
          onClick={() => setShowColorPanel(!showColorPanel)}
          className="flex items-center justify-between w-full"
        >
          <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Colore Sfondo</h4>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-gray-300" style={{ backgroundColor: bgColor }}></div>
            <svg className={`w-4 h-4 text-gray-400 transition-transform ${showColorPanel ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
        {showColorPanel && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {BG_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => onBgColorChange(c.value)}
                className={`w-full aspect-square rounded-lg border-2 transition-all ${
                  bgColor === c.value ? 'border-[#663399] scale-110 shadow-md' : 'border-gray-200 hover:border-gray-400'
                }`}
                style={{ backgroundColor: c.value }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Esporta Bozza</h4>
        <div className="flex gap-2">
          <button
            onClick={onExportPNG}
            className="flex-1 py-3 bg-[#663399] text-white rounded-lg text-sm font-medium hover:bg-[#552288] transition-all shadow-sm"
          >
            📥 PNG
          </button>
          <button
            onClick={onExportJPG}
            className="flex-1 py-3 bg-[#c45824] text-white rounded-lg text-sm font-medium hover:bg-[#a84a1e] transition-all shadow-sm"
          >
            📥 JPG
          </button>
        </div>
      </div>
    </div>
  )
}
