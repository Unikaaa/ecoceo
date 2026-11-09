'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ContactModal from '@/components/contact/ContactModal'

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <>
      <footer className="bg-gradient-to-b from-[#f7f3ee] to-[#efe8df] border-t border-[#e4dbd0] mt-auto">
        <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="col-span-2 lg:col-span-1">
              <Link href="/" className="inline-block mb-4">
                <Image
                  src="/logo.png"
                  alt="UNIKA"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
              <p className="text-[#6b635c] text-sm sm:text-base max-w-[32ch] leading-relaxed">
                Ceramiche artistiche personalizzate, fatte con cura e carattere.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-serif font-semibold mb-3 text-sm sm:text-base text-[#2a2420]">Navigazione</h4>
              <ul className="space-y-0.5 text-sm sm:text-base">
                <li>
                  <Link href="/shop" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                    Shop
                  </Link>
                </li>
                <li>
                <Link href="/personalizza" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Personalizza
                </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                    Chi Siamo
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-serif font-semibold mb-3 text-sm sm:text-base text-[#2a2420]">Supporto</h4>
              <ul className="space-y-0.5 text-sm sm:text-base">
                <li>
                  <Link href="/shipping" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                    Spedizioni
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                    Resi
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="text-gray-600 hover:text-primary transition text-left min-h-[36px]"
                  >
                    Contatti
                  </button>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-serif font-semibold mb-3 text-sm sm:text-base text-[#2a2420]">Seguici</h4>
              <div className="flex flex-wrap gap-2.5">
                <a
                  href="https://www.instagram.com/unika__art_ceramics?igsh=MWtyczRsaW1xOGNlNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2a2420]/80 hover:text-[#663399] transition inline-flex min-h-[34px] items-center rounded-full border border-[#e4dbd0] bg-white/70 px-3 text-xs sm:text-sm"
                >
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/share/1H95DGpSkR/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2a2420]/80 hover:text-[#663399] transition inline-flex min-h-[34px] items-center rounded-full border border-[#e4dbd0] bg-white/70 px-3 text-xs sm:text-sm"
                >
                  Facebook
                </a>
                <a
                  href="https://www.tiktok.com/@unika__20?_r=1&_t=ZN-94coeO4zAIw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2a2420]/80 hover:text-[#663399] transition inline-flex min-h-[34px] items-center rounded-full border border-[#e4dbd0] bg-white/70 px-3 text-xs sm:text-sm"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t border-[#e4dbd0] text-center text-xs sm:text-sm text-[#6b635c]">
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
