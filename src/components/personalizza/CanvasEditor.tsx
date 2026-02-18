'use client'

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'

// Fabric.js types
type FabricCanvas = any
type FabricObject = any

export interface CanvasEditorRef {
  exportPNG: () => string | null
  exportJPG: (quality?: number) => string | null
  getCanvasJSON: () => any
  loadCanvasJSON: (json: any) => void
}

interface CanvasEditorProps {
  state: PersonalizzaState
  onUpdate: (canvasData: any) => void
  canvasShape: 'oval' | 'square'
  bgColor: string
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ state, onUpdate, canvasShape, bgColor }, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const fabricRef = useRef<FabricCanvas>(null)
    const [fabricModule, setFabricModule] = useState<any>(null)
    const [isReady, setIsReady] = useState(false)
    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef(-1)
    const isLoadingRef = useRef(false)

    // Dynamic import di Fabric.js (solo client-side)
    useEffect(() => {
      let cancelled = false
      const loadFabric = async () => {
        try {
          const fabric = await import('fabric')
          if (!cancelled) {
            setFabricModule(fabric)
          }
        } catch (err) {
          console.error('Errore caricamento Fabric.js:', err)
        }
      }
      loadFabric()
      return () => { cancelled = true }
    }, [])

    // Inizializza il canvas
    useEffect(() => {
      if (!fabricModule || !canvasElRef.current || fabricRef.current) return

      const canvas = new fabricModule.Canvas(canvasElRef.current, {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        backgroundColor: bgColor || '#ffffff',
        selection: true,
        preserveObjectStacking: true,
      })

      fabricRef.current = canvas

      // Applica clipping per forma ceramica
      applyClipPath(canvas, canvasShape)

      // Event per salvare la history ad ogni modifica
      const saveToHistory = () => {
        if (isLoadingRef.current) return
        const json = JSON.stringify(canvas.toJSON())
        const idx = historyIndexRef.current
        // Tronca la history futura se siamo in mezzo
        historyRef.current = historyRef.current.slice(0, idx + 1)
        historyRef.current.push(json)
        historyIndexRef.current = historyRef.current.length - 1

        // Salva nello state del parent
        onUpdate(canvas.toJSON())
      }

      canvas.on('object:added', saveToHistory)
      canvas.on('object:modified', saveToHistory)
      canvas.on('object:removed', saveToHistory)

      // Salva stato iniziale
      saveToHistory()
      setIsReady(true)

      return () => {
        canvas.dispose()
        fabricRef.current = null
      }
    }, [fabricModule])

    // Aggiorna clip path quando cambia la forma
    useEffect(() => {
      if (!fabricRef.current || !fabricModule) return
      applyClipPath(fabricRef.current, canvasShape)
    }, [canvasShape, fabricModule])

    // Aggiorna colore di sfondo
    useEffect(() => {
      if (!fabricRef.current) return
      fabricRef.current.backgroundColor = bgColor || '#ffffff'
      fabricRef.current.renderAll()
    }, [bgColor])

    // Carica le immagini utente dallo state (solo alla prima apertura)
    useEffect(() => {
      if (!isReady || !fabricModule || !fabricRef.current) return
      if (state.canvasData) return // Se c'è già un canvas salvato, non caricare duplicati

      // Carica immagini utente
      state.userImages.forEach(async (img, index) => {
        try {
          const fabricImg = await fabricModule.FabricImage.fromURL(img.url, { crossOrigin: 'anonymous' })
          const maxSize = 200
          const scale = Math.min(maxSize / fabricImg.width, maxSize / fabricImg.height)
          fabricImg.set({
            left: 50 + (index * 60) % 400,
            top: 50 + Math.floor(index / 3) * 80,
            scaleX: scale,
            scaleY: scale,
            cornerColor: '#663399',
            cornerStrokeColor: '#663399',
            borderColor: '#663399',
            transparentCorners: false,
          })
          fabricRef.current?.add(fabricImg)
        } catch (err) {
          console.error('Errore caricamento immagine:', err)
        }
      })

      // Carica testo personalizzato
      if (state.customText) {
        const textbox = new fabricModule.Textbox(state.customText, {
          left: CANVAS_WIDTH / 2 - 150,
          top: CANVAS_HEIGHT / 2 - 30,
          width: 300,
          fontFamily: state.customTextFont === 'script' ? 'Georgia' : state.customTextFont,
          fontSize: state.customTextSize,
          fill: state.customTextColor,
          textAlign: 'center',
          cornerColor: '#663399',
          cornerStrokeColor: '#663399',
          borderColor: '#663399',
          transparentCorners: false,
        })
        fabricRef.current?.add(textbox)
      }

      fabricRef.current?.renderAll()
    }, [isReady])

    // Ripristina canvas salvato
    useEffect(() => {
      if (!isReady || !fabricModule || !fabricRef.current) return
      if (!state.canvasData || typeof state.canvasData !== 'object') return

      isLoadingRef.current = true
      fabricRef.current.loadFromJSON(state.canvasData).then(() => {
        fabricRef.current?.renderAll()
        isLoadingRef.current = false
      })
    }, [isReady])

    const applyClipPath = (canvas: FabricCanvas, shape: 'oval' | 'square') => {
      if (!fabricModule) return

      if (shape === 'oval') {
        const clip = new fabricModule.Ellipse({
          rx: CANVAS_WIDTH / 2 - 20,
          ry: CANVAS_HEIGHT / 2 - 20,
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
          absolutePositioned: true,
        })
        canvas.clipPath = clip
      } else {
        const clip = new fabricModule.Rect({
          width: CANVAS_WIDTH - 40,
          height: CANVAS_HEIGHT - 40,
          left: 20,
          top: 20,
          rx: 12,
          ry: 12,
          absolutePositioned: true,
        })
        canvas.clipPath = clip
      }
      canvas.renderAll()
    }

    // === METODI PUBBLICI ===

    const addText = useCallback((text?: string) => {
      if (!fabricRef.current || !fabricModule) return
      const textbox = new fabricModule.Textbox(text || 'Testo', {
        left: CANVAS_WIDTH / 2 - 100,
        top: CANVAS_HEIGHT / 2 - 20,
        width: 200,
        fontFamily: 'serif',
        fontSize: 28,
        fill: '#333333',
        textAlign: 'center',
        cornerColor: '#663399',
        cornerStrokeColor: '#663399',
        borderColor: '#663399',
        transparentCorners: false,
      })
      fabricRef.current.add(textbox)
      fabricRef.current.setActiveObject(textbox)
      fabricRef.current.renderAll()
    }, [fabricModule])

    const addImage = useCallback(async (url: string) => {
      if (!fabricRef.current || !fabricModule) return
      try {
        const img = await fabricModule.FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
        const maxSize = 250
        const scale = Math.min(maxSize / img.width, maxSize / img.height)
        img.set({
          left: CANVAS_WIDTH / 2 - (img.width * scale) / 2,
          top: CANVAS_HEIGHT / 2 - (img.height * scale) / 2,
          scaleX: scale,
          scaleY: scale,
          cornerColor: '#663399',
          cornerStrokeColor: '#663399',
          borderColor: '#663399',
          transparentCorners: false,
        })
        fabricRef.current.add(img)
        fabricRef.current.setActiveObject(img)
        fabricRef.current.renderAll()
      } catch (err) {
        console.error('Errore aggiunta immagine:', err)
      }
    }, [fabricModule])

    const addImageFromFile = useCallback((file: File) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          addImage(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }, [addImage])

    const deleteSelected = useCallback(() => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObjects()
      if (active && active.length > 0) {
        active.forEach((obj: FabricObject) => fabricRef.current.remove(obj))
        fabricRef.current.discardActiveObject()
        fabricRef.current.renderAll()
      }
    }, [])

    const undo = useCallback(() => {
      if (historyIndexRef.current <= 0 || !fabricRef.current) return
      historyIndexRef.current--
      isLoadingRef.current = true
      const json = historyRef.current[historyIndexRef.current]
      fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
        fabricRef.current?.renderAll()
        isLoadingRef.current = false
        onUpdate(JSON.parse(json))
      })
    }, [onUpdate])

    const redo = useCallback(() => {
      if (historyIndexRef.current >= historyRef.current.length - 1 || !fabricRef.current) return
      historyIndexRef.current++
      isLoadingRef.current = true
      const json = historyRef.current[historyIndexRef.current]
      fabricRef.current.loadFromJSON(JSON.parse(json)).then(() => {
        fabricRef.current?.renderAll()
        isLoadingRef.current = false
        onUpdate(JSON.parse(json))
      })
    }, [onUpdate])

    const bringForward = useCallback(() => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject()
      if (active) {
        fabricRef.current.bringObjectForward(active)
        fabricRef.current.renderAll()
      }
    }, [])

    const sendBackward = useCallback(() => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject()
      if (active) {
        fabricRef.current.sendObjectBackwards(active)
        fabricRef.current.renderAll()
      }
    }, [])

    const setTextProperty = useCallback((property: string, value: any) => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject()
      if (active && (active.type === 'textbox' || active.type === 'i-text' || active.type === 'text')) {
        active.set(property, value)
        fabricRef.current.renderAll()
        // Trigger history save
        fabricRef.current.fire('object:modified', { target: active })
      }
    }, [])

    const zoomIn = useCallback(() => {
      if (!fabricRef.current) return
      let zoom = fabricRef.current.getZoom()
      zoom = Math.min(zoom * 1.1, 3)
      fabricRef.current.setZoom(zoom)
      fabricRef.current.renderAll()
    }, [])

    const zoomOut = useCallback(() => {
      if (!fabricRef.current) return
      let zoom = fabricRef.current.getZoom()
      zoom = Math.max(zoom / 1.1, 0.3)
      fabricRef.current.setZoom(zoom)
      fabricRef.current.renderAll()
    }, [])

    const zoomReset = useCallback(() => {
      if (!fabricRef.current) return
      fabricRef.current.setZoom(1)
      fabricRef.current.renderAll()
    }, [])

    // Expose metodi al parent via ref
    useImperativeHandle(ref, () => ({
      exportPNG: () => {
        if (!fabricRef.current) return null
        return fabricRef.current.toDataURL({ format: 'png', multiplier: 2 })
      },
      exportJPG: (quality = 0.9) => {
        if (!fabricRef.current) return null
        return fabricRef.current.toDataURL({ format: 'jpeg', quality, multiplier: 2 })
      },
      getCanvasJSON: () => {
        if (!fabricRef.current) return null
        return fabricRef.current.toJSON()
      },
      loadCanvasJSON: (json: any) => {
        if (!fabricRef.current) return
        isLoadingRef.current = true
        fabricRef.current.loadFromJSON(json).then(() => {
          fabricRef.current?.renderAll()
          isLoadingRef.current = false
        })
      },
      // Metodi esposti per la toolbar
      addText,
      addImage,
      addImageFromFile,
      deleteSelected,
      undo,
      redo,
      bringForward,
      sendBackward,
      setTextProperty,
      zoomIn,
      zoomOut,
      zoomReset,
      getActiveObject: () => fabricRef.current?.getActiveObject(),
      getCanvas: () => fabricRef.current,
    } as any))

    // Loading state
    if (!fabricModule) {
      return (
        <div className="flex items-center justify-center bg-gray-50 rounded-xl" style={{ width: '100%', aspectRatio: '1/1', maxWidth: CANVAS_WIDTH }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#663399] mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Caricamento editor...</p>
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        {/* Bordo forma ceramica visuale */}
        <div
          className="relative mx-auto border-2 border-gray-300 overflow-hidden bg-white shadow-inner"
          style={{
            width: '100%',
            maxWidth: CANVAS_WIDTH,
            aspectRatio: '1/1',
            borderRadius: canvasShape === 'oval' ? '50%' : '12px',
          }}
        >
          <canvas
            ref={canvasElRef}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Info forma */}
        <p className="text-center text-xs text-gray-400 mt-2">
          {canvasShape === 'oval' ? 'Ceramica Ovale' : 'Ceramica Quadrata'} — Trascina e ridimensiona gli elementi
        </p>
      </div>
    )
  }
)

CanvasEditor.displayName = 'CanvasEditor'
export default CanvasEditor
