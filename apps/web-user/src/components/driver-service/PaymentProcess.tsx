'use client'

import { useEffect, useState } from 'react'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface PaymentResult {
  success: boolean
  message: string
  transactionId?: string
  bookingNumber?: string
}

interface PaymentPayload {
  totalAmount: number
  bookingDetails: any
}

interface PaymentProcessProps {
  payload: PaymentPayload
  onComplete: (result: PaymentResult) => void
  onBack: () => void
}

export default function PaymentProcess({ payload, onComplete, onBack }: PaymentProcessProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'failed' | 'redirecting'>('processing')
  const [result, setResult] = useState<PaymentResult | null>(null)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const run = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const success = Math.random() > 0.3
        
        if (success) {
          const successResult: PaymentResult = {
            success: true,
            message: 'Thanh toán thành công',
            transactionId: 'TXN-' + Date.now(),
            bookingNumber: 'BK-DV-' + Date.now()
          }
          setResult(successResult)
          setStatus('success')
          setTimeout(() => {
            setStatus('redirecting')
            setTimeout(() => onComplete(successResult), 5000)
          }, 2000)
        } else {
          throw new Error('Thanh toán thất bại')
        }
      } catch (e: any) {
        const fail: PaymentResult = { success: false, message: e?.message || 'Có lỗi xảy ra' }
        setResult(fail)
        setStatus('failed')
      }
    }
    const t = setTimeout(run, 1200)
    return () => clearTimeout(t)
  }, [payload, onComplete])

  useEffect(() => {
    if (status === 'redirecting') {
      const i = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000)
      return () => clearInterval(i)
    }
  }, [status])

  const format = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)

  return (
    <Section className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <Typography variant="h2" className="text-2xl font-bold text-center">
            Thanh toán
          </Typography>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Amount */}
          <Section className="text-center p-4 bg-gray-50 rounded-lg">
            <Typography className="text-sm text-gray-600 mb-1">Tổng thanh toán</Typography>
            <Typography variant="h3" className="text-2xl font-bold text-primary-600">
              {format(payload.totalAmount)}
            </Typography>
          </Section>

          {/* Status Display */}
          {status === 'processing' && (
            <Section className="text-center py-8">
              <Section className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4" />
              <Typography variant="h4" className="font-medium mb-2">Đang xử lý thanh toán...</Typography>
              <Typography className="text-sm text-gray-600">Vui lòng không tắt trình duyệt</Typography>
            </Section>
          )}

          {status === 'success' && (
            <Section className="text-center py-8">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <Typography variant="h4" className="font-medium text-green-700 mb-2">
                Thanh toán thành công!
              </Typography>
              <Typography className="text-sm text-gray-600">
                Mã giao dịch: {result?.transactionId}
              </Typography>
            </Section>
          )}

          {status === 'failed' && (
            <Section className="text-center py-8">
              <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
              <Typography variant="h4" className="font-medium text-red-700 mb-2">
                Thanh toán thất bại
              </Typography>
              <Typography className="text-sm text-gray-600 mb-4">
                {result?.message}
              </Typography>
              <Section className="flex gap-3 justify-center">
                <Button onClick={onBack} variant="outline">
                  Thử lại
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Làm mới
                </Button>
              </Section>
            </Section>
          )}

          {status === 'redirecting' && (
            <Section className="text-center py-8">
              <Clock className="mx-auto h-16 w-16 text-blue-500 mb-4" />
              <Typography variant="h4" className="font-medium text-blue-700 mb-2">
                Đang chuyển hướng...
              </Typography>
              <Typography className="text-sm text-gray-600">
                Tự động chuyển sau {countdown} giây
              </Typography>
            </Section>
          )}
        </CardContent>
      </Card>
    </Section>
  )
}
