'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface AboutSection {
  section_key: string
  title: string
  subtitle: string
  content: string
  image_url: string
}

export default function AboutPage() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [sections, setSections] = useState<Record<string, AboutSection>>({})

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchAboutSections = async () => {
      try {
        const res = await fetch('/api/about')
        const data = await res.json()
        if (res.ok) {
          const map = (data.sections || []).reduce((acc: Record<string, AboutSection>, section: AboutSection) => {
            acc[section.section_key] = section
            return acc
          }, {})
          setSections(map)
        }
      } catch (error) {
        console.error('Errore caricamento about:', error)
      }
    }

    fetchAboutSections()
  }, [])

  const hero = sections.hero
  const story = sections.story
  const philosophy = sections.philosophy
  const signature = sections.signature

  const defaultStoryParagraphs = [
    "UNIKA nasce dalla passione per l'arte ceramica e dalla volontà di preservare tecniche tradizionali tramandate di generazione in generazione. Ogni pezzo che creiamo porta con sé l'essenza di un sapere antico, arricchito da una visione contemporanea.",
    "La nostra storia inizia in un piccolo atelier dove l'argilla prende forma tra le mani esperte dei nostri artigiani. Ogni ceramica è frutto di ore di lavoro manuale, di attenzione ai dettagli e di un amore profondo per questo mestiere.",
    "Crediamo che ogni oggetto debba avere un'anima, che ogni creazione debba raccontare qualcosa di unico. Per questo ogni pezzo UNIKA è unico, irripetibile, portatore di un messaggio di bellezza e autenticità.",
  ]

  const storyParagraphs = (story?.content ?? defaultStoryParagraphs.join('\n\n'))
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  const parsePhilosophyImages = (raw?: string) => {
    if (!raw) return ['', '', '']
    try {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return [parsed[0] || '', parsed[1] || '', parsed[2] || '']
      if (parsed && Array.isArray(parsed.images)) {
        return [parsed.images[0] || '', parsed.images[1] || '', parsed.images[2] || '']
      }
    } catch {
      return [raw, '', '']
    }
    return ['', '', '']
  }

  const philosophyImages = parsePhilosophyImages(philosophy?.image_url)

  return (
    <div className="min-h-screen bg-site relative overflow-hidden">
      {/* Elementi decorativi di sfondo spettacolari */}
      <div className="absolute inset-0 pointer-events-none hidden sm:block">
        <div className="absolute top-0 left-0 w-[1000px] h-[1000px] bg-gradient-to-br from-[#663399]/10 via-[#663399]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[900px] h-[900px] bg-gradient-to-bl from-[#c45824]/10 via-[#c45824]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[1100px] h-[1100px] bg-gradient-to-tr from-[#663399]/8 via-[#c45824]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle,_rgba(102,51,153,0.06)_0%,_transparent_70%)] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Hero Spettacolare */}
        <section className="relative py-14 sm:py-32 md:py-40 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand overflow-hidden">
          {/* Pattern decorativo */}
          <div className="absolute inset-0 opacity-10 hidden sm:block">
            <div className="absolute top-20 left-20 w-32 h-32 border-2 border-[#663399] rounded-full" />
            <div className="absolute top-40 right-32 w-24 h-24 border-2 border-[#c45824] rounded-full" />
            <div className="absolute bottom-32 left-1/3 w-40 h-40 border-2 border-[#663399] rounded-full" />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
              <div className="inline-block mb-5 sm:mb-8">
                <span className="px-5 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-[#663399]/20 via-[#663399]/15 to-[#c45824]/20 text-[#663399] rounded-full text-xs sm:text-sm font-semibold border border-[#663399]/30 shadow-sm backdrop-blur-sm">
                  {hero?.subtitle ?? 'La Nostra Essenza'}
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif text-gray-900 mb-5 sm:mb-8 leading-[1.05] tracking-tight">
                <span className="block bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                  {hero?.title ?? 'Chi Siamo'}
                </span>
              </h1>
              <p className="text-base sm:text-2xl md:text-3xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-light">
                {hero?.content ?? "Dove l'arte incontra l'artigianato, dove ogni pezzo racconta una storia, dove la tradizione si fonde con l'innovazione"}
              </p>
            </div>
          </div>
        </section>


        {/* Storia Spettacolare */}
        <section className="py-12 sm:py-24 md:py-32 bg-site relative">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center max-w-7xl mx-auto">
              {/* Immagine Atelier con effetti */}
              <div className="order-2 lg:order-1 animate-fade-in-up-delay">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#663399] via-[#c45824] to-[#663399] rounded-artistic opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 hidden sm:block" />
                  <div className="relative aspect-square bg-gradient-to-br from-ceramic-beige via-ceramic-terracotta to-ceramic-earth rounded-artistic overflow-hidden shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="w-full h-full flex items-center justify-center relative">
                      {story?.image_url ? (
                        <img
                          src={story.image_url}
                          alt={story?.subtitle || 'Immagine Atelier'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400 text-lg relative z-10">Immagine Atelier</span>
                      )}
                      {story?.image_url && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#663399]/20 via-[#c45824]/10 to-[#663399]/20" />
                      )}
                    </div>
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/0 via-[#663399]/10 to-[#663399]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    {/* Bordo decorativo */}
                    <div className="absolute inset-0 border-4 border-white/30 rounded-artistic pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Testo Storia */}
              <div className="order-1 lg:order-2 animate-fade-in-up-delay-2">
                <div className="relative">
                  {/* Barra decorativa laterale */}
                  <div className="absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#663399] via-[#c45824] to-transparent rounded-full hidden lg:block" />
                  
                  <div className="pl-0 lg:pl-8">
                    <div className="mb-4 sm:mb-6">
                      <span className="px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#663399]/15 to-[#c45824]/15 text-[#663399] rounded-full text-xs font-semibold border border-[#663399]/30">
                        {story?.subtitle ?? 'La Nostra Storia'}
                      </span>
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif text-gray-900 mb-5 sm:mb-8 leading-tight">
                      <span className="bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                        {story?.title ?? "Un Viaggio nell'Arte"}
                      </span>
                    </h2>
                    <div className="space-y-4 sm:space-y-6 text-sm sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                      {storyParagraphs.map((paragraph, index) => {
                        const isAccent = index % 2 === 1
                        return (
                          <p
                            key={`${index}-${paragraph.slice(0, 16)}`}
                            className={`relative pl-6 border-l-4 ${isAccent ? 'border-[#c45824]/30' : 'border-[#663399]/30'}`}
                          >
                            <span className={`absolute -left-2 top-0 w-3 h-3 rounded-full ${isAccent ? 'bg-[#c45824]' : 'bg-[#663399]'}`} />
                            {paragraph}
                          </p>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Filosofia Spettacolare */}
        <section className="py-12 sm:py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="container mx-auto px-3 sm:px-4">
            <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-20 animate-fade-in-up-delay-3">
              <div className="inline-block mb-4 sm:mb-6">
                <span className="px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-[#663399]/15 to-[#c45824]/15 text-[#663399] rounded-full text-xs sm:text-sm font-semibold border border-[#663399]/30">
                  {philosophy?.subtitle ?? 'Filosofia'}
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-serif text-gray-900 mb-4 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                  {philosophy?.title ?? 'La Nostra Filosofia'}
                </span>
              </h2>
              <p className="text-base sm:text-2xl md:text-3xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                {philosophy?.content ?? "Crediamo nella bellezza della manualità, nel valore del tempo dedicato, nell'importanza di creare oggetti che durino nel tempo e che portino gioia in ogni casa che li accoglie."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto">
              {[
                { title: 'Atelier', gradient: 'from-ceramic-beige to-ceramic-sand', delay: 0 },
                { title: 'Dettagli', gradient: 'from-ceramic-terracotta to-ceramic-earth', delay: 100 },
                { title: 'Materia', gradient: 'from-ceramic-white to-ceramic-beige', delay: 200 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="group relative animate-fade-in-up-delay"
                  style={{ animationDelay: `${item.delay}ms` }}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Bordo gradiente al hover */}
                  <div className={`absolute -inset-1 bg-gradient-to-r from-[#663399] via-[#c45824] to-[#663399] rounded-artistic opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 ${hoveredCard === index ? 'opacity-100' : ''}`} />
                  
                  <div className="relative aspect-square bg-gradient-to-br rounded-artistic overflow-hidden shadow-2xl transform group-hover:scale-105 transition-all duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`} />
                    {philosophyImages[index] && (
                      <img
                        src={philosophyImages[index]}
                        alt={item.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    {philosophyImages[index] && (
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-25`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="w-full h-full flex items-center justify-center relative">
                      <div className="text-center z-10">
                        <h3 className="text-3xl md:text-4xl font-serif text-white mb-2 drop-shadow-2xl">
                          {item.title}
                        </h3>
                        <div className="w-16 h-1 bg-white/50 mx-auto mt-4 rounded-full" />
                      </div>
                    </div>
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/0 via-[#663399]/20 to-[#663399]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Bordo decorativo */}
                    <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/40 transition-all duration-500 rounded-artistic" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Firma Spettacolare */}
        <section className="py-14 sm:py-32 md:py-40 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
          {/* Elementi decorativi */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none hidden sm:block">
            <div className="absolute top-20 left-20 w-64 h-64 border-2 border-[#663399]/20 rounded-full" />
            <div className="absolute bottom-20 right-20 w-80 h-80 border-2 border-[#c45824]/20 rounded-full" />
          </div>

          <div className="container mx-auto px-3 sm:px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center animate-fade-in-up-delay-4">
              <div className="mb-7 sm:mb-12">
                <h2 className="text-4xl sm:text-6xl md:text-8xl font-serif text-gray-900 mb-5 sm:mb-8 leading-[1.1]">
                  <span className="block bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                    Ogni Pezzo
                  </span>
                  <span className="block text-3xl sm:text-5xl md:text-7xl mt-2">
                    è Unico
                  </span>
                </h2>
              </div>
              
              <div className="space-y-5 sm:space-y-8 mb-9 sm:mb-16">
                <p className="text-base sm:text-2xl md:text-3xl text-gray-700 leading-relaxed font-light">
                  {signature?.content ?? "Non produciamo in serie. Ogni ceramica è pensata, modellata e finita a mano, con cura e dedizione. Ogni creazione porta con sé l'impronta dell'artigiano che l'ha realizzata."}
                </p>
                <div className="flex items-center justify-center gap-4 my-8">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#663399] to-transparent" />
                  <div className="w-3 h-3 bg-[#663399] rounded-full" />
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c45824] to-transparent" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-serif text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-[#663399] via-[#c45824] to-[#663399] bg-clip-text text-transparent">
                    Questo è il nostro modo di fare arte.
                  </span>
                  <br />
                  <span className="text-3xl sm:text-4xl md:text-5xl mt-2 block">
                    Questo è UNIKA.
                  </span>
                </p>
              </div>

              <Link href="/personalizza">
                <Button 
                  size="lg" 
                  variant="primary" 
                  className="text-sm sm:text-xl px-7 sm:px-12 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  <span className="flex items-center gap-3">
                    Crea la Tua Ceramica
                    <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
