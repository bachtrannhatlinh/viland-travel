
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
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiClient } from "../../lib/utils";

interface Hotel {
  id: string;
  name: string;
  city: string;
  star_rating: number;
  price_from: number;
  status: string;
}

export default function AdminHotelPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<Hotel | null>(null);
  const [form, setForm] = useState<Partial<Hotel>>({});

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/hotel");
      setHotels(data.data || []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditHotel(null);
    setForm({});
    setOpen(true);
  };

  const handleOpenEdit = (hotel: Hotel) => {
    setEditHotel(hotel);
    setForm(hotel);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditHotel(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editHotel) {
      await apiClient.put(`/hotel/${editHotel.id}`, form);
    } else {
      await apiClient.post("/hotel", form);
    }
    handleClose();
    fetchHotels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa khách sạn này?")) return;
    await apiClient.delete(`/hotel/${id}`);
    fetchHotels();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý khách sạn</h1>
        <Button onClick={handleOpenAdd}>Thêm khách sạn</Button>
      </div>
      <Table>
        <TableCaption>Danh sách khách sạn</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tên khách sạn</TableHead>
            <TableHead>Thành phố</TableHead>
            <TableHead>Hạng sao</TableHead>
            <TableHead>Giá từ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Đang tải...</TableCell>
            </TableRow>
          ) : hotels.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            hotels.map((hotel) => (
              <TableRow key={hotel.id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.city}</TableCell>
                <TableCell>{hotel.star_rating}</TableCell>
                <TableCell>{hotel.price_from}</TableCell>
                <TableCell>{hotel.status}</TableCell>
                <TableCell>
                  <Button className="h-8 px-3 text-xs" onClick={() => handleOpenEdit(hotel)}>
                    Sửa
                  </Button>
                  <Button className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 ml-2" onClick={() => handleDelete(hotel.id)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editHotel ? "Sửa khách sạn" : "Thêm khách sạn"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Tên khách sạn"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="city"
              placeholder="Thành phố"
              value={form.city || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="star_rating"
              placeholder="Hạng sao"
              type="number"
              value={form.star_rating || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="price_from"
              placeholder="Giá từ"
              type="number"
              value={form.price_from || ""}
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
              <Button type="button" className="bg-gray-200 text-gray-800" onClick={handleClose}>
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
