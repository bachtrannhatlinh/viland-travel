import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedServices } from '@/components/home/FeaturedServices'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { NewsAndExperience } from '@/components/home/NewsAndExperience'
import { PartnersAndContact } from '@/components/home/PartnersAndContact'

export default function HomePage() {
  return (
    <div className="space-y-16">
      <HeroSection />
      <FeaturedServices />
      <WhyChooseUs />
      <NewsAndExperience />
      <PartnersAndContact />
    </div>
  )
}
