"use client";
import { useEffect, useState } from "react";
import BookingDetailModal from "./BookingDetailModal";

interface Booking {
  id: string;
  booking_number: string;
  booking_type: string;
  status: string;
  total_amount: number;
  created_at: string;
  [key: string]: any;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/bookings/my-bookings", {
          credentials: "include"
        });
        if (!res.ok) throw new Error("Không thể lấy lịch sử booking");
        const data = await res.json();
        setBookings(data.data || []);
      } catch (err: any) {
        setError(err.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = filter
    ? bookings.filter((b) =>
        b.booking_type?.toLowerCase().includes(filter.toLowerCase()) ||
        b.status?.toLowerCase().includes(filter.toLowerCase()) ||
        b.booking_number?.toLowerCase().includes(filter.toLowerCase())
      )
    : bookings;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Lịch sử đặt dịch vụ</h1>
      <input
        className="border px-2 py-1 mb-4 w-full"
        placeholder="Lọc theo mã booking, loại dịch vụ, trạng thái..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && filteredBookings.length === 0 && <div>Bạn chưa có booking nào.</div>}
      <ul className="space-y-4">
        {filteredBookings.map((b) => (
          <li key={b.id} className="border rounded p-4 shadow hover:bg-gray-50 cursor-pointer">
            <div className="font-semibold">
              <a
                href={`/my-bookings/${b.id}`}
                className="text-blue-600 hover:underline"
                onClick={e => {
                  e.preventDefault();
                  setSelectedBooking(b);
                }}
              >
                Mã booking: {b.booking_number}
              </a>
            </div>
            <div>Loại dịch vụ: {b.booking_type}</div>
            <div>Trạng thái: {b.status}</div>
            <div>Ngày đặt: {new Date(b.created_at).toLocaleString()}</div>
            <div>Tổng tiền: {b.total_amount?.toLocaleString()} VND</div>
          </li>
        ))}
      </ul>
      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}
