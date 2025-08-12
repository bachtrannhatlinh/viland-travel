'use client'

import { useEffect, useState } from 'react'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface PaymentResult {
  success: boolean
  message: string
  transactionId?: string
  bookingNumber?: string
}

interface HotelBookingData {
  hotel: any
  room: any
  checkIn: string
  checkOut: string
  guests: number
  totalAmount: number
  guestInfo: any
}

interface PaymentProcessProps {
  bookingData: HotelBookingData
  onPaymentComplete: (result: PaymentResult) => void
  onBack: () => void
}

export default function PaymentProcess({ bookingData, onPaymentComplete, onBack }: PaymentProcessProps) {
  const [paymentStatus, setPaymentStatus] = useState<'processing' | 'success' | 'failed' | 'redirecting'>('processing')
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null)
  const [countdown, setCountdown] = useState(5)

  // Simulate payment processing
  useEffect(() => {
    const processPayment = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 3000))
        
        // Simulate payment success/failure (80% success rate)
        const isSuccess = Math.random() > 0.2
        
        if (isSuccess) {
          const successResult: PaymentResult = {
            success: true,
            message: 'Thanh toán thành công! Đặt phòng của bạn đã được xác nhận.',
            transactionId: `TXN-${Date.now()}`,
            bookingNumber: `BK-${Date.now()}`
          }
          setPaymentResult(successResult)
          setPaymentStatus('success')
          
          // Auto redirect after showing success
          setTimeout(() => {
            setPaymentStatus('redirecting')
            setTimeout(() => onPaymentComplete(successResult), 5000)
          }, 2000)
        } else {
          throw new Error('Giao dịch bị từ chối bởi ngân hàng')
        }
      } catch (error) {
        const failedResult: PaymentResult = {
          success: false,
          message: error instanceof Error ? error.message : 'Có lỗi xảy ra trong quá trình thanh toán'
        }
        setPaymentResult(failedResult)
        setPaymentStatus('failed')
      }
    }

    const timer = setTimeout(processPayment, 2000)
    return () => clearTimeout(timer)
  }, [bookingData, onPaymentComplete])

  // Countdown for redirect
  useEffect(() => {
    if (paymentStatus === 'redirecting' || paymentStatus === 'success') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [paymentStatus])

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  // Processing state
  if (paymentStatus === 'processing') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <Section className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mb-6" />
          <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-2">
            Đang xử lý thanh toán...
          </Typography>
          <Typography className="text-gray-600 mb-6">
            Vui lòng không đóng trình duyệt
          </Typography>
          <Section className="bg-gray-50 rounded-lg p-4">
            <Typography className="text-sm text-gray-600 mb-1">Tổng thanh toán</Typography>
            <Typography variant="h4" className="text-lg font-bold text-primary-600">
              {formatPrice(bookingData.totalAmount)}
            </Typography>
          </Section>
        </CardContent>
      </Card>
    )
  }

  // Success state
  if (paymentStatus === 'success' || paymentStatus === 'redirecting') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <CheckCircle className="mx-auto h-20 w-20 text-green-500 mb-6" />
          <Typography variant="h3" className="text-xl font-bold text-green-700 mb-2">
            Thanh toán thành công!
          </Typography>
          <Typography className="text-gray-600 mb-6">
            {paymentResult?.message}
          </Typography>
          
          {paymentResult?.transactionId && (
            <Section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <Typography className="text-sm text-green-600 mb-1">Mã giao dịch</Typography>
              <Typography className="font-mono text-sm font-medium">
                {paymentResult.transactionId}
              </Typography>
            </Section>
          )}

          {paymentStatus === 'redirecting' && (
            <Alert className="bg-blue-50 border-blue-200 mb-6">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Tự động chuyển đến trang xác nhận sau {countdown} giây...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  // Failed state
  if (paymentStatus === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="text-center py-12">
          <XCircle className="mx-auto h-20 w-20 text-red-500 mb-6" />
          <Typography variant="h3" className="text-xl font-bold text-red-700 mb-2">
            Thanh toán thất bại
          </Typography>
          <Typography className="text-gray-600 mb-6">
            {paymentResult?.message}
          </Typography>

          <Alert className="bg-red-50 border-red-200 max-w-md mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <Typography variant="h4" className="font-medium text-red-900 mb-2">
                Có thể do các nguyên nhân sau:
              </Typography>
              <Section className="text-sm text-red-700 text-left space-y-1">
                <Typography>• Thông tin thẻ không chính xác</Typography>
                <Typography>• Tài khoản không đủ số dư</Typography>
                <Typography>• Kết nối mạng không ổn định</Typography>
                <Typography>• Phòng đã hết trong thời gian xử lý</Typography>
              </Section>
            </AlertDescription>
          </Alert>

          <Section className="flex justify-center space-x-4">
            <Button onClick={onBack} className="px-6 py-3">
              Thử lại
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/hotels'}
              className="px-6 py-3"
            >
              Chọn phòng khác
            </Button>
          </Section>
        </CardContent>
      </Card>
    )
  }

  return null
}
