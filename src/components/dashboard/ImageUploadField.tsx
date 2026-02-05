'use client'

import { useState, useRef } from 'react'
import { validateFile, uploadValidation } from '@/lib/validations/upload'

interface ImageUploadFieldProps {
  value: string | string[]
  onChange: (urls: string | string[]) => void
  multiple?: boolean
  label?: string
}

export default function ImageUploadField({ 
  value, 
  onChange, 
  multiple = false,
  label = 'Immagine Prodotto'
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentUrls = Array.isArray(value) ? value : (value ? [value] : [])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setError(null)
    setIsUploading(true)

    try {
      // Validazione file
      const validFiles: File[] = []
      for (const file of files) {
        const validation = validateFile(file)
        if (!validation.valid) {
          setError(`${file.name}: ${validation.error}`)
          continue
        }
        validFiles.push(file)
      }

      if (validFiles.length === 0) {
        setIsUploading(false)
        return
      }

      // Upload su Supabase Storage
      const formData = new FormData()
      validFiles.forEach((file) => {
        formData.append('files', file)
      })
      formData.append('folder', 'products')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      // Verifica che la risposta sia JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('❌ Risposta non-JSON ricevuta:', {
          status: response.status,
          statusText: response.statusText,
          contentType: contentType,
          preview: text.substring(0, 500)
        })
        
        // Prova a parsare come JSON comunque (potrebbe essere un errore JSON)
        try {
          const jsonData = JSON.parse(text)
          throw new Error(jsonData.error || jsonData.message || 'Errore durante il caricamento')
        } catch {
          throw new Error(`Errore server (${response.status}): ${response.statusText}. Verifica che il bucket Storage "product-images" esista su Supabase Dashboard → Storage.`)
        }
      }

      const data = await response.json()

      if (!response.ok) {
        // Mostra errori dettagliati se disponibili
        const errorMsg = data.error || data.details || 'Errore durante il caricamento'
        const availableBuckets = data.availableBuckets ? ` Bucket disponibili: ${data.availableBuckets.join(', ')}` : ''
        throw new Error(`${errorMsg}${availableBuckets}`)
      }

      // Aggiorna URLs
      const newUrls = data.files.map((f: any) => f.url)
      
      if (multiple) {
        // Array di immagini
        const updatedUrls = [...currentUrls, ...newUrls]
        onChange(updatedUrls)
      } else {
        // Singola immagine (usa la prima)
        onChange(newUrls[0])
      }

      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Errore upload:', err)
      setError(err.message || 'Errore durante il caricamento')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    if (multiple) {
      const updatedUrls = currentUrls.filter((_, i) => i !== index)
      onChange(updatedUrls)
    } else {
      onChange('')
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      {/* Input file */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          id={`image-upload-${label}`}
          disabled={isUploading}
        />
        <label
          htmlFor={`image-upload-${label}`}
          className={`inline-block px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isUploading ? 'Caricamento...' : multiple ? 'Aggiungi Immagini' : 'Carica Immagine'}
        </label>
        <p className="text-xs text-gray-500">
          Max {uploadValidation.maxSize / 1024 / 1024}MB per file
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
          {error}
        </div>
      )}

      {/* Preview immagini */}
      {currentUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {currentUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
