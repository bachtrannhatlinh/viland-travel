'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/utils';
import { toast } from 'react-toastify';
import Link from 'next/link';

interface ValidationError {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setLoading(false);
      return;
    }

    try {
      let sendFormData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      }

      const result = await apiClient.post('/auth/register', sendFormData)

      if (result.success) {
        toast.success('Registration successful! Redirecting to login...', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => router.push('/login'), 1500);
      } else {
        // Handle validation errors - check both result.error.details and result.details
        const details = result.error?.details || result.details;

        if (details && Array.isArray(details)) {
          const errors: Record<string, string[]> = {};
          details.forEach((detail: ValidationError) => {
            if (!errors[detail.path]) {
              errors[detail.path] = [];
            }
            errors[detail.path].push(detail.msg);
          });
          setFieldErrors(errors);
        } else {
          const errorMsg = result.error?.message || result.message || 'Registration failed';
          setError(errorMsg);
          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      }
    } catch (err: any) {
      // True network error (fetch failed)
      const errorMsg = 'Network error. Please try again.';
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
          className={fieldErrors.firstName?.length ? 'border-red-500' : ''}
          required
        />
        <ErrorMessage message={fieldErrors.firstName} />
      </div>

      <div>
        <Input
          type="text"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
          className={fieldErrors.lastName?.length ? 'border-red-500' : ''}
          required
        />
        <ErrorMessage message={fieldErrors.lastName} />
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          className={fieldErrors.email?.length ? 'border-red-500' : ''}
          required
        />
        <ErrorMessage message={fieldErrors.email} />
      </div>

      <div>
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          className={fieldErrors.password?.length ? 'border-red-500' : ''}
          required
        />
        <ErrorMessage message={fieldErrors.password} />
      </div>

      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
          required
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
      </Button>

      {/* Đăng nhập */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </form>
  );
}
