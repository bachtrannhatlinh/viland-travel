"use client"

import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const contactFormSchema = z.object({
  fullName: z.string().min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  service: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  newsletter: z.boolean().default(false),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

// export const metadata: Metadata = {
//   title: 'Liên hệ - GoSafe',
//   description: 'Liên hệ với GoSafe để được tư vấn và hỗ trợ về các dịch vụ du lịch. Chúng tôi luôn sẵn sàng phục vụ bạn.',
// }

export default function ContactPage() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      service: '',
      subject: '',
      message: '',
      newsletter: false,
    },
  })

  const onSubmit = (values: ContactFormValues) => {
    console.log(values)
    // Handle form submission here
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography variant="h1" className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Liên hệ với GoSafe
          </Typography>
          <Typography variant="large" className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto text-white">
            Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho chuyến du lịch của bạn
          </Typography>
        </div>
      </Section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-md">
            <CardContent className="p-8">
              <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-6">
                Gửi thông tin liên hệ
              </Typography>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên *</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên" {...field} />
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
                          <FormLabel>Số điện thoại *</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Nhập số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                            <SelectItem value="driver">Dịch vụ lái xe</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tiêu đề</FormLabel>
                        <FormControl>
                          <Input placeholder="Tiêu đề câu hỏi hoặc yêu cầu" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nội dung *</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Mô tả chi tiết nhu cầu hoặc câu hỏi của bạn..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Tôi muốn nhận tin tức và ưu đãi từ GoSafe
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full py-4">
                    Gửi thông tin liên hệ
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div>
            <Card className="shadow-md mb-8">
              <CardContent className="p-8">
                <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-6">
                  Thông tin liên hệ
                </Typography>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h3" className="font-semibold text-gray-900">
                        Địa chỉ văn phòng
                      </Typography>
                      <Typography variant="p" className="text-gray-600 mt-1">
                        Tầng 10, Tòa nhà ABC, 123 Đường Nguyễn Huệ<br />
                        Quận 1, TP. Hồ Chí Minh
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h3" className="font-semibold text-gray-900">
                        Hotline
                      </Typography>
                      <Typography variant="p" className="text-gray-600 mt-1">
                        <Typography variant="small" className="text-primary-600 hover:text-primary-700">
                          1900 1234
                        </Typography> (24/7)<br />
                        <Typography variant="small" className="text-primary-600 hover:text-primary-700">
                          090 123 4567
                        </Typography> (Tư vấn)
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h3" className="font-semibold text-gray-900">
                        Email
                      </Typography>
                      <Typography variant="p" className="text-gray-600 mt-1">
                        <Typography variant="small" className="text-primary-600 hover:text-primary-700">
                          info@gosafe.vn
                        </Typography><br />
                        <Typography variant="small" className="text-primary-600 hover:text-primary-700">
                          support@gosafe.vn
                        </Typography>
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h3" className="font-semibold text-gray-900">
                        Giờ làm việc
                      </Typography>
                      <Typography variant="p" className="text-gray-600 mt-1">
                        Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                        Thứ 7 - CN: 8:00 - 17:00
                      </Typography>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="shadow-md mb-8">
              <CardContent className="p-8">
                <Typography variant="h3" className="text-xl font-bold text-gray-900 mb-4">
                  Kết nối với chúng tôi
                </Typography>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-blue-800 text-white rounded-lg flex items-center justify-center hover:bg-blue-900 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-pink-600 text-white rounded-lg flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.744-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 bg-red-600 text-white rounded-lg flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
              </CardContent>
            </Card>

            {/* Quick Contact */}
            <Card className="bg-gradient-to-r from-primary-600 to-primary-800 text-center">
              <CardContent className="p-6 text-white">
                <Typography variant="h3" className="text-xl font-bold mb-3 text-white">
                  Cần hỗ trợ ngay?
                </Typography>
                <Typography variant="p" className="mb-4 opacity-90 text-white">
                  Gọi hotline để được tư vấn miễn phí
                </Typography>
                <Button variant="outline" className="bg-white text-primary-600 px-6 py-3 hover:bg-gray-100">
                  📞 1900 1234
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Section className="mt-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-8">
            Vị trí văn phòng
          </Typography>
          <Card className="shadow-md">
            <CardContent className="p-8">
              <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 text-6xl mb-4">🗺️</div>
                  <Typography variant="p" className="text-gray-600">
                    Bản đồ Google Maps sẽ được tích hợp tại đây
                  </Typography>
                  <Typography variant="small" className="text-sm text-gray-500 mt-2">
                    Tầng 10, Tòa nhà ABC, 123 Đường Nguyễn Huệ, Quận 1, TP. HCM
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>

        {/* FAQ Section */}
        <Section className="mt-16">
          <Typography variant="h2" className="text-3xl font-bold text-gray-900 text-center mb-12">
            Câu hỏi thường gặp
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Làm thế nào để đặt tour trên GoSafe?',
                answer: 'Bạn có thể đặt tour trực tiếp trên website hoặc liên hệ hotline để được tư vấn chi tiết.'
              },
              {
                question: 'Có thể hủy tour không? Phí hủy bao nhiều?',
                answer: 'Có thể hủy tour theo quy định. Phí hủy phụ thuộc vào thời gian hủy trước ngày khởi hành.'
              },
              {
                question: 'GoSafe có văn phòng ở những tỉnh thành nào?',
                answer: 'Hiện tại GoSafe có văn phòng chính tại TP.HCM và văn phòng đại diện tại Hà Nội, Đà Nẵng.'
              },
              {
                question: 'Có những hình thức thanh toán nào?',
                answer: 'Chúng tôi hỗ trợ thanh toán tiền mặt, chuyển khoản, thẻ tín dụng và ví điện tử.'
              }
            ].map((faq, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <Typography variant="h3" className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </Typography>
                  <Typography variant="p" className="text-gray-600">
                    {faq.answer}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
