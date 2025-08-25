'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Typography } from '@/components/ui/typography';
import { apiClient } from '@/lib/utils';

interface CarBookingConfirmation {
  booking_number: string;
  booking_type: string;
  status: string;
  created_at: string;
  total_amount: number;
  booking_details?: {
    startDate?: string;
    endDate?: string;
    pickupLocation?: string;
    dropoffLocation?: string;
    serviceName?: string;
    description?: string;
    participants?: number;
    additionalServices?: any;
    driverInfo?: any;
  };
  // ...other fields as needed
}

export default function CarRentalConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<CarBookingConfirmation | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setError('Không tìm thấy mã booking.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiClient.get(`/car-rental/booking/${bookingId}`);
        console.log(data, 'data')
        if (data.success && data.data) {
          setConfirmation(data.data);
        } else {
          setError('Không tìm thấy thông tin booking.');
        }
      } catch (err) {
        setError('Có lỗi khi xác nhận booking.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải xác nhận booking...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (!confirmation) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Không tìm thấy thông tin xác nhận booking.</div>;
  }

  // Lấy thông tin chi tiết từ booking_details
  const details = confirmation.booking_details || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <Typography variant="h1" className="text-3xl font-bold text-gray-900 mb-2">
            Đặt xe thành công!
          </Typography>
          <Typography variant="large" className="text-lg text-gray-600 mb-4">
            Cảm ơn bạn đã đặt xe với ViLand Travel. Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.
          </Typography>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <span className="text-sm text-green-800">
              Mã booking: <strong>{confirmation.booking_number}</strong>
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Chi tiết đặt xe</h2>
          <div className="space-y-3">
            <div>
              <span className="text-gray-600">Ngày nhận xe:</span>
              <div className="font-medium text-gray-900">{details.startDate ? formatDate(details.startDate) : '-'}</div>
            </div>
            <div>
              <span className="text-gray-600">Ngày trả xe:</span>
              <div className="font-medium text-gray-900">{details.endDate ? formatDate(details.endDate) : '-'}</div>
            </div>
            <div>
              <span className="text-gray-600">Điểm nhận xe:</span>
              <div className="font-medium text-gray-900">{details.pickupLocation || '-'}</div>
            </div>
            <div>
              <span className="text-gray-600">Điểm trả xe:</span>
              <div className="font-medium text-gray-900">{details.dropoffLocation || '-'}</div>
            </div>
            <div>
              <span className="text-gray-600">Tổng tiền:</span>
              <div className="font-bold text-primary-600 text-lg">{formatPrice(confirmation.total_amount)}</div>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái:</span>
              <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                {confirmation.status === 'pending' ? 'Chờ thanh toán' : confirmation.status}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Các bước tiếp theo</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Kiểm tra email xác nhận</h3>
                <p className="text-gray-600 text-sm">Chúng tôi đã gửi email xác nhận chi tiết đặt xe đến email của bạn.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Chuẩn bị giấy tờ</h3>
                <p className="text-gray-600 text-sm">Mang theo bằng lái xe hợp lệ và giấy tờ cần thiết khi nhận xe.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Liên hệ hỗ trợ</h3>
                <p className="text-gray-600 text-sm">Gọi hotline 1900 1234 nếu cần hỗ trợ hoặc thay đổi thông tin.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a1 1 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            In xác nhận
          </button>
        </div>
        <div className="flex justify-center mt-4">
          <Link
            href="/car-rental"
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Quay lại trang thuê xe
          </Link>
        </div>
      </div>
    </div>
  );
}
