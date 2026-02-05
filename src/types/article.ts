export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: Date
  category: string
  image: string
  tags?: string[]
}
