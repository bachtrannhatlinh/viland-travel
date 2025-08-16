'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TourBookingData {
  tourId: string
  tourTitle: string
  selectedDate: string
  participants: {
    adults: number
    children: number
    infants: number
  }
  contactInfo: {
    fullName: string
    email: string
    phone: string
    address: string
  }
  participantDetails: Array<{
    fullName: string
    dateOfBirth: string
    gender: string
    identityCard: string
    type: string
  }>
  specialRequests: string
  totalAmount: number
  bookingDate: string
  status: string
}

export default function TourPaymentForm() {
  const router = useRouter()
  const [bookingData, setBookingData] = useState<TourBookingData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'wallet'>('card')
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const storedBookingData = sessionStorage.getItem('tourBookingData')
    if (storedBookingData) {
      setBookingData(JSON.parse(storedBookingData))
    } else {
      router.push('/tours')
    }
  }, [router])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handlePayment = async () => {
    if (!bookingData) return

    setIsProcessing(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate booking confirmation
      const confirmationNumber = 'GS' + Math.random().toString(36).substr(2, 8).toUpperCase()
      
      const paymentData = {
        ...bookingData,
        confirmationNumber,
        paymentMethod,
        paymentStatus: 'completed',
        paymentDate: new Date().toISOString()
      }

      // Store confirmation data
      sessionStorage.setItem('tourConfirmation', JSON.stringify(paymentData))
      sessionStorage.removeItem('tourBookingData')

      // Navigate to success page
      router.push(`/tours/${bookingData.tourId}/confirmation`)
    } catch (error) {
      console.error('Payment error:', error)
      alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!bookingData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Đang tải thông tin thanh toán...</h2>
        </div>
      </div>
    )
  }

  const getTotalParticipants = () => {
    return bookingData.participants.adults + bookingData.participants.children + bookingData.participants.infants
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Payment Form */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin thanh toán</h2>

          {/* Payment Method Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn phương thức thanh toán</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'card'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">Thẻ tín dụng</div>
                    <div className="text-sm text-gray-600">Visa, Mastercard</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('bank')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'bank'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">Chuyển khoản</div>
                    <div className="text-sm text-gray-600">VNPay, Banking</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  paymentMethod === 'wallet'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-primary-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm5 5a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2zm3 0a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">Ví điện tử</div>
                    <div className="text-sm text-gray-600">MoMo, ZaloPay</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số thẻ
                </label>
                <input
                  type="text"
                  value={cardInfo.number}
                  onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày hết hạn
                  </label>
                  <input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardInfo.cvv}
                    onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên chủ thẻ
                </label>
                <input
                  type="text"
                  value={cardInfo.name}
                  onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                  placeholder="NGUYEN VAN A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Bank Transfer Info */}
          {paymentMethod === 'bank' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Thông tin chuyển khoản</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tài khoản:</span>
                  <span className="font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chủ tài khoản:</span>
                  <span className="font-medium">CONG TY TNHH VIET NAM DU LICH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-medium text-primary-600">
                    {formatPrice(bookingData.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Nội dung:</span>
                  <span className="font-medium">TOUR {bookingData.tourId} {bookingData.contactInfo.fullName}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.
                </p>
              </div>
            </div>
          )}

          {/* E-wallet Info */}
          {paymentMethod === 'wallet' && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Thanh toán qua ví điện tử</h4>
              <div className="space-y-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-pink-600 font-bold">M</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">MoMo</div>
                    <div className="text-sm text-gray-600">Thanh toán qua ví MoMo</div>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-blue-600 font-bold">Z</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">ZaloPay</div>
                    <div className="text-sm text-gray-600">Thanh toán qua ví ZaloPay</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Button */}
          <div className="mt-8">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-white text-lg transition-colors ${
                isProcessing 
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
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center text-xs text-gray-500">
            <div className="flex items-center justify-center mb-1">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Thanh toán an toàn với SSL
            </div>
            <p>Thông tin thanh toán của bạn được mã hóa và bảo mật</p>
          </div>
        </div>
      </div>

      {/* Booking Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Chi tiết đặt tour
          </h3>

          {/* Tour Information */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">{bookingData.tourTitle}</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Ngày khởi hành:</span>
                <span className="font-medium text-gray-900">
                  {formatDate(bookingData.selectedDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Số khách:</span>
                <span className="font-medium text-gray-900">
                  {getTotalParticipants()} người
                </span>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div>
                <span className="font-medium text-gray-900">{bookingData.contactInfo.fullName}</span>
              </div>
              <div>{bookingData.contactInfo.email}</div>
              <div>{bookingData.contactInfo.phone}</div>
            </div>
          </div>

          {/* Participants */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Hành khách</h4>
            <div className="space-y-2 text-sm">
              {bookingData.participants.adults > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Người lớn x {bookingData.participants.adults}</span>
                  <span className="text-gray-900">Người lớn</span>
                </div>
              )}
              {bookingData.participants.children > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Trẻ em x {bookingData.participants.children}</span>
                  <span className="text-gray-900">Trẻ em</span>
                </div>
              )}
              {bookingData.participants.infants > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Em bé x {bookingData.participants.infants}</span>
                  <span className="text-gray-900">Em bé</span>
                </div>
              )}
            </div>
          </div>

          {/* Special Requests */}
          {bookingData.specialRequests && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">Yêu cầu đặc biệt</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                {bookingData.specialRequests}
              </p>
            </div>
          )}

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Tổng cộng</span>
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(bookingData.totalAmount)}
            </span>
          </div>

          {/* Important Notes */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Lưu ý quan trọng:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kiểm tra thông tin thẻ trước khi thanh toán</li>
                  <li>Bạn sẽ nhận email xác nhận sau khi thanh toán</li>
                  <li>Liên hệ hotline 1900 1234 nếu cần hỗ trợ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
