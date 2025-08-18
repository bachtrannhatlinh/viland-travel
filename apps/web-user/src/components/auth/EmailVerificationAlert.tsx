'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/utils';
import { toast } from 'react-toastify';

interface EmailVerificationAlertProps {
  email: string;
  onClose: () => void;
}

export default function EmailVerificationAlert({ email, onClose }: EmailVerificationAlertProps) {
  const [isResending, setIsResending] = useState(false);

  const handleResendEmail = async () => {
    try {
      setIsResending(true);
      
      const result = await apiClient.post('/auth/resend-verification', { email });
      
      if (result.success) {
        toast.success('📧 Email xác thực đã được gửi lại! Vui lòng kiểm tra hộp thư của bạn.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        onClose();
      } else {
        toast.error(result.error?.message || 'Không thể gửi lại email xác thực. Vui lòng thử lại.', {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      toast.error('Có lỗi xảy ra khi gửi email. Vui lòng thử lại.', {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className="text-yellow-600 text-xl">⚠️</div>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Tài khoản chưa được kích hoạt
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Tài khoản của bạn chưa được xác thực email. Vui lòng kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên kết xác thực.
            </p>
          </div>
          <div className="mt-4 flex space-x-2">
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              size="sm"
              variant="outline"
              className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
            >
              {isResending ? 'Đang gửi...' : 'Gửi lại email xác thực'}
            </Button>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-yellow-800 hover:bg-yellow-100"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
