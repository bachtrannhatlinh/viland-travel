"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";

export interface Driver {
  id: string;
  name: string;
  rating: number;
  trips: number;
  vehicle: string;
  price: number;
}

interface Props {
  itineraryId: string;
  onSelectDriver: (driver: Driver) => void;
}

export default function DriverList({ itineraryId, onSelectDriver }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrivers = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/driver-service/search?itineraryId=${encodeURIComponent(itineraryId)}`);
        const data = await res.json();
        setDrivers(data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, [itineraryId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chọn tài xế</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Typography>Đang tìm tài xế phù hợp...</Typography>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {drivers.map((d) => (
              <div key={d.id} className="flex items-center justify-between border rounded-md p-4 bg-white">
                <div>
                  <Typography variant="h3" className="text-lg font-semibold">{d.name}</Typography>
                  <Typography className="text-sm text-gray-600">Xe: {d.vehicle} • ⭐ {d.rating} • {d.trips} chuyến</Typography>
                </div>
                <div className="text-right">
                  <Typography className="font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(d.price)}</Typography>
                  <Button className="mt-2" onClick={() => onSelectDriver(d)}>Đặt tài xế này</Button>
                </div>
              </div>
            ))}
            {drivers.length === 0 && (
              <Typography>Không tìm thấy tài xế phù hợp cho lịch trình này.</Typography>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

