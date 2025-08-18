'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from 'next/link';

export default function EmailVerificationDemo() {
  const [testEmail, setTestEmail] = useState('test@example.com');

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Email Verification Flow Demo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flow Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🔄 Email Verification Flow</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>User đăng ký tài khoản mới</li>
              <li>Hệ thống tạo email verification token</li>
              <li>Gửi email chứa link xác thực</li>
              <li>User click link trong email</li>
              <li>Tài khoản được kích hoạt</li>
              <li>User có thể đăng nhập</li>
            </ol>
          </div>
        </div>

        {/* Test Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🧪 Test Links</h3>
          <div className="space-y-3">
            <Link href="/register">
              <Button className="w-full">
                1. Đăng ký tài khoản mới
              </Button>
            </Link>
            
            <Link href="/login">
              <Button variant="outline" className="w-full">
                2. Thử đăng nhập (sẽ báo chưa verify)
              </Button>
            </Link>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">3. Test verification link:</label>
              <Input
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Email để test"
              />
              <Link href={`/verify-email/test-token-123`}>
                <Button variant="outline" className="w-full">
                  Test Verify Email Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Implemented */}
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h4 className="font-semibold text-green-900 mb-3">✅ Chức năng đã thực thi:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
          <div>
            <h5 className="font-medium mb-2">Backend:</h5>
            <ul className="space-y-1">
              <li>✅ Email verification token generation</li>
              <li>✅ Verify email endpoint</li>
              <li>✅ Resend verification email</li>
              <li>✅ Login check email verification</li>
              <li>✅ Email template (Vietnamese)</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Frontend:</h5>
            <ul className="space-y-1">
              <li>✅ Verify email page với token</li>
              <li>✅ Email verification alert</li>
              <li>✅ Resend email functionality</li>
              <li>✅ Toast notifications</li>
              <li>✅ Responsive UI</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
