'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import EmailVerificationAlert from './EmailVerificationAlert';
import msgError from '@/helper/msg-error';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowEmailVerification(false);

    try {
      const result = await login(formData.email, formData.password);
      console.log(result, 'result')

      if (result.success) {
        // Use router.push since we now have event system for auth state updates
        router.push('/');
      } else {
        // Check if error is due to email not verified
        if (result.error?.code === 'EMAIL_NOT_VERIFIED') {
          setUserEmail(result.error.email || formData.email);
          setShowEmailVerification(true);
          setError('');
        } else {
          setError(result.error?.message || 'Login failed');
        }

        if(result.error.message === msgError.failInforLogin) {
          setError("Email hoặc mật khẩu không đúng");
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* {showEmailVerification && (
        <EmailVerificationAlert
          email={userEmail}
          onClose={() => setShowEmailVerification(false)}
        />
      )} */}

      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.336-3.236.938-4.675m1.675-2.175A9.956 9.956 0 0112 3c5.523 0 10 4.477 10 10 0 1.657-.336 3.236-.938 4.675m-1.675 2.175A9.956 9.956 0 0112 21c-2.21 0-4.268-.72-5.938-1.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.832-.64 1.624-1.09 2.357M15.54 15.54A9.956 9.956 0 0112 19c-2.21 0-4.268-.72-5.938-1.95" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      {/* Đăng ký tài khoản */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Đăng ký tài khoản
          </Link>
        </p>
      </div>
    </form>
  );
}