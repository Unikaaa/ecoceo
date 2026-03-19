'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import SearchBar from './SearchBar'
import CartIcon from './CartIcon'
import ContactModal from '@/components/contact/ContactModal'

export default function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  useEffect(() => {
    if (searchParams.get('openContact') === 'true') {
      setIsContactModalOpen(true)
    }
  }, [searchParams])

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname?.includes(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-site border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="UNIKA"
              width={250}
              height={125}
              className="h-20 w-auto"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            <Link 
              href="/shop" 
              className={`text-base transition-all duration-300 ${
                isActive('/shop')
                  ? 'text-[#663399] text-2xl font-bold scale-110'
                  : 'text-gray-700 hover:text-primary hover:scale-105'
              }`}
            >
              Shop
            </Link>
            <Link 
              href="/personalizza" 
              className={`text-base transition-all duration-300 ${
                isActive('/personalizza')
                  ? 'text-[#663399] text-2xl font-bold scale-110'
                  : 'text-gray-700 hover:text-primary hover:scale-105'
              }`}
            >
              Personalizza
            </Link>
            <Link 
              href="/news" 
              className={`text-base transition-all duration-300 ${
                isActive('/news')
                  ? 'text-[#663399] text-2xl font-bold scale-110'
                  : 'text-gray-700 hover:text-primary hover:scale-105'
              }`}
            >
              News
            </Link>
            <Link 
              href="/about" 
              className={`text-base transition-all duration-300 ${
                isActive('/about')
                  ? 'text-[#663399] text-2xl font-bold scale-110'
                  : 'text-gray-700 hover:text-primary hover:scale-105'
              }`}
            >
              Chi Siamo
            </Link>
            <button
              onClick={() => setIsContactModalOpen(true)}
              className={`text-base transition-all duration-300 ${
                isActive('/contact')
                  ? 'text-[#663399] text-2xl font-bold scale-110'
                  : 'text-gray-700 hover:text-primary hover:scale-105'
              }`}
            >
              Contattaci
            </button>
          </nav>

          {/* Right side - Social, Search & Cart */}
          <div className="flex items-center space-x-5">
            {/* Social Icons */}
            <div className="hidden md:flex items-center space-x-4 -ml-16">
              <a
                href="https://www.facebook.com/share/1H95DGpSkR/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877F2] hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
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
                className="text-black hover:opacity-80 transition-opacity"
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
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </header>
  )
}