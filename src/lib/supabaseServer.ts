import { createClient, SupabaseClient } from '@supabase/supabase-js'

function env(name: string): string {
  const direct = process.env[name]
  if (direct && direct.trim()) return direct.trim()

  // Tolleranza a chiavi .env con spazi iniziali (errore frequente)
  for (const [key, value] of Object.entries(process.env)) {
    if (key.trim() === name && typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }
  return ''
}

let cached: SupabaseClient | null | undefined

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached

  const url = env('NEXT_PUBLIC_SUPABASE_URL')
  const key = env('SUPABASE_SERVICE_ROLE_KEY')

  if (!url || !key) {
    cached = null
    return cached
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return cached
}

export function jsonNoStore(data: unknown, init?: { status?: number }) {
  return Response.json(data, {
    status: init?.status ?? 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  })
}
