import { Plane, MapPin, Building, Car, Shield } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'

export function FeaturedServices() {
  const services = [
    {
      icon: Plane,
      title: 'Vé máy bay',
      description: 'Đặt vé máy bay giá rẻ đến mọi điểm đến trên thế giới',
      link: '/flights',
      color: 'bg-blue-500'
    },
    {
      icon: MapPin,
      title: 'Tour du lịch',
      description: 'Khám phá những tour du lịch hấp dẫn trong và ngoài nước',
      link: '/tours',
      color: 'bg-green-500'
    },
    {
      icon: Building,
      title: 'Khách sạn',
      description: 'Booking khách sạn chất lượng với giá tốt nhất',
      link: '/hotels',
      color: 'bg-purple-500'
    },
    {
      icon: Car,
      title: 'Thuê xe',
      description: 'Dịch vụ thuê xe du lịch an toàn và tiện lợi',
      link: '/car-rental',
      color: 'bg-orange-500'
    },
    {
      icon: Shield,
      title: 'Go_Safe Driver',
      description: 'Dịch vụ lái xe chuyên nghiệp và an toàn',
      link: '/driver-service',
      color: 'bg-red-500'
    }
  ]

  return (
    <Section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Typography variant="h2" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ nổi bật
          </Typography>
          <Typography variant="large" className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp đầy đủ các dịch vụ du lịch để bạn có thể trải nghiệm những chuyến đi hoàn hảo
          </Typography>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow duration-300 text-center group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className={`${service.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </Typography>
                  <Typography variant="small" className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </Typography>
                  <Button variant="link" className="text-primary-600 hover:text-primary-700 p-0">
                    Tìm hiểu thêm →
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
