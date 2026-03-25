import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Suspense } from 'react'

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-site">
      <Suspense fallback={<div className="h-12 md:h-20" />}>
        <Header />
      </Suspense>
      <main className="flex-grow bg-site">
        {children}
      </main>
      <Footer />
    </div>
  )
}
