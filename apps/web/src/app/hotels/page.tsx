import { Metadata } from 'next'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import HotelBookingClient from './components/HotelBookingClient'

export const metadata: Metadata = {
  title: 'Booking khách sạn - GoSafe',
  description: 'Tìm kiếm và đặt phòng khách sạn với giá tốt nhất tại GoSafe.',
}

export default function HotelsPage() {
  return (
    <Section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
            Booking khách sạn
          </Typography>
          <Typography variant="large" className="text-xl text-gray-600">
            Tìm kiếm và đặt phòng khách sạn với giá tốt nhất
          </Typography>
        </div>

        <HotelBookingClient />
      </div>
    </Section>
  )
}
