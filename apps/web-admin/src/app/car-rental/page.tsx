
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

interface CarRental {
  id: string;
  name: string;
  type: string;
  seats: number;
  price_per_day: number;
  status: string;
}

export default function AdminCarRentalPage() {
  const [cars, setCars] = useState<CarRental[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editCar, setEditCar] = useState<CarRental | null>(null);
  const [form, setForm] = useState<Partial<CarRental>>({});

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/car-rental");
      setCars(data.data || []);
    } catch {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditCar(null);
    setForm({});
    setOpen(true);
  };

  const handleOpenEdit = (car: CarRental) => {
    setEditCar(car);
    setForm(car);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditCar(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editCar) {
      await apiClient.put(`/car-rental/${editCar.id}`, form);
    } else {
      await apiClient.post("/car-rental", form);
    }
    handleClose();
    fetchCars();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa xe này?")) return;
    await apiClient.delete(`/car-rental/${id}`);
    fetchCars();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý thuê xe</h1>
        <Button onClick={handleOpenAdd}>Thêm xe</Button>
      </div>
      <Table>
        <TableCaption>Danh sách xe</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tên xe</TableHead>
            <TableHead>Loại</TableHead>
            <TableHead>Số chỗ</TableHead>
            <TableHead>Giá/ngày</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Đang tải...</TableCell>
            </TableRow>
          ) : cars.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            cars.map((car) => (
              <TableRow key={car.id}>
                <TableCell>{car.name}</TableCell>
                <TableCell>{car.type}</TableCell>
                <TableCell>{car.seats}</TableCell>
                <TableCell>{car.price_per_day}</TableCell>
                <TableCell>{car.status}</TableCell>
                <TableCell>
                  <Button className="h-8 px-3 text-xs" onClick={() => handleOpenEdit(car)}>
                    Sửa
                  </Button>
                  <Button className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 ml-2" onClick={() => handleDelete(car.id)}>
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
            <DialogTitle>{editCar ? "Sửa xe" : "Thêm xe"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Tên xe"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="type"
              placeholder="Loại xe"
              value={form.type || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="seats"
              placeholder="Số chỗ"
              type="number"
              value={form.seats || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="price_per_day"
              placeholder="Giá/ngày"
              type="number"
              value={form.price_per_day || ""}
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
