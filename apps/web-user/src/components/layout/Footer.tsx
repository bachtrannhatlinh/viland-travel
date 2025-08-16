import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react'
import { Typography } from '@/components/ui/typography'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Typography variant="h3" className="text-xl font-bold mb-4 text-white">ViLand Travel</Typography>
            <Typography variant="p" className="text-gray-300 mb-4">
              Nền tảng booking tour du lịch hàng đầu Việt Nam. 
              Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời nhất.
            </Typography>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <Typography variant="h4" className="text-lg font-semibold mb-4 text-white">Dịch vụ</Typography>
            <div className="space-y-2">
              <Link href="/flights" className="block text-gray-300 hover:text-white">Vé máy bay</Link>
              <Link href="/tours" className="block text-gray-300 hover:text-white">Tour du lịch</Link>
              <Link href="/hotels" className="block text-gray-300 hover:text-white">Khách sạn</Link>
              <Link href="/car-rental" className="block text-gray-300 hover:text-white">Thuê xe</Link>
              <Link href="/driver-service" className="block text-gray-300 hover:text-white">Go_Safe Driver</Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <Typography variant="h4" className="text-lg font-semibold mb-4 text-white">Hỗ trợ</Typography>
            <div className="space-y-2">
              <Link href="/about" className="block text-gray-300 hover:text-white">Giới thiệu</Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white">Liên hệ</Link>
              <Link href="/blog" className="block text-gray-300 hover:text-white">Tin tức</Link>
              <Link href="/terms" className="block text-gray-300 hover:text-white">Điều khoản</Link>
              <Link href="/privacy" className="block text-gray-300 hover:text-white">Bảo mật</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <Typography variant="h4" className="text-lg font-semibold mb-4 text-white">Liên hệ</Typography>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <Typography variant="small" className="text-gray-300">1900 1234</Typography>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <Typography variant="small" className="text-gray-300">info@vilandtravel.vn</Typography>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <Typography variant="small" className="text-gray-300">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-8 bg-gray-800" />
        <div className="mt-8 text-center">
          <Typography variant="small" className="text-gray-300">
            © 2024 ViLand Travel. Tất cả quyền được bảo lưu.
          </Typography>
        </div>
      </div>
    </footer>
  )
}
