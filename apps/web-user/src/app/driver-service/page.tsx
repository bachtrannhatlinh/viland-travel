import { Metadata } from 'next'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Typography } from '@/components/ui/typography'
import { Section } from '@/components/ui/section'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { DatePicker } from '@/components/ui/date-picker'
import { TimePicker } from '@/components/ui/time-picker'

export const metadata: Metadata = {
  title: 'Dịch vụ lái xe Go_Safe - ViLand Travel',
  description: 'Dịch vụ lái xe chuyên nghiệp, an toàn. Đặt tài xế kinh nghiệm cho chuyến đi của bạn.',
}

export default function DriverServicePage() {

  return (
    <Section className="min-h-screen bg-gray-50">
      <Section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Section className="text-center mb-12">
          <Typography variant="h1" className="text-4xl font-bold text-gray-900 mb-4">
            Dịch vụ lái xe Go_Safe
          </Typography>
          <Typography variant="large" className="text-xl text-gray-600">
            Tài xế chuyên nghiệp, an toàn cho mọi chuyến đi
          </Typography>
          <div className="mt-8">
            <Button size="lg" asChild>
              <Link href="/driver-service/booking" prefetch={true}>Đặt tài xế ngay</Link>
            </Button>
          </div>
        </Section>

        {/* Service Features */}
        <Section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {[
            {
              icon: '🛡️',
              title: 'An toàn tuyệt đối',
              description: 'Tài xế được đào tạo chuyên nghiệp, có kinh nghiệm lái xe lâu năm'
            },
            {
              icon: '⭐',
              title: 'Dịch vụ 5 sao',
              description: 'Thái độ phục vụ tận tình, lịch sự, chuyên nghiệp'
            },
            {
              icon: '📍',
              title: 'Đúng giờ cam kết',
              description: 'Luôn đúng giờ hẹn, không để khách hàng phải chờ đợi'
            },
            {
              icon: '💰',
              title: 'Giá cả hợp lý',
              description: 'Mức giá cạnh tranh, minh bạch, không phí ẩn'
            },
            {
              icon: '🚗',
              title: 'Xe đời mới',
              description: 'Đội xe đời mới, được bảo dưỡng thường xuyên'
            },
            {
              icon: '📞',
              title: 'Hỗ trợ 24/7',
              description: 'Hỗ trợ khách hàng mọi lúc, mọi nơi khi cần thiết'
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <Typography className="text-4xl mb-4">{feature.icon}</Typography>
                <Typography variant="h3" className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</Typography>
                <Typography variant="p" className="text-gray-600">{feature.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </Section>

        {/* Pricing */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">Bảng giá dịch vụ</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>Bảng giá dịch vụ lái xe Go_Safe</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Loại dịch vụ</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-right">Giá</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Thuê theo giờ</TableCell>
                  <TableCell>Tối thiểu 4 giờ</TableCell>
                  <TableCell className="text-right font-semibold text-primary-600">150,000đ/giờ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Thuê nửa ngày</TableCell>
                  <TableCell>8 giờ sử dụng</TableCell>
                  <TableCell className="text-right font-semibold text-primary-600">1,000,000đ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Thuê cả ngày</TableCell>
                  <TableCell>12 giờ sử dụng</TableCell>
                  <TableCell className="text-right font-semibold text-primary-600">1,500,000đ</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Thuê theo tuyến</TableCell>
                  <TableCell>Tùy theo km</TableCell>
                  <TableCell className="text-right font-semibold text-primary-600">Liên hệ</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <Typography variant="h2" className="text-2xl font-bold text-gray-900 mb-4">
            Hệ thống đặt tài xế đang hoàn thiện
          </Typography>
          <Typography variant="p" className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang hoàn thiện hệ thống đặt tài xế online. 
            Hiện tại vui lòng liên hệ trực tiếp để được phục vụ.
          </Typography>
          <div className="space-x-4">
            <Button>Gọi ngay: 1900 1234</Button>
            <Button variant="secondary">Quay về trang chủ</Button>
          </div>
        </div>
      </Section>
    </Section>
  )
}
