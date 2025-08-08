"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

export type ServiceType = "one-way" | "round-trip" | "hourly" | "daily";

export interface ItineraryData {
  pickupLocation: string;
  dropoffLocation?: string;
  date: string;
  time: string;
  serviceType: ServiceType;
  notes?: string;
}

interface Props {
  onSubmit: (data: ItineraryData) => void;
}

export default function ItineraryForm({ onSubmit }: Props) {
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [serviceType, setServiceType] = useState<ServiceType>("one-way");
  const [notes, setNotes] = useState("");

  const canSubmit = pickupLocation && date && time && (!!dropoffLocation || serviceType !== "one-way");

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ pickupLocation, dropoffLocation, date, time, serviceType, notes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nhập lịch trình</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="mb-2 block">Điểm đón</Label>
            <Input placeholder="Địa chỉ đón" value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2 block">Điểm đến</Label>
            <Input placeholder="Địa chỉ đến (bỏ trống nếu thuê theo giờ/ngày)" value={dropoffLocation} onChange={(e) => setDropoffLocation(e.target.value)} />
          </div>
          <div>
            <Label className="mb-2 block">Ngày sử dụng</Label>
            <DatePicker placeholder="Chọn ngày" value={date} onChange={(v: any) => setDate(v)} />
          </div>
          <div>
            <Label className="mb-2 block">Thời gian</Label>
            <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-2 block">Loại dịch vụ</Label>
            <Select value={serviceType} onValueChange={(v) => setServiceType(v as ServiceType)}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại dịch vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-way">Một chiều</SelectItem>
                <SelectItem value="round-trip">Khứ hồi</SelectItem>
                <SelectItem value="hourly">Thuê theo giờ</SelectItem>
                <SelectItem value="daily">Thuê theo ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label className="mb-2 block">Ghi chú lịch trình</Label>
            <Textarea rows={4} placeholder="Mô tả chi tiết lịch trình, yêu cầu đặc biệt..." value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <Button className="w-full py-3" disabled={!canSubmit} onClick={handleSubmit}>
              Tìm tài xế phù hợp
            </Button>
            {!canSubmit && (
              <Typography variant="small" className="text-sm text-gray-500 mt-2 block">
                Vui lòng nhập tối thiểu Điểm đón, Ngày, Giờ. Điểm đến bắt buộc cho dịch vụ Một chiều/Khứ hồi.
              </Typography>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

