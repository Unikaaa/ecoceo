'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ProjectsSection from '@/components/dashboard/ProjectsSection'
import BrandSection from '@/components/dashboard/BrandSection'

export default function ProgettiPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const authStatus = sessionStorage.getItem('dashboard_auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        sessionStorage.setItem('dashboard_auth', 'authenticated')
        setIsAuthenticated(true)
      } else {
        setError(data.error || 'Password non corretta')
      }
    } catch (err) {
      setError('Errore durante l\'autenticazione')
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
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-serif text-gray-900 mb-2 text-center">
              Dashboard UNIKA
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Inserisci la password per accedere
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] focus:border-transparent"
                  placeholder="Password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#663399] text-white py-2 px-4 rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Accedi
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-serif text-gray-900 mb-2">
            Progetti & Brand
          </h1>
          <p className="text-gray-600">
            Gestisci progetti e impostazioni brand/SEO
          </p>
        </div>

        {/* Sezioni */}
        <div className="space-y-8">
          <div id="projects">
            <ProjectsSection />
          </div>
          <div id="brand">
            <BrandSection />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
