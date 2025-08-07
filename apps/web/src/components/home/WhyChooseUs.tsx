import { Check, Star, Users, Clock, Shield, Award } from 'lucide-react'

export function WhyChooseUs() {
  const reasons = [
    {
      icon: Star,
      title: 'Chất lượng hàng đầu',
      description: 'Được đánh giá 5 sao bởi hàng nghìn khách hàng trên toàn quốc'
    },
    {
      icon: Users,
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Hơn 10 năm kinh nghiệm trong lĩnh vực du lịch và dịch vụ'
    },
    {
      icon: Clock,
      title: 'Hỗ trợ 24/7',
      description: 'Luôn sẵn sàng hỗ trợ khách hàng mọi lúc, mọi nơi'
    },
    {
      icon: Shield,
      title: 'An toàn tuyệt đối',
      description: 'Cam kết đảm bảo an toàn cho mọi chuyến đi của bạn'
    },
    {
      icon: Award,
      title: 'Giá cả cạnh tranh',
      description: 'Đảm bảo giá tốt nhất thị trường với chất lượng dịch vụ vượt trội'
    }
  ]

  const stats = [
    { number: '50,000+', label: 'Khách hàng hài lòng' },
    { number: '1,000+', label: 'Tour đã thực hiện' },
    { number: '99%', label: 'Tỷ lệ hài lòng' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tại sao chọn GoSafe?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời nhất
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reasons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon
            return (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {reason.title}
                </h3>
                <p className="text-gray-600">
                  {reason.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
