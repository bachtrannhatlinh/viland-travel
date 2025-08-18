'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import EmailVerificationAlert from './EmailVerificationAlert';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowEmailVerification(false);

    try {
      const result = await login(formData.email, formData.password);

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
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showEmailVerification && (
        <EmailVerificationAlert
          email={userEmail}
          onClose={() => setShowEmailVerification(false)}
        />
      )}

      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
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