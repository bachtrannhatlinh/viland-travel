'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import { useRouter } from 'next/navigation'
import { FlightBookingData } from '@/types/flight.types'

// Force dynamic rendering - no SSG
export const dynamic = 'force-dynamic'

export default function FlightPaymentPage() {
  const router = useRouter()
  // Lấy booking flight từ store
  const bookingItem = useBookingStore((state) => state.items.find(i => i.type === 'flight'))
  const [bookingData, setBookingData] = useState<FlightBookingData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card')
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(3)

  useEffect(() => {
    if (bookingItem && bookingItem.details) {
      setBookingData(bookingItem.details)
    }
    // Nếu không có booking, không redirect mà hiển thị thông báo ở dưới
  }, [bookingItem, router])

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

  const handlePayment = async () => {
    if (!bookingData) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate booking confirmation
      const confirmationCode = 'VN' + Math.random().toString(36).substr(2, 6).toUpperCase()
      
      // Store confirmation data
      const confirmationData = {
        ...bookingData,
        confirmationCode,
        paymentMethod,
        bookingDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      // Lưu dữ liệu xác nhận vào Zustand store (cập nhật lại booking flight)
      const updateItem = useBookingStore.getState().updateItem
      if (bookingItem) {
        updateItem(bookingItem.id, { details: confirmationData })
      }
      // KHÔNG xoá booking flight khỏi store sau khi xác nhận
      // Redirect to confirmation page
      router.push(`/flights/confirmation?code=${confirmationCode}`)
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  const validatePayment = () => {
    if (paymentMethod === 'card') {
      return cardInfo.number && cardInfo.expiry && cardInfo.cvv && cardInfo.name
    }
    return true
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đặt vé chuyến bay.</h2>
          <button
            className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700"
            onClick={() => router.push('/flights')}
          >
            Quay lại trang tìm chuyến bay
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                  ✓
                </div>
                <span className="font-medium">Chọn chuyến bay</span>
              </div>
              
              <div className="w-8 h-px bg-green-600"></div>
              
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white">
                  ✓
                </div>
                <span className="font-medium">Thông tin hành khách</span>
              </div>
              
              <div className="w-8 h-px bg-primary-600"></div>
              
              <div className="flex items-center space-x-2 text-primary-600">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary-600 text-white">
                  3
                </div>
                <span className="font-medium">Thanh toán</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h2>

              {/* Payment Method Selection */}
              <div className="space-y-4 mb-6">
                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      💳
                    </div>
                    <div>
                      <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                      <div className="text-sm text-gray-500">Visa, Mastercard, JCB</div>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      🏦
                    </div>
                    <div>
                      <div className="font-medium">Chuyển khoản ngân hàng</div>
                      <div className="text-sm text-gray-500">Vietcombank, Techcombank, VPBank</div>
                    </div>
                  </div>
                </label>

                <label className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'wallet' ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'wallet')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      📱
                    </div>
                    <div>
                      <div className="font-medium">Ví điện tử</div>
                      <div className="text-sm text-gray-500">Momo, ZaloPay, VNPay</div>
                    </div>
                  </div>
                </label>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Thông tin thẻ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số thẻ *
                      </label>
                      <input
                        type="text"
                        value={cardInfo.number}
                        onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên chủ thẻ *
                      </label>
                      <input
                        type="text"
                        value={cardInfo.name}
                        onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                        placeholder="NGUYEN VAN A"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày hết hạn *
                      </label>
                      <input
                        type="text"
                        value={cardInfo.expiry}
                        onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        maxLength={5}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        placeholder="123"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Transfer Instructions */}
              {paymentMethod === 'bank' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-semibold text-lg mb-3">Hướng dẫn chuyển khoản</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Chủ tài khoản:</strong> CONG TY TNHH VIET NAM DU LICH</p>
                    <p><strong>Nội dung:</strong> FLIGHT {bookingData.flight.flightNumber} {bookingData.contactInfo.name}</p>
                    <p className="text-orange-600 font-medium">
                      Sau khi chuyển khoản, vui lòng gửi ảnh chụp biên lai để xác nhận.
                    </p>
                  </div>
                </div>
              )}

              {/* E-wallet Instructions */}
              {paymentMethod === 'wallet' && (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                  <h3 className="font-semibold text-lg mb-3">Thanh toán qua ví điện tử</h3>
                  <p className="text-sm">
                    Bạn sẽ được chuyển hướng đến ứng dụng ví điện tử để hoàn tất thanh toán.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Chi tiết đặt vé
              </h3>

              {/* Flight Information */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Chuyến bay</h4>
                  <span className="text-sm text-gray-600">
                    {formatDate(bookingData.flight.departureDate)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {bookingData.flight.departureCity} → {bookingData.flight.arrivalCity}
                    </span>
                    <span className="text-sm font-medium">
                      {formatTime(bookingData.flight.departureDate)} - {formatTime(bookingData.flight.arrivalDate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      {bookingData.flight.airline} • {bookingData.flight.flightNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Hành khách</h4>
                <div className="space-y-2">
                  {bookingData.passengers.map((passenger, index) => (
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

              {/* Total Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Tổng cộng</span>
                  <span className="text-primary-600">
                    {formatPrice(bookingData.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing || !validatePayment()}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors ${
                  isProcessing || !validatePayment()
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý thanh toán...
                  </div>
                ) : (
                  `Thanh toán ${formatPrice(bookingData.totalAmount)}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center text-xs text-gray-500">
                <div className="flex items-center justify-center mb-1">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Thanh toán được bảo mật bởi SSL 256-bit
                </div>
                <p>Thông tin thẻ của bạn được mã hóa và bảo vệ tuyệt đối</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
