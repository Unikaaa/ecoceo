'use client'

import { useState, useRef } from 'react'
import { validateFile, uploadValidation } from '@/lib/validations/upload'
import ImagePreview from './ImagePreview'
import Button from '@/components/ui/Button'

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void
  maxFiles?: number
}

export default function ImageUpload({ onImagesChange, maxFiles = uploadValidation.maxFiles }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setErrors([])

    if (images.length + files.length > maxFiles) {
      setErrors([`Puoi caricare massimo ${maxFiles} immagini`])
      return
    }

    const newImages: string[] = []
    const newErrors: string[] = []

    for (const file of files) {
      const validation = validateFile(file)
      
      if (!validation.valid) {
        newErrors.push(`${file.name}: ${validation.error}`)
        continue
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        const updatedImages = [...images, ...newImages, result]
        setImages(updatedImages)
        onImagesChange(updatedImages)
      }
      reader.readAsDataURL(file)
      newImages.push('') // Placeholder, will be replaced by reader
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onImagesChange(newImages)
  }

  const handleUpload = async () => {
    if (images.length === 0) return

    setIsUploading(true)
    try {
      // Convert base64 to File objects for upload
      const formData = new FormData()
      
      // Note: In production, you would convert base64 back to File or upload directly
      // For now, we'll just prepare the data structure
      const imageData = images.map((img, index) => ({
        data: img,
        index,
      }))

      // TODO: Implement actual upload to Supabase/S3
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })

      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setIsUploading(false)
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(['Errore durante il caricamento'])
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Carica Immagini ({images.length}/{maxFiles})
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="image-upload"
          disabled={images.length >= maxFiles}
        />
        <label
          htmlFor="image-upload"
          className={`inline-block px-4 py-2 border border-gray-300 rounded-artistic cursor-pointer hover:bg-gray-50 transition ${
            images.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Seleziona Immagini
        </label>
        <p className="text-xs text-gray-500 mt-1">
          Max {uploadValidation.maxSize / 1024 / 1024}MB per file, {maxFiles} immagini totali
        </p>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-artistic p-3">
          <ul className="text-sm text-red-600 space-y-1">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <ImagePreview images={images} onRemove={handleRemove} />

      {images.length > 0 && (
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Caricamento...' : 'Carica Immagini'}
        </Button>
      )}
    </div>
  )
}
