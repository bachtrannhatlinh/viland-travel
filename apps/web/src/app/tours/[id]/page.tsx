import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - sẽ thay thế bằng API call thực tế
const mockTourData = {
  id: '1',
  title: 'Tour Hạ Long 3 ngày 2 đêm',
  slug: 'tour-ha-long-3-ngay-2-dem',
  shortDescription: 'Khám phá vẻ đẹp thiên nhiên kỳ vĩ của Vịnh Hạ Long với những hang động tuyệt đẹp và làng chài truyền thống.',
  description: 'Tour Hạ Long 3 ngày 2 đêm sẽ đưa bạn khám phá một trong những di sản thiên nhiên thế giới được UNESCO công nhận. Với hành trình đầy thú vị qua các hang động kỳ bí, làng chài cổ kính và những hoạt động thú vị trên vịnh.',
  images: [
    '/api/placeholder/800/400',
    '/api/placeholder/800/400',
    '/api/placeholder/800/400',
    '/api/placeholder/800/400'
  ],
  duration: { days: 3, nights: 2 },
  price: {
    adult: 2500000,
    child: 1875000,
    infant: 500000,
    currency: 'VND'
  },
  discountPrice: {
    adult: 2200000,
    child: 1650000,
    infant: 400000
  },
  destinations: ['Hạ Long', 'Vịnh Lan Hạ', 'Đảo Cát Bà'],
  category: 'adventure',
  difficulty: 'easy',
  maxGroupSize: 25,
  minGroupSize: 4,
  highlights: [
    'Tham quan động Thiên Cung và động Đầu Gỗ',
    'Thưởng thức hải sản tươi ngon',
    'Ngắm hoàng hôn trên vịnh',
    'Trải nghiệm chèo kayak',
    'Thăm làng chài Cửa Vạn'
  ],
  inclusions: [
    'Xe du lịch đời mới có máy lạnh',
    'Khách sạn 3 sao tiêu chuẩn quốc tế',
    'Các bữa ăn theo chương trình',
    'Vé tham quan các điểm trong chương trình',
    'Hướng dẫn viên nhiệt tình, có kinh nghiệm',
    'Bảo hiểm du lịch'
  ],
  exclusions: [
    'Chi phí cá nhân',
    'Đồ uống có cồn',
    'Tip cho hướng dẫn viên và tài xế',
    'Các dịch vụ khác không được nêu trong chương trình'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Hà Nội - Hạ Long - Tham quan Vịnh Hạ Long',
      description: 'Khởi hành từ Hà Nội đi Hạ Long, tham quan vịnh và các hang động',
      activities: [
        '07:30 - Xe đón khách tại điểm hẹn',
        '12:00 - Đến Hạ Long, nhận phòng khách sạn',
        '14:00 - Tham quan động Thiên Cung',
        '16:00 - Du thuyền trên vịnh Hạ Long',
        '18:00 - Ngắm hoàng hôn trên vịnh'
      ],
      meals: ['Trưa', 'Tối'],
      accommodation: 'Khách sạn 3 sao Hạ Long'
    },
    {
      day: 2,
      title: 'Hạ Long - Cát Bà - Vịnh Lan Hạ',
      description: 'Khám phá đảo Cát Bà và vịnh Lan Hạ tuyệt đẹp',
      activities: [
        '08:00 - Ăn sáng tại khách sạn',
        '09:00 - Di chuyển ra đảo Cát Bà',
        '10:30 - Tham quan vịnh Lan Hạ',
        '14:00 - Trải nghiệm chèo kayak',
        '16:00 - Thăm làng chài Cửa Vạn',
        '19:00 - BBQ hải sản trên du thuyền'
      ],
      meals: ['Sáng', 'Trưa', 'Tối'],
      accommodation: 'Du thuyền qua đêm'
    },
    {
      day: 3,
      title: 'Đảo Ti Tốp - Hà Nội',
      description: 'Tham quan đảo Ti Tốp và trở về Hà Nội',
      activities: [
        '08:00 - Ăn sáng trên du thuyền',
        '09:00 - Tham quan đảo Ti Tốp',
        '10:30 - Leo lên đỉnh đảo ngắm toàn cảnh',
        '12:00 - Trở về bến, ăn trưa',
        '13:30 - Khởi hành về Hà Nội',
        '18:00 - Về đến Hà Nội, kết thúc tour'
      ],
      meals: ['Sáng', 'Trưa'],
      accommodation: null
    }
  ],
  availability: [
    {
      startDate: '2025-08-15',
      endDate: '2025-08-17',
      availableSlots: 15,
      isAvailable: true
    },
    {
      startDate: '2025-08-22',
      endDate: '2025-08-24',
      availableSlots: 8,
      isAvailable: true
    },
    {
      startDate: '2025-08-29',
      endDate: '2025-08-31',
      availableSlots: 20,
      isAvailable: true
    }
  ],
  reviews: [
    {
      user: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Tour rất tuyệt vời, hướng dẫn viên nhiệt tình, cảnh đẹp. Sẽ giới thiệu cho bạn bè.',
      createdAt: '2025-07-15'
    },
    {
      user: 'Trần Thị B',
      rating: 4,
      comment: 'Chuyến đi thú vị, đồ ăn ngon. Chỉ tiếc là thời tiết không được thuận lợi.',
      createdAt: '2025-07-10'
    }
  ],
  averageRating: 4.8,
  totalReviews: 156,
  featured: true,
  isActive: true
}

