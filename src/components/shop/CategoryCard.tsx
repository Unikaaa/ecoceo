import Link from 'next/link'

interface Category {
  id: string
  name: string
  description: string
  image: string
  slug: string
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {

  return (
    <Link
      href={`/shop/${category.slug}`}
      className="group block bg-white rounded-artistic overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
    >
      <div className="aspect-video bg-gradient-to-br from-ceramic-beige via-ceramic-white to-ceramic-sand flex items-center justify-center relative overflow-hidden">
        <span className="text-gray-400 text-sm font-medium relative z-10">Immagine</span>
        {/* Overlay hover elegante */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 md:p-8">
        <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
          {category.name}
        </h3>
        <p className="text-gray-600 text-sm md:text-base leading-relaxed">
          {category.description}
        </p>
        <div className="flex items-center gap-2 mt-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Esplora</span>
          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
