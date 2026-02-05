import { mockArticles } from '@/lib/data/mockArticles'
import ArticleCard from '@/components/news/ArticleCard'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'News - UNIKA',
  description: 'Scopri le ultime novità, storie e consigli sul mondo della ceramica artistica',
  openGraph: {
    title: 'News - UNIKA',
    description: 'Scopri le ultime novità, storie e consigli sul mondo della ceramica artistica',
  },
}

export default function NewsPage() {
  const featuredArticle = mockArticles[0]
  const otherArticles = mockArticles.slice(1)

  return (
    <div className="bg-site min-h-screen relative overflow-hidden">
      {/* Elementi decorativi di sfondo - più grandi e visibili */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-[#663399]/12 via-[#663399]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-[700px] h-[700px] bg-gradient-to-bl from-[#c45824]/12 via-[#c45824]/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-[900px] h-[900px] bg-gradient-to-tr from-[#663399]/10 via-[#c45824]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-[#c45824]/12 to-transparent rounded-full blur-3xl" />
        {/* Pattern decorativo aggiuntivo */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle,_rgba(102,51,153,0.05)_0%,_transparent_70%)] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Hero Section Spettacolare */}
        <section className="container mx-auto px-4 pt-20 md:pt-32 pb-16">
          <div className="max-w-6xl mx-auto text-center animate-fade-in-up">
            <div className="inline-block mb-6">
              <span className="px-6 py-2 bg-gradient-to-r from-[#663399]/15 via-[#663399]/10 to-[#c45824]/15 text-[#663399] rounded-full text-sm font-semibold border-2 border-[#663399]/30 shadow-lg backdrop-blur-sm">
                News & Blog
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gray-900 mb-6 leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                Storie di Arte
              </span>
              <span className="block text-4xl md:text-6xl lg:text-7xl mt-2">
                e Ceramica
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Esplora le nostre storie, scopri le tecniche artigianali e immergiti nel mondo della ceramica artistica
            </p>
          </div>
        </section>

        {/* Featured Article */}
        {featuredArticle && (
          <section className="container mx-auto px-4 pb-20 animate-fade-in-up-delay">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 flex items-center gap-4">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#663399] to-transparent" />
                  <span>In Evidenza</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#663399] to-transparent" />
                </h2>
              </div>
              <Link
                href={`/news/${featuredArticle.slug}`}
                className="group block bg-white rounded-artistic overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] md:aspect-auto overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="w-full h-full flex items-center justify-center relative">
                      <span className="text-gray-400 text-sm relative z-10">Immagine</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/0 via-[#663399]/10 to-[#663399]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>
                  <div className="p-8 md:p-12 flex flex-col justify-center relative">
                    <div className="absolute top-8 right-8">
                      <span className="px-4 py-1.5 bg-gradient-to-r from-[#663399]/15 to-[#c45824]/15 text-[#663399] rounded-full text-xs font-semibold border border-[#663399]/30">
                        {featuredArticle.category}
                      </span>
                    </div>
                    <div className="mb-4">
                      <time className="text-sm text-gray-500 font-medium">
                        {new Date(featuredArticle.publishedAt).toLocaleDateString('it-IT', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4 group-hover:text-[#663399] transition-colors duration-300 leading-tight">
                      {featuredArticle.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#663399] via-[#c45824] to-[#663399] p-0.5">
                          <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="text-[#663399] font-bold text-xs">
                              {featuredArticle.author.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{featuredArticle.author}</span>
                      </div>
                      <span className="text-[#663399] font-semibold group-hover:text-[#c45824] transition-colors duration-300 flex items-center gap-2">
                        Leggi
                        <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* Grid Articoli */}
        <section className="container mx-auto px-4 pb-20 md:pb-32 animate-fade-in-up-delay-2">
          <div className="max-w-7xl mx-auto">
            {otherArticles.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-gray-900 flex items-center gap-4">
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#663399] to-transparent" />
                  <span>Altri Articoli</span>
                  <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#663399] to-transparent" />
                </h2>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherArticles.map((article, index) => (
                <div
                  key={article.id}
                  style={{ animationDelay: `${index * 100}ms` }}
                  className="animate-fade-in-up-delay"
                >
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
