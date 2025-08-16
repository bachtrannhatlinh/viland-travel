import Link from 'next/link'
import { Calendar, User, ArrowRight, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'

export function NewsAndExperience() {
  const news = [
    {
      id: 1,
      title: 'Top 10 điểm đến hấp dẫn nhất Việt Nam năm 2024',
      excerpt: 'Khám phá những điểm đến tuyệt vời nhất mà bạn không thể bỏ lỡ trong năm 2024...',
      image: '/images/news/vietnam-destinations.jpg',
      date: '2024-01-15',
      author: 'Admin ViLand Travel',
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
      comment: 'Đặt vé máy bay qua ViLand Travel rất tiện lợi, giá cả hợp lý. Sẽ tiếp tục sử dụng dịch vụ.',
      tour: 'Vé máy bay HN-SGN',
      avatar: '/images/avatars/user2.jpg'
    },
    {
      name: 'Lê Văn C',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Thuê xe từ ViLand Travel rất an toàn, xe mới, tài xế lái cẩn thận. Giá cả phải chăng.',
      tour: 'Thuê xe 7 chỗ',
      avatar: '/images/avatars/user3.jpg'
    }
  ]

  return (
    <Section variant="content" background="gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* News & Knowledge */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-4">
                Tin tức & Kiến thức
              </Typography>
              <Typography variant="p" className="text-gray-600">
                Cập nhật những thông tin mới nhất về du lịch và chia sẻ kinh nghiệm hữu ích
              </Typography>
            </div>

            <div className="space-y-6">
              {news.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex">
                      <div className="w-32 h-24 bg-gray-200 flex-shrink-0">
                        {/* Placeholder for image */}
                        <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600"></div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(article.date).toLocaleDateString('vi-VN')}
                            <Typography variant="small" className="mx-2">•</Typography>
                            <User className="h-4 w-4 mr-1" />
                            {article.author}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <Typography variant="h3" className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </Typography>
                        <Typography variant="small" className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {article.excerpt}
                        </Typography>
                        <Button variant="link" className="p-0 text-primary-600 hover:text-primary-700">
                          Đọc thêm <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button className="inline-flex items-center">
                Xem tất cả tin tức <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Customer Experiences */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-4">
                Khách hàng đã trải nghiệm
              </Typography>
              <Typography variant="p" className="text-gray-600">
                Chia sẻ từ những khách hàng đã sử dụng dịch vụ của chúng tôi
              </Typography>
            </div>

            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0">
                        {/* Placeholder for avatar */}
                        <div className="w-full h-full bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <Typography variant="h4" className="font-semibold text-gray-900">{exp.name}</Typography>
                          <Typography variant="small" className="text-sm text-gray-500 ml-2">• {exp.location}</Typography>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {[...Array(exp.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {exp.tour}
                          </Badge>
                        </div>
                        <Typography variant="small" className="text-gray-700 text-sm italic">
                          &ldquo;{exp.comment}&rdquo;
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild variant="secondary" className="inline-flex items-center">
                <Link href="/reviews">
                  Xem thêm đánh giá <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
