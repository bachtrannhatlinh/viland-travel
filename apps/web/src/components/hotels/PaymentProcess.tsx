'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { BookingData } from './BookingForm';

interface PaymentProcessProps {
  bookingData: BookingData;
  onBack: () => void;
  onPaymentComplete: (result: PaymentResult) => void;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  bookingNumber?: string;
  message: string;
  redirectUrl?: string;
}

export default function PaymentProcess({ bookingData, onBack, onPaymentComplete }: PaymentProcessProps) {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | 'redirecting'>('processing');
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [countdown, setCountdown] = useState(3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPaymentMethodName = (method: string) => {
    const methods: Record<string, string> = {
      'vnpay': 'VNPay',
      'momo': 'MoMo',
      'zalopay': 'ZaloPay',
      'onepay': 'OnePay'
    };
    return methods[method] || method;
  };

  // Simulate payment processing
  useEffect(() => {
    const processPayment = async () => {
      try {
        // Simulate API call to create booking and process payment
        const response = await fetch('/api/hotels/book', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            hotelId: bookingData.hotel.id,
            roomType: bookingData.room.type,
            quantity: bookingData.quantity,
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            guests: bookingData.guests,
            contactInfo: bookingData.contactInfo,
            specialRequests: bookingData.specialRequests,
            totalAmount: bookingData.totalAmount,
            paymentMethod: bookingData.paymentMethod
          })
        });

        const result = await response.json();

        if (result.success) {
          if (result.redirectUrl) {
            // For payment gateways that require redirect
            setPaymentStatus('redirecting');
            setTimeout(() => {
              window.location.href = result.redirectUrl;
            }, 3000);
          } else {
            // Direct payment success
            const successResult: PaymentResult = {
              success: true,
              transactionId: result.transactionId || 'TXN' + Date.now(),
              bookingNumber: result.bookingNumber || 'BK' + Date.now(),
              message: 'Đặt phòng và thanh toán thành công!'
            };
            setPaymentResult(successResult);
            setPaymentStatus('success');
            setTimeout(() => {
              onPaymentComplete(successResult);
            }, 3000);
          }
        } else {
          throw new Error(result.message || 'Thanh toán thất bại');
        }
      } catch (error) {
        const failedResult: PaymentResult = {
          success: false,
          message: error instanceof Error ? error.message : 'Có lỗi xảy ra trong quá trình thanh toán'
        };
        setPaymentResult(failedResult);
        setPaymentStatus('failed');
      }
    };

    // Simulate processing time
    const timer = setTimeout(processPayment, 2000);

    return () => clearTimeout(timer);
  }, [bookingData, onPaymentComplete]);

  // Countdown for redirect
  useEffect(() => {
    if (paymentStatus === 'redirecting' || paymentStatus === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentStatus]);

  const renderProcessingState = () => (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
          <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Đang xử lý thanh toán...
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8">
            Vui lòng đợi trong giây lát. Đừng đóng trình duyệt.
          </Typography>
        </div>
        <div className="max-w-md mx-auto space-y-4">
          <Progress value={60} className="h-2" />
          <Typography variant="small" className="text-sm text-gray-500">
            Đang kết nối với {getPaymentMethodName(bookingData.paymentMethod)}...
          </Typography>
        </div>
      </CardContent>
    </Card>
  );

  const renderRedirectingState = () => (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full">
          <Loader className="w-8 h-8 text-yellow-600 animate-spin" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Chuyển hướng đến trang thanh toán...
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8">
            Bạn sẽ được chuyển đến {getPaymentMethodName(bookingData.paymentMethod)} trong {countdown} giây
          </Typography>
        </div>
        <div className="max-w-md mx-auto space-y-4">
          <Progress value={((3 - countdown) / 3) * 100} className="h-2" />
          <Typography variant="small" className="text-sm text-gray-500">
            Nếu không được chuyển hướng tự động, vui lòng làm mới trang
          </Typography>
        </div>
      </CardContent>
    </Card>
  );

  const renderSuccessState = () => (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Đặt phòng thành công!
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8">
            {paymentResult?.message}
          </Typography>
        </div>

        {paymentResult && (
          <Card className="bg-green-50 border-green-200 max-w-md mx-auto mb-8">
            <CardContent className="p-6">
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <Typography variant="small" className="text-sm font-medium text-gray-700">Mã đặt phòng:</Typography>
                  <Typography variant="small" className="text-sm font-bold text-green-600">{paymentResult.bookingNumber}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-sm font-medium text-gray-700">Mã giao dịch:</Typography>
                  <Typography variant="small" className="text-sm text-gray-900">{paymentResult.transactionId}</Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" className="text-sm font-medium text-gray-700">Số tiền:</Typography>
                  <Typography variant="small" className="text-sm font-bold text-gray-900">{formatPrice(bookingData.totalAmount)}</Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Typography variant="small" className="text-sm text-gray-500 mb-4">
          Thông tin đặt phòng đã được gửi đến email: {bookingData.contactInfo.email}
        </Typography>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3"
          >
            Về trang chủ
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/bookings'}
            className="px-6 py-3"
          >
            Xem đặt chỗ
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderFailedState = () => (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Thanh toán thất bại
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8">
            {paymentResult?.message}
          </Typography>
        </div>

        <Alert className="bg-red-50 border-red-200 max-w-md mx-auto mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <Typography variant="h4" className="font-medium text-red-900 mb-2">Có thể do các nguyên nhân sau:</Typography>
            <ul className="text-sm text-red-700 text-left space-y-1">
              <li>• Thông tin thẻ không chính xác</li>
              <li>• Tài khoản không đủ số dư</li>
              <li>• Kết nối mạng không ổn định</li>
              <li>• Phòng đã hết trong thời gian xử lý</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={onBack}
            className="px-6 py-3"
          >
            Thử lại
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = '/hotels'}
            className="px-6 py-3"
          >
            Chọn phòng khác
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        {paymentStatus === 'failed' && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-700 mb-4 p-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        )}

        <div className="text-center">
          <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
            Thanh toán đặt phòng
          </Typography>
          <Typography variant="p" className="text-gray-600">
            {bookingData.hotel.name} - {bookingData.room.name}
          </Typography>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === 'processing' && renderProcessingState()}
      {paymentStatus === 'redirecting' && renderRedirectingState()}
      {paymentStatus === 'success' && renderSuccessState()}
      {paymentStatus === 'failed' && renderFailedState()}

      {/* Booking Summary */}
      {paymentStatus === 'processing' && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Chi tiết thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <Typography variant="small">Khách sạn:</Typography>
                <Typography variant="small">{bookingData.hotel.name}</Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="small">Loại phòng:</Typography>
                <Typography variant="small">{bookingData.room.name}</Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="small">Số đêm:</Typography>
                <Typography variant="small">{bookingData.nights} đêm</Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="small">Số phòng:</Typography>
                <Typography variant="small">{bookingData.quantity} phòng</Typography>
              </div>
              <div className="flex justify-between">
                <Typography variant="small">Phương thức:</Typography>
                <Typography variant="small">{getPaymentMethodName(bookingData.paymentMethod)}</Typography>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <Typography variant="small" className="font-semibold">Tổng cộng:</Typography>
                <Typography variant="small" className="text-blue-600 font-bold">{formatPrice(bookingData.totalAmount)}</Typography>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
