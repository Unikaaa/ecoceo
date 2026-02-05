import Link from 'next/link'
import Image from 'next/image'
import { Article } from '@/types/article'

interface ArticleCardProps {
  article: Article
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formattedDate = new Date(article.publishedAt).toLocaleDateString('it-IT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block bg-white rounded-artistic overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] relative"
    >
      {/* Bordo gradiente al hover */}
      <div className="absolute inset-0 rounded-artistic bg-gradient-to-r from-[#663399] via-[#c45824] to-[#663399] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
      
      <div className="relative bg-white rounded-artistic overflow-hidden">
        {/* Immagine */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="w-full h-full flex items-center justify-center relative">
            <span className="text-gray-400 text-sm relative z-10">Immagine</span>
          </div>
          {/* Overlay hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#663399]/0 via-[#663399]/15 to-[#663399]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Badge categoria */}
          <div className="absolute top-4 left-4 z-20">
            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-[#663399] rounded-full text-xs font-semibold shadow-lg">
              {article.category}
            </span>
          </div>
        </div>

        {/* Contenuto */}
        <div className="p-6 md:p-8">
          {/* Data */}
          <div className="mb-3">
            <time className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              {formattedDate}
            </time>
          </div>

          {/* Titolo */}
          <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4 group-hover:text-[#663399] transition-colors duration-300 leading-tight line-clamp-2">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
            {article.excerpt}
          </p>

          {/* Footer card */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#663399] via-[#c45824] to-[#663399] p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-[#663399] font-bold text-xs">
                    {article.author.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 text-[#663399] font-semibold text-sm group-hover:text-[#c45824] transition-colors duration-300">
              <span>Leggi</span>
              <svg 
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {article.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs hover:bg-[#663399]/10 hover:text-[#663399] transition-all duration-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
