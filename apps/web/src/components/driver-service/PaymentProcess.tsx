'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export interface DriverBookingPayload {
  itineraryId: string;
  driverId: string;
  totalAmount: number;
  paymentMethod: 'vnpay' | 'momo' | 'zalopay' | 'onepay';
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  bookingNumber?: string;
  message: string;
  redirectUrl?: string;
}

interface Props {
  payload: DriverBookingPayload;
  onBack: () => void;
  onComplete: (result: PaymentResult) => void;
}

export default function DriverPaymentProcess({ payload, onBack, onComplete }: Props) {
  const [status, setStatus] = useState<'processing' | 'redirecting' | 'success' | 'failed'>('processing');
  const [countdown, setCountdown] = useState(3);
  const [result, setResult] = useState<PaymentResult | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch('/api/driver-service/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          if (data.redirectUrl) {
            setStatus('redirecting');
            setTimeout(() => {
              window.location.href = data.redirectUrl;
            }, 3000);
          } else {
            const ok: PaymentResult = {
              success: true,
              transactionId: data.transactionId,
              bookingNumber: data.bookingNumber,
              message: data.message || 'Đặt tài xế và thanh toán thành công!',
            };
            setResult(ok);
            setStatus('success');
            setTimeout(() => onComplete(ok), 2000);
          }
        } else {
          throw new Error(data.message || 'Thanh toán thất bại');
        }
      } catch (e: any) {
        const fail: PaymentResult = { success: false, message: e?.message || 'Có lỗi xảy ra' };
        setResult(fail);
        setStatus('failed');
      }
    };
    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, [payload, onComplete]);

  useEffect(() => {
    if (status === 'redirecting') {
      const i = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
      return () => clearInterval(i);
    }
  }, [status]);

  const format = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

  return (
    <Card className="text-center py-10">
      <CardHeader>
        <CardTitle>Thanh toán</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'processing' && (
          <>
            <Typography>Đang xử lý thanh toán...</Typography>
            <Progress value={60} className="h-2" />
          </>
        )}
        {status === 'redirecting' && (
          <>
            <Typography>Chuyển hướng đến cổng thanh toán trong {countdown}s...</Typography>
            <Progress value={((3 - countdown) / 3) * 100} className="h-2" />
          </>
        )}
        {status === 'success' && result && (
          <div className="space-y-2">
            <Typography className="font-semibold text-green-600">{result.message}</Typography>
            <div className="text-sm">
              <div>Mã đặt chỗ: <b>{result.bookingNumber}</b></div>
              <div>Mã giao dịch: <b>{result.transactionId}</b></div>
              <div>Số tiền: <b>{format(payload.totalAmount)}</b></div>
            </div>
            <Button onClick={() => onComplete(result)}>Tiếp tục</Button>
          </div>
        )}
        {status === 'failed' && (
          <div className="space-y-2">
            <Typography className="font-semibold text-red-600">{result?.message}</Typography>
            <Button variant="outline" onClick={onBack}>Thử lại</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

