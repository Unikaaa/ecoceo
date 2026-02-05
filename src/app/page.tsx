import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Customization from '@/components/home/Customization'
import Artisan from '@/components/home/Artisan'
import CTA from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Customization />
      <Artisan />
      <CTA />
    </>
  )
}
