'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import CreazioniSection from '@/components/dashboard/CreazioniSection'
import HomepageArtSection from '@/components/dashboard/HomepageArtSection'

export default function CreazioniPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const authStatus = sessionStorage.getItem('dashboard_auth')
    if (authStatus === 'authenticated') setIsAuthenticated(true)
    setIsLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (data.success) {
        sessionStorage.setItem('dashboard_auth', 'authenticated')
        setIsAuthenticated(true)
      } else {
        setError(data.error || 'Password non corretta')
      }
    } catch {
      setError("Errore durante l'autenticazione")
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('dashboard_auth')
    fetch('/api/dashboard/auth', { method: 'DELETE', credentials: 'include' }).catch(() => {})
    setIsAuthenticated(false)
    setPassword('')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center">
        <div className="text-gray-600">Caricamento...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-site flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-serif text-gray-900 mb-2 text-center">Dashboard UNIKA</h1>
          <p className="text-gray-600 text-center mb-8">Inserisci la password per accedere</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Password"
              required
            />
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            ) : null}
            <button
              type="submit"
              className="w-full bg-[#663399] text-white py-2 px-4 rounded-lg hover:bg-[#552288]"
            >
              Accedi
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-serif text-gray-900 mb-2">Creazioni</h1>
          <p className="text-gray-600">
            Gestisci le opere in “Materia che diventa arte” senza duplicare il catalogo.
          </p>
        </div>
        <CreazioniSection />
        <HomepageArtSection />
      </div>
    </DashboardLayout>
  )
}
