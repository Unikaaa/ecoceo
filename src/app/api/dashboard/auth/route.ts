import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Verifica password da variabile ambiente
    const dashboardPassword = process.env.DASHBOARD_PASSWORD || 'admin123'

    if (password === dashboardPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Password non corretta' },
        { status: 401 }
      )
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Errore durante l\'autenticazione' },
      { status: 500 }
    )
  }
}
