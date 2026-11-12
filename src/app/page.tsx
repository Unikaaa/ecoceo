import Hero from '@/components/home/Hero'
import CollectionsGateway from '@/components/home/CollectionsGateway'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Customization from '@/components/home/Customization'
import WorksGallery from '@/components/home/WorksGallery'
import MaterialsTeaser from '@/components/home/MaterialsTeaser'
import CustomProjectTeaser from '@/components/home/CustomProjectTeaser'
import ProfessionalsTeaser from '@/components/home/ProfessionalsTeaser'
import BrandIntro from '@/components/home/BrandIntro'
import CTA from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <CollectionsGateway />
      <FeaturedProducts />
      <Customization />
      <WorksGallery />
      <MaterialsTeaser />
      <CustomProjectTeaser />
      <ProfessionalsTeaser />
      <BrandIntro />
      <CTA />
    </>
  )
}
