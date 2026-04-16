import { inferCeramicShapeFromProduct, type CeramicShape } from '@/lib/personalizza/productShape'

export type PersonalizationType = 'FIXED_SHAPE' | 'GEOMETRIC_SUPPORT'

export type ProductTypeLike = {
  id: string
  personalization_type?: string | null
  allowed_shapes?: string[] | null
  canvas_shape?: string | null
  slug?: string | null
  name?: string | null
}

export type AvailableOptions = {
  personalizationType: PersonalizationType
  canChooseGeometricShape: boolean
  allowedShapes: CeramicShape[]
  defaultShape: CeramicShape
}

function toPersonalizationType(value?: string | null): PersonalizationType {
  return value === 'GEOMETRIC_SUPPORT' ? 'GEOMETRIC_SUPPORT' : 'FIXED_SHAPE'
}

function normalizeShapeArray(values?: string[] | null): CeramicShape[] {
  const raw = (values || []).map((v) => (v || '').toLowerCase().trim()).filter(Boolean)
  const set = new Set<CeramicShape>()
  for (const v of raw) {
    if (v === 'triangle') set.add('triangle')
    else if (v === 'rectangle' || v === 'rect') set.add('rectangle')
    else if (v === 'circle' || v === 'round') set.add('circle')
    else if (v === 'square' || v === 'quadrata') set.add('square')
    else if (v === 'oval' || v === 'ovale') set.add('oval')
  }
  return Array.from(set)
}

export function getAvailableOptions(productType: ProductTypeLike): AvailableOptions {
  const personalizationType = toPersonalizationType(productType.personalization_type)
  const defaultShape = inferCeramicShapeFromProduct(productType)

  if (personalizationType === 'FIXED_SHAPE') {
    return {
      personalizationType,
      canChooseGeometricShape: false,
      allowedShapes: [defaultShape],
      defaultShape,
    }
  }

  const allowed = normalizeShapeArray(productType.allowed_shapes)
  const allowedShapes = allowed.length > 0 ? allowed : (['oval', 'rectangle', 'square', 'circle', 'triangle'] as CeramicShape[])

  return {
    personalizationType,
    canChooseGeometricShape: true,
    allowedShapes,
    defaultShape: allowedShapes.includes(defaultShape) ? defaultShape : allowedShapes[0],
  }
}

