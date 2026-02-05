'use client'

interface ImagePreviewProps {
  images: string[]
  onRemove: (index: number) => void
}

export default function ImagePreview({ images, onRemove }: ImagePreviewProps) {
  if (images.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <div className="aspect-square rounded-artistic overflow-hidden bg-gray-100">
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Rimuovi immagine"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
