import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { inferCeramicShapeFromProduct } from '@/lib/personalizza/productShape'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database non configurato' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      sessionId,
      categoryId,
      productTypeId,
      ceramicShape,
      styleId,
      sizeId,
      backgroundId,
      decorations,
      customText,
      customTextFont,
      customTextColor,
      customTextSize,
      userImages,
      canvasData,
      totalPrice,
    } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID richiesto' },
        { status: 400 }
      )
    }

    // Verifica se esiste già una configurazione per questa sessione
    const { data: existing } = await supabase
      .from('configurations')
      .select('id')
      .eq('user_session_id', sessionId)
      .eq('status', 'draft')
      .single()

    // Non salvare se non ci sono almeno categoria e tipo prodotto e stile e dimensione
    // per evitare errori di NOT NULL constraint
    if (!categoryId || !productTypeId || !styleId || !sizeId) {
      return NextResponse.json({
        success: true,
        configuration: null,
        message: 'Configurazione incompleta, non salvata nel database',
      })
    }

    // Server-side validation (profilo): se il prodotto è FIXED_SHAPE, scarta input di shape geometrica.
    let safeShape = (ceramicShape || null) as string | null
    if (productTypeId) {
      const { data: pt } = await supabase
        .from('product_types')
        .select('id, slug, name, canvas_shape, personalization_type')
        .eq('id', productTypeId)
        .single()

      if (pt && (pt.personalization_type || 'FIXED_SHAPE') !== 'GEOMETRIC_SUPPORT') {
        safeShape = inferCeramicShapeFromProduct(pt)
      }
    }

    const enrichedCanvasData =
      canvasData && typeof canvasData === 'object'
        ? {
            ...canvasData,
            __meta: {
              ...(canvasData.__meta || {}),
              ceramicShape: safeShape,
            },
          }
        : canvasData

    const configData = {
      user_session_id: sessionId,
      category_id: categoryId,
      product_type_id: productTypeId,
      style_id: styleId,
      size_id: sizeId,
      background_id: backgroundId || null,
      decorations: decorations || [],
      custom_text: customText || null,
      custom_text_font: customTextFont || 'serif',
      custom_text_color: customTextColor || '#000000',
      custom_text_size: customTextSize || 24,
      user_images: userImages || [],
      canvas_data: enrichedCanvasData || null,
      total_price: totalPrice || 0,
      status: 'draft',
    }

    let result
    if (existing) {
      // Aggiorna configurazione esistente
      result = await supabase
        .from('configurations')
        .update(configData)
        .eq('id', existing.id)
        .select()
        .single()
    } else {
      // Crea nuova configurazione
      result = await supabase
        .from('configurations')
        .insert(configData)
        .select()
        .single()
    }

    if (result.error) {
      console.error('Errore salvataggio configurazione:', result.error)
      return NextResponse.json(
        { error: 'Errore durante il salvataggio' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      configuration: result.data,
    })
  } catch (error: any) {
    console.error('Errore API salvataggio:', error)
    return NextResponse.json(
      { error: 'Errore durante il salvataggio' },
      { status: 500 }
    )
  }
}
