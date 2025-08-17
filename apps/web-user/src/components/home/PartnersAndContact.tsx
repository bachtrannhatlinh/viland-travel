'use client'

import { Mail, Phone, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Section } from '@/components/ui/section'
import { Typography } from '@/components/ui/typography'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Link from 'next/link'

const contactFormSchema = z.object({
  name: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  service: z.string().optional(),
  message: z.string().optional(),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export function PartnersAndContact() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: '',
      message: '',
    },
  })

  const onSubmit = (values: ContactFormValues) => {
    console.log('Form submitted:', values)
    // Handle form submission here
  }

  const partners = [
    { name: 'Vietnam Airlines', logo: '/images/partners/vietnam-airlines.png' },
    { name: 'Jetstar', logo: '/images/partners/jetstar.png' },
    { name: 'Bamboo Airways', logo: '/images/partners/bamboo.png' },
    { name: 'Agoda', logo: '/images/partners/agoda.png' },
    { name: 'Booking.com', logo: '/images/partners/booking.png' },
    { name: 'Expedia', logo: '/images/partners/expedia.png' },
  ]

  return (
    <Section variant="content" background="white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Partners */}
          <div>
            <div className="text-center lg:text-left mb-8">
              <Typography variant="h2" className="text-3xl font-bold text-gray-900 mb-4">
                Đối tác của chúng tôi
              </Typography>
              <Typography variant="p" className="text-gray-600">
                Hợp tác với những thương hiệu hàng đầu để mang đến dịch vụ tốt nhất
              </Typography>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {partners.map((partner, index) => (
                <Card key={index} className="hover:bg-gray-100 transition-colors duration-300">
                  <CardContent className="flex items-center justify-center p-4">
                    {/* Placeholder for partner logo */}
                    <div className="w-24 h-12 bg-gray-300 rounded flex items-center justify-center">
                      <Typography variant="small" className="text-xs text-gray-600 text-center px-2">
                        {partner.name}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center lg:text-left">
              <Typography variant="p" className="text-gray-600 mb-4">
                Và hơn 500+ đối tác khác trên toàn thế giới
              </Typography>
              <Link href="/partners" className="text-primary-600 hover:text-primary-700 font-medium">
                Xem tất cả đối tác →
              </Link>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Liên hệ nhanh</CardTitle>
                <Typography variant="p" className="text-gray-600">
                  Gửi thông tin để chúng tôi tư vấn cho bạn những gói tour phù hợp nhất
                </Typography>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên của bạn" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Số điện thoại *</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="0987654321" {...field} />
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
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dịch vụ quan tâm</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn dịch vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="tour">Tour du lịch</SelectItem>
                              <SelectItem value="flight">Vé máy bay</SelectItem>
                              <SelectItem value="hotel">Khách sạn</SelectItem>
                              <SelectItem value="car">Thuê xe</SelectItem>
                              <SelectItem value="driver">Go_Safe Driver</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tin nhắn</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={4}
                              placeholder="Nhập yêu cầu cụ thể của bạn..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Gửi liên hệ
                    </Button>
                  </form>
                </Form>

                <div className="mt-8 p-4 bg-primary-50 rounded-lg">
                  <Typography variant="h4" className="font-semibold text-primary-900 mb-3">
                    Hoặc liên hệ trực tiếp:
                  </Typography>
                  <div className="space-y-2">
                    <div className="flex items-center text-primary-700">
                      <Phone className="h-4 w-4 mr-2" />
                      <Typography variant="small">Hotline: 1900 1234</Typography>
                    </div>
                    <div className="flex items-center text-primary-700">
                      <Mail className="h-4 w-4 mr-2" />
                      <Typography variant="small">Email: info@gosafe.vn</Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  )
}
