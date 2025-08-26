import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedServices } from '@/components/home/FeaturedServices'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { NewsAndExperience } from '@/components/home/NewsAndExperience'
import { PartnersAndContact } from '@/components/home/PartnersAndContact'
import { Section } from '@/components/ui/section'
import { ListTour } from '@/components/home/ListTour'

export default function HomePage() {
  return (
    <Section className="space-y-16">
      <HeroSection />
      <ListTour />
      <FeaturedServices />
      <WhyChooseUs />
      <NewsAndExperience />
      <PartnersAndContact />
    </Section>
  )
}
