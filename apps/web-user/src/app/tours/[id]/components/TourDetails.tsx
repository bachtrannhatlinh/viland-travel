import Link from 'next/link'
import Image from 'next/image'

interface TourDetailsProps {
  tour: {
    id: string,
    title: string,
    slug: string,
    description: string,
    short_description: string,
    images: string[] | null,
    duration_days: number,
    duration_nights: number,
    destinations: string[],
    start_location: string | null,
    end_location: string | null,
    price_adult: number,
    price_child: number,
    price_infant: number,
    currency: string,
    discount_adult: number | null,
    discount_child: number | null,
    discount_infant: number | null,
    inclusions: string[],
    exclusions: string[],
    category: string,
    difficulty: string,
    max_group_size: number,
    rating: number,
    total_reviews: number,
    is_featured: boolean,
    is_active: boolean,
    created_at: string,
    updated_at: string,
  }
}

export default function TourDetails({ tour }: TourDetailsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: tour.currency
    }).format(price)
  }

  const calculateDiscountedPrice = (originalPrice: number, discount: number) => {
    return originalPrice - (originalPrice * discount / 100)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-2 text-sm text-gray-600">
          {rating} ({tour.total_reviews} đánh giá)
        </span>
      </div>
    )
  }

  const formatDuration = (durationDays: Date, durationNights: Date) => {
    // Assuming these Date objects contain the number of days/nights
    // You might need to adjust this based on your actual data structure
    const days = durationDays ? new Date(durationDays).getDate() : 0
    const nights = durationNights ? new Date(durationNights).getDate() : 0
    return `${days} ngày ${nights} đêm`
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
                    <span>📍 {tour.destinations?.join(', ') || 'Chưa xác định'}</span>
                    <span>⏱️ {tour.duration_days} ngày {tour.duration_nights} đêm</span>
                    <span>👥 Tối đa {tour.max_group_size} người</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                    <span>🚀 Điểm khởi hành: {tour.start_location || 'Chưa xác định'}</span>
                    <span>🏁 Điểm kết thúc: {tour.end_location || 'Chưa xác định'}</span>
                  </div>
                  {(tour.category || tour.difficulty) && (
                    <div className="flex items-center space-x-2 mb-4">
                      {tour.category && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {tour.category}
                        </span>
                      )}
                      {tour.difficulty && (
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Độ khó: {tour.difficulty}
                        </span>
                      )}
                    </div>
                  )}
                  {renderStars(tour.rating)}
                </div>
                {tour.is_featured && (
                  <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                    Nổi bật
                  </span>
                )}
              </div>

              {/* Image Gallery */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {tour.images && tour.images.length > 0 ? (
                  tour.images.slice(0, 4).map((image, index) => (
                    <div key={index} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                      {image ? (
                        <Image
                          src={image}
                          alt={`${tour.title} - Ảnh ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          Ảnh {index + 1}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  // Fallback khi không có images
                  [...Array(4)].map((_, index) => (
                    <div key={index} className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                        Ảnh {index + 1}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Short Description */}
              {tour.short_description && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">{tour.short_description}</p>
                </div>
              )}

              <p className="text-gray-700 leading-relaxed">{tour.description}</p>
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
                  {tour.inclusions && tour.inclusions.length > 0 ? (
                    tour.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 italic">Chưa có thông tin</li>
                  )}
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
                  {tour.exclusions && tour.exclusions.length > 0 ? (
                    tour.exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-red-500 mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 italic">Chưa có thông tin</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Tour Information */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Thông tin tour</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Mã tour:</span>
                    <span className="text-gray-600">{tour.id}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Thời gian:</span>
                    <span className="text-gray-600">{tour.duration_days} ngày {tour.duration_nights} đêm</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Nhóm tối đa:</span>
                    <span className="text-gray-600">{tour.max_group_size} người</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Đánh giá:</span>
                    <span className="text-gray-600">{tour.rating}/5 ({tour.total_reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Trạng thái:</span>
                    <span className={`text-sm px-2 py-1 rounded ${tour.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {tour.is_active ? 'Đang hoạt động' : 'Tạm dừng'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-700 w-32">Cập nhật:</span>
                    <span className="text-gray-600">{new Date(tour.updated_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {(tour.discount_adult !== null && tour.discount_adult > 0) ? 
                      formatPrice(calculateDiscountedPrice(tour.price_adult, tour.discount_adult)) : 
                      formatPrice(tour.price_adult)
                    }
                  </span>
                  {(tour.discount_adult !== null && tour.discount_adult > 0) && (
                    <div className="text-right">
                      <span className="text-lg text-gray-500 line-through block">
                        {formatPrice(tour.price_adult)}
                      </span>
                      <span className="text-sm text-red-500 font-medium">
                        -{tour.discount_adult}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">Giá cho 1 người lớn</p>

                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Trẻ em (2-11 tuổi):</span>
                    <div className="text-right">
                      <span className={tour.discount_child !== null && tour.discount_child > 0 ? 'line-through text-gray-400' : ''}>
                        {formatPrice(tour.price_child)}
                      </span>
                      {tour.discount_child !== null && tour.discount_child > 0 && (
                        <div>
                          <span className="font-medium">
                            {formatPrice(calculateDiscountedPrice(tour.price_child, tour.discount_child))}
                          </span>
                          <span className="text-red-500 ml-1">(-{tour.discount_child}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span>Em bé (&lt;2 tuổi):</span>
                    <div className="text-right">
                      <span className={tour.discount_infant !== null && tour.discount_infant > 0 ? 'line-through text-gray-400' : ''}>
                        {formatPrice(tour.price_infant)}
                      </span>
                      {tour.discount_infant !== null && tour.discount_infant > 0 && (
                        <div>
                          <span className="font-medium">
                            {formatPrice(calculateDiscountedPrice(tour.price_infant, tour.discount_infant))}
                          </span>
                          <span className="text-red-500 ml-1">(-{tour.discount_infant}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <Link
                href={`/tours/${tour.id}/booking`}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white text-center py-3 px-6 rounded-lg font-semibold transition-colors block mb-4"
              >
                Đặt tour ngay
              </Link>

              <Link
                href={`/tours/${tour.id}/contact`}
                className="w-full border border-primary-600 text-primary-600 hover:bg-primary-50 text-center py-3 px-6 rounded-lg font-semibold transition-colors block"
              >
                Liên hệ tư vấn
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
                    <span>info@vilandtravel.vn</span>
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