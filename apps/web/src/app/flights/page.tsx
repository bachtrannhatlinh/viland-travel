import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Vé máy bay giá rẻ - GoSafe',
  description: 'Tìm kiếm và đặt vé máy bay đến mọi điểm đến trên thế giới với giá tốt nhất.',
}

export default function FlightsPage() {
  return (
    <Section className="min-h-screen bg-gray-50">
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="text-center mb-12">
          <CardContent className="p-8">
            <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
              Vé máy bay giá rẻ
            </Typography>
            <Typography variant="large" className="text-xl text-gray-600">
              Tìm kiếm và đặt vé máy bay đến mọi điểm đến trên thế giới
            </Typography>
          </CardContent>
        </Card>

        {/* Flight Search Form - Temporary Simple Form */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <Section className="text-center">
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
                Tìm chuyến bay
              </Typography>
              <Typography className="text-gray-600 mb-8">
                Form tìm kiếm chuyến bay đang được phát triển
              </Typography>
              <Button asChild size="lg">
                <Link href="/flights/search?demo=true" prefetch={true}>
                  Xem demo kết quả tìm kiếm
                </Link>
              </Button>
            </Section>
          </CardContent>
        </Card>
         {/* Popular Destinations */}
        <Section className="mb-12">
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-6">
            Điểm đến phổ biến
          </Typography>
          <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <Card key={destination.code} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <Section className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <Typography variant="h2" className="text-white text-2xl font-bold">
                    {destination.code}
                  </Typography>
                </Section>
                <CardContent className="p-4">
                  <Typography variant="h3" className="font-bold text-lg">
                    {destination.city}
                  </Typography>
                  <Typography className="text-gray-600">
                    {destination.country}
                  </Typography>
                  <Typography className="text-primary-600 font-semibold mt-2">
                    Từ {destination.price.toLocaleString('vi-VN')} VND
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Section>
        </Section>

        {/* Features */}
        <Section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Section className="text-center">
            <Section className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Section>
            <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-2">
              Tìm kiếm thông minh
            </Typography>
            <Typography className="text-gray-600">
              So sánh giá từ hàng trăm hãng hàng không để tìm ưu đãi tốt nhất
            </Typography>
          </Section>
          
          <Section className="text-center">
            <Section className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Section>
            <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-2">
              Đặt vé an toàn
            </Typography>
            <Typography className="text-gray-600">
              Hệ thống thanh toán bảo mật và chính sách hoàn tiền linh hoạt
            </Typography>
          </Section>
          
          <Section className="text-center">
            <Section className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 9.75 9.75c0-.372-.036-.74-.103-1.103a9.75 9.75 0 0 0-9.647-8.647Z" />
              </svg>
            </Section>
            <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-2">
              Hỗ trợ 24/7
            </Typography>
            <Typography className="text-gray-600">
              Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc
            </Typography>
          </Section>
        </Section>
      </Section>
    </Section>
  )
}

const popularDestinations = [
  {
    code: 'SGN',
    city: 'Hồ Chí Minh',
    country: 'Việt Nam',
    price: 1200000
  },
  {
    code: 'HAN',
    city: 'Hà Nội',
    country: 'Việt Nam', 
    price: 1500000
  },
  {
    code: 'DAD',
    city: 'Đà Nẵng',
    country: 'Việt Nam',
    price: 900000
  },
  {
    code: 'BKK',
    city: 'Bangkok',
    country: 'Thái Lan',
    price: 3200000
  }
]
