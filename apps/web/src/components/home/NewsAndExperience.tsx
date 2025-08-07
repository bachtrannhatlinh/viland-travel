import Link from 'next/link'
import { Calendar, User, ArrowRight } from 'lucide-react'

export function NewsAndExperience() {
  const news = [
    {
      id: 1,
      title: 'Top 10 điểm đến hấp dẫn nhất Việt Nam năm 2024',
      excerpt: 'Khám phá những điểm đến tuyệt vời nhất mà bạn không thể bỏ lỡ trong năm 2024...',
      image: '/images/news/vietnam-destinations.jpg',
      date: '2024-01-15',
      author: 'Admin GoSafe',
      category: 'Kiến thức du lịch'
    },
    {
      id: 2,
      title: 'Kinh nghiệm du lịch bụi với chi phí tiết kiệm',
      excerpt: 'Chia sẻ những mẹo hay để có chuyến du lịch tiết kiệm nhưng vẫn đầy đủ trải nghiệm...',
      image: '/images/news/budget-travel.jpg',
      date: '2024-01-10',
      author: 'Travel Expert',
      category: 'Tips & Tricks'
    },
    {
      id: 3,
      title: 'Cẩm nang chuẩn bị hành lý du lịch hoàn hảo',
      excerpt: 'Hướng dẫn chi tiết cách chuẩn bị hành lý thông minh cho mọi loại hình du lịch...',
      image: '/images/news/packing-guide.jpg',
      date: '2024-01-05',
      author: 'Travel Guide',
      category: 'Hướng dẫn'
    }
  ]

  const experiences = [
    {
      name: 'Nguyễn Văn A',
      location: 'TP.HCM',
      rating: 5,
      comment: 'Dịch vụ tuyệt vời! Tour Đà Lạt 3N2Đ rất đáng giá. Hướng dẫn viên nhiệt tình, lịch trình hợp lý.',
      tour: 'Tour Đà Lạt 3N2Đ',
      avatar: '/images/avatars/user1.jpg'
    },
    {
      name: 'Trần Thị B',
      location: 'Hà Nội',
      rating: 5,
      comment: 'Đặt vé máy bay qua GoSafe rất tiện lợi, giá cả hợp lý. Sẽ tiếp tục sử dụng dịch vụ.',
      tour: 'Vé máy bay HN-SGN',
      avatar: '/images/avatars/user2.jpg'
    },
    {
      name: 'Lê Văn C',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Thuê xe từ GoSafe rất an toàn, xe mới, tài xế lái cẩn thận. Giá cả phải chăng.',
      tour: 'Thuê xe 7 chỗ',
      avatar: '/images/avatars/user3.jpg'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* News & Knowledge */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tin tức & Kiến thức
              </h2>
              <p className="text-gray-600">
                Cập nhật những thông tin mới nhất về du lịch và chia sẻ kinh nghiệm hữu ích
              </p>
            </div>

            <div className="space-y-6">
              {news.map((article) => (
                <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="flex">
                    <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                      {/* Placeholder for image */}
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600"></div>
                    </div>
                    <div className="flex-1 p-4">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(article.date).toLocaleDateString('vi-VN')}
                        <span className="mx-2">•</span>
                        <User className="h-4 w-4 mr-1" />
                        {article.author}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {article.excerpt}
                      </p>
                      <Link 
                        href={`/blog/${article.id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center"
                      >
                        Đọc thêm <ArrowRight className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/blog"
                className="btn-primary inline-flex items-center"
              >
                Xem tất cả tin tức <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Customer Experiences */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Khách hàng đã trải nghiệm
              </h2>
              <p className="text-gray-600">
                Chia sẻ từ những khách hàng đã sử dụng dịch vụ của chúng tôi
              </p>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0">
                      {/* Placeholder for avatar */}
                      <div className="w-full h-full bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h4 className="font-semibold text-gray-900">{exp.name}</h4>
                        <span className="text-sm text-gray-500 ml-2">• {exp.location}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        {[...Array(exp.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">{exp.tour}</span>
                      </div>
                      <p className="text-gray-700 text-sm italic">
                        "{exp.comment}"
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link 
                href="/reviews"
                className="btn-secondary inline-flex items-center"
              >
                Xem thêm đánh giá <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
