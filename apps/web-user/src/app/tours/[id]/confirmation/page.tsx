'use client'

import { useState, useEffect } from 'react'
import { useBookingStore } from '@/store/bookingStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface TourConfirmationData {
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
  confirmationNumber: string
  paymentMethod: string
  paymentStatus: string
  paymentDate: string
}

export default function TourConfirmationPage() {
  const router = useRouter()
  // Lấy dữ liệu xác nhận từ store (booking tour đã xác nhận)
  const bookingItem = useBookingStore((state) => state.items.find(i => i.type === 'tour'))
  const [confirmationData, setConfirmationData] = useState<TourConfirmationData | null>(null)

  useEffect(() => {
    if (bookingItem && bookingItem.details) {
      setConfirmationData(bookingItem.details)
    } else {
      router.push('/tours')
    }
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
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString('vi-VN')
  }

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900">Đang tải thông tin xác nhận...</h2>
        </div>
      </div>
    )
  }

  const getTotalParticipants = () => {
    return confirmationData.participants.adults + confirmationData.participants.children + confirmationData.participants.infants
  }

  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'card': return 'Thẻ tín dụng'
      case 'bank': return 'Chuyển khoản ngân hàng'
      case 'wallet': return 'Ví điện tử'
      default: return method
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt tour thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Cảm ơn bạn đã đặt tour với ViLand Travel. Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-sm text-green-800">
              Mã xác nhận: <strong>{confirmationData.confirmationNumber}</strong>
            </span>
          </div>
        </div>

        {/* Confirmation Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết đặt tour</h2>
          
          {/* Tour Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin tour</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Tour:</span>
                  <div className="font-medium text-gray-900">{confirmationData.tourTitle}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ngày khởi hành:</span>
                  <div className="font-medium text-gray-900">{formatDate(confirmationData.selectedDate)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Số khách:</span>
                  <div className="font-medium text-gray-900">{getTotalParticipants()} người</div>
                </div>
                <div>
                  <span className="text-gray-600">Tổng tiền:</span>
                  <div className="font-bold text-primary-600 text-lg">{formatPrice(confirmationData.totalAmount)}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin thanh toán</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Phương thức:</span>
                  <div className="font-medium text-gray-900">{getPaymentMethodText(confirmationData.paymentMethod)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    ✓ Đã thanh toán
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Thời gian thanh toán:</span>
                  <div className="font-medium text-gray-900">{formatDateTime(confirmationData.paymentDate)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Mã xác nhận:</span>
                  <div className="font-mono text-primary-600 font-bold">{confirmationData.confirmationNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Họ và tên:</span>
                  <div className="font-medium text-gray-900">{confirmationData.contactInfo.fullName}</div>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <div className="font-medium text-gray-900">{confirmationData.contactInfo.email}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600">Số điện thoại:</span>
                  <div className="font-medium text-gray-900">{confirmationData.contactInfo.phone}</div>
                </div>
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <div className="font-medium text-gray-900">{confirmationData.contactInfo.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Participant Details */}
          <div className="border-t border-gray-200 pt-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh sách hành khách</h3>
            <div className="space-y-4">
              {confirmationData.participantDetails.map((participant, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {participant.type === 'adult' ? 'Người lớn' : 
                       participant.type === 'child' ? 'Trẻ em' : 'Em bé'} #{index + 1}
                    </h4>
                    <span className="text-sm text-gray-600">{participant.gender === 'male' ? 'Nam' : 'Nữ'}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Họ tên:</span>
                      <div className="font-medium">{participant.fullName}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Ngày sinh:</span>
                      <div className="font-medium">{new Date(participant.dateOfBirth).toLocaleDateString('vi-VN')}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">CMND/CCCD:</span>
                      <div className="font-medium">{participant.identityCard}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Requests */}
          {confirmationData.specialRequests && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu đặc biệt</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{confirmationData.specialRequests}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Các bước tiếp theo</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kiểm tra email xác nhận</h3>
                <p className="text-gray-600 text-sm">Chúng tôi đã gửi email xác nhận chi tiết tour đến {confirmationData.contactInfo.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chuẩn bị giấy tờ</h3>
                <p className="text-gray-600 text-sm">Chuẩn bị CMND/CCCD và các giấy tờ cần thiết theo hướng dẫn trong email</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Liên hệ hỗ trợ</h3>
                <p className="text-gray-600 text-sm">Gọi hotline 1900 1234 nếu cần hỗ trợ hoặc thay đổi thông tin</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Thông tin quan trọng</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Vui lòng có mặt tại điểm tập trung trước 30 phút so với giờ khởi hành</p>
            <p>• Mang theo CMND/CCCD gốc và giấy tờ cần thiết</p>
            <p>• Liên hệ hướng dẫn viên qua số điện thoại trong email xác nhận</p>
            <p>• Chính sách hủy tour: miễn phí hủy trước 7 ngày, phí 50% trong vòng 3-7 ngày, không hoàn tiền dưới 3 ngày</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In xác nhận
          </button>
          <Link
            href="/tours"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Đặt tour khác
          </Link>
          <Link
            href="/"
            className="px-6 py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </Link>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cần hỗ trợ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Hotline 24/7</div>
                <div className="text-gray-600">1900 1234</div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Email</div>
                <div className="text-gray-600">info@vilandtravel.vn</div>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-8 h-8 text-primary-600 mb-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">Văn phòng</div>
                <div className="text-gray-600">123 Đường ABC, Hà Nội</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
