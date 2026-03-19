'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ContactModal from '@/components/contact/ContactModal'

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <>
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/logo.png"
                  alt="UNIKA"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-gray-600 text-sm">
                Ceramiche artistiche personalizzate
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold mb-4">Navigazione</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shop" className="text-gray-600 hover:text-primary transition">
                    Shop
                  </Link>
                </li>
                <li>
                <Link href="/personalizza" className="text-gray-600 hover:text-primary transition">
                  Personalizza
                </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition">
                    Chi Siamo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/shipping" className="text-gray-600 hover:text-primary transition">
                    Spedizioni
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-600 hover:text-primary transition">
                    Resi
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-gray-600 hover:text-primary transition text-left"
                  >
                    Contatti
                  </button>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-semibold mb-4">Seguici</h4>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/unika__art_ceramics?igsh=MWtyczRsaW1xOGNlNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1H95DGpSkR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition"
                >
                  Facebook
                </a>
                <a
                  href="https://www.tiktok.com/@unika__20?_r=1&_t=ZN-94coeO4zAIw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary transition"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} UNIKA. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  )
}
