'use client'

import { useRef, useEffect } from 'react'
import { PersonalizzaState } from '@/app/personalizza/page'

interface CanvasEditorProps {
  state: PersonalizzaState
  onUpdate: (canvasData: any) => void
}

/**
 * Canvas Editor - Stile Canva
 * 
 * TODO: Implementare con Fabric.js o Konva.js
 * 
 * Funzionalità richieste:
 * - Drag & drop elementi
 * - Resize elementi
 * - Rotazione elementi
 * - Layer management
 * - Undo/Redo
 * - Zoom in/out
 * - Snap to grid
 * 
 * Librerie consigliate:
 * - Fabric.js: https://fabricjs.com/
 * - Konva.js: https://konvajs.org/
 * - React-Konva: https://konvajs.org/docs/react/
 */
export default function CanvasEditor({ state, onUpdate }: CanvasEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // TODO: Inizializzare canvas con Fabric.js o Konva.js
    // Per ora placeholder
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Placeholder: disegna un rettangolo
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#663399'
    ctx.lineWidth = 2
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

    // Testo placeholder
    ctx.fillStyle = '#333'
    ctx.font = '24px serif'
    ctx.textAlign = 'center'
    ctx.fillText('Canvas Editor - Da implementare', canvas.width / 2, canvas.height / 2)
  }, [state])

  return (
    <div className="w-full">
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 text-center">
          Canvas interattivo - Implementazione in corso
        </p>
        <p className="text-xs text-gray-500 text-center mt-2">
          Utilizzare Fabric.js o Konva.js per drag & drop, resize, rotazione
        </p>
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full border border-gray-300 rounded-lg bg-white"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}
