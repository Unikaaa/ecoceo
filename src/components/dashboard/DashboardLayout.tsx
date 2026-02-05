'use client'

import { ReactNode } from 'react'
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

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname?.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 overflow-y-auto">
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
              isActive('/dashboard') && !isActive('/dashboard/contacts') && !isActive('/dashboard/magazzino') && !isActive('/dashboard/personalizza') && !isActive('/dashboard/progetti') && !isActive('/dashboard/contenuti') ? 'bg-gray-100 font-medium text-[#663399]' : ''
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
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
          >
            Esci
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
