'use client';

import { useState } from 'react';
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { ErrorMessage } from "../../src/components/ui/error-message";
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/utils';

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
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
        setSuccess('Registration successful! Redirecting to login...');
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
          setError(result.error?.message || result.message || 'Registration failed');
        }
      }
    } catch (err: any) {
      // True network error (fetch failed)
      setError('Network error. Please try again.');
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
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}
