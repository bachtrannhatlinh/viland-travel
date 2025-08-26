'use client'

import Image from 'next/image'
import { Section } from '@/components/ui/section'

export function HeroSection() {
  return (
    <Section
      variant="hero"
      className="relative w-full bg-[#FFF9E5] flex justify-center items-center"
      style={{ minHeight: '200px', maxHeight: '600px', padding: 0 }}
    >
      <div className="relative w-full h-auto aspect-[1884/584] max-w-[1884px]">
        <Image
          src="/images/banner.jpg"
          alt="Banner"
          fill
          priority
          className="object-contain"
          sizes="100vw"
        />
      </div>
    </Section>
  )
}
