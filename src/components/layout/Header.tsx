'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import ContactModal from '@/components/contact/ContactModal'

export default function Header() {
  const pathname = usePathname()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    // Supporta apertura modal via query param: ?openContact=true
    // Evitiamo useSearchParams per non bloccare la build (CSR bailout).
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('openContact') === 'true') {
      setIsContactModalOpen(true)
    }
  }, [pathname])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.includes(path)
  }

  const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/personalizza', label: 'Personalizza' },
    { href: '/news', label: 'News' },
    { href: '/about', label: 'Chi Siamo' },
  ]

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md border-gray-200'
          : 'bg-white/45 backdrop-blur-sm border-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="UNIKA"
              width={250}
              height={125}
              className="h-9 sm:h-10 md:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-base transition-colors ${
                  isActive(link.href)
                    ? 'text-[#663399] font-semibold'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="text-base text-gray-700 hover:text-primary transition-colors"
            >
              Contattaci
            </button>
          </nav>

          {/* Right side - Social, Search & Cart */}
          <div className="flex items-center gap-0.5 md:gap-4">
            {/* Social Icons */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1H95DGpSkR/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#1877F2] hover:bg-gray-100 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.675 0h-21.35C.593 0 0 .592 0 1.326v21.348C0 23.408.593 24 1.326 24h11.495v-9.294H9.692V11.08h3.129V8.41c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.794.715-1.794 1.763v2.313h3.587l-.467 3.626h-3.12V24h6.116C23.408 24 24 23.408 24 22.674V1.326C24 .592 23.408 0 22.675 0z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/unika__art_ceramics?igsh=MWtyczRsaW1xOGNlNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5"
                  fill="url(#instagram-gradient)"
                  viewBox="0 0 24 24"
                >
                  <defs>
                    <linearGradient id="instagram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f09433" />
                      <stop offset="25%" stopColor="#e6683c" />
                      <stop offset="50%" stopColor="#dc2743" />
                      <stop offset="75%" stopColor="#cc2366" />
                      <stop offset="100%" stopColor="#bc1888" />
                    </linearGradient>
                  </defs>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@unika__20?_r=1&_t=ZN-94coeO4zAIw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-black hover:bg-gray-100 transition-colors"
                aria-label="TikTok"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            </div>

            {/* Search Bar */}
            <SearchBar />

            {/* Cart Icon */}
            <CartIcon />

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md">
          <nav className="container mx-auto px-3 py-3 flex flex-col gap-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`h-11 px-3 flex items-center rounded-xl text-sm ${
                  isActive(link.href)
                    ? 'text-[#663399] bg-[#663399]/10 font-semibold border border-[#663399]/20'
                    : 'text-gray-800 bg-white border border-gray-100 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setIsContactModalOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="h-11 px-3 text-left rounded-xl text-sm text-gray-800 bg-white border border-gray-100 hover:bg-gray-50"
            >
              Contattaci
            </button>
          </nav>
        </div>
      )}

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </header>
  )
}