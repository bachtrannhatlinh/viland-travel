'use client';

import { Button } from "@/components/ui/button";
import Link from 'next/link';

export default function AuthNavigationDemo() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Auth Navigation Demo</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Login Demo */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Login Page</h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Trang đăng nhập với link chuyển đến register
            </div>
            <Link href="/login">
              <Button className="w-full">
                Đi đến trang Đăng nhập
              </Button>
            </Link>
          </div>
        </div>

        {/* Register Demo */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Register Page</h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              Trang đăng ký với link chuyển đến login
            </div>
            <Link href="/register">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                Đi đến trang Đăng ký
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Chức năng đã thêm:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✅ Trang login có link "Đăng ký tài khoản" chuyển đến /register</li>
          <li>✅ Trang register có link "Đăng nhập" chuyển đến /login</li>
          <li>✅ Styling đẹp với hover effects</li>
          <li>✅ Navigation hai chiều giữa login và register</li>
        </ul>
      </div>
    </div>
  );
}
