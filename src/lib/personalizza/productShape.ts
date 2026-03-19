export type CeramicShape = 'oval' | 'square' | 'triangle' | 'rectangle' | 'circle'

export function normalizeCeramicShape(value?: string | null): CeramicShape {
  const shape = (value || '').toLowerCase().trim()
  if (shape === 'triangle') return 'triangle'
  if (shape === 'rectangle' || shape === 'rect') return 'rectangle'
  if (shape === 'circle' || shape === 'round') return 'circle'
  if (shape === 'square' || shape === 'quadrata') return 'square'
  return 'oval'
}

export function inferCeramicShapeFromProduct(productType: {
  canvas_shape?: string | null
  slug?: string | null
  name?: string | null
}): CeramicShape {
  if (productType.canvas_shape) {
    return normalizeCeramicShape(productType.canvas_shape)
  }

  const text = `${productType.slug || ''} ${productType.name || ''}`.toLowerCase()
  if (text.includes('triang')) return 'triangle'
  if (text.includes('rettang') || text.includes('rectangle') || text.includes('rect')) return 'rectangle'
  if (text.includes('cerchio') || text.includes('circle') || text.includes('rotond')) return 'circle'
  if (text.includes('quadra') || text.includes('square')) return 'square'
  return 'oval'
}
