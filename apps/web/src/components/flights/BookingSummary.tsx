import { Flight, FlightClass, PassengerInfo } from '@/types/flight.types'

interface BookingSummaryProps {
  outboundFlight: Flight
  returnFlight?: Flight
  passengers: PassengerInfo[]
  selectedClass: FlightClass
  specialRequests?: string
  onConfirmBooking: () => void
  isLoading?: boolean
}

export default function BookingSummary({
  outboundFlight,
  returnFlight,
  passengers,
  selectedClass,
  specialRequests,
  onConfirmBooking,
  isLoading = false
}: BookingSummaryProps) {

  // Calculate pricing
  const getClassPrice = (flight: Flight, flightClass: FlightClass) => {
    const pricingData = flight.pricing[flightClass]
    return pricingData ? pricingData.price : flight.pricing[FlightClass.ECONOMY].price
  }

  const getPassengerPrice = (passenger: PassengerInfo, basePrice: number) => {
    switch (passenger.type) {
      case 'adult':
        return basePrice
      case 'child':
        return basePrice * 0.75 // 25% discount for children
      case 'infant':
        return basePrice * 0.1 // 90% discount for infants
      default:
        return basePrice
    }
  }

  const outboundBasePrice = getClassPrice(outboundFlight, selectedClass)
  const returnBasePrice = returnFlight ? getClassPrice(returnFlight, selectedClass) : 0

  const outboundTotal = passengers.reduce((sum, passenger) => 
    sum + getPassengerPrice(passenger, outboundBasePrice), 0
  )

  const returnTotal = returnFlight ? passengers.reduce((sum, passenger) => 
    sum + getPassengerPrice(passenger, returnBasePrice), 0
  ) : 0

  const subtotal = outboundTotal + returnTotal
  const taxes = subtotal * 0.1 // 10% tax
  const totalAmount = subtotal + taxes

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getClassLabel = (flightClass: FlightClass) => {
    switch (flightClass) {
      case FlightClass.ECONOMY:
        return 'Phổ thông'
      case FlightClass.PREMIUM_ECONOMY:
        return 'Phổ thông đặc biệt'
      case FlightClass.BUSINESS:
        return 'Thương gia'
      case FlightClass.FIRST:
        return 'Hạng nhất'
      default:
        return 'Phổ thông'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Tóm tắt đặt chỗ
      </h3>

      {/* Outbound Flight */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Chuyến đi</h4>
          <span className="text-sm text-gray-600">
            {formatDate(outboundFlight.departureDate)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {outboundFlight.departureCity} → {outboundFlight.arrivalCity}
            </span>
            <span className="text-sm font-medium">
              {formatTime(outboundFlight.departureDate)} - {formatTime(outboundFlight.arrivalDate)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {outboundFlight.airline} • {outboundFlight.flightNumber}
            </span>
            <span className="text-sm text-gray-600">
              {getClassLabel(selectedClass)}
            </span>
          </div>
        </div>
      </div>

      {/* Return Flight */}
      {returnFlight && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">Chuyến về</h4>
            <span className="text-sm text-gray-600">
              {formatDate(returnFlight.departureDate)}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {returnFlight.departureCity} → {returnFlight.arrivalCity}
              </span>
              <span className="text-sm font-medium">
                {formatTime(returnFlight.departureDate)} - {formatTime(returnFlight.arrivalDate)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {returnFlight.airline} • {returnFlight.flightNumber}
              </span>
              <span className="text-sm text-gray-600">
                {getClassLabel(selectedClass)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Passengers */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Hành khách</h4>
        <div className="space-y-2">
          {passengers.map((passenger, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                {passenger.title} {passenger.firstName} {passenger.lastName}
              </span>
              <span className="text-gray-900">
                {passenger.type === 'adult' ? 'Người lớn' : 
                 passenger.type === 'child' ? 'Trẻ em' : 'Em bé'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Special Requests */}
      {specialRequests && (
        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Yêu cầu đặc biệt</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            {specialRequests}
          </p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="mb-6 space-y-3">
        <h4 className="font-semibold text-gray-900">Chi tiết giá</h4>
        
        {/* Outbound Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Chuyến đi ({passengers.length} hành khách)</span>
            <span className="text-gray-900">{formatPrice(outboundTotal)}</span>
          </div>
          
          {returnFlight && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Chuyến về ({passengers.length} hành khách)</span>
              <span className="text-gray-900">{formatPrice(returnTotal)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
            <span className="text-gray-600">Tạm tính</span>
            <span className="text-gray-900">{formatPrice(subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Thuế và phí</span>
            <span className="text-gray-900">{formatPrice(taxes)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
          <span className="text-xl font-bold text-primary-600">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Điều khoản quan trọng:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Vé không hoàn lại sau khi đặt</li>
              <li>Có thể thay đổi với phí phụ thu</li>
              <li>Check-in trực tuyến mở 24h trước giờ bay</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Confirm Booking Button */}
      <button
        onClick={onConfirmBooking}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-primary-600 hover:bg-primary-700'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang xử lý...
          </div>
        ) : (
          'Xác nhận đặt vé'
        )}
      </button>

      {/* Security Notice */}
      <div className="mt-4 text-center text-xs text-gray-500">
        <div className="flex items-center justify-center mb-1">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          Thanh toán được bảo mật bởi SSL
        </div>
        <p>Thông tin của bạn được mã hóa và bảo vệ</p>
      </div>
    </div>
  )
}
