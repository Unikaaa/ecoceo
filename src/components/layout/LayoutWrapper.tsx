'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import SitePopup from './SitePopup'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  if (isDashboard) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen bg-site">
      <SitePopup />
      <Header />
      <main className="flex-grow bg-site">
        {children}
      </main>
      <Footer />
    </div>
  )
}
