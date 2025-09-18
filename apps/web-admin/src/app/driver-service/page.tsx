
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

interface Driver {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  trips: number;
  price: number;
  status: string;
}

export default function AdminDriverServicePage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState<Partial<Driver>>({});

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const data = await apiClient.get("/driver-service");
      setDrivers(data.data || []);
    } catch (err) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditDriver(null);
    setForm({});
    setOpen(true);
  };

  const handleOpenEdit = (driver: Driver) => {
    setEditDriver(driver);
    setForm(driver);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditDriver(null);
    setForm({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editDriver) {
      await apiClient.put(`/driver-service/${editDriver.id}`, form);
    } else {
      await apiClient.post("/driver-service", form);
    }
    handleClose();
    fetchDrivers();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài xế này?")) return;
    await apiClient.delete(`/driver-service/${id}`);
    fetchDrivers();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài xế</h1>
        <Button onClick={handleOpenAdd}>Thêm tài xế</Button>
      </div>
      <Table>
        <TableCaption>Danh sách tài xế</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Tên tài xế</TableHead>
            <TableHead>Phương tiện</TableHead>
            <TableHead>Đánh giá</TableHead>
            <TableHead>Số chuyến</TableHead>
            <TableHead>Giá dịch vụ</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Đang tải...</TableCell>
            </TableRow>
          ) : drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>Không có dữ liệu</TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>{driver.name}</TableCell>
                <TableCell>{driver.vehicle}</TableCell>
                <TableCell>{driver.rating}</TableCell>
                <TableCell>{driver.trips}</TableCell>
                <TableCell>{driver.price}</TableCell>
                <TableCell>{driver.status}</TableCell>
                <TableCell>
                  <Button className="h-8 px-3 text-xs" onClick={() => handleOpenEdit(driver)}>
                    Sửa
                  </Button>
                  <Button className="h-8 px-3 text-xs bg-red-500 hover:bg-red-600 ml-2" onClick={() => handleDelete(driver.id)}>
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
            <DialogTitle>{editDriver ? "Sửa tài xế" : "Thêm tài xế"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Tên tài xế"
              value={form.name || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="vehicle"
              placeholder="Phương tiện"
              value={form.vehicle || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="rating"
              placeholder="Đánh giá"
              type="number"
              value={form.rating || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="trips"
              placeholder="Số chuyến"
              type="number"
              value={form.trips || ""}
              onChange={handleChange}
              required
            />
            <Input
              name="price"
              placeholder="Giá dịch vụ"
              type="number"
              value={form.price || ""}
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
