'use client'

import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import ContactModal from '@/components/contact/ContactModal'

export default function CTA() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand text-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Inizia il Tuo Viaggio nell'Arte
          </h2>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-700">
            Scopri la nostra collezione di ceramiche artistiche o contattaci per creare 
            qualcosa di veramente unico per te
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-5">
                Esplora lo Shop
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-10 py-5"
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
