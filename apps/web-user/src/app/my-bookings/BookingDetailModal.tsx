"use client";
import React from "react";

interface BookingDetailModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-2">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fadeIn">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 rounded-full p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition"
          onClick={onClose}
          aria-label="Đóng"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {/* Header */}
        <div className="px-6 pt-6 pb-2 border-b flex items-center gap-2">
          <span className="inline-block bg-blue-100 text-blue-700 rounded px-2 py-1 text-xs font-semibold">{booking.booking_type}</span>
          <h2 className="text-lg font-bold flex-1">Chi tiết booking</h2>
        </div>
        {/* Content */}
        <div className="px-6 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <div><span className="text-gray-500 text-xs">Mã booking</span><div className="font-semibold">{booking.booking_number}</div></div>
          <div><span className="text-gray-500 text-xs">Trạng thái</span><div>{booking.status}</div></div>
          <div><span className="text-gray-500 text-xs">Ngày đặt</span><div>{new Date(booking.created_at).toLocaleString()}</div></div>
          <div><span className="text-gray-500 text-xs">Tổng tiền</span><div className="font-semibold text-green-700">{booking.total_amount?.toLocaleString()} VND</div></div>
          {booking.contact_info && (
            <div className="sm:col-span-2"><span className="text-gray-500 text-xs">Liên hệ</span><div>{booking.contact_info.name} - {booking.contact_info.phone}</div></div>
          )}
          {booking.special_requests && (
            <div className="sm:col-span-2"><span className="text-gray-500 text-xs">Yêu cầu đặc biệt</span><div>{booking.special_requests}</div></div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
      `}</style>
    </div>
  );
}
