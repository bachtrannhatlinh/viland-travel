"use client";
import { useEffect, useState } from "react";
import BookingDetailModal from "./BookingDetailModal";
import { apiClient } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { Input } from "@/components/ui/input";

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
        const data = await apiClient.get('/bookings/my-bookings');
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
    <div className="max-w-5xl mx-auto py-8">
      <Typography variant="h2" className="mb-4">Lịch sử đặt dịch vụ</Typography>
      <Input
        className="mb-4"
        placeholder="Lọc theo mã booking, loại dịch vụ, trạng thái..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      {loading && <div>Đang tải...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && filteredBookings.length === 0 && <div>Bạn chưa có booking nào.</div>}
      {!loading && filteredBookings.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã booking</TableHead>
              <TableHead>Loại dịch vụ</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày đặt</TableHead>
              <TableHead>Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBookings.map((b) => (
              <TableRow key={b.id} className="cursor-pointer" onClick={() => setSelectedBooking(b)}>
                <TableCell className="font-semibold text-blue-600">
                  <a
                    href={`/my-bookings/${b.id}`}
                    className="hover:underline"
                    onClick={e => {
                      e.preventDefault();
                      setSelectedBooking(b);
                    }}
                  >
                    {b.booking_number}
                  </a>
                </TableCell>
                <TableCell>{b.booking_type}</TableCell>
                <TableCell>
                  <span className={
                    b.status === 'pending' ? 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs' :
                    b.status === 'completed' ? 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs' :
                    b.status === 'cancelled' ? 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs' :
                    'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs'
                  }>
                    {b.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(b.created_at).toLocaleString()}</TableCell>
                <TableCell>{b.total_amount?.toLocaleString()} VND</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {selectedBooking && (
        <BookingDetailModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
}
