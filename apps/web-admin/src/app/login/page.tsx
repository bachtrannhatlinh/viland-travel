"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../lib/utils";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
  const data = await apiClient.post("/auth/login", { email: username, password, adminOnly: true });
      // Kiểm tra role trả về từ server
      if (!data.data?.user || data.data.user.role !== "admin") {
        throw new Error("Bạn không có quyền truy cập admin.");
      }
  // Lưu token vào localStorage hoặc cookie
  // Ưu tiên accessToken nếu có, fallback sang token
  const token = data.data.accessToken || data.data.token;
  if (!token) throw new Error("Không nhận được access token từ server");
  localStorage.setItem("admin_token", token);
  router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-900 dark:to-blue-950 transition-colors">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-800 flex flex-col gap-6 animate-fade-in"
      >
        <div className="flex flex-col items-center gap-2 mb-2">
          <div className="bg-blue-600 text-white rounded-full p-3 mb-2 shadow-lg">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">Đăng nhập Quản trị</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Chỉ dành cho Admin hệ thống</p>
        </div>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="username">Tên đăng nhập</label>
          <input
            id="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition"
            required
            autoFocus
          />
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="password">Mật khẩu</label>
          <input
            id="password"
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white transition"
            required
          />
        </div>
        {error && <div className="text-red-500 text-center text-sm font-medium -mt-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition-colors text-base mt-2"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
