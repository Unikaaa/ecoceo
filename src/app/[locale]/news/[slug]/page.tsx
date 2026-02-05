import { notFound } from 'next/navigation'
import { mockArticles } from '@/lib/data/mockArticles'
import Image from 'next/image'
import { Metadata } from 'next'
import Link from 'next/link'

interface PageProps {
  params: {
    locale: string
    slug: string
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = mockArticles.find((a) => a.slug === params.slug)

  if (!article) {
    return {
      title: 'Articolo non trovato - UNIKA',
    }
  }

  return {
    title: `${article.title} - UNIKA`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.image],
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: [article.author],
    },
  }
}

export default function ArticlePage({ params }: PageProps) {
  const article = mockArticles.find((a) => a.slug === params.slug)

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.publishedAt).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Calculate reading time (approximate)
  const wordsPerMinute = 200
  const words = article.content.split(/\s+/).length
  const readingTime = Math.ceil(words / wordsPerMinute)

  return (
    <article className="bg-site min-h-screen relative overflow-hidden">
      {/* Elementi decorativi di sfondo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-[#663399]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-[#c45824]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-28 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb elegante con animazione */}
          <nav className="mb-12 text-sm animate-fade-in-up">
            <div className="flex items-center gap-2 text-gray-500">
              <Link 
                href="/" 
                className="hover:text-[#663399] transition-all duration-300 hover:scale-105"
              >
                Home
              </Link>
              <span className="text-gray-300">/</span>
              <Link 
                href="/news" 
                className="hover:text-[#663399] transition-all duration-300 hover:scale-105"
              >
                News
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900 font-medium">{article.title}</span>
            </div>
          </nav>

          {/* Header spettacolare */}
          <header className="mb-16 animate-fade-in-up-delay">
            {/* Categoria e Tag con animazione */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-5 py-2 bg-gradient-to-r from-[#663399]/15 via-[#663399]/10 to-[#c45824]/15 text-[#663399] rounded-full text-sm font-semibold border-2 border-[#663399]/30 shadow-lg backdrop-blur-sm hover:scale-110 transition-transform duration-300">
                {article.category}
              </span>
              {article.tags && article.tags.map((tag, idx) => (
                <span 
                  key={tag} 
                  className="px-3 py-1.5 bg-white/80 backdrop-blur-sm text-gray-600 rounded-full text-xs hover:bg-[#663399]/10 hover:text-[#663399] transition-all duration-300 hover:scale-105 shadow-sm"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Titolo principale drammatico */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-gray-900 mb-8 leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                {article.title}
              </span>
            </h1>

            {/* Meta informazioni eleganti con decorazioni */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#663399] via-[#c45824] to-transparent rounded-full" />
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 pl-6 pb-8 border-b-2 border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#663399] via-[#c45824] to-[#663399] p-0.5 shadow-lg hover:scale-110 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                      <span className="text-[#663399] font-bold text-sm">
                        {article.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{article.author}</div>
                    <div className="text-xs text-gray-500">Autore</div>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#663399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <time className="font-medium">{formattedDate}</time>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#c45824]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium">{readingTime} min di lettura</span>
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image spettacolare */}
          <div className="mb-16 group animate-fade-in-up-delay-2">
            <div className="relative aspect-[21/9] rounded-artistic overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(102,51,153,0.1)_100%)]" />
                <span className="text-gray-400 text-sm relative z-10">Immagine</span>
              </div>
              {/* Effetto hover avanzato */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/0 via-[#663399]/10 to-[#663399]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform group-hover:scale-110" />
              <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/30 transition-all duration-500 rounded-artistic" />
            </div>
          </div>

          {/* Content con tipografia spettacolare */}
          <div className="prose prose-lg prose-slate max-w-none mb-20 animate-fade-in-delay-3">
            <div className="text-gray-700 leading-relaxed text-lg md:text-xl">
              {article.content.split('\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return (
                    <h2 
                      key={index} 
                      className="text-4xl md:text-5xl font-serif text-gray-900 mt-16 mb-8 first:mt-0 relative pl-6 border-l-4 border-gradient-to-b from-[#663399] to-[#c45824]"
                      style={{
                        borderImage: 'linear-gradient(to bottom, #663399, #c45824) 1'
                      }}
                    >
                      <span className="bg-gradient-to-r from-gray-900 via-[#663399] to-gray-900 bg-clip-text text-transparent">
                        {paragraph.replace('# ', '')}
                      </span>
                    </h2>
                  )
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h3 
                      key={index} 
                      className="text-3xl md:text-4xl font-serif text-gray-900 mt-12 mb-6 relative"
                    >
                      <span className="relative">
                        {paragraph.replace('## ', '')}
                        <span className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-[#663399] to-[#c45824] rounded-full" />
                      </span>
                    </h3>
                  )
                }
                if (paragraph.trim() === '') {
                  return <div key={index} className="h-6" />
                }
                return (
                  <p 
                    key={index} 
                    className="mb-8 leading-9 text-gray-700 first-letter:text-6xl first-letter:font-serif first-letter:text-[#663399] first-letter:float-left first-letter:mr-3 first-letter:leading-none"
                  >
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Footer spettacolare */}
          <footer className="pt-16 border-t-2 border-gray-200 animate-fade-in-up-delay-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <Link
                href="/news"
                className="group flex items-center gap-3 text-[#663399] hover:text-[#c45824] transition-all duration-300 font-semibold text-lg"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#663399] to-[#c45824] flex items-center justify-center transform group-hover:-translate-x-2 transition-transform duration-300 shadow-lg">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
                <span>Torna alle News</span>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-6 py-3 rounded-full">
                <svg className="w-5 h-5 text-[#663399]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <time className="font-medium">Pubblicato il {formattedDate}</time>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </article>
  )
}
