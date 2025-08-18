'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/utils';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface VerificationState {
  loading: boolean;
  success: boolean;
  error: string;
  message: string;
}

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [state, setState] = useState<VerificationState>({
    loading: true,
    success: false,
    error: '',
    message: ''
  });

  useEffect(() => {
    if (!token) {
      setState({
        loading: false,
        success: false,
        error: 'Token xác thực không hợp lệ',
        message: ''
      });
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: '', message: '' }));

      const result = await apiClient.get(`/auth/verify-email/${token}`);

      if (result.success) {
        setState({
          loading: false,
          success: true,
          error: '',
          message: result.message || 'Email đã được xác thực thành công!'
        });

        toast.success('🎉 Email đã được xác thực thành công! Tài khoản của bạn đã được kích hoạt.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setState({
          loading: false,
          success: false,
          error: result.error?.message || 'Xác thực email thất bại',
          message: ''
        });

        toast.error(result.error?.message || 'Xác thực email thất bại', {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error: any) {
      setState({
        loading: false,
        success: false,
        error: 'Có lỗi xảy ra khi xác thực email. Vui lòng thử lại.',
        message: ''
      });

      toast.error('Có lỗi xảy ra khi xác thực email. Vui lòng thử lại.', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };

  const handleResendEmail = async () => {
    // This would need the user's email - for now just redirect to login
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Xác thực Email
          </h2>
          <p className="mt-2 text-gray-600">
            ViLand Travel
          </p>
        </div>

        <div className="text-center">
          {state.loading && (
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Đang xác thực email của bạn...</p>
            </div>
          )}

          {state.success && (
            <div className="space-y-4">
              <div className="text-green-600 text-6xl">✅</div>
              <h3 className="text-xl font-semibold text-green-600">Xác thực thành công!</h3>
              <p className="text-gray-600">{state.message}</p>
              <p className="text-sm text-gray-500">
                Bạn sẽ được chuyển đến trang đăng nhập trong 3 giây...
              </p>
              <Link href="/login">
                <Button className="w-full">
                  Đăng nhập ngay
                </Button>
              </Link>
            </div>
          )}

          {state.error && !state.loading && (
            <div className="space-y-4">
              <div className="text-red-600 text-6xl">❌</div>
              <h3 className="text-xl font-semibold text-red-600">Xác thực thất bại</h3>
              <p className="text-gray-600">{state.error}</p>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  Token có thể đã hết hạn hoặc không hợp lệ.
                </p>
                <div className="flex flex-col space-y-2">
                  <Button onClick={handleResendEmail} variant="outline">
                    Gửi lại email xác thực
                  </Button>
                  <Link href="/login">
                    <Button className="w-full">
                      Quay lại đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
