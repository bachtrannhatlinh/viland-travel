'use client';

import { useState } from 'react';
import { ArrowLeft, User, Mail, Phone, Calendar, Users, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Typography } from '@/components/ui/typography';
import { Section } from '@/components/ui/section';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Hotel, Room } from './HotelList';

const bookingFormSchema = z.object({
  firstName: z.string().min(1, 'Vui lòng nhập họ'),
  lastName: z.string().min(1, 'Vui lòng nhập tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự').regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  specialRequests: z.string().optional(),
  paymentMethod: z.string().min(1, 'Vui lòng chọn phương thức thanh toán'),
})

type BookingFormValues = z.infer<typeof bookingFormSchema>

interface BookingFormProps {
  hotel: Hotel;
  room: Room;
  quantity: number;
  searchData: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  };
  onBack: () => void;
  onSubmitBooking: (bookingData: BookingData) => void;
}

export interface BookingData {
  hotel: Hotel;
  room: Room;
  quantity: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  guests: {
    adults: number;
    children: number;
  };
  contactInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  specialRequests?: string;
  totalAmount: number;
  paymentMethod: string;
}

export default function BookingForm({ 
  hotel, 
  room, 
  quantity, 
  searchData, 
  onBack, 
  onSubmitBooking 
}: BookingFormProps) {
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      specialRequests: '',
      paymentMethod: 'vnpay'
    }
  })

  const checkInDate = new Date(searchData.checkIn);
  const checkOutDate = new Date(searchData.checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalAmount = room.pricing.basePrice * nights * quantity;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const onSubmit = (values: BookingFormValues) => {
    const bookingData: BookingData = {
      hotel,
      room,
      quantity,
      checkIn: searchData.checkIn,
      checkOut: searchData.checkOut,
      nights,
      guests: {
        adults: searchData.adults,
        children: searchData.children
      },
      contactInfo: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone
      },
      specialRequests: values.specialRequests,
      totalAmount,
      paymentMethod: values.paymentMethod
    };

    onSubmitBooking(bookingData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4 p-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại chọn phòng
        </Button>

        <Typography variant="h1" className="text-2xl font-bold text-gray-900 mb-2">
          Đặt phòng khách sạn
        </Typography>
        <Typography variant="p" className="text-gray-600">
          Vui lòng điền thông tin để hoàn tất đặt phòng
        </Typography>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            Email *
                          </FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            Số điện thoại *
                          </FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="0901234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Special Requests */}
              <Card>
                <CardHeader>
                  <CardTitle>Yêu cầu đặc biệt</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="specialRequests"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            rows={4}
                            placeholder="Ví dụ: Phòng tầng cao, giường đôi, check-in sớm..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Phương thức thanh toán
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="space-y-3">
                            {[
                              { id: 'vnpay', name: 'VNPay', description: 'Thanh toán qua VNPay' },
                              { id: 'momo', name: 'MoMo', description: 'Ví điện tử MoMo' },
                              { id: 'zalopay', name: 'ZaloPay', description: 'Ví điện tử ZaloPay' },
                              { id: 'onepay', name: 'OnePay', description: 'Thanh toán qua thẻ ngân hàng' }
                            ].map((method) => (
                              <Label key={method.id} className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                <Input
                                  type="radio"
                                  value={method.id}
                                  checked={field.value === method.id}
                                  onChange={() => field.onChange(method.id)}
                                  className="text-blue-600 focus:ring-blue-500 w-auto mr-3"
                                />
                                <div className="ml-0">
                                  <Typography variant="small" className="text-sm font-medium text-gray-900">
                                    {method.name}
                                  </Typography>
                                  <Typography variant="small" className="text-sm text-gray-600">
                                    {method.description}
                                  </Typography>
                                </div>
                              </Label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 px-6 font-semibold text-lg"
              >
                Đặt phòng và thanh toán
              </Button>
            </form>
          </Form>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Chi tiết đặt phòng</CardTitle>
            </CardHeader>
            <CardContent>

            {/* Hotel Info */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Typography variant="h3" className="font-medium text-gray-900">{hotel.name}</Typography>
              <Typography variant="small" className="text-sm text-gray-600">{hotel.location.city}</Typography>
            </div>

            {/* Room Info */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <Typography variant="h4" className="font-medium text-gray-900 mb-2">{room.name}</Typography>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Nhận phòng: {formatDate(searchData.checkIn)}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Trả phòng: {formatDate(searchData.checkOut)}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  {quantity} phòng, {searchData.adults} người lớn
                  {searchData.children > 0 && `, ${searchData.children} trẻ em`}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <Typography variant="small">{formatPrice(room.pricing.basePrice)} x {nights} đêm x {quantity} phòng</Typography>
                <Typography variant="small">{formatPrice(totalAmount)}</Typography>
              </div>
              {room.pricing.taxes && (
                <div className="flex justify-between text-sm text-gray-600">
                  <Typography variant="small">Thuế & phí</Typography>
                  <Typography variant="small">{formatPrice(room.pricing.taxes)}</Typography>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <Typography variant="large" className="text-lg font-semibold text-gray-900">Tổng cộng</Typography>
                <Typography variant="large" className="text-xl font-bold text-blue-600">
                  {formatPrice(totalAmount + (room.pricing.taxes || 0))}
                </Typography>
              </div>
            </div>

            {/* Policies */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Typography variant="h4" className="font-medium text-gray-900 mb-2 text-sm">
                Chính sách hủy phòng
              </Typography>
              <Typography variant="small" className="text-xs text-gray-600">
                Hủy miễn phí trước 24 giờ check-in. Sau thời gian này sẽ tính phí hủy 100% giá trị đặt phòng.
              </Typography>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
