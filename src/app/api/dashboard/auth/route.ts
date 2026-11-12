import { NextRequest, NextResponse } from 'next/server'
import {
  DASHBOARD_COOKIE,
  createDashboardToken,
} from '@/lib/dashboardAuth'

function envPassword(): string {
  const direct = process.env.DASHBOARD_PASSWORD
  if (direct && direct.trim()) return direct.trim()
  for (const [key, value] of Object.entries(process.env)) {
    if (key.trim() === 'DASHBOARD_PASSWORD' && value?.trim()) return value.trim()
  }
  return ''
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const dashboardPassword = envPassword()

    if (!dashboardPassword) {
      return NextResponse.json(
        { success: false, error: 'Password dashboard non configurata' },
        { status: 500 }
      )
    }

    if (password !== dashboardPassword) {
      return NextResponse.json(
        { success: false, error: 'Password non corretta' },
        { status: 401 }
      )
    }

    const token = createDashboardToken()
    const response = NextResponse.json({ success: true, token })
    response.cookies.set({
      name: DASHBOARD_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 12,
    })
    return response
  } catch {
    return NextResponse.json(
      { success: false, error: "Errore durante l'autenticazione" },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: DASHBOARD_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return response
}
