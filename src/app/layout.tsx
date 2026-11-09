import type { Metadata } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/layout/LayoutWrapper'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'UNIKA - Ceramiche Artistiche',
    template: '%s | UNIKA',
  },
  description: 'Ecommerce di ceramiche artistiche personalizzate. Crea pezzi unici per la tua casa con la nostra collezione di ceramiche artigianali.',
  keywords: ['ceramiche', 'ceramica artistica', 'ecommerce', 'artigianato', 'terracotta'],
  authors: [{ name: 'UNIKA' }],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://unika.com',
    siteName: 'UNIKA',
    title: 'UNIKA - Ceramiche Artistiche',
    description: 'Ecommerce di ceramiche artistiche personalizzate',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UNIKA - Ceramiche Artistiche',
    description: 'Ecommerce di ceramiche artistiche personalizzate',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans`}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
