import { Metadata } from 'next'
import Link from 'next/link'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Zap, Eye, Check } from 'lucide-react'


export const metadata: Metadata = {
  title: 'Về chúng tôi - ViLand Travel',
  description: 'Tìm hiểu về ViLand Travel - nền tảng đặt tour du lịch an toàn và tin cậy hàng đầu Việt Nam.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Về ViLand Travel
          </Typography>
          <Typography variant="large" className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-white">
            Nền tảng đặt tour du lịch an toàn và tin cậy hàng đầu Việt Nam
          </Typography>
        </div>
      </Section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900">Sứ mệnh</Typography>
            </div>
            <Typography variant="p" className="text-gray-600 leading-relaxed">
              Mang đến trải nghiệm du lịch an toàn, chất lượng và đáng nhớ cho mọi khách hàng.
              Chúng tôi cam kết xây dựng một nền tảng đáng tin cậy, giúp kết nối du khách với
              những dịch vụ du lịch tốt nhất, từ tour trọn gói đến các dịch vụ riêng lẻ như
              vé máy bay, khách sạn, thuê xe và tài xế.
            </Typography>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary-100 rounded-full mb-4">
                <Eye className="w-8 h-8 text-secondary-600" />
              </div>
              <Typography variant="h2" className="text-2xl font-bold text-gray-900">Tầm nhìn</Typography>
            </div>
            <Typography variant="p" className="text-gray-600 leading-relaxed">
              Trở thành nền tảng du lịch hàng đầu Việt Nam, được tin tưởng bởi hàng triệu
              khách hàng. Chúng tôi hướng đến việc số hóa ngành du lịch, tạo ra một hệ sinh thái
              hoàn chỉnh và hiện đại, nơi mọi nhu cầu du lịch đều được đáp ứng một cách
              thuận tiện và an toàn nhất.
            </Typography>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-12">Giá trị cốt lõi</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🛡️',
                title: 'An toàn',
                description: 'Đặt sự an toàn của khách hàng lên hàng đầu trong mọi hoạt động'
              },
              {
                icon: '🤝',
                title: 'Tin cậy',
                description: 'Xây dựng lòng tin thông qua dịch vụ chất lượng và minh bạch'
              },
              {
                icon: '💡',
                title: 'Sáng tạo',
                description: 'Không ngừng đổi mới để mang đến trải nghiệm tốt nhất'
              },
              {
                icon: '❤️',
                title: 'Tận tâm',
                description: 'Phục vụ với tất cả sự tận tâm và chuyên nghiệp'
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-3">{value.title}</Typography>
                <Typography variant="p" className="text-gray-600">{value.description}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Company Stats */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-12">ViLand Travel trong con số</Typography>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50,000+', label: 'Khách hàng hài lòng' },
              { number: '200+', label: 'Đối tác tin cậy' },
              { number: '5+', label: 'Năm kinh nghiệm' },
              { number: '99%', label: 'Tỷ lệ hài lòng' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <Typography variant="p" className="text-gray-600">{stat.label}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-12">Đội ngũ lãnh đạo</Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Nguyễn Văn An',
                position: 'CEO & Founder',
                bio: '10+ năm kinh nghiệm trong ngành du lịch và công nghệ',
                image: '👨‍💼'
              },
              {
                name: 'Trần Thị Bình',
                position: 'CTO',
                bio: 'Chuyên gia công nghệ với kinh nghiệm phát triển platform',
                image: '👩‍💻'
              },
              {
                name: 'Lê Văn Cường',
                position: 'Head of Operations',
                bio: 'Quản lý vận hành và quan hệ đối tác chiến lược',
                image: '👨‍💼'
              }
            ].map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-2">{member.name}</Typography>
                <Typography variant="p" className="text-primary-600 font-medium mb-3">{member.position}</Typography>
                <Typography variant="p" className="text-gray-600 text-sm">{member.bio}</Typography>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Awards */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-12">Chứng nhận & Giải thưởng</Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Giấy phép kinh doanh lữ hành',
                description: 'Được cấp bởi Tổng cục Du lịch Việt Nam'
              },
              {
                title: 'Chứng nhận ISO 9001:2015',
                description: 'Hệ thống quản lý chất lượng quốc tế'
              },
              {
                title: 'Top 10 Startup Du lịch 2023',
                description: 'Vinh danh bởi Vietnam Tourism Awards'
              },
              {
                title: 'Chứng nhận an toàn thông tin',
                description: 'Bảo mật dữ liệu khách hàng theo chuẩn quốc tế'
              },
              {
                title: 'Thành viên VITA',
                description: 'Hiệp hội Du lịch Việt Nam'
              },
              {
                title: 'Partner chính thức',
                description: 'Của các hãng hàng không và khách sạn lớn'
              }
            ].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <Check className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-gray-600 text-sm">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg p-8 text-center text-white">
          <Typography variant="h2" className="text-3xl font-bold mb-4">Bắt đầu hành trình cùng ViLand Travel</Typography>
          <Typography variant="large" className="text-xl opacity-90 mb-8">
            Khám phá thế giới với sự an toàn và tin cậy
          </Typography>
          <div className="space-x-4">
            <Button className="bg-white text-primary-600 px-8 py-3 font-semibold hover:bg-gray-100">Liên hệ ngay</Button>
            <Button variant="outline" className="border-2 border-white text-white px-8 py-3 font-semibold hover:bg-white hover:text-primary-600">Xem tour hot</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
