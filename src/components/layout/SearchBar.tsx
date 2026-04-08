'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Product } from '@/lib/data/mockProducts'
import { formatPrice } from '@/lib/utils'

interface SearchResult {
  type: 'product' | 'category' | 'page'
  title: string
  description?: string
  price?: number
  url: string
}

const pages = [
  { title: 'Shop', url: '/shop', description: 'Esplora tutti i prodotti' },
  { title: 'Personalizza', url: '/personalizza', description: 'Crea la tua ceramica' },
  { title: 'News', url: '/news', description: 'Ultime novità e articoli' },
  { title: 'Chi Siamo', url: '/about', description: 'La nostra storia' },
]

function slugify(input: string): string {
  return (input || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Carica prodotti all'apertura della search bar
  useEffect(() => {
    if (isOpen && products.length === 0) {
      const fetchProducts = async () => {
        try {
          const response = await fetch('/api/products')
          const data = await response.json()
          if (response.ok && data.products) {
            setProducts(data.products)
          }
        } catch (error) {
          console.error('Errore caricamento prodotti per ricerca:', error)
        }
      }
      fetchProducts()
    }
  }, [isOpen, products.length])

  // Lock scroll quando la tendina è aperta (come ContactModal)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const body = document.body
    const html = document.documentElement
    if (!isOpen) return

    const scrollY = window.scrollY || 0
    const prevBody = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    }
    const prevHtmlOverflow = html.style.overflow

    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'

    return () => {
      const top = body.style.top
      body.style.position = prevBody.position
      body.style.top = prevBody.top
      body.style.left = prevBody.left
      body.style.right = prevBody.right
      body.style.width = prevBody.width
      body.style.overflow = prevBody.overflow
      html.style.overflow = prevHtmlOverflow

      const y = top ? Math.abs(parseInt(top, 10)) : scrollY
      window.scrollTo(0, y || 0)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults: SearchResult[] = []

      // Cerca nei prodotti
      products
        .filter((product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .forEach((product) => {
          searchResults.push({
            type: 'product',
            title: product.name,
            description: product.description,
            price: product.price,
            // Link sempre valido: la categoria (section) può non essere uno slug route-safe.
            url: `/shop/${product.slug}`,
          })
        })

      // Categorie live: deriviamo le "sezioni" dai prodotti Supabase (sempre aggiornate)
      const sections = Array.from(
        new Set(
          (products || [])
            .map((p) => (p.category || '').trim())
            .filter(Boolean)
        )
      )
      sections
        .filter((section) => section.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 4)
        .forEach((section) => {
          const sectionSlug = slugify(section)
          // Se non possiamo creare uno slug valido, evitiamo link rotti e mandiamo allo shop.
          const url = sectionSlug ? `/shop/category/${sectionSlug}` : '/shop'
          searchResults.push({
            type: 'category',
            title: section,
            description: 'Vai alla categoria',
            url,
          })
        })

      // Cerca nelle pagine
      pages
        .filter((page) =>
          page.title.toLowerCase().includes(query.toLowerCase()) ||
          page.description.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 2)
        .forEach((page) => {
          searchResults.push({
            type: 'page',
            title: page.title,
            description: page.description,
            url: page.url,
          })
        })

      setResults(searchResults)
      setSelectedIndex(-1)
    } else {
      setResults([])
    }
  }, [query, products])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < results.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectResult(results[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setQuery('')
    }
  }

  const handleSelectResult = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product':
        return 'Prodotto'
      case 'category':
        return 'Categoria'
      case 'page':
        return 'Pagina'
      default:
        return ''
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product':
        return 'bg-[#663399]'
      case 'category':
        return 'bg-[#c45824]'
      case 'page':
        return 'bg-gray-600'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <>
      {/* Icona lente */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-700 hover:text-[#663399] hover:bg-gray-100 transition-colors"
        aria-label="Cerca"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>

      {/* Banner ricerca */}
      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-12 md:pt-20 px-3 md:px-4 overflow-hidden">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
            {/* Barra ricerca */}
            <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-b from-gray-50 to-white">
              <div className="flex items-center gap-3 md:gap-4">
                <svg
                  className="w-6 h-6 text-[#663399]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cerca prodotti, categorie, pagine..."
                  className="flex-1 text-base md:text-lg outline-none text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={() => {
                    if (query.trim().length > 0) {
                      // Se c'è testo, lo cancella
                      setQuery('')
                      inputRef.current?.focus()
                    } else {
                      // Se non c'è testo, chiude la tendina
                      setIsOpen(false)
                    }
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label={query.trim().length > 0 ? "Cancella" : "Chiudi"}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Risultati */}
            {query.trim().length > 0 && (
              <div
                ref={resultsRef}
                className="max-h-[60vh] md:max-h-96 overflow-y-auto"
              >
                {results.length > 0 ? (
                  <div className="p-2 md:p-3">
                    {results.map((result, index) => (
                      <button
                        key={`${result.type}-${result.url}-${index}`}
                        onClick={() => handleSelectResult(result)}
                        className={`w-full text-left p-3.5 md:p-4 rounded-lg transition-all ${
                          selectedIndex === index
                            ? 'bg-[#663399]/10 border-2 border-[#663399]'
                            : 'bg-white hover:bg-gray-50 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`${getTypeColor(
                              result.type
                            )} text-white text-xs font-semibold px-2 py-1 rounded mt-1`}
                          >
                            {getTypeLabel(result.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {result.title}
                            </h4>
                            {result.description && (
                              <p className="text-sm text-gray-600 line-clamp-1">
                                {result.description}
                              </p>
                            )}
                            {result.price && (
                              <p className="text-sm font-bold text-[#663399] mt-1">
                                {formatPrice(result.price)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    <p>Nessun risultato trovato per "{query}"</p>
                  </div>
                )}
              </div>
            )}

            {/* Suggerimenti quando vuoto */}
            {query.trim().length === 0 && (
              <div className="p-6 text-center text-gray-500">
                <p className="mb-4">Inizia a digitare per cercare...</p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {[
                    { label: 'ceramica', url: '/shop' },
                    { label: 'piatti', url: '/shop/category/piatti' },
                    { label: 'gioielli', url: '/shop/category/gioielleria' },
                    { label: 'regali', url: '/shop/category/eventi-e-regali' },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() => {
                        router.push(s.url)
                        setIsOpen(false)
                        setQuery('')
                      }}
                      className="px-3 py-2 min-h-[44px] bg-gray-100 hover:bg-[#663399] hover:text-white rounded-full text-sm transition-colors"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      , document.body)}
    </>
  )
}
