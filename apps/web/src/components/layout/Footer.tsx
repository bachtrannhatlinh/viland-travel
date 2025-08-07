import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">GoSafe</h3>
            <p className="text-gray-300 mb-4">
              Nền tảng booking tour du lịch hàng đầu Việt Nam. 
              Chúng tôi cam kết mang đến cho bạn những trải nghiệm du lịch tuyệt vời nhất.
            </p>
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
            <h4 className="text-lg font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2">
              <li><Link href="/flights" className="text-gray-300 hover:text-white">Vé máy bay</Link></li>
              <li><Link href="/tours" className="text-gray-300 hover:text-white">Tour du lịch</Link></li>
              <li><Link href="/hotels" className="text-gray-300 hover:text-white">Khách sạn</Link></li>
              <li><Link href="/car-rental" className="text-gray-300 hover:text-white">Thuê xe</Link></li>
              <li><Link href="/driver-service" className="text-gray-300 hover:text-white">Go_Safe Driver</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-300 hover:text-white">Giới thiệu</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Liên hệ</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white">Tin tức</Link></li>
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Điều khoản</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Bảo mật</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-gray-300">1900 1234</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-gray-300">info@gosafe.vn</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span className="text-gray-300">
                  123 Nguyễn Huệ, Quận 1, TP.HCM
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-300">
            © 2024 GoSafe. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}
