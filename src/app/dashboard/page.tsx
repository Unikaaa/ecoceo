'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DashboardLayout from '@/components/dashboard/DashboardLayout'

export default function DashboardPage() {
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
      <div className="min-h-screen bg-site flex items-center justify-center px-3 sm:px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-5 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-2 text-center">
              Dashboard UNIKA
            </h1>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-8">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#663399] focus:border-transparent"
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
                className="w-full bg-[#663399] text-white py-2.5 px-4 rounded-lg hover:bg-[#552288] transition-colors font-medium"
              >
                Accedi
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const menuItems = [
    {
      href: '/dashboard/contacts',
      title: 'Contatti',
      description: 'Gestisci i messaggi e le richieste dei clienti',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      href: '/dashboard/magazzino',
      title: 'Magazzino',
      description: 'Prodotti, collezioni, ordini e favoriti',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-emerald-600',
      bgLight: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      href: '/dashboard/creazioni',
      title: 'Creazioni',
      description: 'Galleria artistica e contenuti homepage',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-yellow-600',
      bgLight: 'bg-amber-50',
      iconColor: 'text-amber-700',
    },
    {
      href: '/dashboard/personalizza',
      title: 'Personalizza',
      description: 'Categorie, tipi, stili, dimensioni e prezzi',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-purple-600',
      bgLight: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      href: '/dashboard/contenuti',
      title: 'Contenuti',
      description: 'Chi Siamo, News & Blog del sito',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      gradient: 'from-amber-500 to-orange-500',
      bgLight: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      href: '/dashboard/progetti',
      title: 'Progetti & Brand',
      description: 'Progetti speciali e impostazioni SEO',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      gradient: 'from-rose-500 to-pink-500',
      bgLight: 'bg-rose-50',
      iconColor: 'text-rose-600',
    },
    {
      href: '/dashboard/popup',
      title: 'Pop Up',
      description: 'Crea popup evento/sconto con scadenza',
      icon: (
        <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h6m-9 9h16a2 2 0 002-2V7a2 2 0 00-2-2H8l-4 4v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-violet-500',
      bgLight: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
    },
  ]

  return (
    <DashboardLayout onLogout={handleLogout}>
      <div className="space-y-6 sm:space-y-10 lg:space-y-12">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/5 via-transparent to-[#c45824]/5 rounded-2xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8 lg:p-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#663399] to-[#c45824] rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-xl sm:text-2xl font-serif font-bold">U</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-serif text-gray-900">
                  Dashboard UNIKA
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">
                  Benvenuto nel pannello di controllo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sezione principale */}
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 sm:mb-6 lg:mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#663399] rounded-full"></span>
            Seleziona una sezione
          </h2>

          {/* Menu Sezioni - Grid 2x3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-7">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Gradient bar top */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${item.gradient}`} />
                
                <div className="p-4 sm:p-6 lg:p-7">
                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 ${item.bgLight} rounded-xl flex items-center justify-center mb-2.5 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className={item.iconColor}>
                      {item.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#663399] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center text-gray-400 group-hover:text-[#663399] transition-colors">
                    <span className="text-sm font-medium">Apri</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats (opzionale) */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Accesso Rapido</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/magazzino" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#663399] hover:text-white transition-colors shadow-sm">
              + Nuovo Prodotto
            </Link>
            <Link href="/dashboard/contenuti" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#663399] hover:text-white transition-colors shadow-sm">
              + Nuovo Articolo
            </Link>
            <Link href="/dashboard/personalizza" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#663399] hover:text-white transition-colors shadow-sm">
              + Nuova Categoria
            </Link>
            <Link href="/dashboard/contacts" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#663399] hover:text-white transition-colors shadow-sm">
              📬 Vedi Messaggi
            </Link>
            <Link href="/dashboard/popup" className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-[#663399] hover:text-white transition-colors shadow-sm">
              + Nuova Pop Up
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
