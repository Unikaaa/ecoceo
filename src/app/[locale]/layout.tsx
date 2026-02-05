import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-site">
      <Header />
      <main className="flex-grow bg-site">
        {children}
      </main>
      <Footer />
    </div>
  )
}
