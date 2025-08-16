import { Metadata } from 'next'
import { Typography } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Section } from '@/components/ui/section'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Blog - Tin tức & Kiến thức Du lịch - ViLand Travel',
  description: 'Cập nhật tin tức du lịch mới nhất, kiến thức hữu ích và kinh nghiệm từ cộng đồng ViLand Travel.',
}

export default function BlogPage() {
  const featuredPosts = [
    {
      id: 1,
      title: '10 điểm đến không thể bỏ qua tại Việt Nam năm 2024',
      excerpt: 'Khám phá những điểm đến tuyệt vời nhất Việt Nam với những trải nghiệm độc đáo và ý nghĩa.',
      image: '🏞️',
      category: 'Điểm đến',
      readTime: '5 phút đọc',
      date: '15/12/2023'
    },
    {
      id: 2,
      title: 'Hướng dẫn du lịch tiết kiệm cho sinh viên',
      excerpt: 'Những mẹo hay giúp sinh viên có thể du lịch với chi phí tối ưu mà vẫn trải nghiệm tuyệt vời.',
      image: '🎒',
      category: 'Mẹo du lịch',
      readTime: '7 phút đọc',
      date: '12/12/2023'
    },
    {
      id: 3,
      title: 'Top 5 khách sạn boutique đẹp nhất Sài Gòn',
      excerpt: 'Những khách sạn boutique với thiết kế độc đáo và dịch vụ tuyệt vời tại thành phố Hồ Chí Minh.',
      image: '🏨',
      category: 'Khách sạn',
      readTime: '6 phút đọc',
      date: '10/12/2023'
    }
  ]

  const blogPosts = [
    {
      id: 4,
      title: 'Kinh nghiệm du lịch Phú Quốc tự túc',
      excerpt: 'Chia sẻ kinh nghiệm du lịch đảo ngọc Phú Quốc với chi phí hợp lý và lịch trình tối ưu.',
      category: 'Kinh nghiệm',
      readTime: '8 phút đọc',
      date: '08/12/2023'
    },
    {
      id: 5,
      title: 'Cẩm nang du lịch Đà Lạt mùa khô',
      excerpt: 'Hướng dẫn chi tiết để có chuyến du lịch Đà Lạt hoàn hảo trong mùa khô.',
      category: 'Cẩm nang',
      readTime: '10 phút đọc',
      date: '05/12/2023'
    },
    {
      id: 6,
      title: 'Ẩm thực đường phố Hà Nội không thể bỏ qua',
      excerpt: 'Khám phá những món ăn đường phố đặc trưng và địa điểm ăn uống nổi tiếng tại Hà Nội.',
      category: 'Ẩm thực',
      readTime: '6 phút đọc',
      date: '03/12/2023'
    },
    {
      id: 7,
      title: 'Bí quyết chụp ảnh du lịch ấn tượng',
      excerpt: 'Những mẹo và kỹ thuật giúp bạn có những bức ảnh du lịch đẹp và chuyên nghiệp.',
      category: 'Photography',
      readTime: '5 phút đọc',
      date: '01/12/2023'
    },
    {
      id: 8,
      title: 'Du lịch bền vững - xu hướng mới của ngành du lịch',
      excerpt: 'Tìm hiểu về xu hướng du lịch bền vững và cách du lịch có trách nhiệm với môi trường.',
      category: 'Xu hướng',
      readTime: '7 phút đọc',
      date: '28/11/2023'
    },
    {
      id: 9,
      title: 'Checklist chuẩn bị hành lý du lịch',
      excerpt: 'Danh sách đầy đủ những vật dụng cần thiết cho chuyến du lịch hoàn hảo.',
      category: 'Mẹo du lịch',
      readTime: '4 phút đọc',
      date: '25/11/2023'
    }
  ]

  const categories = [
    'Tất cả',
    'Điểm đến',
    'Mẹo du lịch',
    'Kinh nghiệm',
    'Ẩm thực',
    'Khách sạn',
    'Cẩm nang',
    'Photography',
    'Xu hướng'
  ]

  return (
    <Section className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-6">
            Blog Du lịch ViLand Travel
          </Typography>
          <Typography variant="large" className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Khám phá thế giới qua những câu chuyện, kinh nghiệm và mẹo hay từ cộng đồng ViLand Travel
          </Typography>
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button variant="ghost" size="sm" className="absolute right-2 top-2 p-2 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Posts */}
        <div className="mb-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-8">Bài viết nổi bật</Typography>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                  <Typography variant="large" className="text-6xl">{post.image}</Typography>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="secondary">
                      {post.category}
                    </Badge>
                    <Typography variant="small" className="text-gray-500">{post.date}</Typography>
                  </div>
                  <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer">
                    {post.title}
                  </Typography>
                  <Typography variant="p" className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</Typography>
                  <div className="flex items-center justify-between">
                    <Typography variant="small" className="text-gray-500">{post.readTime}</Typography>
                    <Button variant="link" className="p-0 h-auto text-primary-600 font-medium hover:text-primary-700">
                      Đọc tiếp →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === 'Tất cả' ? 'default' : 'outline'}
                size="sm"
                className={`rounded-full text-sm font-medium transition-colors`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline">
                    {post.category}
                  </Badge>
                  <Typography variant="small" className="text-gray-500">{post.date}</Typography>
                </div>
                <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 cursor-pointer">
                  {post.title}
                </Typography>
                <Typography variant="p" className="text-gray-600 mb-4">{post.excerpt}</Typography>
                <div className="flex items-center justify-between">
                  <Typography variant="small" className="text-gray-500">{post.readTime}</Typography>
                  <Button variant="link" className="p-0 h-auto text-primary-600 font-medium hover:text-primary-700">
                    Đọc tiếp →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button className="px-8 py-3">
            Xem thêm bài viết
          </Button>
        </div>

        {/* Newsletter Signup */}
        <Card className="mt-16">
          <CardContent className="text-center p-8">
            <Typography variant="h3" className="text-2xl font-bold text-gray-900 mb-4">
              Đăng ký nhận tin tức du lịch
            </Typography>
            <Typography variant="p" className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nhận những bài viết mới nhất, ưu đãi độc quyền và mẹo du lịch hữu ích 
              từ ViLand Travel ngay trong hộp thư của bạn.
            </Typography>
            <div className="max-w-md mx-auto flex gap-3">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1"
              />
              <Button className="px-6 py-3 whitespace-nowrap">
                Đăng ký
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Hệ thống blog đang hoàn thiện
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang xây dựng một nền tảng blog phong phú với những câu chuyện du lịch 
            và kinh nghiệm thực tế từ cộng đồng.
          </Typography>
          <div className="space-x-4">
            <Button>Theo dõi fanpage</Button>
            <Button variant="secondary">Quay về trang chủ</Button>
          </div>
        </div>
      </div>
    </Section>
  )
}
