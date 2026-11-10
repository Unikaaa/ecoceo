import Link from 'next/link'
import Image from 'next/image'
import { UNIKA_LINES } from '@/lib/lines'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#f7f3ee] to-[#efe8df] border-t border-[#e4dbd0] mt-auto">
      <div className="container mx-auto px-3 sm:px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
            <p className="text-[#6b635c] text-sm sm:text-base max-w-[34ch] leading-relaxed">
              Laboratorio creativo e produttivo Made in Italy: ceramica, fotoceramica,
              personalizzazione e design contemporaneo.
            </p>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-3 text-sm sm:text-base text-[#2a2420]">Linee</h4>
            <ul className="space-y-0.5 text-sm sm:text-base">
              {UNIKA_LINES.map((line) => (
                <li key={line.id}>
                  <Link
                    href={`/${line.slug}`}
                    className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center"
                  >
                    {line.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif font-semibold mb-3 text-sm sm:text-base text-[#2a2420]">Esplora</h4>
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
                <Link href="/progetti" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Progetti
                </Link>
              </li>
              <li>
                <Link href="/processo" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Processo
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Chi Siamo
                </Link>
              </li>
              <li>
                <Link href="/professionisti" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Professionisti
                </Link>
              </li>
            </ul>
          </div>

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
                <Link href="/faq" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  Contatti
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-600 hover:text-primary transition inline-flex min-h-[36px] items-center">
                  News
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 md:mt-8 md:pt-8 border-t border-[#e4dbd0] text-center text-xs sm:text-sm text-[#6b635c]">
          <p>&copy; {new Date().getFullYear()} UNIKA. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
