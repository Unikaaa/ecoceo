import { createHmac, timingSafeEqual } from 'crypto'
import { NextRequest } from 'next/server'

export const DASHBOARD_COOKIE = 'unika_dashboard_auth'

function envPassword(): string {
  const direct = process.env.DASHBOARD_PASSWORD
  if (direct && direct.trim()) return direct.trim()
  for (const [key, value] of Object.entries(process.env)) {
    if (key.trim() === 'DASHBOARD_PASSWORD' && value?.trim()) return value.trim()
  }
  return ''
}

function secret(): string {
  return (
    envPassword() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    'unika-dashboard-dev-secret'
  )
}

export function createDashboardToken(): string {
  const exp = Date.now() + 1000 * 60 * 60 * 12 // 12h
  const payload = `ok.${exp}`
  const sig = createHmac('sha256', secret()).update(payload).digest('hex')
  return `${payload}.${sig}`
}

export function verifyDashboardToken(token?: string | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [flag, expStr, sig] = parts
  if (flag !== 'ok') return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || Date.now() > exp) return false
  const payload = `${flag}.${expStr}`
  const expected = createHmac('sha256', secret()).update(payload).digest('hex')
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  } catch {
    return false
  }
}

export function isDashboardAuthenticated(request: NextRequest): boolean {
  const cookie = request.cookies.get(DASHBOARD_COOKIE)?.value
  if (verifyDashboardToken(cookie)) return true

  const header = request.headers.get('x-dashboard-token')
  if (verifyDashboardToken(header)) return true

  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Bearer ')) {
    return verifyDashboardToken(auth.slice(7))
  }
  return false
}

export function requireDashboard(request: NextRequest) {
  if (!isDashboardAuthenticated(request)) {
    return Response.json(
      { error: 'Non autorizzato. Accedi alla dashboard.' },
      {
        status: 401,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  }
  return null
}
