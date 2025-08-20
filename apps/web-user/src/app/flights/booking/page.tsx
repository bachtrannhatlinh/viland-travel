'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { FlightClass, PassengerInfo, FlightBookingData } from '@/types/flight.types'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

export default function FlightBookingPage() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<any>(null)
  const [passengers, setPassengers] = useState<PassengerInfo[]>([])
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  const [specialRequests, setSpecialRequests] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)

  useEffect(() => {
    // Get selected flight data from session storage
    const selectedFlightData = sessionStorage.getItem('selectedFlight')
    if (selectedFlightData) {
      const data = JSON.parse(selectedFlightData)
      setBookingData(data)
      
      // Initialize passengers based on search criteria
      const { adults, children, infants } = data.searchCriteria.passengers
      const initialPassengers: PassengerInfo[] = []
      
      // Add adults
      for (let i = 0; i < adults; i++) {
        initialPassengers.push({
          type: 'adult',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'VN',
          passportNumber: '',
          passportExpiry: ''
        })
      }
      
      // Add children
      for (let i = 0; i < children; i++) {
        initialPassengers.push({
          type: 'child',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'VN',
          passportNumber: '',
          passportExpiry: ''
        })
      }
      
      // Add infants
      for (let i = 0; i < infants; i++) {
        initialPassengers.push({
          type: 'infant',
          title: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          nationality: 'VN',
          passportNumber: '',
          passportExpiry: ''
        })
      }
      
      setPassengers(initialPassengers)
      setIsLoading(false)
    } else {
      router.push('/flights')
    }
  }, [router])

  const calculateTotalAmount = () => {
    if (!bookingData) return 0
    
    const flight = bookingData.flight
    const selectedClass = bookingData.selectedClass
    const basePrice = flight.pricing[selectedClass]?.price || flight.pricing[FlightClass.ECONOMY].price
    
    let total = 0
    passengers.forEach(passenger => {
      switch (passenger.type) {
        case 'adult':
          total += basePrice
          break
        case 'child':
          total += basePrice * 0.75 // 25% discount for children
          break
        case 'infant':
          total += basePrice * 0.1 // 90% discount for infants
          break
      }
    })
    
    // Add taxes (10%)
    total += total * 0.1
    
    return total
  }

  const handlePassengerUpdate = (index: number, passengerData: PassengerInfo) => {
    const updatedPassengers = [...passengers]
    updatedPassengers[index] = passengerData
    setPassengers(updatedPassengers)
  }

  const validateBooking = () => {
    // Validate contact info
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ')
      return false
    }
    
    // Validate passengers
    for (const passenger of passengers) {
      if (!passenger.firstName || !passenger.lastName || !passenger.dateOfBirth) {
        alert('Vui lòng điền đầy đủ thông tin hành khách')
        return false
      }
    }
    
    return true
  }

  const addItem = useBookingStore((state) => state.addItem)
  const clear = useBookingStore((state) => state.clear)

  const handleConfirmBooking = () => {
    if (!validateBooking()) return

    const finalBookingData: FlightBookingData = {
      flight: bookingData.flight,
      passengers,
      contactInfo,
      selectedClass: bookingData.selectedClass,
      specialRequests,
      totalAmount: calculateTotalAmount(),
      bookingDate: new Date().toISOString(),
      status: 'pending'
    }

    // Lưu vào Zustand store
    clear() // Xoá các booking cũ nếu cần, chỉ giữ 1 booking flight
    addItem({
      id: bookingData.flight.id,
      type: 'flight',
      name: bookingData.flight.name || bookingData.flight.code || 'Chuyến bay',
      details: finalBookingData,
      quantity: passengers.length,
      price: finalBookingData.totalAmount
    })

    // Navigate to payment page
    router.push('/flights/payment')
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  if (isLoading) {
    return (
      <Section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Typography className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
            <Typography variant="h2" className="text-xl font-bold text-gray-900">
              Đang tải thông tin đặt vé...
            </Typography>
          </CardContent>
        </Card>
      </Section>
    )
  }

  if (!bookingData) {
    return (
      <Section className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center p-8">
          <CardContent>
            <Typography variant="h2" className="text-xl font-bold text-gray-900 mb-4">
              Không tìm thấy thông tin chuyến bay
            </Typography>
            <Button asChild>
              <Link href="/flights">Quay lại trang tìm kiếm</Link>
            </Button>
          </CardContent>
        </Card>
      </Section>
    )
  }

  return (
    <Section className="min-h-screen bg-gray-50">
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3 text-green-600">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-600 text-white font-semibold">
                    ✓
                  </div>
                  <span className="font-medium">Chọn chuyến bay</span>
                </div>
                
                <div className="w-12 h-px bg-primary-600"></div>
                
                <div className="flex items-center space-x-3 text-primary-600">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary-600 text-white font-semibold">
                    2
                  </div>
                  <span className="font-medium">Thông tin hành khách</span>
                </div>
                
                <div className="w-12 h-px bg-gray-300"></div>
                
                <div className="flex items-center space-x-3 text-gray-400">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300 text-white font-semibold">
                    3
                  </div>
                  <span className="font-medium">Thanh toán</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <Section className="lg:col-span-2 space-y-6">
            {/* Flight Information */}
            <Card className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-4">
                Thông tin chuyến bay
              </Typography>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {bookingData.flight.airline.split(' ').map((word: string) => word[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bookingData.flight.airline}</h3>
                      <p className="text-sm text-gray-500">{bookingData.flight.flightNumber}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Khởi hành</p>
                      <p className="font-semibold">{bookingData.flight.departureCity}</p>
                      <p className="text-gray-600">
                        {formatDate(bookingData.flight.departureDate)} • {formatTime(bookingData.flight.departureDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Đến</p>
                      <p className="font-semibold">{bookingData.flight.arrivalCity}</p>
                      <p className="text-gray-600">
                        {formatDate(bookingData.flight.arrivalDate)} • {formatTime(bookingData.flight.arrivalDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Hạng vé</div>
                  <div className="font-semibold text-primary-600">
                    {bookingData.selectedClass === FlightClass.ECONOMY ? 'Phổ thông' :
                     bookingData.selectedClass === FlightClass.BUSINESS ? 'Thương gia' :
                     bookingData.selectedClass === FlightClass.FIRST ? 'Hạng nhất' : 'Phổ thông đặc biệt'}
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-4">
                Thông tin liên hệ
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </Label>
                  <Input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </Label>
                  <Input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </Label>
                  <Input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </Label>
                  <Input
                    type="text"
                    value={contactInfo.address}
                    onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                  />
                </div>
              </div>
            </Card>

            {/* Passenger Information */}
            <Card className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-4">
                Thông tin hành khách
              </Typography>
              
              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <Typography variant="h4" className="font-semibold text-gray-900 mb-3">
                      Hành khách {index + 1} - {
                        passenger.type === 'adult' ? 'Người lớn' :
                        passenger.type === 'child' ? 'Trẻ em' : 'Em bé'
                      }
                    </Typography>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Danh xưng *
                        </Label>
                        <Select value={passenger.title} onValueChange={(value) => handlePassengerUpdate(index, {...passenger, title: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh xưng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mr">Ông</SelectItem>
                            <SelectItem value="Ms">Bà</SelectItem>
                            <SelectItem value="Miss">Cô</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên *
                        </Label>
                        <Input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => handlePassengerUpdate(index, {...passenger, firstName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ *
                        </Label>
                        <Input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => handlePassengerUpdate(index, {...passenger, lastName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngày sinh *
                        </Label>
                        <DatePicker
                          value={passenger.dateOfBirth}
                          onChange={(value) => handlePassengerUpdate(index, {...passenger, dateOfBirth: value})}
                          placeholder="Chọn ngày sinh"
                        />
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Quốc tịch *
                        </Label>
                        <Select value={passenger.nationality} onValueChange={(value) => handlePassengerUpdate(index, {...passenger, nationality: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VN">Việt Nam</SelectItem>
                            <SelectItem value="US">Hoa Kỳ</SelectItem>
                            <SelectItem value="UK">Anh</SelectItem>
                            <SelectItem value="AU">Úc</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-700 mb-2">
                          Số hộ chiếu
                        </Label>
                        <Input
                          type="text"
                          value={passenger.passportNumber || ''}
                          onChange={(e) => handlePassengerUpdate(index, {...passenger, passportNumber: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Special Requests */}
            <Card className="bg-white rounded-lg shadow-md p-6">
              <Typography variant="h3" className="text-lg font-bold text-gray-900 mb-4">
                Yêu cầu đặc biệt
              </Typography>

              <Textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Ví dụ: Suất ăn chay, ghế gần lối đi, hỗ trợ người khuyết tật..."
                rows={3}
              />
            </Card>
          </Section>

          {/* Booking Summary */}
          <Section className="lg:col-span-1">
            <Card className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-6">
                Tóm tắt đặt vé
              </Typography>

              {/* Flight Information */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <Typography variant="h4" className="font-semibold text-gray-900">Chuyến bay</Typography>
                  <Typography variant="small" className="text-sm text-gray-600">
                    {formatDate(bookingData.flight.departureDate)}
                  </Typography>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-sm text-gray-600">
                      {bookingData.flight.departureCity} → {bookingData.flight.arrivalCity}
                    </Typography>
                    <Typography variant="small" className="text-sm font-medium">
                      {formatTime(bookingData.flight.departureDate)} - {formatTime(bookingData.flight.arrivalDate)}
                    </Typography>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="text-sm text-gray-600">
                      {bookingData.flight.airline} • {bookingData.flight.flightNumber}
                    </Typography>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <Typography variant="h4" className="font-semibold text-gray-900 mb-3">Hành khách</Typography>
                <div className="space-y-2">
                  {passengers.map((passenger, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <Typography variant="small" className="text-gray-600">
                        {passenger.firstName} {passenger.lastName}
                      </Typography>
                      <Typography variant="small" className="text-gray-900">
                        {passenger.type === 'adult' ? 'Người lớn' :
                         passenger.type === 'child' ? 'Trẻ em' : 'Em bé'}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <Typography variant="large">Tổng cộng</Typography>
                  <Typography variant="large" className="text-primary-600">
                    {formatPrice(calculateTotalAmount())}
                  </Typography>
                </div>
              </div>

              {/* Confirm Button */}
              <Button className="w-full py-4" onClick={handleConfirmBooking}>
                Tiếp tục thanh toán
              </Button>

              {/* Terms */}
              <Typography variant="small" className="mt-4 text-xs text-gray-500 text-center">
                Bằng cách tiếp tục, bạn đồng ý với{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  Điều khoản dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  Chính sách bảo mật
                </Link>
              </Typography>
            </Card>
          </Section>
        </Section>
      </Section>
    </Section>
  )
}
