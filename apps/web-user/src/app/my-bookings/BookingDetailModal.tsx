"use client";
import React from "react";

interface BookingDetailModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-2">Chi tiết booking</h2>
        <div className="mb-2"><b>Mã booking:</b> {booking.booking_number}</div>
        <div className="mb-2"><b>Loại dịch vụ:</b> {booking.booking_type}</div>
        <div className="mb-2"><b>Trạng thái:</b> {booking.status}</div>
        <div className="mb-2"><b>Ngày đặt:</b> {new Date(booking.created_at).toLocaleString()}</div>
        <div className="mb-2"><b>Tổng tiền:</b> {booking.total_amount?.toLocaleString()} VND</div>
        {booking.contact_info && (
          <div className="mb-2"><b>Liên hệ:</b> {booking.contact_info.name} - {booking.contact_info.phone}</div>
        )}
        {booking.special_requests && (
          <div className="mb-2"><b>Yêu cầu đặc biệt:</b> {booking.special_requests}</div>
        )}
        {/* Hiển thị thêm các trường chi tiết khác nếu cần */}
      </div>
    </div>
  );
}
