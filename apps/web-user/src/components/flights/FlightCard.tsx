import { Button } from '@/components/ui/button'
import { Flight } from '@/types/flight.types'

interface FlightCardProps {
  flight: Flight
  onSelect: (flight: Flight) => void
}

export default function FlightCard({ flight, onSelect }: FlightCardProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  const getLowestPrice = () => {
    if (!flight.pricing) return 0
    const prices = Object.values(flight.pricing).map(p => p?.price || 0).filter(p => p > 0)
    return prices.length > 0 ? Math.min(...prices) : 0
  }

  const hasDiscount = () => {
    if (!flight.pricing) return false
    return Object.values(flight.pricing).some(p => p?.originalPrice && p?.originalPrice > (p?.price || 0))
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          {/* Airline Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {flight.airline.split(' ').map(word => word[0]).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{flight.airline}</h3>
              <p className="text-sm text-gray-500">
                {flight.flightNumber} • {flight.aircraftType}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {getLowestPrice().toLocaleString('vi-VN')} ₫
            </div>
            {hasDiscount() && flight.pricing?.economy?.originalPrice && (
              <div className="text-sm text-gray-500 line-through">
                {flight.pricing.economy.originalPrice.toLocaleString('vi-VN')} ₫
              </div>
            )}
            <div className="text-sm text-gray-500">Giá cho 1 người</div>
          </div>
        </div>

        {/* Flight Details */}
        <div className="flex items-center justify-between mb-4">
          {/* Departure */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.departureDate)}
            </div>
            <div className="text-sm text-gray-500">{formatDate(flight.departureDate)}</div>
            <div className="text-lg font-semibold text-gray-700">{flight.departureAirport}</div>
            <div className="text-sm text-gray-500">{flight.departureCity}</div>
          </div>

          {/* Flight Path */}
          <div className="flex-1 mx-8">
            <div className="flex items-center justify-center">
              <div className="flex-1 border-t border-gray-300 relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-center mt-2">
              <div className="text-sm text-gray-500">{flight.formattedDuration}</div>
              <div className="text-xs text-gray-400">
                {flight.isDirect ? 'Bay thẳng' : 'Có điểm dừng'}
              </div>
            </div>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {formatTime(flight.arrivalDate)}
            </div>
            <div className="text-sm text-gray-500">{formatDate(flight.arrivalDate)}</div>
            <div className="text-lg font-semibold text-gray-700">{flight.arrivalAirport}</div>
            <div className="text-sm text-gray-500">{flight.arrivalCity}</div>
          </div>
        </div>

        {/* Amenities */}
        {flight.amenities && (
          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            {(Array.isArray(flight.amenities) ? flight.amenities.includes('Wifi') : flight.amenities.wifi) && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 112 0 1 1 0 01-2 0z" />
                </svg>
                <span>WiFi</span>
              </div>
            )}
            {(Array.isArray(flight.amenities) ? flight.amenities.includes('Meal') : flight.amenities.meals) && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" />
                </svg>
                <span>Suất ăn</span>
              </div>
            )}
            {(Array.isArray(flight.amenities) ? flight.amenities.includes('Entertainment') : flight.amenities.entertainment) && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
                <span>Giải trí</span>
              </div>
            )}
          </div>
        )}

        {/* Available Classes & Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            {flight.pricing?.economy?.available && flight.pricing.economy.available > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Phổ thông: {flight.pricing.economy.available} chỗ
              </span>
            )}
            {flight.pricing?.business?.available && flight.pricing.business.available > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Thương gia: {flight.pricing.business.available} chỗ
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {/* Rating */}
            {flight.rating && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-600">{flight.rating}</span>
              </div>
            )}

            <Button onClick={() => onSelect(flight)}>
              Chọn chuyến bay
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
