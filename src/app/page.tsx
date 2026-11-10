import Hero from '@/components/home/Hero'
import BrandIntro from '@/components/home/BrandIntro'
import LinesOverview from '@/components/home/LinesOverview'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import Customization from '@/components/home/Customization'
import ProcessTeaser from '@/components/home/ProcessTeaser'
import MaterialsTeaser from '@/components/home/MaterialsTeaser'
import ProjectsTeaser from '@/components/home/ProjectsTeaser'
import ProfessionalsTeaser from '@/components/home/ProfessionalsTeaser'
import CTA from '@/components/home/CTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandIntro />
      <LinesOverview />
      <FeaturedProducts />
      <Customization />
      <ProcessTeaser />
      <MaterialsTeaser />
      <ProjectsTeaser />
      <ProfessionalsTeaser />
      <CTA />
    </>
  )
}
