"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  useEffect(() => {
    // Kiểm tra token admin, nếu không có thì redirect về login
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-blue-950 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-800 dark:text-white mb-8 text-center">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">📦</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Tour</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Tạo, sửa, xóa và xem danh sách tour du lịch.</p>
            <a href="/tour" className="text-blue-600 hover:underline font-medium">Đi tới Tour</a>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">✈️</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Chuyến bay</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Quản lý thông tin chuyến bay, đặt vé, cập nhật trạng thái.</p>
            <a href="/flight" className="text-blue-600 hover:underline font-medium">Đi tới Chuyến bay</a>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">🏨</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Khách sạn</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Thêm, sửa, xóa và duyệt danh sách khách sạn.</p>
            <a href="/hotel" className="text-blue-600 hover:underline font-medium">Đi tới Khách sạn</a>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">🚗</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Thuê xe</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Quản lý dịch vụ thuê xe, đặt xe, cập nhật trạng thái.</p>
            <a href="/car-rental" className="text-blue-600 hover:underline font-medium">Đi tới Thuê xe</a>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">🧑‍✈️</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Tài xế</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Quản lý thông tin tài xế, phân công, cập nhật trạng thái.</p>
            <a href="/driver-service" className="text-blue-600 hover:underline font-medium">Đi tới Tài xế</a>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
            <span className="text-blue-600 text-4xl mb-2">👤</span>
            <h2 className="text-lg font-semibold mb-1">Quản lý Người dùng</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 text-center">Xem, sửa, phân quyền người dùng hệ thống.</p>
            <a href="/user" className="text-blue-600 hover:underline font-medium">Đi tới Người dùng</a>
          </div>
        </div>
      </div>
    </div>
  );
}
