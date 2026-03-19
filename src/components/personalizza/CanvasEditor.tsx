'use client'

import { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'
import { CeramicShape } from '@/lib/personalizza/productShape'

// Fabric.js types
type FabricCanvas = any
type FabricObject = any

export interface CanvasEditorRef {
  exportPNG: () => string | null
  exportJPG: (quality?: number) => string | null
  getCanvasJSON: () => any
  loadCanvasJSON: (json: any) => void
  setObjectOpacity: (value: number) => void
  setObjectAngle: (value: number) => void
  setObjectScale: (value: number) => void
  setImageRoundness: (value: number) => void
  setTextCurve: (value: number) => void
}

export interface CanvasSelectionInfo {
  type: 'none' | 'text' | 'image' | 'other'
  fontSize?: number
  fontFamily?: string
  fill?: string
  angle?: number
  opacity?: number
  scale?: number
  roundness?: number
  textCurve?: number
}

interface CanvasEditorProps {
  state: PersonalizzaState
  onUpdate: (canvasData: any) => void
  canvasShape: CeramicShape
  bgColor: string
  onSelectionChange?: (selection: CanvasSelectionInfo) => void
}

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

const STEP4_TEXT_OBJECT_ID = 'step4-custom-text'
const MIN_TEXTBOX_WIDTH = 120

const isTextObject = (obj: any) =>
  obj && (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text')

const applyObjectInteractionDefaults = (obj: any) => {
  if (!obj) return
  obj.set({
    centeredRotation: true,
    centeredScaling: true,
    lockScalingFlip: true,
    minScaleLimit: 0.2,
    selectable: true,
    evented: true,
    hasControls: true,
    hasBorders: true,
    lockMovementX: false,
    lockMovementY: false,
    lockRotation: false,
  })
  if (isTextObject(obj)) {
    obj.setControlsVisibility?.({
      mt: true,
      mb: true,
      ml: true,
      mr: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
      mtr: true,
    })
  }
}

const normalizeTextboxScale = (textbox: any) => {
  if (!isTextObject(textbox)) return
  const scaleX = typeof textbox.scaleX === 'number' ? textbox.scaleX : 1
  const scaleY = typeof textbox.scaleY === 'number' ? textbox.scaleY : 1
  if (Math.abs(scaleX - 1) < 0.001 && Math.abs(scaleY - 1) < 0.001) return

  const currentWidth = typeof textbox.width === 'number' ? textbox.width : 200
  const currentFont = typeof textbox.fontSize === 'number' ? textbox.fontSize : 24
  const control = textbox?.data?.lastControl
  const affectsBoth = control === 'tl' || control === 'tr' || control === 'bl' || control === 'br'
  const affectWidth = control === 'ml' || control === 'mr' || affectsBoth || !control
  const affectFont = control === 'mt' || control === 'mb' || affectsBoth || !control
  const nextWidth = affectWidth
    ? Math.max(MIN_TEXTBOX_WIDTH, Math.round(currentWidth * scaleX))
    : Math.max(MIN_TEXTBOX_WIDTH, Math.round(currentWidth))
  const nextFont = affectFont
    ? Math.max(10, Math.round(currentFont * scaleY))
    : Math.max(10, Math.round(currentFont))

  textbox.set({
    width: nextWidth,
    fontSize: nextFont,
    scaleX: 1,
    scaleY: 1,
    data: { ...(textbox.data || {}), baseWidth: nextWidth, lastControl: undefined },
  })
  textbox.setCoords?.()
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))

const fitTextboxToContent = (textbox: any) => {
  if (!isTextObject(textbox)) return
  const measuredWidth =
    typeof textbox.calcTextWidth === 'function'
      ? textbox.calcTextWidth()
      : (typeof textbox.width === 'number' ? textbox.width : MIN_TEXTBOX_WIDTH)
  const nextWidth = Math.max(MIN_TEXTBOX_WIDTH, Math.ceil(measuredWidth + 24))
  textbox.set({
    width: nextWidth,
    data: { ...(textbox.data || {}), baseWidth: nextWidth },
  })
  textbox.setCoords?.()
}

const CanvasEditor = forwardRef<CanvasEditorRef, CanvasEditorProps>(
  ({ state, onUpdate, canvasShape, bgColor, onSelectionChange }, ref) => {
    const canvasElRef = useRef<HTMLCanvasElement>(null)
    const fabricRef = useRef<FabricCanvas>(null)
    const [fabricModule, setFabricModule] = useState<any>(null)
    const [isReady, setIsReady] = useState(false)
    const historyRef = useRef<string[]>([])
    const historyIndexRef = useRef(-1)
    const isLoadingRef = useRef(false)
    const onSelectionChangeRef = useRef(onSelectionChange)
    const lastSelectedObjectRef = useRef<any>(null)

    const applyTextCurve = (textObj: any, curveValue: number) => {
      if (!fabricModule || !isTextObject(textObj)) return
      const safe = clamp(curveValue, -100, 100)
      const currentData = textObj.data || {}
      const center = textObj.getCenterPoint?.()
      const baseWidth = Math.max(140, (currentData.baseWidth || textObj.width || 200))

      if (safe === 0 || !textObj?.text) {
        textObj.set({
          path: undefined,
          pathSide: undefined,
          pathStartOffset: 0,
          width: baseWidth,
          editable: true,
          selectable: true,
          evented: true,
          data: { ...currentData, textCurve: 0 },
        })
        if (center) {
          textObj.setPositionByOrigin?.(center, 'center', 'center')
        }
        textObj.setCoords?.()
        return
      }

      const magnitude = Math.abs(safe) / 100
      // 50 = mezzo cerchio, 100 = cerchio completo visivo (quasi chiuso per evitare flip).
      const epsilon = 0.0001
      const maxSpan = (Math.PI * 2) - epsilon
      const spanAngle = magnitude * maxSpan
      const radius = Math.max(16, baseWidth / Math.max(spanAngle, 0.001))
      const sweepFlag = safe > 0 ? 1 : 0
      const startAngle = -Math.PI / 2 - (spanAngle / 2)
      const endAngle = startAngle + spanAngle
      const x1 = radius * Math.cos(startAngle)
      const y1 = radius * Math.sin(startAngle)
      const x2 = radius * Math.cos(endAngle)
      const y2 = radius * Math.sin(endAngle)
      const largeArcFlag = spanAngle > Math.PI ? 1 : 0
      const pathString = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2}`

      const path = new fabricModule.Path(pathString, {
        visible: false,
        absolutePositioned: false,
      })

      textObj.set({
        path,
        // Mantiene il testo sempre dritto: cambia la curva, non il verso delle lettere.
        pathSide: 'left',
        pathAlign: 'center',
        pathStartOffset: 0,
        textAlign: 'center',
        width: baseWidth,
        editable: true,
        selectable: true,
        evented: true,
        objectCaching: false,
        data: { ...currentData, textCurve: safe },
      })
      if (center) {
        // Mantiene il testo fermo nello stesso punto mentre cambia la curvatura.
        textObj.setPositionByOrigin?.(center, 'center', 'center')
      }
      textObj.setCoords?.()
    }

  useEffect(() => {
      onSelectionChangeRef.current = onSelectionChange
    }, [onSelectionChange])

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

      const emitSelectionChange = () => {
        const callback = onSelectionChangeRef.current
        if (!callback) return

        const active = canvas.getActiveObject() as any
        if (!active) {
          callback({ type: 'none' })
          return
        }
        lastSelectedObjectRef.current = active

        if (active.type === 'textbox' || active.type === 'i-text' || active.type === 'text') {
          callback({
            type: 'text',
            fontSize: active.fontSize || 24,
            fontFamily: active.fontFamily || 'serif',
            fill: active.fill || '#000000',
            angle: typeof active.angle === 'number' ? active.angle : 0,
            opacity: typeof active.opacity === 'number' ? active.opacity : 1,
            scale: Math.round(((active.scaleX || 1) + (active.scaleY || 1)) * 50),
            textCurve: typeof active?.data?.textCurve === 'number' ? active.data.textCurve : 0,
          })
          return
        }

        if (active.type === 'image') {
          const clipPath = active.clipPath as any
          let roundness = typeof active?.data?.roundness === 'number' ? active.data.roundness : 0
          const maxRadius = Math.max(1, Math.min(active.width || 0, active.height || 0) / 2)
          if (clipPath?.type === 'rect' && typeof clipPath?.rx === 'number') {
            roundness = Math.round((clipPath.rx / maxRadius) * 100)
          } else if (clipPath?.type === 'circle') {
            roundness = 100
          }
          roundness = Math.max(0, Math.min(100, roundness))

          callback({
            type: 'image',
            angle: typeof active.angle === 'number' ? active.angle : 0,
            opacity: typeof active.opacity === 'number' ? active.opacity : 1,
            scale: Math.round(((active.scaleX || 1) + (active.scaleY || 1)) * 50),
            roundness,
          })
          return
        }

        callback({
          type: 'other',
          angle: typeof active.angle === 'number' ? active.angle : 0,
          opacity: typeof active.opacity === 'number' ? active.opacity : 1,
          scale: Math.round(((active.scaleX || 1) + (active.scaleY || 1)) * 50),
        })
      }

      canvas.on('object:added', saveToHistory)
      canvas.on('object:modified', saveToHistory)
      canvas.on('object:removed', saveToHistory)
      canvas.on('selection:created', emitSelectionChange)
      canvas.on('selection:updated', emitSelectionChange)
      canvas.on('selection:cleared', emitSelectionChange)
      canvas.on('object:modified', emitSelectionChange)
      canvas.on('object:scaled', emitSelectionChange)
      canvas.on('object:rotated', emitSelectionChange)
      canvas.on('object:modified', (event: any) => {
        const target = event?.target as any
        if (isTextObject(target)) {
          normalizeTextboxScale(target)
          const curve = typeof target?.data?.textCurve === 'number' ? target.data.textCurve : 0
          if (curve !== 0) {
            applyTextCurve(target, curve)
          }
          target?.setCoords?.()
        }
      })
      canvas.on('object:scaling', (event: any) => {
        const target = event?.target as any
        const corner = event?.transform?.corner
        if (isTextObject(target) && corner) {
          target.set({
            data: { ...(target.data || {}), lastControl: corner },
          })
          if (corner === 'ml' || corner === 'mr') {
            // Handle orizzontali: allunga/comprimi solo lunghezza testo.
            target.set({ scaleY: 1 })
          } else if (corner === 'mt' || corner === 'mb') {
            // Handle verticali: varia solo altezza (font-size) del testo.
            target.set({ scaleX: 1 })
          }
        }
        if (target) {
          target.set({
            scaleX: Math.max(0.2, Math.abs(target.scaleX || 1)),
            scaleY: Math.max(0.2, Math.abs(target.scaleY || 1)),
          })
        }
        target?.setCoords?.()
      })
      canvas.on('object:rotating', (event: any) => event?.target?.setCoords?.())
      canvas.on('text:editing:entered', (event: any) => {
        const target = event?.target as any
        if (!isTextObject(target)) return
        const curve = typeof target?.data?.textCurve === 'number' ? target.data.textCurve : 0
        if (curve === 0) return
        target.set({
          path: undefined,
          pathSide: undefined,
          pathStartOffset: 0,
          editable: true,
          selectable: true,
          evented: true,
          data: { ...(target.data || {}), __editingCurve: curve },
        })
        target.setCoords?.()
        canvas.renderAll()
      })
      canvas.on('text:editing:exited', (event: any) => {
        const target = event?.target as any
        if (!isTextObject(target)) return
        const curve = typeof target?.data?.__editingCurve === 'number'
          ? target.data.__editingCurve
          : (typeof target?.data?.textCurve === 'number' ? target.data.textCurve : 0)
        fitTextboxToContent(target)
        target.set({
          data: { ...(target.data || {}), __editingCurve: undefined },
        })
        applyTextCurve(target, curve)
        target.setCoords?.()
        canvas.renderAll()
        canvas.fire('object:modified', { target })
      })
      canvas.on('text:changed', (event: any) => {
        const target = event?.target as any
        if (!isTextObject(target)) return
        fitTextboxToContent(target)
        const curve = typeof target?.data?.textCurve === 'number' ? target.data.textCurve : 0
        if (curve !== 0) {
          applyTextCurve(target, curve)
        }
        canvas.renderAll()
      })
      canvas.on('mouse:dblclick', (event: any) => {
        const target = event?.target
        if (!target) return
        if (isTextObject(target) && typeof target.enterEditing === 'function') {
          target.enterEditing()
          return
        }
        if (target.type !== 'image') return
        toggleImageRoundMode(target)
      })

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
          applyObjectInteractionDefaults(fabricImg)
          applyImageRoundMode(fabricImg, 'rounded')
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
          data: { source: STEP4_TEXT_OBJECT_ID, baseWidth: 300, textCurve: 0 },
        })
        fitTextboxToContent(textbox)
        applyObjectInteractionDefaults(textbox)
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
        const objects = fabricRef.current?.getObjects() as any[] | undefined
        objects?.forEach((obj) => {
          if (isTextObject(obj)) {
            applyTextCurve(obj, typeof obj?.data?.textCurve === 'number' ? obj.data.textCurve : 0)
          }
          applyObjectInteractionDefaults(obj)
          obj.setCoords?.()
        })
        fabricRef.current?.renderAll()
        isLoadingRef.current = false
      })
    }, [isReady])

    // Mantiene sincronizzato il testo scritto allo step 4 anche in anteprima.
    useEffect(() => {
      if (!isReady || !fabricRef.current || !fabricModule) return

      const canvas = fabricRef.current
      const objects = canvas.getObjects() as any[]
      const existingText = objects.find(
        (obj) =>
          (obj?.data?.source === STEP4_TEXT_OBJECT_ID) ||
          (obj.type === 'textbox' && obj.text === state.customText)
      )

      isLoadingRef.current = true

      if (!state.customText?.trim()) {
        if (existingText) {
          canvas.remove(existingText)
        }
      } else if (existingText) {
        existingText.set({
          text: state.customText,
          fontFamily: state.customTextFont === 'script' ? 'Georgia' : state.customTextFont,
          fontSize: state.customTextSize,
          fill: state.customTextColor,
          data: {
            ...(existingText.data || {}),
            source: STEP4_TEXT_OBJECT_ID,
            baseWidth: (existingText.data?.baseWidth || existingText.width || 300),
          },
        })
        fitTextboxToContent(existingText)
        applyTextCurve(existingText, typeof existingText?.data?.textCurve === 'number' ? existingText.data.textCurve : 0)
        applyObjectInteractionDefaults(existingText)
        existingText.setCoords?.()
      } else {
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
          data: { source: STEP4_TEXT_OBJECT_ID, baseWidth: 300, textCurve: 0 },
        })
        fitTextboxToContent(textbox)
        applyTextCurve(textbox, 0)
        applyObjectInteractionDefaults(textbox)
        canvas.add(textbox)
      }

      canvas.renderAll()
      isLoadingRef.current = false
      onUpdate(canvas.toJSON())
    }, [
      isReady,
      fabricModule,
      state.customText,
      state.customTextFont,
      state.customTextColor,
      state.customTextSize,
      onUpdate,
    ])

    const applyClipPath = (canvas: FabricCanvas, shape: CeramicShape) => {
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
      } else if (shape === 'circle') {
        const clip = new fabricModule.Circle({
          radius: CANVAS_WIDTH / 2 - 20,
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
          absolutePositioned: true,
        })
        canvas.clipPath = clip
      } else if (shape === 'triangle') {
        const clip = new fabricModule.Triangle({
          width: CANVAS_WIDTH - 40,
          height: CANVAS_HEIGHT - 40,
          left: CANVAS_WIDTH / 2,
          top: CANVAS_HEIGHT / 2,
          originX: 'center',
          originY: 'center',
          absolutePositioned: true,
        })
        canvas.clipPath = clip
      } else if (shape === 'rectangle') {
        const clip = new fabricModule.Rect({
          width: CANVAS_WIDTH - 40,
          height: CANVAS_HEIGHT - 80,
          left: 20,
          top: 40,
          rx: 8,
          ry: 8,
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
      const baseWidth = 200
      const textbox = new fabricModule.Textbox(text || 'Testo', {
        left: CANVAS_WIDTH / 2 - 100,
        top: CANVAS_HEIGHT / 2 - 20,
        width: baseWidth,
        fontFamily: 'serif',
        fontSize: 28,
        fill: '#333333',
        textAlign: 'center',
        cornerColor: '#663399',
        cornerStrokeColor: '#663399',
        borderColor: '#663399',
        transparentCorners: false,
        data: { baseWidth, textCurve: 0 },
      })
      fitTextboxToContent(textbox)
      applyTextCurve(textbox, 0)
      applyObjectInteractionDefaults(textbox)
      fabricRef.current.add(textbox)
      fabricRef.current.setActiveObject(textbox)
      textbox.setCoords?.()
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
        applyObjectInteractionDefaults(img)
        applyImageRoundMode(img, 'rounded')
        fabricRef.current.add(img)
        fabricRef.current.setActiveObject(img)
        img.setCoords?.()
        fabricRef.current.renderAll()
      } catch (err) {
        console.error('Errore aggiunta immagine:', err)
      }
    }, [fabricModule])

    const applyImageRoundMode = (img: any, mode: 'rounded' | 'circle') => {
      if (!fabricModule || !img?.width || !img?.height) return

      if (mode === 'circle') {
        const radius = Math.min(img.width, img.height) / 2
        img.set({
          clipPath: new fabricModule.Circle({
            radius,
            originX: 'center',
            originY: 'center',
          }),
          data: { ...(img.data || {}), roundMode: 'circle' },
        })
      } else {
        const maxRadius = Math.min(img.width, img.height) / 2
        const defaultRoundness = 35
        const rx = (defaultRoundness / 100) * maxRadius
        img.set({
          clipPath: new fabricModule.Rect({
            width: img.width,
            height: img.height,
            rx,
            ry: rx,
            originX: 'center',
            originY: 'center',
          }),
          data: { ...(img.data || {}), roundMode: 'rounded', roundness: defaultRoundness },
        })
      }
      img.setCoords?.()
    }

    const toggleImageRoundMode = (img: any) => {
      const currentMode = img?.data?.roundMode === 'circle' ? 'circle' : 'rounded'
      const nextMode = currentMode === 'rounded' ? 'circle' : 'rounded'
      applyImageRoundMode(img, nextMode)
      img.setCoords?.()
      fabricRef.current?.renderAll()
      fabricRef.current?.fire('object:modified', { target: img })
    }

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
      const activeObject = fabricRef.current.getActiveObject() as any
      const fallbackSelected = lastSelectedObjectRef.current
      const hasFallback = !!fallbackSelected && fabricRef.current.getObjects().includes(fallbackSelected)
      if (active && active.length > 0) {
        active.forEach((obj: FabricObject) => {
          if ((obj as any)?.isEditing && typeof (obj as any).exitEditing === 'function') {
            (obj as any).exitEditing()
          }
          fabricRef.current.remove(obj)
        })
      } else if (activeObject) {
        if (activeObject?.isEditing && typeof activeObject.exitEditing === 'function') {
          activeObject.exitEditing()
        }
        fabricRef.current.remove(activeObject)
      } else if (hasFallback) {
        if (fallbackSelected?.isEditing && typeof fallbackSelected.exitEditing === 'function') {
          fallbackSelected.exitEditing()
        }
        fabricRef.current.remove(fallbackSelected)
      } else {
        return
      }
      fabricRef.current.discardActiveObject()
      fabricRef.current.renderAll()
      fabricRef.current.fire('selection:cleared')
      lastSelectedObjectRef.current = null
    }, [])

    // Shortcut tastiera: Canc/Backspace elimina elemento selezionato nel canvas.
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!fabricRef.current) return
        if (event.key !== 'Delete' && event.key !== 'Backspace') return

        const activeObject = fabricRef.current.getActiveObject() as any
        const isEditingCanvasText = isTextObject(activeObject) && !!activeObject?.isEditing
        if (isEditingCanvasText) {
          // Se stai scrivendo dentro il testo del canvas, Backspace/Delete
          // deve cancellare solo caratteri e non l'intero oggetto.
          return
        }

        const activeEl = document.activeElement as HTMLElement | null
        const tag = activeEl?.tagName?.toLowerCase()
        const isTyping =
          tag === 'input' ||
          tag === 'textarea' ||
          activeEl?.isContentEditable

        if (isTyping) return

        const hasSelectedObjects = fabricRef.current.getActiveObjects()?.length > 0
        if (!hasSelectedObjects) return

        event.preventDefault()
        deleteSelected()
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }, [deleteSelected])

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
      const active = fabricRef.current.getActiveObject() as any
      if (isTextObject(active)) {
        const baseWidth = active?.data?.baseWidth || active?.width || 200
        active.set(property, value)
        active.set({
          width: Math.max(MIN_TEXTBOX_WIDTH, baseWidth),
          scaleX: 1,
          scaleY: 1,
          data: { ...(active.data || {}), baseWidth: Math.max(MIN_TEXTBOX_WIDTH, baseWidth) },
        })
        applyTextCurve(active, typeof active?.data?.textCurve === 'number' ? active.data.textCurve : 0)
        active.setCoords?.()
        fabricRef.current.renderAll()
        // Trigger history save
        fabricRef.current.fire('object:modified', { target: active })
      }
    }, [])

    const setObjectOpacity = useCallback((value: number) => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject() as any
      if (!active) return
      active.set('opacity', Math.max(0.1, Math.min(1, value)))
      active.setCoords?.()
      fabricRef.current.renderAll()
      fabricRef.current.fire('object:modified', { target: active })
    }, [])

    const setObjectAngle = useCallback((value: number) => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject() as any
      if (!active) return
      active.set('angle', value)
      active.setCoords?.()
      fabricRef.current.renderAll()
      fabricRef.current.fire('object:modified', { target: active })
    }, [])

    const setObjectScale = useCallback((value: number) => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject() as any
      if (!active) return
      const scale = Math.max(0.2, Math.min(4, value / 100))
      active.set({ scaleX: scale, scaleY: scale })
      active.setCoords?.()
      fabricRef.current.renderAll()
      fabricRef.current.fire('object:modified', { target: active })
    }, [])

    const setImageRoundness = useCallback((value: number) => {
      if (!fabricRef.current || !fabricModule) return
      const active = fabricRef.current.getActiveObject() as any
      if (!active || active.type !== 'image') return

      const safe = Math.max(0, Math.min(100, value))
      if (safe <= 0) {
        active.set({
          clipPath: null,
          data: { ...(active.data || {}), roundMode: 'none', roundness: 0 },
        })
      } else if (safe >= 100) {
        const radius = Math.min(active.width || 0, active.height || 0) / 2
        active.set({
          clipPath: new fabricModule.Circle({
            radius,
            originX: 'center',
            originY: 'center',
          }),
          data: { ...(active.data || {}), roundMode: 'circle', roundness: 100 },
        })
      } else {
        const maxRadius = Math.min(active.width || 0, active.height || 0) / 2
        const rx = (safe / 100) * maxRadius
        active.set({
          clipPath: new fabricModule.Rect({
            width: active.width,
            height: active.height,
            rx,
            ry: rx,
            originX: 'center',
            originY: 'center',
          }),
          data: { ...(active.data || {}), roundMode: 'rounded', roundness: safe },
        })
      }
      active.setCoords?.()
      fabricRef.current.renderAll()
      fabricRef.current.fire('object:modified', { target: active })
    }, [fabricModule])

    const setTextCurve = useCallback((value: number) => {
      if (!fabricRef.current) return
      const active = fabricRef.current.getActiveObject() as any
      if (!isTextObject(active)) return
      applyTextCurve(active, value)
      active.setCoords?.()
      fabricRef.current.renderAll()
      fabricRef.current.fire('object:modified', { target: active })
    }, [fabricModule])

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
      setObjectOpacity,
      setObjectAngle,
      setObjectScale,
      setImageRoundness,
      setTextCurve,
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
            borderRadius: canvasShape === 'oval' || canvasShape === 'circle' ? '50%' : canvasShape === 'rectangle' ? '8px' : '12px',
            clipPath: canvasShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
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
          Ceramica {canvasShape === 'oval' ? 'ovale' : canvasShape === 'square' ? 'quadrata' : canvasShape === 'triangle' ? 'triangolare' : canvasShape === 'rectangle' ? 'rettangolare' : 'rotonda'} — Trascina e ridimensiona gli elementi
        </p>
    </div>
  )
}
)

CanvasEditor.displayName = 'CanvasEditor'
export default CanvasEditor
