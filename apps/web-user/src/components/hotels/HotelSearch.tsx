'use client';

import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { useListFilterStore } from '@/store/listFilterStore';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Typography } from '@/components/ui/typography';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

interface SearchFormData {
  destination: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  adults: number;
  children: number;
}

interface HotelSearchProps {
  onSearch: (searchData: SearchFormData) => void;
  loading?: boolean;
}

const formSchema = z.object({
  destination: z.string().min(1, 'Vui lòng nhập điểm đến'),
  checkIn: z.string().min(1, 'Vui lòng chọn ngày nhận phòng'),
  checkOut: z.string().min(1, 'Vui lòng chọn ngày trả phòng'),
  rooms: z.number().min(1).max(5),
  adults: z.number().min(1).max(6),
  children: z.number().min(0).max(4),
}).refine((data) => {
  if (data.checkIn && data.checkOut) {
    return new Date(data.checkOut) > new Date(data.checkIn);
  }
  return true;
}, {
  message: "Ngày trả phòng phải sau ngày nhận phòng",
  path: ["checkOut"],
});

export default function HotelSearch({ onSearch, loading = false }: HotelSearchProps) {
  // Set minimum dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { search, filters, setSearch, setFilter, reset } = useListFilterStore();
  const form = useForm<SearchFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: filters.destination || '',
      checkIn: filters.checkIn || '',
      checkOut: filters.checkOut || '',
      rooms: filters.rooms || 1,
      adults: filters.adults || 2,
      children: filters.children || 0,
    },
  });

  useEffect(() => {
    form.reset({
      destination: filters.destination || '',
      checkIn: filters.checkIn || '',
      checkOut: filters.checkOut || '',
      rooms: filters.rooms || 1,
      adults: filters.adults || 2,
      children: filters.children || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (data: SearchFormData) => {
    setFilter('destination', data.destination);
    setFilter('checkIn', data.checkIn);
    setFilter('checkOut', data.checkOut);
    setFilter('rooms', data.rooms);
    setFilter('adults', data.adults);
    setFilter('children', data.children);
    setSearch(data.destination);
    onSearch(data);
  };

  return (
    <Card className="p-6 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Destination */}
            <div className="lg:col-span-1">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <MapPin className="w-4 h-4 mr-1" />
                      Điểm đến
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Thành phố, tên khách sạn..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Check-in Date */}
            <div>
              <FormField
                control={form.control}
                name="checkIn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-1" />
                      Ngày nhận phòng
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Chọn ngày nhận phòng"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Check-out Date */}
            <div>
              <FormField
                control={form.control}
                name="checkOut"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                      <Calendar className="w-4 h-4 mr-1" />
                      Ngày trả phòng
                    </FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Chọn ngày trả phòng"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Guests & Rooms */}
            <div>
              <Typography variant="small" className="flex items-center text-sm font-medium text-gray-700 mb-3">
                <Users className="w-4 h-4 mr-1" />
                Phòng & Khách
              </Typography>
              <div className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="rooms"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} phòng</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adults"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} người lớn</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="children"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Select value={field.value.toString()} onValueChange={(value) => field.onChange(parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[0, 1, 2, 3, 4].map(num => (
                              <SelectItem key={num} value={num.toString()}>{num} trẻ em</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <div className="mt-6 text-center">
            <Button
              type="submit"
              disabled={loading}
              className="px-8 py-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <Typography variant="small" className="text-white">Đang tìm kiếm...</Typography>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  <Typography variant="small" className="text-white">Tìm kiếm khách sạn</Typography>
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