interface TourDetailPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  // Trong thực tế sẽ fetch data từ API
  const tour = mockTourData
  
  return {
    title: `${tour.title} - GoSafe`,
    description: tour.shortDescription,
  }
}

export default function TourDetailPage({ params }: TourDetailPageProps) {
  // Trong thực tế sẽ fetch data từ API dựa trên params.id
  const tour = mockTourData
  
  if (!tour) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} ({tour.totalReviews} đánh giá)
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-primary-600">
                Trang chủ
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link href="/tours" className="ml-1 text-gray-700 hover:text-primary-600">
                  Tour du lịch
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-gray-500 truncate">{tour.title}</span>
              </div>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tour Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {tour.title}
                  </h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>📍 {tour.destinations.join(', ')}</span>
                    <span>⏱️ {tour.duration.days} ngày {tour.duration.nights} đêm</span>
                    <span>👥 {tour.minGroupSize}-{tour.maxGroupSize} người</span>
                  </div>
                  {renderStars(tour.averageRating)}
                </div>
                {tour.featured && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {tour.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                      Ảnh {index + 1}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
            </div>

            {/* Tour Highlights */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Điểm nổi bật</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch trình tour</h2>
              <div className="space-y-6">
                {tour.itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-primary-500 pl-6 pb-6">
                    <div className="flex items-center mb-3">
                      <div className="bg-primary-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-4">
                        {day.day}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">{day.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{day.description}</p>
                    
                    <div className="space-y-2">
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="flex items-start">
                          <svg className="w-4 h-4 text-primary-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700">{activity}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489c.14.56-.619 1.08-1.203.703L6 13.124A2 2 0 014 11V5z" clipRule="evenodd" />
                        </svg>
                        <span>Bữa ăn: {day.meals.join(', ')}</span>
                      </div>
                      {day.accommodation && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm12 6v2H4v-2h12z" clipRule="evenodd" />
                          </svg>
                          <span>Nghỉ đêm: {day.accommodation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Bao gồm
                </h3>
                <ul className="space-y-2">
                  {tour.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Không bao gồm
                </h3>
                <ul className="space-y-2">
                  {tour.exclusions.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-4 h-4 text-red-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá từ khách hàng</h2>
              <div className="space-y-6">
                {tour.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-semibold">
                            {review.user.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user}</h4>
                          <div className="flex items-center mt-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(tour.discountPrice?.adult || tour.price.adult)}
                  </span>
                  {tour.discountPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(tour.price.adult)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Giá cho 1 người lớn</p>
                
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Trẻ em (2-11 tuổi):</span>
                    <span>{formatPrice(tour.discountPrice?.child || tour.price.child)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Em bé (&lt;2 tuổi):</span>
                    <span>{formatPrice(tour.discountPrice?.infant || tour.price.infant)}</span>
                  </div>
                </div>
              </div>

              {/* Available Dates */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Ngày khởi hành</h3>
                <div className="space-y-2">
                  {tour.availability.map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-500 cursor-pointer">
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(date.startDate).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-sm text-gray-600">
                          Còn {date.availableSlots} chỗ
                        </div>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>

              {/* Booking Button */}
              <Link
                href={`/tours/${tour.id}/booking`}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 px-6 rounded-lg font-semibold transition-colors block"
              >
                Đặt tour ngay
              </Link>

              {/* Contact Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Cần hỗ trợ?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>1900 1234</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span>info@gosafe.vn</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
