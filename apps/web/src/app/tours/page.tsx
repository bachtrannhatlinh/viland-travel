import { Metadata } from 'next'
import { DatePicker } from '@/components/ui/date-picker'
import { Label } from '@/components/ui/label'

export const metadata: Metadata = {
  title: 'Tour du lịch - GoSafe',
  description: 'Khám phá những tour du lịch hấp dẫn trong và ngoài nước với GoSafe. Lịch trình chi tiết, giá cả hợp lý.',
}

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tour du lịch
          </h1>
          <p className="text-xl text-gray-600">
            Khám phá những điểm đến tuyệt vời với các tour du lịch đa dạng
          </p>
        </div>

        {/* Tour Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Điểm đến
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Chọn điểm đến</option>
                <option value="hanoi">Hà Nội</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="danang">Đà Nẵng</option>
                <option value="dalat">Đà Lạt</option>
                <option value="halong">Hạ Long</option>
                <option value="nhatrang">Nha Trang</option>
                <option value="phuquoc">Phú Quốc</option>
              </select>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày khởi hành
              </Label>
              <DatePicker placeholder="Chọn ngày khởi hành" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số người
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="1">1 người</option>
                <option value="2">2 người</option>
                <option value="3-5">3-5 người</option>
                <option value="6+">6+ người</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full btn-primary py-3">
                Tìm tour
              </button>
            </div>
          </div>
        </div>

        {/* Featured Tours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Sample Tour 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Hạ Long Bay</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">
                  Nổi bật
                </span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">4.8 (156)</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tour Hạ Long 3 ngày 2 đêm
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Khám phá vẻ đẹp thiên nhiên kỳ vĩ của Vịnh Hạ Long với những hang động tuyệt đẹp...
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>3 ngày 2 đêm</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Hạ Long</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">2,200,000₫</span>
                  <span className="text-sm text-gray-500 line-through ml-2">2,500,000₫</span>
                </div>
                <a
                  href="/tours/1"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>

          {/* Sample Tour 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Sapa</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                  Mới
                </span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">4.6 (89)</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tour Sapa 2 ngày 1 đêm
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Chinh phục đỉnh Fansipan, khám phá bản làng dân tộc và thưởng thức văn hóa núi rừng...
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>2 ngày 1 đêm</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Sapa</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">1,800,000₫</span>
                </div>
                <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium">
                  Sắp ra mắt
                </button>
              </div>
            </div>
          </div>

          {/* Sample Tour 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Đà Nẵng</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                  Khuyến mãi
                </span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-gray-600">4.7 (124)</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tour Đà Nẵng - Hội An 4 ngày 3 đêm
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Tận hưởng bãi biển tuyệt đẹp, khám phá phố cổ Hội An và thưởng thức ẩm thực miền Trung...
              </p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>4 ngày 3 đêm</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Đà Nẵng</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">3,200,000₫</span>
                  <span className="text-sm text-gray-500 line-through ml-2">3,800,000₫</span>
                </div>
                <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed text-sm font-medium">
                  Sắp ra mắt
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Thêm nhiều tour hấp dẫn sắp ra mắt
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang cập nhật thêm nhiều tour du lịch mới nhất và hấp dẫn nhất. 
            Đăng ký nhận thông báo để không bỏ lỡ các ưu đãi đặc biệt.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Đăng ký nhận tin</button>
            <button className="btn-secondary">Liên hệ tư vấn</button>
          </div>
        </div>
      </div>
    </div>
  )
}
