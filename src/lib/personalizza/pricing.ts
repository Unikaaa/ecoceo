/**
 * Calcolo prezzo dinamico per personalizza
 */

export interface PricingInput {
  sizeId: string
  styleId: string
  backgroundId?: string | null
  decorationIds: string[]
}

export interface PricingResult {
  basePrice: number
  stylePrice: number
  backgroundPrice: number
  decorationsPrice: number
  totalPrice: number
  breakdown: {
    size: { name: string; price: number }
    style: { name: string; price: number }
    background?: { name: string; price: number }
    decorations: Array<{ name: string; price: number }>
  }
}

export async function calculatePrice(
  input: PricingInput
): Promise<PricingResult> {
  try {
    // Fetch dati necessari
    const [sizeRes, styleRes, backgroundRes, decorationsRes] = await Promise.all([
      fetch(`/api/personalizza/sizes?id=${input.sizeId}`),
      fetch(`/api/personalizza/styles/${input.styleId}`),
      input.backgroundId
        ? fetch(`/api/personalizza/backgrounds?id=${input.backgroundId}`)
        : Promise.resolve({ ok: false, json: () => ({}) }),
      input.decorationIds.length > 0
        ? fetch(`/api/personalizza/decorations?ids=${input.decorationIds.join(',')}`)
        : Promise.resolve({ ok: false, json: () => ({ decorations: [] }) }),
    ])

    const size = await sizeRes.json()
    const style = await styleRes.json()
    const background = input.backgroundId ? await backgroundRes.json() : null
    const decorations = await decorationsRes.json()

    const basePrice = parseFloat(size.size?.base_price || 0)
    const stylePrice = parseFloat(style.style?.price_extra || 0)
    const backgroundPrice = background?.background
      ? parseFloat(background.background.price_extra || 0)
      : 0
    const decorationsPrice =
      decorations.decorations?.reduce(
        (sum: number, dec: any) => sum + parseFloat(dec.price_extra || 0),
        0
      ) || 0

    const totalPrice = basePrice + stylePrice + backgroundPrice + decorationsPrice

    return {
      basePrice,
      stylePrice,
      backgroundPrice,
      decorationsPrice,
      totalPrice,
      breakdown: {
        size: {
          name: size.size?.name || '',
          price: basePrice,
        },
        style: {
          name: style.style?.name || '',
          price: stylePrice,
        },
        ...(background?.background && {
          background: {
            name: background.background.name,
            price: backgroundPrice,
          },
        }),
        decorations: decorations.decorations?.map((dec: any) => ({
          name: dec.name,
          price: parseFloat(dec.price_extra || 0),
        })) || [],
      },
    }
  } catch (error) {
    console.error('Errore calcolo prezzo:', error)
    throw new Error('Errore durante il calcolo del prezzo')
  }
}
