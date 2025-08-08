"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

interface Props {
  bookingNumber: string;
  transactionId?: string;
  amount: number;
}

export default function BookingConfirmation({ bookingNumber, transactionId, amount }: Props) {
  return (
    <Card className="text-center py-12">
      <CardContent className="space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-2">
            Đặt tài xế thành công!
          </Typography>
          <Typography className="text-gray-600">Cảm ơn bạn đã sử dụng dịch vụ lái xe Go_Safe.</Typography>
        </div>
        <Card className="bg-green-50 border-green-200 max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-2 text-left">
              <div className="flex justify-between"><Typography className="text-sm text-gray-700">Mã đặt chỗ:</Typography><Typography className="text-sm font-semibold text-green-700">{bookingNumber}</Typography></div>
              {transactionId && <div className="flex justify-between"><Typography className="text-sm text-gray-700">Mã giao dịch:</Typography><Typography className="text-sm">{transactionId}</Typography></div>}
              <div className="flex justify-between"><Typography className="text-sm text-gray-700">Số tiền:</Typography><Typography className="text-sm font-semibold">{new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(amount)}</Typography></div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-center gap-4">
          <Button onClick={() => (window.location.href = '/')}>Về trang chủ</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/driver-service')}>Đặt chuyến khác</Button>
        </div>
      </CardContent>
    </Card>
  );
}

