import { z } from 'zod'

export const uploadValidation = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  maxFiles: 5,
}

// Schema per validazione client-side (non usato nel server)
// Nel server usiamo validateFile() direttamente perché File non è disponibile in Node.js
export const uploadSchema = z.object({
  files: z
    .array(z.any()) // Cambiato da z.instanceof(File) perché File non esiste in Node.js runtime
    .min(1, 'Almeno un file è richiesto')
    .max(uploadValidation.maxFiles, `Massimo ${uploadValidation.maxFiles} file`),
})

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!uploadValidation.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo file non supportato. Usa: ${uploadValidation.allowedTypes.join(', ')}`,
    }
  }

  // Check file size
  if (file.size > uploadValidation.maxSize) {
    return {
      valid: false,
      error: `File troppo grande. Massimo ${uploadValidation.maxSize / 1024 / 1024}MB`,
    }
  }

  return { valid: true }
}
