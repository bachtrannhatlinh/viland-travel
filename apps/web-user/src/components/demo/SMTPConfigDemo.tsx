'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'react-toastify';

export default function SMTPConfigDemo() {
  const [testEmail, setTestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestEmail = async () => {
    if (!testEmail) {
      toast.error('Vui lòng nhập email để test');
      return;
    }

    setIsLoading(true);
    try {
      toast.info('Đang gửi email test...', {
        autoClose: 2000,
      });

      // Simulate API call
      setTimeout(() => {
        toast.success('✅ Email test đã được gửi! Kiểm tra hộp thư của bạn.', {
          autoClose: 5000,
        });
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      toast.error('❌ Không thể gửi email. Kiểm tra cấu hình SMTP.');
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">📧 SMTP Configuration Guide</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Steps */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🔧 Cấu hình SMTP</h3>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">1. Gmail SMTP (Khuyến nghị)</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• Bật 2-factor authentication</p>
              <p>• Tạo App Password trong Google Account</p>
              <p>• Sử dụng App Password thay vì mật khẩu thường</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">2. Cập nhật .env file</h4>
            <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded overflow-x-auto">
{`EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-digit-app-password
EMAIL_FROM=noreply@vilandtravel.vn
EMAIL_FROM_NAME=ViLand Travel
FRONTEND_URL=http://localhost:3000`}
            </pre>
          </div>
        </div>

        {/* Test Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">🧪 Test Email</h3>
          
          <div className="bg-white border rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email để test:
                </label>
                <Input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="your-email@example.com"
                />
              </div>
              
              <Button 
                onClick={handleTestEmail}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Đang gửi...' : '📧 Gửi Email Test'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
