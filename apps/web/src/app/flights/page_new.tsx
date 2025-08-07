'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FlightSearchParams } from '@/types/flight.types'

export default function FlightsPage() {
  const router = useRouter()
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (searchParams: FlightSearchParams) => {
    setIsSearching(true)
    
    // Tạo query string từ search params
    const queryParams = new URLSearchParams({
      from: searchParams.from,
      to: searchParams.to,
      departureDate: searchParams.departureDate,
      adults: searchParams.passengers.adults.toString(),
      children: searchParams.passengers.children.toString(),
      infants: searchParams.passengers.infants.toString(),
      class: searchParams.flightClass,
      tripType: searchParams.tripType,
      ...(searchParams.returnDate && { returnDate: searchParams.returnDate })
    })

    // Chuyển hướng đến trang kết quả tìm kiếm
    router.push(`/flights/search?${queryParams.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Vé máy bay giá rẻ
          </h1>
          <p className="text-xl text-gray-600">
            Tìm kiếm và đặt vé máy bay đến mọi điểm đến trên thế giới
          </p>
        </div>

        {/* Flight Search Form - Temporary Simple Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tìm chuyến bay
            </h2>
            <p className="text-gray-600 mb-8">
              Form tìm kiếm chuyến bay đang được phát triển
            </p>
            <button 
              onClick={() => router.push('/flights/search?demo=true')}
              className="btn-primary px-8 py-3"
            >
              Xem demo kết quả tìm kiếm
            </button>
          </div>
        </div>

        {/* Popular Destinations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Điểm đến phổ biến</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((destination) => (
              <div key={destination.code} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="w-full h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{destination.code}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg">{destination.city}</h3>
                  <p className="text-gray-600">{destination.country}</p>
                  <p className="text-primary-600 font-semibold mt-2">
                    Từ {destination.price.toLocaleString('vi-VN')} VND
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tìm kiếm thông minh</h3>
            <p className="text-gray-600">So sánh giá từ hàng trăm hãng hàng không để tìm ưu đãi tốt nhất</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Đặt vé an toàn</h3>
            <p className="text-gray-600">Hệ thống thanh toán bảo mật và chính sách hoàn tiền linh hoạt</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 1 0 9.75 9.75c0-.372-.036-.74-.103-1.103a9.75 9.75 0 0 0-9.647-8.647Z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hỗ trợ 24/7</h3>
            <p className="text-gray-600">Đội ngũ tư vấn chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc</p>
          </div>
        </div>
      </div>
    </div>
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
