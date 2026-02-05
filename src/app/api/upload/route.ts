import { NextRequest, NextResponse } from 'next/server'
import { validateFile, uploadValidation } from '@/lib/validations/upload'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

export async function POST(request: NextRequest) {
  try {
    // Verifica configurazione Supabase
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('⚠️ Variabili d\'ambiente mancanti:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseServiceKey,
      })
      return NextResponse.json(
        { 
          error: 'Storage non configurato. Verifica NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY in .env.local',
          details: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseServiceKey,
          }
        },
        { status: 500 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Client Supabase non inizializzato' },
        { status: 500 }
      )
    }

    // Verifica che il bucket esista
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.error('Errore lista bucket:', bucketsError)
      return NextResponse.json(
        { 
          error: 'Errore accesso Storage Supabase',
          details: bucketsError.message 
        },
        { status: 500 }
      )
    }

    const bucketExists = buckets?.some(b => b.name === 'product-images')
    
    if (!bucketExists) {
      console.error('Bucket non trovato. Bucket disponibili:', buckets?.map(b => b.name))
      return NextResponse.json(
        { 
          error: 'Bucket "product-images" non trovato su Supabase Storage',
          details: 'Crea il bucket su Supabase Dashboard → Storage → New bucket',
          availableBuckets: buckets?.map(b => b.name) || []
        },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]
    const folder = formData.get('folder') as string || 'products' // Default folder

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'Nessun file fornito' },
        { status: 400 }
      )
    }

    if (files.length > uploadValidation.maxFiles) {
      return NextResponse.json(
        { error: `Massimo ${uploadValidation.maxFiles} file` },
        { status: 400 }
      )
    }

    const uploadedFiles: { url: string; name: string; size: number; path: string }[] = []
    const errors: string[] = []

    for (const file of files) {
      const validation = validateFile(file)
      
      if (!validation.valid) {
        errors.push(`${file.name}: ${validation.error}`)
        continue
      }

      try {
        // Genera nome file univoco
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(2, 15)
        const fileExt = file.name.split('.').pop()
        const fileName = `${timestamp}-${randomStr}.${fileExt}`
        const filePath = `${folder}/${fileName}`

        // Upload su Supabase Storage
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          console.error('Errore upload Supabase:', error)
          
          // Messaggio errore più dettagliato
          let errorMessage = 'Errore durante il caricamento'
          if (error.message?.includes('Bucket not found') || error.message?.includes('does not exist')) {
            errorMessage = 'Bucket Storage "product-images" non trovato. Crealo su Supabase Dashboard → Storage'
          } else if (error.message?.includes('new row violates row-level security') || error.message?.includes('RLS')) {
            errorMessage = 'Policy Storage non configurate. Configura le policy su Supabase Dashboard → Storage → Policies per permettere upload da service_role'
          } else if (error.message?.includes('JWT')) {
            errorMessage = 'Errore autenticazione. Verifica SUPABASE_SERVICE_ROLE_KEY in .env.local'
          } else {
            errorMessage = error.message || errorMessage
          }
          
          errors.push(`${file.name}: ${errorMessage}`)
          continue
        }

        // Ottieni URL pubblico
        const { data: urlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)

        uploadedFiles.push({
          url: urlData.publicUrl,
          name: file.name,
          size: file.size,
          path: filePath,
        })
      } catch (error: any) {
        console.error('Errore upload file:', error)
        errors.push(`${file.name}: ${error.message || 'Errore durante il caricamento'}`)
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json(
        { error: 'Nessun file caricato con successo', details: errors },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Errore durante il caricamento' },
      { status: 500 }
    )
  }
}
