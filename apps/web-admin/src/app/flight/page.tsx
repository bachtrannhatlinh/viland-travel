
"use client";
import FlightBookingList from "./FlightBookingList";

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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "../../lib/utils";

interface Flight {
  id: string;
  flight_number: string;
  airline: string;
  departure_city: string;
  arrival_city: string;
  departure_date: string;
  arrival_date: string;
  status: string;
}

export default function AdminFlightPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editFlight, setEditFlight] = useState<Flight | null>(null);

  // Form state
  const [form, setForm] = useState<Partial<Flight>>({});

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/flights");
      setFlights(data.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditFlight(null);
    setForm({});
    setOpen(true);
  };

  const handleOpenEdit = (flight: Flight) => {
    setEditFlight(flight);
    setForm(flight);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditFlight(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editFlight) {
      await apiClient.put(`/flight/${editFlight.id}`, form);
    } else {
      await apiClient.post("/flight", form);
    }
    handleClose();
    fetchFlights();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa chuyến bay này?")) return;
    await apiClient.delete(`/flight/${id}`);
    fetchFlights();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý chuyến bay</h1>
        <Button onClick={handleOpenAdd}>Thêm chuyến bay</Button>
      </div>

      <Table className="mb-10">
        <TableCaption>Danh sách chuyến bay</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Mã chuyến</TableHead>
            <TableHead>Hãng</TableHead>
            <TableHead>Điểm đi</TableHead>
            <TableHead>Điểm đến</TableHead>
            <TableHead>Ngày đi</TableHead>
            <TableHead>Ngày đến</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8}>Đang tải...</TableCell>
            </TableRow>
          ) : flights.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            flights.map((flight) => (
              <TableRow key={flight.id}>
                <TableCell>{flight.flight_number}</TableCell>
                <TableCell>{flight.airline}</TableCell>
                <TableCell>{flight.departure_city}</TableCell>
                <TableCell>{flight.arrival_city}</TableCell>
                <TableCell>{flight.departure_date}</TableCell>
                <TableCell>{flight.arrival_date}</TableCell>
                <TableCell>{flight.status}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEdit(flight)}>Sửa</Button>
                  <Button
                    className="ml-2"
                    onClick={() => handleDelete(flight.id)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

  <FlightBookingList />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editFlight ? "Sửa chuyến bay" : "Thêm chuyến bay"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="flight_number"
              placeholder="Mã chuyến bay"
              value={form.flight_number || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="airline"
              placeholder="Hãng"
              value={form.airline || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="departure_city"
              placeholder="Điểm đi"
              value={form.departure_city || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="arrival_city"
              placeholder="Điểm đến"
              value={form.arrival_city || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="departure_date"
              placeholder="Ngày đi (YYYY-MM-DD)"
              value={form.departure_date || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="arrival_date"
              placeholder="Ngày đến (YYYY-MM-DD)"
              value={form.arrival_date || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="status"
              placeholder="Trạng thái"
              value={form.status || ""}
              onChange={handleChange}
              required
            />
            <DialogFooter>
              <Button type="submit">Lưu</Button>
              <Button type="button" onClick={handleClose}>
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
