'use client'

import { useState, lazy, Suspense } from 'react'
import { Typography } from '@/components/ui/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

// Lazy load heavy components
const HotelSearch = lazy(() => import('../../../components/hotels/HotelSearch'))
const HotelList = lazy(() => import('../../../components/hotels/HotelList'))
const RoomSelection = lazy(() => import('../../../components/hotels/RoomSelection'))
const BookingForm = lazy(() => import('../../../components/hotels/BookingForm'))
const PaymentProcess = lazy(() => import('../../../components/hotels/PaymentProcess'))

type BookingStep = 'search' | 'results' | 'rooms' | 'booking' | 'payment' | 'confirmation'

interface SearchData {
  destination: string
  checkIn: string
  checkOut: string
  rooms: number
  adults: number
  children: number
}

export default function HotelBookingClient() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('search')
  const [searchData, setSearchData] = useState<SearchData | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingData, setBookingData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (data: SearchData) => {
    setLoading(true)
    setSearchData(data)
    
    try {
      // Simulate API call with shorter delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // Mock results - in real app this would come from API
      const results = [
        {
          id: '1',
          name: 'The Grand Hotel Saigon',
          description: 'Khách sạn cao cấp 5 sao với view thành phố tuyệt đẹp',
          starRating: 5,
          rating: 9.2,
          reviewCount: 1250,
          location: {
            address: '8 Đồng Khởi, Bến Nghé, Quận 1',
            city: 'TP. Hồ Chí Minh',
            country: 'Việt Nam'
          },
          startingPrice: 2500000
        },
        {
          id: '2', 
          name: 'Liberty Central Saigon Centre',
          description: 'Khách sạn boutique 4 sao với thiết kế hiện đại',
          starRating: 4,
          rating: 8.8,
          reviewCount: 890,
          location: {
            address: '179 Nguyễn Thị Minh Khai, Phường 6, Quận 3',
            city: 'TP. Hồ Chí Minh',
            country: 'Việt Nam'
          },
          startingPrice: 1800000
        }
      ]
      
      setSearchResults(results)
      setCurrentStep('results')
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectHotel = (hotel: any) => {
    setSelectedHotel(hotel)
    setCurrentStep('rooms')
  }

  const handleSelectRoom = (room: any, quantity: number) => {
    setSelectedRoom({ room, quantity })
    setCurrentStep('booking')
  }

  const handleSubmitBooking = (data: any) => {
    setBookingData(data)
    setCurrentStep('payment')
  }

  const handlePaymentComplete = (result: any) => {
    if (result.success) {
      setCurrentStep('confirmation')
    } else {
      console.error('Payment failed:', result.message)
    }
  }

  const handleBackToSearch = () => {
    setCurrentStep('search')
    setSearchResults([])
    setSelectedHotel(null)
    setSelectedRoom(null)
    setBookingData(null)
  }

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  )

  if (currentStep === 'search') {
    return (
      <Card>
        <CardContent className="p-8">
          <Suspense fallback={<LoadingSpinner />}>
            <HotelSearch onSearch={handleSearch} loading={loading} />
          </Suspense>
        </CardContent>
      </Card>
    )
  }

  if (currentStep === 'results' && searchData) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToSearch}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Tìm kiếm mới
          </Button>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-2">
            Kết quả tìm kiếm khách sạn
          </Typography>
          <Typography variant="p" className="text-gray-600">
            {searchResults.length} khách sạn được tìm thấy tại {searchData.destination || 'tất cả điểm đến'}
          </Typography>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Suspense fallback={<LoadingSpinner />}>
              <HotelSearch onSearch={handleSearch} loading={loading} />
            </Suspense>
          </CardContent>
        </Card>
        
        <Suspense fallback={<LoadingSpinner />}>
          <HotelList
            hotels={searchResults}
            loading={loading}
            onSelectHotel={handleSelectHotel}
          />
        </Suspense>
      </div>
    )
  }

  if (currentStep === 'rooms' && selectedHotel && searchData) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <RoomSelection
          hotel={selectedHotel}
          searchData={searchData}
          onBack={() => setCurrentStep('results')}
          onSelectRoom={handleSelectRoom}
        />
      </Suspense>
    )
  }

  if (currentStep === 'booking' && selectedHotel && selectedRoom && searchData) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <BookingForm
          hotel={selectedHotel}
          room={selectedRoom.room}
          quantity={selectedRoom.quantity}
          searchData={searchData}
          onBack={() => setCurrentStep('rooms')}
          onSubmitBooking={handleSubmitBooking}
        />
      </Suspense>
    )
  }

  if (currentStep === 'payment' && bookingData) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <PaymentProcess
          bookingData={bookingData}
          onBack={() => setCurrentStep('booking')}
          onPaymentComplete={handlePaymentComplete}
        />
      </Suspense>
    )
  }

  if (currentStep === 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Đặt phòng thành công!
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8">
            Cảm ơn bạn đã sử dụng dịch vụ của GoSafe. Thông tin đặt phòng đã được gửi về email của bạn.
          </Typography>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => window.location.href = '/'}
              className="px-6 py-3"
            >
              Về trang chủ
            </Button>
            <Button
              variant="secondary"
              onClick={handleBackToSearch}
              className="px-6 py-3"
            >
              Đặt phòng mới
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
