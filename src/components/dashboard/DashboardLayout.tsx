'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ContactsBadge from './ContactsBadge'

interface DashboardLayoutProps {
  children: ReactNode
  onLogout: () => void
  activeSection?: string
}

export default function DashboardLayout({ children, onLogout, activeSection }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 px-3 py-2.5 flex items-center justify-between">
        <Link href="/dashboard" className="min-w-0">
          <h2 className="text-lg font-serif text-gray-900 leading-tight">UNIKA Dashboard</h2>
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="h-10 w-10 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50"
          aria-label={isMobileMenuOpen ? 'Chiudi menu dashboard' : 'Apri menu dashboard'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? 'x' : '≡'}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-50 h-full w-72 lg:w-64 max-w-[88vw] bg-white border-r border-gray-200 overflow-y-auto transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:top-0 top-0`}
      >
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard">
            <h2 className="text-2xl font-serif text-gray-900">UNIKA</h2>
            <p className="text-sm text-gray-600 mt-1">Dashboard Admin</p>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          <Link
            href="/dashboard"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard') && !isActive('/dashboard/contacts') && !isActive('/dashboard/magazzino') && !isActive('/dashboard/personalizza') && !isActive('/dashboard/progetti') && !isActive('/dashboard/contenuti') && !isActive('/dashboard/popup') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Menu
          </Link>
          <Link
            href="/dashboard/contacts"
            className={`w-full flex items-center justify-between px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/contacts') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            <span>Contatti</span>
            <ContactsBadge />
          </Link>
          <Link
            href="/dashboard/magazzino"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/magazzino') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Magazzino
          </Link>
          <Link
            href="/dashboard/personalizza"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/personalizza') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Personalizza
          </Link>
          <Link
            href="/dashboard/contenuti"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/contenuti') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Contenuti
          </Link>
          <Link
            href="/dashboard/progetti"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/progetti') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Progetti & Brand
          </Link>
          <Link
            href="/dashboard/popup"
            className={`w-full block px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
              isActive('/dashboard/popup') ? 'bg-gray-100 font-medium text-[#663399]' : ''
            }`}
          >
            Pop Up
          </Link>
        </nav>

        <div className="sticky bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {isMobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-label="Chiudi menu dashboard"
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 p-3.5 sm:p-5 lg:p-10 xl:p-12">
        {children}
      </main>
    </div>
  )
}
