'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ContactModal from '@/components/contact/ContactModal'

export default function CTA() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <>
      <section className="py-7 sm:py-12 md:py-20 lg:py-24 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand text-gray-900">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-5xl font-serif mb-3 sm:mb-5 md:mb-6 lg:mb-7 text-gray-900">
            Inizia il Tuo Viaggio nell'Arte
          </h2>
          <p className="text-sm sm:text-base md:text-2xl mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-3xl mx-auto text-gray-700">
            Scopri la nostra collezione di ceramiche artistiche o contattaci per creare 
            qualcosa di veramente unico per te
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-10 shadow-md">
                Esplora lo Shop
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-10 bg-white/80 border-[#663399] text-[#663399] hover:bg-[#663399] hover:text-white shadow-md"
              onClick={() => setIsContactModalOpen(true)}
            >
              Contattaci
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  )
}
