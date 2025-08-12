import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: 'Tour du lịch - GoSafe',
  description: 'Khám phá các tour du lịch hấp dẫn với GoSafe. Trải nghiệm những chuyến đi đáng nhớ.',
}

export default function ToursPage() {
  return (
    <Section className="min-h-screen bg-gray-50">
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Section className="text-center mb-12">
          <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
            Tour du lịch
          </Typography>
          <Typography variant="large" className="text-xl text-gray-600">
            Khám phá những điểm đến tuyệt vời cùng GoSafe
          </Typography>
        </Section>

        {/* Tours Grid */}
        <Section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Sample Tour 1 */}
          <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Section className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <Typography variant="large" className="text-white text-xl font-bold">Hà Nội</Typography>
            </Section>
            <CardContent className="p-6">
              <Section className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Phổ biến
                </Badge>
                <Section className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <Typography variant="small" className="text-sm text-gray-600">4.8 (256)</Typography>
                </Section>
              </Section>
              <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                Tour Hà Nội - Hạ Long 3 ngày 2 đêm
              </Typography>
              <Typography variant="p" className="text-gray-600 text-sm mb-4">
                Khám phá thủ đô ngàn năm văn hiến và kỳ quan thiên nhiên thế giới Vịnh Hạ Long...
              </Typography>
              <Section className="flex items-center justify-between mb-4">
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">3 ngày 2 đêm</Typography>
                </Section>
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">Hà Nội</Typography>
                </Section>
              </Section>
              <Section className="flex items-center justify-between">
                <Section>
                  <Typography variant="large" className="text-2xl font-bold text-primary-600">2,500,000₫</Typography>
                  <Typography variant="small" className="text-sm text-gray-500 line-through ml-2">2,800,000₫</Typography>
                </Section>
                <Button variant="outline" size="sm" disabled>
                  Sắp ra mắt
                </Button>
              </Section>
            </CardContent>
          </Card>

          {/* Sample Tour 2 */}
          <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Section className="h-48 bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center">
              <Typography variant="large" className="text-white text-xl font-bold">Sapa</Typography>
            </Section>
            <CardContent className="p-6">
              <Section className="flex items-center justify-between mb-2">
                <Badge variant="default" className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">
                  Mới
                </Badge>
                <Section className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <Typography variant="small" className="text-sm text-gray-600">4.9 (89)</Typography>
                </Section>
              </Section>
              <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                Tour Sapa - Fansipan 2 ngày 1 đêm
              </Typography>
              <Typography variant="p" className="text-gray-600 text-sm mb-4">
                Chinh phục nóc nhà Đông Dương, khám phá văn hóa các dân tộc thiểu số...
              </Typography>
              <Section className="flex items-center justify-between mb-4">
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">2 ngày 1 đêm</Typography>
                </Section>
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">Sapa</Typography>
                </Section>
              </Section>
              <Section className="flex items-center justify-between">
                <Section>
                  <Typography variant="large" className="text-2xl font-bold text-primary-600">1,800,000₫</Typography>
                </Section>
                <Button variant="outline" size="sm" disabled>
                  Sắp ra mắt
                </Button>
              </Section>
            </CardContent>
          </Card>

          {/* Sample Tour 3 */}
          <Card className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Section className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
              <Typography variant="large" className="text-white text-xl font-bold">Đà Nẵng</Typography>
            </Section>
            <CardContent className="p-6">
              <Section className="flex items-center justify-between mb-2">
                <Badge variant="default" className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Khuyến mãi
                </Badge>
                <Section className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <Typography variant="small" className="text-sm text-gray-600">4.7 (124)</Typography>
                </Section>
              </Section>
              <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                Tour Đà Nẵng - Hội An 4 ngày 3 đêm
              </Typography>
              <Typography variant="p" className="text-gray-600 text-sm mb-4">
                Tận hưởng bãi biển tuyệt đẹp, khám phá phố cổ Hội An và thưởng thức ẩm thực miền Trung...
              </Typography>
              <Section className="flex items-center justify-between mb-4">
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">4 ngày 3 đêm</Typography>
                </Section>
                <Section className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <Typography variant="small">Đà Nẵng</Typography>
                </Section>
              </Section>
              <Section className="flex items-center justify-between">
                <Section>
                  <Typography variant="large" className="text-2xl font-bold text-primary-600">3,200,000₫</Typography>
                  <Typography variant="small" className="text-sm text-gray-500 line-through ml-2">3,800,000₫</Typography>
                </Section>
                <Button variant="outline" size="sm" disabled>
                  Sắp ra mắt
                </Button>
              </Section>
            </CardContent>
          </Card>
        </Section>

        {/* Call to Action */}
        <Card className="text-center py-16 bg-white rounded-lg shadow-md">
          <CardContent>
            <Section className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Section>
            <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
              Thêm nhiều tour hấp dẫn sắp ra mắt
            </Typography>
            <Typography variant="p" className="text-gray-600 mb-8 max-w-md mx-auto">
              Chúng tôi đang cập nhật thêm nhiều tour du lịch mới nhất và hấp dẫn nhất. 
              Đăng ký nhận thông báo để không bỏ lỡ các ưu đãi đặc biệt.
            </Typography>
            <Section className="space-x-4">
              <Button>Đăng ký nhận tin</Button>
              <Button variant="secondary">Liên hệ tư vấn</Button>
            </Section>
          </CardContent>
        </Card>
      </Section>
    </Section>
  )
}
