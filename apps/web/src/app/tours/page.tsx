import { Metadata } from 'next'

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày khởi hành
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
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

        {/* Coming Soon Message */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Danh sách tour đang cập nhật
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Chúng tôi đang cập nhật các tour du lịch mới nhất và hấp dẫn nhất. 
            Vui lòng quay lại sau hoặc liên hệ để được tư vấn.
          </p>
          <div className="space-x-4">
            <button className="btn-primary">Liên hệ tư vấn</button>
            <button className="btn-secondary">Quay về trang chủ</button>
          </div>
        </div>
      </div>
    </div>
  )
}
