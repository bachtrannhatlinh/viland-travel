"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { apiClient } from "../../lib/utils";

interface Booking {
  id: string;
  booking_number: string;
  user_id: string;
  service_id: string;
  status: string;
  total_amount: number;
  created_at: string;
}

export default function FlightBookingList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/bookings?bookingType=flight");
      setBookings(res.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  // Helper: format tiền
  const formatMoney = (amount: number) => amount.toLocaleString("vi-VN");
  // Helper: badge trạng thái
  const StatusBadge = ({ status }: { status: string }) => {
    let color = "bg-gray-200 text-gray-700";
    if (status === "pending") color = "bg-yellow-100 text-yellow-800";
    if (status === "paid") color = "bg-green-100 text-green-800";
    if (status === "cancelled") color = "bg-red-100 text-red-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{status}</span>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Danh sách booking chuyến bay của user</h2>
      <div className="w-full max-w-6xl overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <Table>
          <TableCaption className="text-base font-medium">Danh sách booking flight</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Mã booking</TableHead>
              <TableHead className="min-w-[180px]">User ID</TableHead>
              <TableHead className="min-w-[180px]">Flight ID</TableHead>
              <TableHead className="min-w-[120px]">Trạng thái</TableHead>
              <TableHead className="min-w-[120px] text-right">Tổng tiền</TableHead>
              <TableHead className="min-w-[160px]">Ngày tạo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Đang tải...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Không có dữ liệu</TableCell>
              </TableRow>
            ) : (
              bookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.booking_number}</TableCell>
                  <TableCell className="truncate max-w-[180px]">{b.user_id}</TableCell>
                  <TableCell className="truncate max-w-[180px]">{b.service_id}</TableCell>
                  <TableCell><StatusBadge status={b.status} /></TableCell>
                  <TableCell className="text-right">{formatMoney(b.total_amount)}</TableCell>
                  <TableCell>{b.created_at ? new Date(b.created_at).toLocaleString() : ""}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
