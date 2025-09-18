
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

interface Tour {
  id: string;
  title: string;
  category: string;
  price_adult: number;
  price_child: number;
  duration: string;
  status: string;
}

export default function AdminTourPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<Partial<Tour>>({});

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/tour");
      setTours(data.data || []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditTour(null);
    setForm({});
    setOpen(true);
  };

  const handleOpenEdit = (tour: Tour) => {
    setEditTour(tour);
    setForm(tour);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditTour(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editTour) {
      await apiClient.put(`/tour/${editTour.id}`, form);
    } else {
      await apiClient.post("/tour", form);
    }
    handleClose();
    fetchTours();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tour này?")) return;
    await apiClient.delete(`/tour/${id}`);
    fetchTours();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tour</h1>
        <Button onClick={handleOpenAdd}>Thêm tour</Button>
      </div>
      <Table>
        <TableCaption>Danh sách tour</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tên tour</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Giá người lớn</TableHead>
            <TableHead>Giá trẻ em</TableHead>
            <TableHead>Thời lượng</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Đang tải...</TableCell>
            </TableRow>
          ) : tours.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.title}</TableCell>
                <TableCell>{tour.category}</TableCell>
                <TableCell>{tour.price_adult}</TableCell>
                <TableCell>{tour.price_child}</TableCell>
                <TableCell>{tour.duration}</TableCell>
                <TableCell>{tour.status}</TableCell>
                <TableCell>
                  <Button className="h-8 px-3 text-xs" onClick={() => handleOpenEdit(tour)}>
                    Sửa
                  </Button>
                  <Button className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 ml-2" onClick={() => handleDelete(tour.id)}>
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
            <DialogTitle>{editTour ? "Sửa tour" : "Thêm tour"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Tên tour"
              value={form.title || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="category"
              placeholder="Danh mục"
              value={form.category || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="price_adult"
              placeholder="Giá người lớn"
              type="number"
              value={form.price_adult || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="price_child"
              placeholder="Giá trẻ em"
              type="number"
              value={form.price_child || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="duration"
              placeholder="Thời lượng"
              value={form.duration || ""}
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
