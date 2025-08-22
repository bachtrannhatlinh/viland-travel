'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FlightBookingData } from '@/types/flight.types'
import { fetchBookingConfirmation } from '@/lib/booking'

// Force dynamic rendering - no SSG
export const dynamic = 'force-dynamic'

interface ConfirmationData extends FlightBookingData {
  confirmationCode: string
  paymentMethod: string
  bookingDate: string
  status: string
}

export default function FlightConfirmationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const confirmationCode = searchParams.get('code')
  // Lấy dữ liệu xác nhận từ store (booking flight đã xác nhận)
  const bookingItem = useBookingStore((state) => state.items.find(i => i.type === 'flight'))
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false;
    async function getData() {
      if (bookingItem && bookingItem.details && bookingItem.details.confirmationCode === confirmationCode) {
        setConfirmationData(bookingItem.details);
        setIsLoading(false);
        return;
      }
      // Nếu không có trong store, gọi API lấy thông tin xác nhận
      if (confirmationCode) {
        setIsLoading(true);
        const data = await fetchBookingConfirmation(confirmationCode);
        if (!ignore) {
          setConfirmationData(data as any);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    getData();
    return () => { ignore = true; };
  }, [bookingItem, confirmationCode]);

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

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = () => {
    // This would integrate with a PDF generation service
    alert('Chức năng tải PDF đang được phát triển')
  }

  const handleEmailConfirmation = () => {
    // This would send confirmation email
    alert('Email xác nhận đã được gửi đến địa chỉ của bạn')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Đang tải thông tin xác nhận...</h2>
        </div>
      </div>
    )
  }

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy thông tin đặt vé</h2>
          <p className="text-gray-600 mb-6">Mã xác nhận không hợp lệ hoặc đã hết hạn</p>
          <Button asChild>
            <Link href="/flights">Quay lại trang chủ</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt vé thành công!</h1>
          <p className="text-lg text-gray-600">
            Cảm ơn bạn đã chọn ViLand Travel. Thông tin xác nhận đã được gửi đến email của bạn.
          </p>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {/* Header with Confirmation Code */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Mã đặt vé: {confirmationData.confirmationCode}
                </h2>
                <p className="text-gray-600">
                  Ngày đặt: {formatDate(confirmationData.bookingDate)}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✓ Đã xác nhận
                </span>
              </div>
            </div>
          </div>

          {/* Flight Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin chuyến bay</h3>
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✈</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{confirmationData.flight.airline}</h4>
                    <p className="text-gray-600">{confirmationData.flight.flightNumber}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{formatDate(confirmationData.flight.departureDate)}</div>
                  <div className="font-medium">{confirmationData.flight.formattedDuration}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center md:text-left">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTime(confirmationData.flight.departureDate)}
                  </div>
                  <div className="text-gray-600">{confirmationData.flight.departureCity}</div>
                  <div className="text-sm text-gray-500">{confirmationData.flight.departureAirport}</div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-8 h-px bg-gray-400 mb-2"></div>
                    <div className="text-sm text-gray-500">Bay thẳng</div>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTime(confirmationData.flight.arrivalDate)}
                  </div>
                  <div className="text-gray-600">{confirmationData.flight.arrivalCity}</div>
                  <div className="text-sm text-gray-500">{confirmationData.flight.arrivalAirport}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Passenger Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin hành khách</h3>
            <div className="space-y-4">
              {confirmationData.passengers.map((passenger, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Hành khách {index + 1}</div>
                      <div className="font-medium">
                        {passenger.title} {passenger.firstName} {passenger.lastName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Loại</div>
                      <div className="font-medium">
                        {passenger.type === 'adult' ? 'Người lớn' : 
                         passenger.type === 'child' ? 'Trẻ em' : 'Em bé'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Ngày sinh</div>
                      <div className="font-medium">{formatDate(passenger.date_of_birth)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Quốc tịch</div>
                      <div className="font-medium">{passenger.nationality}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Họ tên</div>
                  <div className="font-medium">{confirmationData.contact_info.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Điện thoại</div>
                  <div className="font-medium">{confirmationData.contact_info.phone}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{confirmationData.contact_info.email}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          {confirmationData.specialRequests && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Yêu cầu đặc biệt</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-gray-700">{confirmationData.specialRequests}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Tóm tắt thanh toán</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá vé ({confirmationData.passengers.length} hành khách)</span>
                  <span className="font-medium">{formatPrice(confirmationData.total_amount * 0.9)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế và phí</span>
                  <span className="font-medium">{formatPrice(confirmationData.total_amount * 0.1)}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(confirmationData.total_amount)}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Phương thức thanh toán: {
                    confirmationData.paymentMethod === 'card' ? 'Thẻ tín dụng' :
                    confirmationData.paymentMethod === 'bank' ? 'Chuyển khoản' : 'Ví điện tử'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-lg text-blue-900 mb-3">Thông tin quan trọng</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Vui lòng có mặt tại sân bay ít nhất 2 tiếng trước giờ bay nội địa, 3 tiếng trước giờ bay quốc tế</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Mang theo giấy tờ tùy thân hợp lệ (CMND/CCCD/Hộ chiếu)</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Check-in trực tuyến mở 24 giờ trước giờ khởi hành</span>
            </div>
            <div className="flex items-start">
              <span className="font-medium mr-2">•</span>
              <span>Liên hệ hotline 1900-1234 nếu cần hỗ trợ</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="secondary" onClick={handlePrint} className="px-6 py-3 inline-flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In vé
          </Button>

          <Button variant="secondary" onClick={handleDownloadPDF} className="px-6 py-3 inline-flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Tải PDF
          </Button>

          <Button variant="secondary" onClick={handleEmailConfirmation} className="px-6 py-3 inline-flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Gửi lại Email
          </Button>

          <Button asChild className="px-6 py-3 inline-flex items-center justify-center">
            <Link href="/flights">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Đặt vé khác
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
